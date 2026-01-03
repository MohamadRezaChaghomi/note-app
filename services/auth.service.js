import User from "@/models/User.model";
import PasswordResetCode from "@/models/PasswordResetCode.model";
import bcrypt from "bcryptjs";
import { recaptchaService } from "@/lib/recaptcha";
import { generateNumericCode } from "@/lib/crypto";
import { sendMail, sendWelcomeEmail, sendSecurityAlert } from "@/services/mail.service";
import { connectDB } from "@/lib/db";

class AuthService {
  constructor() {
    this.saltRounds = 10;
  }

  /**
   * Register new user with reCAPTCHA
   */
  async registerUser(userData) {
    try {
      await connectDB();
      const { email, password, name, recaptchaToken } = userData;

      // Verify reCAPTCHA
      await this.verifyRecaptcha(recaptchaToken, "register");

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("EMAIL_EXISTS");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role: "user",
        provider: "credentials",
        settings: {
          theme: "system",
          language: "en",
          notifications: true
        }
      });

      // Remove sensitive data
      const userObj = user.toObject();
      delete userObj.password;
      
      // Send welcome email
      try {
        await sendWelcomeEmail(email, name);
      } catch (emailError) {
        console.warn("Welcome email failed:", emailError);
      }
      
      return userObj;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Send password reset code
   */
  async sendResetCode(email) {
    try {
      await connectDB();
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists (security)
        return { sent: true };
      }

      // Check if user can reset password (not OAuth-only user)
      if ((user.provider === 'google' || user.provider === 'multiple') && !user.password) {
        throw new Error("OAUTH_USER_NO_PASSWORD");
      }

      // Generate 6-digit code
      const code = generateNumericCode(6);
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      // Save to PasswordResetCode collection
      const hashedCode = await bcrypt.hash(code, this.saltRounds);
      
      // Delete any existing codes for this user
      await PasswordResetCode.deleteMany({ email });
      
      // Create new code
      await PasswordResetCode.create({
        userId: user._id,
        email: email,
        code: hashedCode,
        expiresAt: expires,
        attempts: 0
      });

      // Send email
      await sendMail({
        to: email,
        subject: "Password Reset Code",
        html: `
          <h2>Password Reset</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });

      return { sent: true, email };
    } catch (error) {
      console.error("Send reset code error:", error);
      
      if (error.message === "OAUTH_USER_NO_PASSWORD") {
        throw new Error("OAUTH_USER_NO_PASSWORD");
      }
      
      throw new Error("FAILED_TO_SEND_CODE");
    }
  }

  /**
   * Verify reset code
   */
  async verifyResetCode(email, code) {
    try {
      await connectDB();
      
      // Check in PasswordResetCode collection
      const resetCodeDoc = await PasswordResetCode.findOne({ 
        email,
        expiresAt: { $gt: new Date() }
      });
      
      if (!resetCodeDoc) {
        throw new Error("INVALID_CODE");
      }

      // Check attempts
      if (resetCodeDoc.attempts >= 5) {
        await PasswordResetCode.deleteOne({ _id: resetCodeDoc._id });
        throw new Error("TOO_MANY_ATTEMPTS");
      }

      // Verify code
      const isValid = await bcrypt.compare(code, resetCodeDoc.code);
      if (!isValid) {
        resetCodeDoc.attempts += 1;
        await resetCodeDoc.save();
        throw new Error("INVALID_CODE");
      }

      // Get user
      const user = await User.findById(resetCodeDoc.userId);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      return {
        userId: user._id,
        email: user.email,
        valid: true,
        resetCodeId: resetCodeDoc._id
      };
    } catch (error) {
      console.error("Verify reset code error:", error);
      throw error;
    }
  }

  /**
   * Reset password with code
   */
  async resetPassword(email, code, newPassword) {
    try {
      await connectDB();
      
      // Verify the code
      const verification = await this.verifyResetCode(email, code);
      
      if (!verification.valid) {
        throw new Error("INVALID_CODE");
      }

      // Get the reset code document
      const resetCodeDoc = await PasswordResetCode.findById(verification.resetCodeId);
      if (!resetCodeDoc) {
        throw new Error("INVALID_CODE");
      }

      // Verify code again (double check)
      const isValid = await bcrypt.compare(code, resetCodeDoc.code);
      if (!isValid) {
        throw new Error("INVALID_CODE");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

      // Update user
      await User.findByIdAndUpdate(verification.userId, {
        password: hashedPassword,
        loginAttempts: 0,
        lockUntil: null
      });

      // Delete the used code
      await PasswordResetCode.deleteOne({ _id: verification.resetCodeId });

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  /**
   * Create or update user from OAuth provider
   */
  async createOrUpdateOAuthUser(profile, provider) {
    try {
      await connectDB();
      
      const email = profile.email.toLowerCase();
      
      // Check if user exists
      let user = await User.findOne({ email });
      
      if (user) {
        // Update existing user
        if (!user.oauthProviders?.includes(provider)) {
          user.oauthProviders = [...(user.oauthProviders || []), provider];
          user.provider = user.provider === 'credentials' ? 'multiple' : provider;
        }
        
        user.name = profile.name || user.name;
        user.image = profile.image || user.image;
        user.emailVerified = user.emailVerified || new Date();
        user.lastLogin = new Date();
        
        await user.save();
        
        // Send security alert
        try {
          await sendSecurityAlert(email, "oauth_login", {
            provider,
            browser: "Unknown",
            os: "Unknown",
            location: "Unknown"
          });
        } catch (emailError) {
          console.warn("Security alert failed:", emailError);
        }
      } else {
        // Create new user
        user = await User.create({
          email,
          name: profile.name || email.split('@')[0],
          image: profile.image,
          provider: provider,
          oauthProviders: [provider],
          emailVerified: new Date(),
          role: "user",
          settings: {
            theme: "system",
            language: "en",
            notifications: true
          }
        });
        
        // Send welcome email
        try {
          await sendWelcomeEmail(email, user.name);
        } catch (emailError) {
          console.warn("Welcome email failed:", emailError);
        }
      }
      
      return user;
    } catch (error) {
      console.error("OAuth user creation error:", error);
      throw error;
    }
  }

  /**
   * Link OAuth provider to existing account
   */
  async linkOAuthProvider(userId, profile, provider) {
    try {
      await connectDB();
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }
      
      // Check if provider already linked
      if (user.oauthProviders?.includes(provider)) {
        return user;
      }
      
      // Add provider
      user.oauthProviders = [...(user.oauthProviders || []), provider];
      user.provider = user.provider === 'credentials' ? 'multiple' : provider;
      
      // Update profile image if not set
      if (!user.image && profile.image) {
        user.image = profile.image;
      }
      
      await user.save();
      
      // Send security alert
      try {
        await sendSecurityAlert(user.email, 'oauth_linked', { 
          provider,
          browser: "Unknown",
          os: "Unknown",
          location: "Unknown"
        });
      } catch (emailError) {
        console.warn("Security alert email failed:", emailError);
      }
      
      return user;
    } catch (error) {
      console.error("Link OAuth error:", error);
      throw error;
    }
  }

  /**
   * Verify reCAPTCHA token
   */
  async verifyRecaptcha(token, action) {
    // Skip in development unless forced
    if (process.env.NODE_ENV === "development" && process.env.FORCE_RECAPTCHA !== "true") {
      console.warn(`reCAPTCHA skipped for ${action} in development`);
      return true;
    }

    const result = await recaptchaService.verify(token, action);
    
    if (!result.success) {
      console.error(`reCAPTCHA failed for ${action}:`, result);
      throw new Error("RECAPTCHA_FAILED");
    }

    return true;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    await connectDB();
    return User.findOne({ email });
  }

  /**
   * Update user's display name
   */
  async updateUserName(userId, newName) {
    try {
      await connectDB();
      const user = await User.findByIdAndUpdate(
        userId,
        { name: newName },
        { new: true }
      ).lean();

      if (!user) throw new Error("USER_NOT_FOUND");
      return user;
    } catch (error) {
      console.error("Update user name error:", error);
      throw error;
    }
  }
}

// ایجاد نمونه از سرویس
const authServiceInstance = new AuthService();

// Export
export { AuthService, authServiceInstance };
export default authServiceInstance;