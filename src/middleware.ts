import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/teste-gclid") {
    return new NextResponse(null, { status: 404 });
  }

  // Allow all API routes to pass through
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow login page without authentication
  if (pathname === '/login') {
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
