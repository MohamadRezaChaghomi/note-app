import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import { recaptchaService } from "@/lib/recaptcha";
import { generateNumericCode } from "@/lib/crypto";
import { sendMail } from "@/services/mail.service";
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

      // Generate 6-digit code
      const code = generateNumericCode(6);
      const expires = new Date(Date.now() + 10 * 60 * 1000);

      // Hash and save code (use update to avoid validation on the document)
      const hashedCode = await bcrypt.hash(code, this.saltRounds);
      await User.updateOne({ _id: user._id }, { $set: { resetCode: hashedCode, resetCodeExpires: expires } });

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
      throw new Error("FAILED_TO_SEND_CODE");
    }
  }

  /**
   * Verify reset code
   */
  async verifyResetCode(email, code) {
    try {
      await connectDB();
      const user = await User.findOne({ email }).select("+resetCode +resetCodeExpires");
      
      if (!user || !user.resetCode || !user.resetCodeExpires) {
        throw new Error("INVALID_CODE");
      }

      // Check expiration
      if (user.resetCodeExpires < new Date()) {
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        await user.save();
        throw new Error("CODE_EXPIRED");
      }

      // Verify code
      const isValid = await bcrypt.compare(code, user.resetCode);
      if (!isValid) {
        throw new Error("INVALID_CODE");
      }

      return {
        userId: user._id,
        email: user.email,
        valid: true
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

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);

      // Update user
      await User.findByIdAndUpdate(verification.userId, {
        password: hashedPassword,
        resetCode: undefined,
        resetCodeExpires: undefined,
        loginAttempts: 0,
        lockUntil: null
      });

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
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
}

const authService = new AuthService();
export { AuthService, authService };
export default authService;