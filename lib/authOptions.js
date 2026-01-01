import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { recaptchaService } from "@/lib/recaptcha";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  jwt: { maxAge: 24 * 60 * 60 },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          const email = (credentials?.email || "").toLowerCase().trim();
          const password = credentials?.password || "";
          const recaptchaToken = credentials?.recaptchaToken;

          // Basic validation
          if (!email || !password) {
            throw new Error("MISSING_FIELDS");
          }

          // Verify reCAPTCHA in production
          if (process.env.NODE_ENV === "production") {
            const recaptchaResult = await recaptchaService.verify(recaptchaToken, "login");
            if (!recaptchaResult.success) {
              throw new Error("RECAPTCHA_FAILED");
            }
          }

          await connectDB();
          
          // Find user with security fields
          const user = await User.findOne({ email })
            .select("+password +loginAttempts +lockUntil +lastLogin +role +provider");
          
          if (!user) {
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error("INVALID_CREDENTIALS");
          }

          // Check if account is locked
          if (user.lockUntil && user.lockUntil > Date.now()) {
            const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            throw new Error(`Account is locked. Try again in ${lockTime} minutes.`);
          }

          // Check password
          let isPasswordValid = false;
          
          if (!user.password && user.provider === "google") {
            throw new Error("USE_GOOGLE");
          }
          
          if (user.password) {
            isPasswordValid = await bcrypt.compare(password, user.password);
          }

          if (!isPasswordValid) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            
            if (user.loginAttempts >= 5) {
              user.lockUntil = Date.now() + 15 * 60 * 1000;
            }
            
            await user.save();
            throw new Error("INVALID_CREDENTIALS");
          }

          // Reset attempts on success
          user.loginAttempts = 0;
          user.lockUntil = null;
          user.lastLogin = new Date();
          await user.save();

          return {
            id: String(user._id),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || "user",
            image: user.image,
            provider: "credentials"
          };
          
        } catch (error) {
          console.error("Authorize error:", error.message);
          throw error;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          await connectDB();
          
          const email = (user?.email || "").toLowerCase();
          
          let existingUser = await User.findOne({ email });
          
          if (!existingUser) {
            existingUser = await User.create({
              email,
              name: user?.name || profile?.name || "",
              provider: "google",
              image: user?.image || profile?.picture,
              role: "user",
              settings: {
                theme: "system",
                language: "en",
                notifications: true,
              }
            });
          } else {
            existingUser.lastLogin = new Date();
            existingUser.name = user?.name || profile?.name || existingUser.name;
            existingUser.image = user?.image || profile?.picture || existingUser.image;
            existingUser.provider = "google";
            await existingUser.save();
          }
          
          user.id = String(existingUser._id);
          user.role = existingUser.role || "user";
        }
        
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.provider = user.provider || account?.provider;
      }
      
      token.lastActivity = Date.now();
      
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.provider = token.provider;
        session.user.lastActivity = token.lastActivity;
      }
      
      return session;
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  
  debug: process.env.NODE_ENV === "development"
};