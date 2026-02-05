import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// حل مشکل reCAPTCHA در محیط توسعه
const isDevelopment = process.env.NODE_ENV === 'development';
const verifyRecaptchaInDev = process.env.VERIFY_RECAPTCHA_IN_DEV === 'true';

// تنظیمات توسعه
const getAuthOptions = () => {
  if (isDevelopment && !verifyRecaptchaInDev) {
    return {
      ...authOptions,
      providers: authOptions.providers.map(provider => {
        if (provider.id === "credentials") {
          return {
            ...provider,
            async authorize(credentials, req) {
              // حذف recaptchaToken در توسعه
              const { recaptchaToken, ...rest } = credentials;
              return provider.authorize(rest, req);
            }
          };
        }
        return provider;
      })
    };
  }
  return authOptions;
};

const handler = NextAuth(getAuthOptions());

export { handler as GET, handler as POST };