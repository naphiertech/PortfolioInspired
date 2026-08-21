import { NextResponse } from "next/server";

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
    total: number;
    totalText: string;
    weeks: ContributionWeek[];
    months: MonthLabel[];
    updatedAt: string;
  };
  error?: string;
}

// In-memory cache for 1 hour
let cachedData: {
  username: string;
  total: number;
  totalText: string;
  weeks: ContributionWeek[];
  months: MonthLabel[];
  updatedAt: string;
} | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "naphiertech";

    // Return cached data if fresh
    const now = Date.now();
    if (cachedData && cachedData.username === username && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(
        { success: true, data: cachedData },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }

    const githubUrl = `https://github.com/users/${encodeURIComponent(username)}/contributions`;
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

    // 1. Extract total count from h2 (e.g. "480 contributions in the last year")
    const h2Match = html.match(/([0-9,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
    let total = 0;
    let totalText = "contributions in the last year";
    if (h2Match) {
      total = parseInt(h2Match[1].replace(/,/g, ""), 10);
      totalText = `${total.toLocaleString()} contributions in the last year`;
    } else {
      const fallbackMatch = html.match(/([0-9,]+)\s+contributions/i);
      if (fallbackMatch) {
        total = parseInt(fallbackMatch[1].replace(/,/g, ""), 10);
        totalText = `${total.toLocaleString()} contributions in the last year`;
      }
    }

    // 2. Extract tooltips map: id -> text
    const tooltipMap: Record<string, string> = {};
    const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
    let tMatch;
    while ((tMatch = tooltipRegex.exec(html)) !== null) {
      tooltipMap[tMatch[1]] = tMatch[2].replace(/\s+/g, " ").trim();
    }

    // 3. Extract table rows & cells
    // GitHub's table structure: <tbody> with <tr> for each day of week (0 to 6) or weekly columns
    // We can extract all <td data-date="..." data-level="..."> with their dates
    const days: ContributionDay[] = [];
    const tdRegex = /<td([^>]+)>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const attrs = tdMatch[1];
      const dateMatch = attrs.match(/data-date="([^"]+)"/);
      const levelMatch = attrs.match(/data-level="([^"]+)"/);
      const idMatch = attrs.match(/id="([^"]+)"/);

      if (dateMatch && levelMatch) {
        const dateStr = dateMatch[1];
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

        const dateObj = new Date(dateStr + "T00:00:00Z");
        const dayOfWeek = dateObj.getUTCDay(); // 0 = Sunday, 6 = Saturday

        days.push({
          date: dateStr,
          level,
          count,
          tooltip: tooltip || `${count} contribution(s) on ${dateStr}`,
          dayOfWeek,
        });
      }
    }

    // Sort days chronologically
    days.sort((a, b) => (a.date > b.date ? 1 : -1));

    // 4. Organize days into weekly columns (Sunday to Saturday)
    const weeks: ContributionWeek[] = [];
    let currentWeek: (ContributionDay | null)[] = Array(7).fill(null);

    // If the first day is not Sunday, pad earlier days with null
    if (days.length > 0) {
      const firstDayOfWeek = days[0].dayOfWeek;
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek[i] = null;
      }

      for (const day of days) {
        currentWeek[day.dayOfWeek] = day;
        if (day.dayOfWeek === 6) {
          // Saturday is end of week
          weeks.push({ days: [...currentWeek] });
          currentWeek = Array(7).fill(null);
        }
      }

      // If last week wasn't added because it ended before Saturday
      if (currentWeek.some((d) => d !== null)) {
        weeks.push({ days: [...currentWeek] });
      }
    }

    // 5. Extract month labels with week index positions
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

    const parsedData = {
      username,
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
