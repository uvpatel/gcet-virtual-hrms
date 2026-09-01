import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const { pathname } = req.nextUrl;

  // Protect all dashboard routes
  if (!sessionCookie && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
