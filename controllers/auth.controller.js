import { 
  registerUser, 
  sendResetCode, 
  verifyResetCode, 
  resetPassword 
} from "@/services/auth.service";
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

// ارسال کد بازنشانی
export async function forgetPassword(req) {
  const body = await req.json();
  const { email } = body || {};
  
  try {
    const result = await sendResetCode({ email });
    
    // همیشه ok برمی‌گردانیم حتی اگر ایمیل وجود نداشته باشد (برای امنیت)
    return Response.json({ 
      ok: true, 
      message: "If an account exists with this email, a reset code has been sent."
    });
  } catch (error) {
    console.error("Forget password error:", error);
    return Response.json({ 
      ok: false, 
      error: "Failed to send reset code" 
    }, { status: 500 });
  }
}

// تأیید کد بازنشانی
export async function verifyCode(req) {
  const body = await req.json();
  const { email, code } = body || {};
  
  if (!email || !code) {
    return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
  }

  try {
    const result = await verifyResetCode({ email, code });
    return Response.json({ 
      ok: true, 
      email: result.email,
      userId: result.userId 
    });
  } catch (error) {
    const msg = String(error?.message || "ERROR");
    
    if (msg === "INVALID_CODE") {
      return Response.json({ ok: false, error: "INVALID_CODE" }, { status: 400 });
    }
    
    if (msg === "CODE_EXPIRED") {
      return Response.json({ ok: false, error: "CODE_EXPIRED" }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "VERIFICATION_FAILED" }, { status: 500 });
  }
}

// تغییر رمز عبور با کد تأیید شده
export async function reset(req) {
  const body = await req.json();
  const { email, code, newPassword } = body || {};
  
  if (!email || !code || !newPassword) {
    return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
  }

  try {
    await resetPassword({ email, code, newPassword });
    return Response.json({ ok: true });
  } catch (error) {
    const msg = String(error?.message || "ERROR");
    
    if (msg === "INVALID_CODE" || msg === "CODE_EXPIRED" || msg === "USER_NOT_FOUND") {
      return Response.json({ ok: false, error: msg }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "RESET_FAILED" }, { status: 500 });
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
