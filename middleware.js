import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = ["/dashboard", "/notes", "/folders", "/api"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only check API routes and protected pages
  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // Use getToken to fetch token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token, redirect to login
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*", "/folders/:path*", "/api/:path*"]
};