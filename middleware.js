import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = ["/dashboard", "/notes", "/report"];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  // استفاده از getToken برای واکشی درست توکن
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Middleware token check:", { 
    tokenExists: !!token,
    pathname,
    hasToken: !!token 
  });

  // اگر توکن وجود نداشت، به login هدایت کن
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // بررسی lastActive (اختیاری - اگر می‌خواهید حذف کنید)
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