import { GITHUB_ACCOUNTS } from "./siteConfig";

export interface ContributionDay {
  date: string;
  level: number;
  count: number;
  tooltip: string;
  dayOfWeek: number;
}

export interface ContributionWeek {
  days: (ContributionDay | null)[];
}

export interface MonthLabel {
  name: string;
  weekIndex: number;
}

export interface ContributionData {
  username: string;
  year?: number;
  total: number;
  totalText: string;
  weeks: ContributionWeek[];
  months: MonthLabel[];
  updatedAt: string;
}

export interface GitHubContributionsApiResponse {
  success: boolean;
  data?: ContributionData;
  error?: string;
}

/**
 * Normalizes contribution days by YYYY-MM-DD date and merges multiple datasets into one.
 * - For matching dates: combinedCount = naphiertechCount + bagatata05Count
 * - If a date exists on only one account, uses that account's count
 * - Calculates yearly total from the merged dataset
 * - Preserves monochrome intensity levels (0..4) and tooltip formatting
 */
export function mergeContributionData(
  datasets: (ContributionData | null | undefined)[],
): ContributionData | null {
  const valid = datasets.filter(
    (d): d is ContributionData => Boolean(d && Array.isArray(d.weeks) && d.weeks.length > 0),
  );

  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];

  // 1. Group all contribution days by YYYY-MM-DD date
  const daysByDate = new Map<string, ContributionDay[]>();
  for (const dataset of valid) {
    for (const week of dataset.weeks) {
      for (const day of week.days) {
        if (!day || !day.date) continue;
        const existing = daysByDate.get(day.date) || [];
        existing.push(day);
        daysByDate.set(day.date, existing);
      }
    }
  }

  // 2. Select structural grid template (longest calendar weeks layout)
  const base = valid.reduce(
    (best, cur) => (cur.weeks.length > best.weeks.length ? cur : best),
    valid[0],
  );
  const year = base.year || new Date().getFullYear();

  // 3. Merge calendar grid cells
  const mergedWeeks: ContributionWeek[] = base.weeks.map((week) => {
    const days = week.days.map((day) => {
      if (!day) return null;
      const list = daysByDate.get(day.date) || [];
      if (list.length === 0) return day;
      if (list.length === 1) return list[0];

      let combinedCount = 0;
      let maxLevel = 0;
      let nonZeroAccounts = 0;
      let sampleTooltip = "";

      for (const d of list) {
        combinedCount += d.count;
        if (d.level > maxLevel) maxLevel = d.level;
        if (d.count > 0) {
          nonZeroAccounts++;
          if (!sampleTooltip) sampleTooltip = d.tooltip;
        }
      }

      // Determine level:
      // - 0 when 0 contributions
      // - If only one account has activity on that date, preserve that account's level
      // - If multiple accounts have activity on matching date, boost level appropriately (capped at 4)
      let level = 0;
      if (combinedCount === 0) {
        level = 0;
      } else if (nonZeroAccounts <= 1) {
        level = maxLevel > 0 ? maxLevel : 1;
      } else {
        level = Math.min(4, Math.max(maxLevel, 1) + 1);
      }

      // Format tooltip
      let tooltip = "";
      if (combinedCount === 0) {
        tooltip = list[0]?.tooltip || `No contributions on ${day.date}`;
      } else if (nonZeroAccounts <= 1 && sampleTooltip) {
        tooltip = sampleTooltip;
      } else {
        const dateMatch = sampleTooltip.match(/on (.+)$/i);
        const datePhrase = dateMatch ? dateMatch[1] : day.date;
        tooltip = `${combinedCount} contribution${combinedCount === 1 ? "" : "s"} on ${datePhrase}`;
      }

      return {
        date: day.date,
        level,
        count: combinedCount,
        tooltip,
        dayOfWeek: day.dayOfWeek,
      };
    });

    return { days };
  });

  // 4. Calculate displayed yearly contribution total from the merged data
  let total = 0;
  for (const week of mergedWeeks) {
    for (const day of week.days) {
      if (day) {
        total += day.count;
      }
    }
  }

  const combinedUsername = valid.map((d) => d.username).join(" + ");

  return {
    username: combinedUsername,
    year,
    total,
    totalText: `${total.toLocaleString()} contributions in ${year}`,
    weeks: mergedWeeks,
    months: base.months,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fetches contribution data for a single account from the existing caching API route.
 */
export async function fetchUserContributions(username: string): Promise<ContributionData | null> {
  try {
    const res = await fetch(`/api/github-contributions?username=${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    const json: GitHubContributionsApiResponse = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches contribution data for multiple accounts in parallel,
 * merges after both resolve, and handles one account failing gracefully without breaking the graph.
 */
export async function fetchCombinedContributions(
  accounts: readonly string[] = GITHUB_ACCOUNTS,
): Promise<ContributionData | null> {
  const settled = await Promise.allSettled(
    accounts.map((username) => fetchUserContributions(username)),
  );

  const successfulDatasets: ContributionData[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      successfulDatasets.push(result.value);
    }
  }

  if (successfulDatasets.length === 0) {
    return null;
  }

  return mergeContributionData(successfulDatasets);
}
