import authServiceInstance from "@/services/auth.service";

export async function register(req) {
  try {
    const body = await req.json();
    const { email, password, name, recaptchaToken } = body || {};

    if (!email || !password || !name) {
      return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const user = await authServiceInstance.registerUser({ email, password, name, recaptchaToken });
    return Response.json({ ok: true, userId: String(user._id) });
  } catch (error) {
    console.error("Registration error:", error.message);
    
    if (error.message === "EMAIL_EXISTS") {
      return Response.json({ ok: false, error: "EMAIL_EXISTS" }, { status: 409 });
    }
    
    if (error.message === "RECAPTCHA_FAILED") {
      return Response.json({ ok: false, error: "RECAPTCHA_FAILED" }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "REGISTER_FAILED" }, { status: 500 });
  }
}

export async function forgetPassword(req) {
  try {
    const body = await req.json();
    const { email } = body || {};
    
    if (!email) {
      return Response.json({ ok: false, error: "EMAIL_REQUIRED" }, { status: 400 });
    }

    const result = await authServiceInstance.sendResetCode(email);
    
    return Response.json({ 
      ok: true, 
      message: "If an account exists with this email, a reset code has been sent.",
      ...result
    });
  } catch (error) {
    console.error("Forget password error:", error);
    
    if (error.message === "OAUTH_USER_NO_PASSWORD") {
      return Response.json({ 
        ok: false, 
        error: "OAUTH_USER_NO_PASSWORD",
        message: "This account uses Google sign-in. Please use Google to log in."
      }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "SEND_CODE_FAILED" }, { status: 500 });
  }
}

export async function verifyCode(req) {
  try {
    const body = await req.json();
    const { email, code } = body || {};
    
    if (!email || !code) {
      return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    const result = await authServiceInstance.verifyResetCode(email, code);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Verify code error:", error.message);
    
    if (error.message === "INVALID_CODE") {
      return Response.json({ ok: false, error: "INVALID_CODE" }, { status: 400 });
    }
    
    if (error.message === "CODE_EXPIRED") {
      return Response.json({ ok: false, error: "CODE_EXPIRED" }, { status: 400 });
    }
    
    if (error.message === "TOO_MANY_ATTEMPTS") {
      return Response.json({ ok: false, error: "TOO_MANY_ATTEMPTS" }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "VERIFICATION_FAILED" }, { status: 500 });
  }
}

export async function reset(req) {
  try {
    const body = await req.json();
    const { email, code, newPassword } = body || {};
    
    if (!email || !code || !newPassword) {
      return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    await authServiceInstance.resetPassword(email, code, newPassword);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Reset password error:", error.message);
    
    if (error.message === "INVALID_CODE" || error.message === "CODE_EXPIRED") {
      return Response.json({ ok: false, error: error.message }, { status: 400 });
    }
    
    return Response.json({ ok: false, error: "RESET_FAILED" }, { status: 500 });
  }
}

export async function activity(req) {
  const res = Response.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `lastActive=${Date.now()}; Path=/; Max-Age=${60 * 60}; SameSite=Lax; HttpOnly`
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
  res.headers.append(
    "Set-Cookie", 
    `lastActive=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`
  );
  return res;
}

// Legacy function (for token-based reset)
export async function validateToken(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const code = url.searchParams.get("token") || url.searchParams.get("code");

    if (!email || !code) {
      return Response.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }

    // Verify code via auth service
    await authServiceInstance.verifyResetCode(email, code);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Validate token error:", error.message || error);
    if (error.message === "INVALID_CODE") {
      return Response.json({ ok: false, error: "INVALID_CODE" }, { status: 400 });
    }
    if (error.message === "CODE_EXPIRED") {
      return Response.json({ ok: false, error: "CODE_EXPIRED" }, { status: 400 });
    }
    return Response.json({ ok: false, error: "VALIDATION_FAILED" }, { status: 500 });
  }
}

// OAuth Callback function
export async function oauthCallback(req) {
  try {
    const body = await req.json();
    const { provider, profile, userId } = body || {};

    if (!provider || !profile || !profile.email) {
      return Response.json({ ok: false, error: "INVALID_OAUTH_DATA" }, { status: 400 });
    }

    let user;
    
    if (userId) {
      // Linking OAuth to existing account
      user = await authServiceInstance.linkOAuthProvider(userId, profile, provider);
    } else {
      // Creating or updating OAuth user
      user = await authServiceInstance.createOrUpdateOAuthUser(profile, provider);
    }

    return Response.json({ 
      ok: true, 
      userId: String(user._id),
      email: user.email,
      name: user.name,
      image: user.image,
      provider: user.provider,
      oauthProviders: user.oauthProviders
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    
    if (error.message === "USER_NOT_FOUND") {
      return Response.json({ ok: false, error: "USER_NOT_FOUND" }, { status: 404 });
    }
    
    return Response.json({ ok: false, error: "OAUTH_FAILED" }, { status: 500 });
  }
}