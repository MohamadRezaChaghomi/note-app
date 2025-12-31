import { registerUser, createResetTokenAndEmail, validateResetToken, resetPassword } from "@/services/auth.service";
import { verifyCaptcha } from "@/lib/captcha";

export async function register(req) {
  const body = await req.json();
  const { email, password, name, captchaId, captchaAnswer } = body || {};

  if (!verifyCaptcha(captchaId, captchaAnswer)) {
    return Response.json({ ok: false, error: "INVALID_CAPTCHA" }, { status: 400 });
  }

  if (!email || !password) {
    return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
  }

  try {
    const user = await registerUser({ email, password, name });
    return Response.json({ ok: true, userId: String(user._id) });
  } catch (e) {
    const msg = String(e?.message || "ERROR");
    if (msg === "EMAIL_EXISTS") return Response.json({ ok: false, error: "EMAIL_EXISTS" }, { status: 409 });
    return Response.json({ ok: false, error: "REGISTER_FAILED" }, { status: 500 });
  }
}

export async function forgetPassword(req) {
  const body = await req.json();
  const { email } = body || {};
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  await createResetTokenAndEmail({ email, baseUrl });
  return Response.json({ ok: true });
}

export async function validateToken(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const ok = await validateResetToken({ email, token });
  return Response.json({ ok });
}

export async function reset(req) {
  const body = await req.json();
  const { email, token, newPassword } = body || {};
  if (!email || !token || !newPassword) return Response.json({ ok: false }, { status: 400 });

  try {
    await resetPassword({ email, token, newPassword });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "INVALID_TOKEN" }, { status: 400 });
  }
}

export async function activity(req) {
  // refresh lastActive cookie
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `lastActive=${Date.now()}; Path=/; Max-Age=${60 * 60}; SameSite=Lax`
  );
  return res;
}

export async function check(req) {
  const last = Number(req.cookies.get("lastActive")?.value || "0");
  const ok = Date.now() - last <= 10 * 60 * 1000;
  return Response.json({ ok, lastActive: last });
}

export async function logout() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", `lastActive=; Path=/; Max-Age=0; SameSite=Lax`);
  return res;
}
