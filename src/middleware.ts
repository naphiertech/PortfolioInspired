import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PRESENTATION_COOKIE_NAME,
  PRESENTATION_COOKIE_MAX_AGE,
  PRESENTATION_QUERY_PARAM,
  isValidPresentationMode,
} from "@/features/presentation-modes/types/config";

/**
 * Global Presentation Mode Middleware
 *
 * Synchronizes explicit `?mode=` query parameters into the server-readable
 * first-party cookie before Server Components render.
 *
 * - Non-redirecting, non-blocking
 * - Only activates for valid presentation modes ('default' | 'focus')
 * - Skips static assets, images, API routes, and metadata endpoints
 */
export function middleware(request: NextRequest) {
  const queryMode = request.nextUrl.searchParams.get(PRESENTATION_QUERY_PARAM);

  if (queryMode && isValidPresentationMode(queryMode)) {
    // Forward the cookie in request headers so Server Components read it in the current cycle
    request.cookies.set(PRESENTATION_COOKIE_NAME, queryMode);

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Set cookie on response for persistent browser storage
    response.cookies.set(PRESENTATION_COOKIE_NAME, queryMode, {
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
