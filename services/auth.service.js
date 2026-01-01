import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import PasswordResetCode from "@/models/PasswordResetCode.model";
import { randomToken, sha256, generateNumericCode } from "@/lib/crypto";
import { sendMail } from "@/services/mail.service";

export async function registerUser({ email, password, name }) {
  await connectDB();
  const e = email.toLowerCase().trim();

  const existing = await User.findOne({ email: e });
  if (existing) throw new Error("EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: e, name: name || "", passwordHash, provider: "credentials" });
  return user;
}

// تولید کد ۶ رقمی
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ارسال کد بازنشانی
export async function sendResetCode({ email }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  const user = await User.findOne({ email: e });
  if (!user) return null; // برای امنیت، کاربر وجود ندارد را اعلام نکنیم

  // حذف کدهای قبلی برای این کاربر
  await PasswordResetCode.deleteMany({ userId: user._id });

  // تولید کد جدید
  const code = generateResetCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 دقیقه اعتبار

  // ذخیره کد
  await PasswordResetCode.create({
    userId: user._id,
    email: e,
    code,
    expiresAt
  });

  // ارسال ایمیل
  await sendMail({
    to: e,
    subject: "کد بازنشانی رمز عبور",
    html: `
      <div style="font-family: Arial; line-height: 1.6; text-align: center; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; margin-bottom: 20px;">بازنشانی رمز عبور</h2>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #666;">کد تأیید شما:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #007bff; margin: 15px 0;">
            ${code}
          </div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">این کد به مدت 10 دقیقه معتبر است</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
          <p style="margin: 5px 0;">اگر درخواست بازنشانی رمز عبور نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
      </div>
    `
  });

  return { email: e };
}

// تأیید کد
export async function verifyResetCode({ email, code }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  
  const resetCode = await PasswordResetCode.findOne({ 
    email: e, 
    code 
  });

  if (!resetCode) {
    throw new Error("INVALID_CODE");
  }

  // بررسی انقضا
  if (resetCode.expiresAt.getTime() < Date.now()) {
    await PasswordResetCode.deleteOne({ _id: resetCode._id });
    throw new Error("CODE_EXPIRED");
  }

  // افزایش تعداد تلاش‌ها
  resetCode.attempts += 1;
  await resetCode.save();

  return { 
    valid: true, 
    email: resetCode.email,
    userId: resetCode.userId 
  };
}

// تغییر رمز عبور پس از تأیید کد
export async function resetPassword({ email, code, newPassword }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  
  // ابتدا کد را تأیید می‌کنیم
  const verification = await verifyResetCode({ email: e, code });
  if (!verification.valid) {
    throw new Error("INVALID_CODE");
  }

  // تغییر رمز عبور کاربر
  const user = await User.findById(verification.userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  // حذف کد استفاده شده
  await PasswordResetCode.deleteMany({ userId: user._id });

  return { success: true };
}
