import { NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/notes", "/report"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("next-auth.session-token") || req.cookies.get("__Secure-next-auth.session-token");
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const lastActive = req.cookies.get("lastActive")?.value;
  if (lastActive) {
    const diff = Date.now() - Number(lastActive);
    if (diff > 10 * 60 * 1000) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("timeout", "1");
      const res = NextResponse.redirect(url);
      res.cookies.set("lastActive", "", { maxAge: 0 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*", "/report/:path*"]
};
