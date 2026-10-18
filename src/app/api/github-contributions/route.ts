import { NextResponse } from "next/server";
import { GITHUB_ACCOUNTS } from "@/lib/siteConfig";
import {
  type ContributionData,
  type ContributionDay,
  type ContributionWeek,
  type MonthLabel,
  mergeContributionData,
} from "@/lib/githubContributions";
import fallbackSnapshot from "@/data/githubContributionsFallback.json";

export const dynamic = "force-dynamic";

export interface GitHubContributionsResponse {
  success: boolean;
  data?: ContributionData;
  error?: string;
}

interface CachedPayload {
  data: ContributionData;
  timestamp: number;
}

// In-memory cache keyed by username:year or combined:accounts:year for 1 hour
const memoryCache = new Map<string, CachedPayload>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Parses raw GitHub contributions HTML for a specific calendar year.
 */
async function scrapeGitHubUserContributions(
  username: string,
  year: number,
): Promise<ContributionData | null> {
  const githubUrl = `https://github.com/users/${encodeURIComponent(
    username,
  )}/contributions?from=${year}-01-01&to=${year}-12-31`;

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
  let tMatch: RegExpExecArray | null;
  while ((tMatch = tooltipRegex.exec(html)) !== null) {
    tooltipMap[tMatch[1]] = tMatch[2].replace(/\s+/g, " ").trim();
  }

  // 2. Parse GitHub days for the requested year into a map
  const githubDayMap = new Map<string, { level: number; count: number; tooltip: string }>();
  const tdRegex = /<td([^>]+)>/gi;
  let tdMatch: RegExpExecArray | null;
  const yearPrefix = `${year}-`;

  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const attrs = tdMatch[1];
    const dateMatch = attrs.match(/data-date="([^"]+)"/);
    const levelMatch = attrs.match(/data-level="([^"]+)"/);
    const idMatch = attrs.match(/id="([^"]+)"/);

    if (dateMatch && levelMatch) {
      const dateStr = dateMatch[1];

      // Strictly accept only dates in requested year
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

  // 3. Construct the complete calendar-year date array (Jan 1 -> Dec 31)
  const allYearDays: ContributionDay[] = [];
  const curDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));

  while (curDate <= endDate) {
    const yyyy = curDate.getUTCFullYear();
    const mm = String(curDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(curDate.getUTCDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = curDate.getUTCDay(); // 0 = Sun, 6 = Sat

    if (githubDayMap.has(dateStr)) {
      const d = githubDayMap.get(dateStr)!;
      allYearDays.push({
        date: dateStr,
        level: d.level,
        count: d.count,
        tooltip: d.tooltip,
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

  // 4. Compute total contributions for the year
  const total = allYearDays.reduce((sum, d) => sum + d.count, 0);
  const totalText = `${total.toLocaleString()} contributions in ${year}`;

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

  return {
    username,
    year,
    total,
    totalText,
    weeks,
    months,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Retrieves contribution data for a single account with multi-tier caching:
 * 1. Fresh memoryCache
 * 2. Live GitHub scrape
 * 3. Stale memoryCache (stale-while-revalidate on failure)
 * 4. Static verified fallback snapshot (cold start resilience on rate limits)
 */
async function getAccountContributions(
  username: string,
  year: number,
): Promise<ContributionData | null> {
  const cacheKey = `${username.toLowerCase()}:${year}`;
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);

  // Return fresh cache if available
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // Attempt live scrape from GitHub
  try {
    const liveData = await scrapeGitHubUserContributions(username, year);
    if (liveData) {
      memoryCache.set(cacheKey, { data: liveData, timestamp: now });
      return liveData;
    }
  } catch (err) {
    console.warn(`[GitHub API] Failed live fetch for ${username} (${year}):`, err);
  }

  // Fallback 1: Return stale cache if available
  if (cached) {
    return cached.data;
  }

  // Fallback 2: Return verified historical snapshot
  const yearKey = String(year);
  const fallbackRecord = fallbackSnapshot as unknown as Record<
    string,
    Record<string, ContributionData>
  >;

  if (fallbackRecord?.[yearKey]?.[username]) {
    const fb = fallbackRecord[yearKey][username];
    memoryCache.set(cacheKey, { data: fb, timestamp: now });
    return fb;
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentYear = new Date().getFullYear();
    const rawYear = searchParams.get("year");
    const parsedYear = rawYear ? parseInt(rawYear, 10) : currentYear;
    const year =
      !isNaN(parsedYear) && parsedYear >= 2020 && parsedYear <= currentYear + 1
        ? parsedYear
        : currentYear;

    const allowedMap = new Map(
      GITHUB_ACCOUNTS.map((acc) => [acc.toLowerCase(), acc])
    );

    const singleUsername = searchParams.get("username")?.trim();

    // Case 1: Caller specifically requested a single user (must be in GITHUB_ACCOUNTS allowlist)
    if (singleUsername) {
      const canonicalUser = allowedMap.get(singleUsername.toLowerCase());
      if (!canonicalUser) {
        return NextResponse.json(
          { success: false, error: "Unsupported GitHub account." },
          { status: 400 }
        );
      }

      const data = await getAccountContributions(canonicalUser, year);
      if (!data) {
        return NextResponse.json(
          { success: false, error: `Failed to load GitHub contributions for ${canonicalUser}.` },
          { status: 500 },
        );
      }
      return NextResponse.json(
        { success: true, data },
        {
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }

    // Case 2: Combined accounts mode (strictly filtered to GITHUB_ACCOUNTS allowlist)
    const accountsParam = searchParams.get("accounts");
    const parsedAccounts = accountsParam
      ? accountsParam
          .split(",")
          .map((a) => allowedMap.get(a.trim().toLowerCase()))
          .filter((a): a is (typeof GITHUB_ACCOUNTS)[number] => Boolean(a))
      : [];
    const targetAccounts =
      parsedAccounts.length > 0
        ? Array.from(new Set(parsedAccounts))
        : [...GITHUB_ACCOUNTS];

    const combinedCacheKey = `combined:${targetAccounts.slice().sort().join("+")}:${year}`;
    const now = Date.now();
    const cachedCombined = memoryCache.get(combinedCacheKey);

    if (cachedCombined && now - cachedCombined.timestamp < CACHE_TTL) {
      return NextResponse.json(
        { success: true, data: cachedCombined.data },
        {
          headers: {
            "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        },
      );
    }

    // Retrieve data for all accounts in parallel
    const accountResults = await Promise.all(
      targetAccounts.map(async (acc) => ({
        username: acc,
        data: await getAccountContributions(acc, year),
      })),
    );

    // Fail gracefully without silent partial data if any account is completely missing
    const missing = accountResults.filter((r) => !r.data).map((r) => r.username);
    if (missing.length > 0) {
      console.error(`[GitHub API] Missing contributions data for: ${missing.join(", ")}`);
      // If we have an expired combined cache, return it instead of failing
      if (cachedCombined) {
        return NextResponse.json(
          { success: true, data: cachedCombined.data },
          {
            headers: {
              "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
            },
          },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Could not retrieve complete contribution data for all accounts: ${missing.join(", ")}`,
        },
        { status: 500 },
      );
    }

    const datasets = accountResults.map((r) => r.data!).filter(Boolean);
    const combinedData = mergeContributionData(datasets);

    if (!combinedData) {
      return NextResponse.json(
        { success: false, error: "Failed to merge contribution datasets." },
        { status: 500 },
      );
    }

    memoryCache.set(combinedCacheKey, { data: combinedData, timestamp: now });

    return NextResponse.json(
      { success: true, data: combinedData },
      {
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error: unknown) {
    console.error("Error in /api/github-contributions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load GitHub contributions.",
      },
      { status: 500 },
    );
  }
}
