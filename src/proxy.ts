import { NextResponse, type NextRequest } from "next/server";

/**
 * Redirects plain-HTTP requests to HTTPS in production.
 * Most hosts terminate TLS in front of the app and pass the original
 * protocol in `x-forwarded-proto`; local development is left untouched.
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host") ?? "";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");

  if (proto === "http" && !isLocal) {
    const { pathname, search } = request.nextUrl;
    const hostname = host.split(":")[0];
    return NextResponse.redirect(`https://${hostname}${pathname}${search}`, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip build assets and the image optimiser, which Next.js also requests internally.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
