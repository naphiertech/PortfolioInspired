import { NextResponse } from "next/server";
import { GITHUB_USERNAME } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export interface ContributionDay {
  date: string;
  level: number; // 0..4
  count: number;
  tooltip: string;
  dayOfWeek: number; // 0 = Sun, 6 = Sat
}

export interface ContributionWeek {
  days: (ContributionDay | null)[];
}

export interface MonthLabel {
  name: string;
  weekIndex: number;
}

export interface GitHubContributionsResponse {
  success: boolean;
  data?: {
    username: string;
    year: number;
    total: number;
    totalText: string;
    weeks: ContributionWeek[];
    months: MonthLabel[];
    updatedAt: string;
  };
  error?: string;
}

// In-memory cache keyed by username and year for 1 hour
interface CachedPayload {
  username: string;
  year: number;
  total: number;
  totalText: string;
  weeks: ContributionWeek[];
  months: MonthLabel[];
  updatedAt: string;
}

let cachedData: CachedPayload | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || GITHUB_USERNAME;
    const currentYear = new Date().getFullYear();

    // Return cached data if fresh and matches current year
    const now = Date.now();
    if (
      cachedData &&
      cachedData.username === username &&
      cachedData.year === currentYear &&
      now - lastFetchTime < CACHE_TTL
    ) {
      return NextResponse.json(
        { success: true, data: cachedData },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }

    // Query GitHub specifically for the full calendar year (Jan 1 to Dec 31)
    const githubUrl = `https://github.com/users/${encodeURIComponent(
      username,
    )}/contributions?from=${currentYear}-01-01&to=${currentYear}-12-31`;

    const response = await fetch(githubUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub responded with HTTP ${response.status}`);
    }

    const html = await response.text();

    // 1. Extract tooltips map: id -> text
    const tooltipMap: Record<string, string> = {};
    const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
    let tMatch;
    while ((tMatch = tooltipRegex.exec(html)) !== null) {
      tooltipMap[tMatch[1]] = tMatch[2].replace(/\s+/g, " ").trim();
    }

    // 2. Parse GitHub days for the current year into a map
    const githubDayMap = new Map<string, { level: number; count: number; tooltip: string }>();
    const tdRegex = /<td([^>]+)>/gi;
    let tdMatch;
    const yearPrefix = `${currentYear}-`;

    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const attrs = tdMatch[1];
      const dateMatch = attrs.match(/data-date="([^"]+)"/);
      const levelMatch = attrs.match(/data-level="([^"]+)"/);
      const idMatch = attrs.match(/id="([^"]+)"/);

      if (dateMatch && levelMatch) {
        const dateStr = dateMatch[1];

        // Strictly accept only dates in currentYear
        if (!dateStr.startsWith(yearPrefix)) {
          continue;
        }

        const level = parseInt(levelMatch[1], 10);
        const id = idMatch ? idMatch[1] : "";
        const tooltip = tooltipMap[id] || "";

        let count = 0;
        const countMatch = tooltip.match(/^([0-9,]+)\s+contribution/i);
        if (countMatch) {
          count = parseInt(countMatch[1].replace(/,/g, ""), 10);
        } else if (level > 0) {
          count = level;
        }

        githubDayMap.set(dateStr, {
          level,
          count,
          tooltip: tooltip || `${count} contribution${count === 1 ? "" : "s"} on ${dateStr}`,
        });
      }
    }

    // 3. Construct the complete 365/366 calendar-year date array (Jan 1 -> Dec 31)
    const allYearDays: ContributionDay[] = [];
    const curDate = new Date(Date.UTC(currentYear, 0, 1));
    const endDate = new Date(Date.UTC(currentYear, 11, 31));

    while (curDate <= endDate) {
      const yyyy = curDate.getUTCFullYear();
      const mm = String(curDate.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(curDate.getUTCDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayOfWeek = curDate.getUTCDay(); // 0 = Sun, 6 = Sat

      if (githubDayMap.has(dateStr)) {
        const data = githubDayMap.get(dateStr)!;
        allYearDays.push({
          date: dateStr,
          level: data.level,
          count: data.count,
          tooltip: data.tooltip,
          dayOfWeek,
        });
      } else {
        // Future date or day with 0 contributions
        allYearDays.push({
          date: dateStr,
          level: 0,
          count: 0,
          tooltip: `No contributions on ${dateStr}`,
          dayOfWeek,
        });
      }

      curDate.setUTCDate(curDate.getUTCDate() + 1);
    }

    // 4. Compute total contributions for the current year
    const total = allYearDays.reduce((sum, d) => sum + d.count, 0);
    const totalText = `${total.toLocaleString()} contributions in ${currentYear}`;

    // 5. Organize into 52-53 weekly columns (Sunday -> Saturday)
    const weeks: ContributionWeek[] = [];
    let currentWeek: (ContributionDay | null)[] = Array(7).fill(null);

    if (allYearDays.length > 0) {
      // Pad leading days before Jan 1 if Jan 1 is not Sunday
      const firstDayOfWeek = allYearDays[0].dayOfWeek;
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek[i] = null;
      }

      for (const day of allYearDays) {
        currentWeek[day.dayOfWeek] = day;
        if (day.dayOfWeek === 6) {
          weeks.push({ days: [...currentWeek] });
          currentWeek = Array(7).fill(null);
        }
      }

      // If last week has trailing days (Dec 31 is not Saturday)
      if (currentWeek.some((d) => d !== null)) {
        weeks.push({ days: [...currentWeek] });
      }
    }

    // 6. Generate the 12 month labels (Jan .. Dec) mapped to week column positions
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const months: MonthLabel[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIdx) => {
      const firstNonNullDay = week.days.find((d) => d !== null);
      if (firstNonNullDay) {
        const monthIndex = new Date(firstNonNullDay.date + "T00:00:00Z").getUTCMonth();
        if (monthIndex !== lastMonth) {
          months.push({
            name: monthNames[monthIndex],
            weekIndex: weekIdx,
          });
          lastMonth = monthIndex;
        }
      }
    });

    const parsedData: CachedPayload = {
      username,
      year: currentYear,
      total,
      totalText,
      weeks,
      months,
      updatedAt: new Date().toISOString(),
    };

    cachedData = parsedData;
    lastFetchTime = now;

    return NextResponse.json(
      { success: true, data: parsedData },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Error fetching GitHub contributions:", error);

    // Fallback: If cache exists even if expired, return it
    if (cachedData) {
      return NextResponse.json({ success: true, data: cachedData });
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load GitHub contributions.",
      },
      { status: 500 },
    );
  }
}
