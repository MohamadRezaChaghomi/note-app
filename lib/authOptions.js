import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { recaptchaService } from "@/lib/recaptcha";
import { sendSecurityAlert } from "@/services/mail.service";

export const authOptions = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  jwt: { maxAge: 24 * 60 * 60 },
  
  providers: [
    CredentialsProvider({
      id: "credentials",
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
          
          // Find user with password field
          const user = await User.findOne({ email })
            .select("+password +loginAttempts +lockUntil +lastLogin +role +provider +oauthProviders");
          
          if (!user) {
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new Error("INVALID_CREDENTIALS");
          }

          // Check if user is OAuth-only
          if (user.provider === "google" && !user.password) {
            throw new Error("USE_GOOGLE");
          }

          // Check if account is locked
          if (user.lockUntil && user.lockUntil > Date.now()) {
            const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
            throw new Error(`Account is locked. Try again in ${lockTime} minutes.`);
          }

          // Check password
          let isPasswordValid = false;
          
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
            provider: user.provider || "credentials",
            oauthProviders: user.oauthProviders || []
          };
          
        } catch (error) {
          console.error("Authorize error:", error.message);
          throw error;
        }
      }
    }),

    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
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
            // Create new OAuth user
            existingUser = await User.create({
              email,
              name: user?.name || profile?.name || email.split('@')[0],
              provider: "google",
              oauthProviders: ["google"],
              image: user?.image || profile?.picture,
              emailVerified: new Date(),
              role: "user",
              settings: {
                theme: "system",
                language: "en",
                notifications: true,
              }
            });
          } else {
            // Update existing user
            existingUser.lastLogin = new Date();
            existingUser.name = user?.name || profile?.name || existingUser.name;
            existingUser.image = user?.image || profile?.picture || existingUser.image;
            
            // Add Google to oauthProviders if not already
            if (!existingUser.oauthProviders?.includes("google")) {
              existingUser.oauthProviders = [...(existingUser.oauthProviders || []), "google"];
            }
            
            // Update provider
            if (existingUser.provider === "credentials" && existingUser.password) {
              existingUser.provider = "multiple";
            } else {
              existingUser.provider = "google";
            }
            
            await existingUser.save();
            
            // Send security alert for new OAuth login
            try {
              await sendSecurityAlert(email, "oauth_login", {
                provider: "google",
                browser: "Unknown",
                os: "Unknown",
                location: "Unknown"
              });
            } catch (alertError) {
              console.warn("Security alert failed:", alertError);
            }
          }
          
          user.id = String(existingUser._id);
          user.role = existingUser.role || "user";
          user.provider = existingUser.provider;
          user.oauthProviders = existingUser.oauthProviders;
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
        token.oauthProviders = user.oauthProviders || [];
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
        session.user.oauthProviders = token.oauthProviders;
        session.user.lastActivity = token.lastActivity;
      }
      
      return session;
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    signUp: "/auth/register"
  },
  
  debug: process.env.NODE_ENV === "development",
  
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("Account linked:", user.email, account.provider);
    }
  }
};