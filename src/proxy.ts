import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js Middleware / Proxy
 * 1. Enforces HTTPS in production
 * 2. Protects /admin routes at the server level (eliminates 1s dashboard flash)
 * 3. Redirects authenticated users from /admin/login to /admin
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Redirect plain-HTTP requests to HTTPS in production
  if (process.env.NODE_ENV === "production") {
    const proto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host") ?? "";
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

    if (proto === "http" && !isLocal) {
      const hostname = host.split(":")[0];
      return NextResponse.redirect(`https://${hostname}${pathname}${search}`, 308);
    }
  }

  // 2. Server-side guard for /admin: redirect immediately to login if no session cookie
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("varun_admin_session");
    if (!sessionCookie?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Redirect to /admin if user is already logged in and visits /admin/login
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("varun_admin_session");
    if (sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip build assets and the image optimiser, which Next.js also requests internally.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
