import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  const { pathname } = req.nextUrl;

  if (!session && pathname.startsWith("/(dashboard)")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (session?.user as any)?.role;
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/employee", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/employee/:path*", "/admin/:path*"] };