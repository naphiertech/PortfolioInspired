import { NextResponse } from "next/server";
import { fullProjects } from "@/lib/data";
import { formatShortDate, formatRelativeTime } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

export interface GitHubActivityData {
  repoTitle: string;
  rawRepoName: string;
  description: string;
  pushedAt: string;
  formattedDate: string;
  relativeTime: string;
  isProject: boolean;
  href: string;
  githubUrl: string;
}

export interface GitHubActivityResponse {
  success: boolean;
  data: GitHubActivityData | null;
  error?: string;
}

interface GitHubRepoItem {
  name: string;
  html_url: string;
  pushed_at: string;
  updated_at: string;
  fork: boolean;
  description: string | null;
}

// Process-level in-memory cache as an auxiliary optimization (30-min TTL).
// Primary caching is guaranteed via Next.js fetch revalidation (next: { revalidate: 1800 })
// and Edge CDN response caching (s-maxage=1800), reducing repeated upstream requests.
let cachedActivity: GitHubActivityData | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET() {
  try {
    const now = Date.now();

    // Serve fresh in-memory cached data if available in this instance
    if (cachedActivity && now - lastFetchTime < CACHE_TTL) {
      return NextResponse.json(
        { success: true, data: cachedActivity },
        {
          headers: {
            "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
          },
        },
      );
    }

    const headers: Record<string, string> = {
      "User-Agent": "NaphierAwalie-Portfolio/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      "https://api.github.com/users/naphiertech/repos?sort=pushed&per_page=10",
      {
        headers,
        next: { revalidate: 1800 },
      },
    );

    if (!response.ok) {
      // If GitHub is rate-limited or fails, fall back to cached data if available
      if (cachedActivity) {
        return NextResponse.json(
          { success: true, data: cachedActivity },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300",
            },
          },
        );
      }
      return NextResponse.json({ success: false, data: null }, { status: 200 });
    }

    const repos: GitHubRepoItem[] = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      return NextResponse.json({ success: false, data: null }, { status: 200 });
    }

    // Filter and sort by pushed_at descending
    const validRepos = repos
      .filter((r) => r.pushed_at)
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

    if (validRepos.length === 0) {
      return NextResponse.json({ success: false, data: null }, { status: 200 });
    }

    const latestRepo = validRepos[0];

    // Find matching project in fullProjects by github URL or repo name
    const latestUrlNormalized = latestRepo.html_url.toLowerCase().trim();
    const latestNameNormalized = latestRepo.name.toLowerCase().trim();

    const matchedProject = fullProjects.find((p) => {
      if (!p.github) return false;
      const projectGithubNormalized = p.github.toLowerCase().trim();
      if (projectGithubNormalized === latestUrlNormalized) return true;
      const urlParts = projectGithubNormalized.split("/").filter(Boolean);
      const repoSlug = urlParts[urlParts.length - 1];
      return repoSlug === latestNameNormalized;
    });

    const isProject = Boolean(matchedProject);
    const repoTitle = matchedProject ? matchedProject.title : latestRepo.name;
    const href = matchedProject ? `/projects/${matchedProject.slug}` : latestRepo.html_url;

    const activityData: GitHubActivityData = {
      repoTitle,
      rawRepoName: latestRepo.name,
      description: latestRepo.description || matchedProject?.overview || "",
      pushedAt: latestRepo.pushed_at,
      formattedDate: formatShortDate(latestRepo.pushed_at),
      relativeTime: formatRelativeTime(latestRepo.pushed_at),
      isProject,
      href,
      githubUrl: latestRepo.html_url,
    };

    cachedActivity = activityData;
    lastFetchTime = now;

    return NextResponse.json(
      { success: true, data: activityData },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    // Gracefully return null on any unhandled failure (no crashes or internal error exposure)
    if (cachedActivity) {
      return NextResponse.json({ success: true, data: cachedActivity });
    }
    return NextResponse.json({ success: false, data: null }, { status: 200 });
  }
}
