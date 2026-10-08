import { NextRequest, NextResponse } from "next/server";
import { BRAND_URL } from "@/lib/brand";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const canonicalUrl = new URL(BRAND_URL);
  const canonicalHost = canonicalUrl.hostname;
  const requestHost = request.nextUrl.hostname.toLowerCase();
  const redirectHosts = new Set([
    `www.${canonicalHost}`,
    "transferfortaleza-tur.vercel.app",
  ]);

  if (redirectHosts.has(requestHost)) {
    const destination = request.nextUrl.clone();
    destination.protocol = canonicalUrl.protocol;
    destination.hostname = canonicalHost;
    destination.port = "";
    return NextResponse.redirect(destination, 301);
  }

  const disabledLeadApi =
    pathname === "/api/track" ||
    pathname === "/api/admin/leads" ||
    pathname === "/api/admin/sync-sheets" ||
    /^\/api\/lead\/[^/]+$/.test(pathname) ||
    /^\/api\/admin\/lead\/[^/]+$/.test(pathname);
  if (disabledLeadApi) {
    return new NextResponse(null, { status: 404 });
  }

  if (pathname === "/admin/leads" || pathname.startsWith("/admin/leads/")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/teste-gclid") {
    return new NextResponse(null, { status: 404 });
  }

  // Allow all API routes to pass through
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow the admin login page without an authenticated session.
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
