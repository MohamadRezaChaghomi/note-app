import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// این تابع فقط برای محیط توسعه - حذف در تولید
function withRecaptchaDevSupport(authOptions) {
  if (process.env.NODE_ENV === 'development') {
    return {
      ...authOptions,
      providers: authOptions.providers.map(provider => {
        if (provider.id === "credentials") {
          return {
            ...provider,
            async authorize(credentials) {
              // در محیط توسعه، reCAPTCHA را نادیده بگیر
              const creds = { ...credentials };
              delete creds.recaptchaToken;
              return provider.authorize(creds);
            }
          };
        }
        return provider;
      })
    };
  }
  return authOptions;
}

const handler = NextAuth(withRecaptchaDevSupport(authOptions));

export { handler as GET, handler as POST };