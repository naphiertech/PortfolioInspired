import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PRESENTATION_COOKIE_NAME,
  PRESENTATION_COOKIE_MAX_AGE,
  PRESENTATION_QUERY_PARAM,
  isValidPresentationMode,
} from "@/features/presentation-modes/types/config";
import { getRandomPresentationMode } from "@/features/presentation-modes/lib/resolveMode";
import type { PresentationMode } from "@/features/presentation-modes/types/presentation";

/**
 * Global Presentation Mode Middleware
 *
 * Implements authoritative 3-tier presentation mode resolution:
 * 1. Explicit valid `?mode=` query parameter (e.g. "?mode=focus") -> Always respected, never randomized
 * 2. Existing persisted cookie preference -> Preserved across refreshes and internal navigation
 * 3. Randomized first entry -> Uniform random selection among 4 modes for fresh visitors, persisted to cookie
 *
 * Ensures 100% server-client agreement with zero hydration mismatch and zero blank frames.
 */
export function middleware(request: NextRequest) {
  const queryMode = request.nextUrl.searchParams.get(PRESENTATION_QUERY_PARAM);
  const cookieMode = request.cookies.get(PRESENTATION_COOKIE_NAME)?.value;

  const isRoot = request.nextUrl.pathname === "/";

  // Priority 1: Explicit valid URL query parameter
  const hasValidQueryMode = Boolean(queryMode && isValidPresentationMode(queryMode));

  // Priority 2: Existing User Preference Cookie
  const hasValidCookieMode = Boolean(cookieMode && isValidPresentationMode(cookieMode));

  let effectiveMode: PresentationMode;
  let shouldSetCookie = false;

  if (hasValidQueryMode && queryMode && isValidPresentationMode(queryMode)) {
    // Explicit mode always wins and synchronizes to cookie for persistence
    effectiveMode = queryMode;
    shouldSetCookie = true;
  } else if (hasValidCookieMode && cookieMode && isValidPresentationMode(cookieMode)) {
    // Existing preference is authoritative; never overwrite with randomization
    effectiveMode = cookieMode;
    shouldSetCookie = false;
  } else {
    // Priority 3: Randomized first entry for fresh visitors with no preference
    effectiveMode = getRandomPresentationMode(isRoot);
    shouldSetCookie = true;
  }

  // Minimal is strictly one page: redirect any deep route requests back to "/"
  if (effectiveMode === "minimal" && !isRoot) {
    const redirectUrl = new URL("/", request.url);
    if (hasValidQueryMode && queryMode) {
      redirectUrl.searchParams.set(PRESENTATION_QUERY_PARAM, "minimal");
    }
    const response = NextResponse.redirect(redirectUrl);
    if (shouldSetCookie) {
      response.cookies.set(PRESENTATION_COOKIE_NAME, "minimal", {
        path: "/",
        maxAge: PRESENTATION_COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return response;
  }

  if (shouldSetCookie) {
    // Forward the cookie in request headers so Server Components (RootLayout) read it immediately
    request.cookies.set(PRESENTATION_COOKIE_NAME, effectiveMode);

    const requestHeaders = new Headers(request.headers);
    const existingCookieHeader = request.headers.get("cookie") || "";
    const cookieEntry = `${PRESENTATION_COOKIE_NAME}=${effectiveMode}`;
    const newCookieHeader = existingCookieHeader
      ? `${existingCookieHeader}; ${cookieEntry}`
      : cookieEntry;
    requestHeaders.set("cookie", newCookieHeader);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Set cookie on response for persistent browser storage
    response.cookies.set(PRESENTATION_COOKIE_NAME, effectiveMode, {
      path: "/",
      maxAge: PRESENTATION_COOKIE_MAX_AGE,
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /api/* (API endpoints)
     * - /_next/* (Next.js internals & static files)
     * - /favicon.ico, /sitemap.xml, /robots.txt
     * - Static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp, .pdf, .woff, .woff2)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|woff|woff2)$).*)",
  ],
};
