import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import PasswordResetToken from "@/models/PasswordResetToken.model";
import { randomToken, sha256 } from "@/lib/crypto";
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

export async function createResetTokenAndEmail({ email, baseUrl }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  const user = await User.findOne({ email: e });
  if (!user) return; // for security, don't reveal

  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

  const link = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(e)}`;

  await sendMail({
    to: e,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial; line-height: 1.6">
        <h2>Password reset</h2>
        <p>Click the link below to reset your password (valid for 30 minutes):</p>
        <p><a href="${link}">${link}</a></p>
      </div>
    `
  });
}

export async function validateResetToken({ email, token }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  const user = await User.findOne({ email: e });
  if (!user) return false;

  const tokenHash = sha256(token);
  const rec = await PasswordResetToken.findOne({ userId: user._id, tokenHash });
  if (!rec) return false;
  if (rec.expiresAt.getTime() < Date.now()) return false;
  return true;
}

export async function resetPassword({ email, token, newPassword }) {
  await connectDB();
  const e = email.toLowerCase().trim();
  const user = await User.findOne({ email: e });
  if (!user) throw new Error("INVALID_TOKEN");

  const tokenHash = sha256(token);
  const rec = await PasswordResetToken.findOne({ userId: user._id, tokenHash });
  if (!rec || rec.expiresAt.getTime() < Date.now()) throw new Error("INVALID_TOKEN");

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  await PasswordResetToken.deleteMany({ userId: user._id });
}
