// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // مسیرهایی که نیاز به احراز هویت ندارند
  const publicPaths = [
    '/api/auth',
    '/api/captcha',
    '/api/register',
    '/api/forget-password',
    '/api/reset-password',
    '/api/verify-code',
    '/api/validate-token',
    '/auth'
  ];

  // اگر مسیر عمومی است، اجازه عبور بده
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // مسیرهایی که نیاز به احراز هویت دارند
  const protectedPaths = ['/dashboard', '/notes', '/folders', '/api'];
  
  // بررسی آیا مسیر فعلی نیاز به احراز هویت دارد
  const needsAuth = protectedPaths.some(path => pathname.startsWith(path));
  if (!needsAuth) return NextResponse.next();

  // بررسی توکن
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // اگر توکن وجود ندارد، به صفحه لاگین هدایت شود
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};