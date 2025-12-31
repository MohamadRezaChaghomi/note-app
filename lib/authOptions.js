import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { verifyCaptcha } from "@/lib/captcha";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 10 * 60 }, // 10 minutes
  jwt: { maxAge: 10 * 60 },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaId: { label: "CaptchaId", type: "text" },
        captchaAnswer: { label: "CaptchaAnswer", type: "text" }
      },
      async authorize(credentials) {
        const email = (credentials?.email || "").toLowerCase().trim();
        const password = credentials?.password || "";
        const captchaId = credentials?.captchaId || "";
        const captchaAnswer = credentials?.captchaAnswer || "";

        if (!verifyCaptcha(captchaId, captchaAnswer)) return null;

        await connectDB();
        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: String(user._id), email: user.email, name: user.name };
      }
    }),

    // Optional
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })]
      : [])
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const email = (user?.email || "").toLowerCase();
        const existing = await User.findOne({ email });
        if (!existing) {
          await User.create({
            email,
            name: user?.name || "",
            provider: "google",
            passwordHash: ""
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.uid) session.user.id = token.uid;
      return session;
    }
  },

  pages: {
    signIn: "/auth/login"
  }
};
