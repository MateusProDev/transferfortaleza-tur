import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("[MIDDLEWARE] Processing request:", pathname);

  // Allow all API routes to pass through
  if (pathname.startsWith('/api')) {
    console.log("[MIDDLEWARE] Allowing API route:", pathname);
    return NextResponse.next();
  }

  // Allow login page without authentication
  if (pathname === '/login') {
    console.log("[MIDDLEWARE] Allowing login page");
    return NextResponse.next();
  }

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const authToken = request.cookies.get("authToken")?.value;
    console.log("[MIDDLEWARE] Admin route check:", pathname, "Auth token:", authToken ? "present" : "missing");

    if (!authToken) {
      console.log("[MIDDLEWARE] No auth token, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log("[MIDDLEWARE] Auth token present, allowing access");
    return NextResponse.next();
  }

  console.log("[MIDDLEWARE] Allowing public route:", pathname);
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
