/**
 * Simple CAPTCHA Service for registration
 * Note: This is separate from Google reCAPTCHA
 */

const captchaStore = new Map();

export function generateCaptcha() {
  const id = Math.random().toString(36).substring(2, 15);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let answer = "";
  
  for (let i = 0; i < 5; i++) {
    answer += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const captcha = {
    id,
    text: answer,
    answer: answer.toLowerCase(),
    createdAt: Date.now()
  };
  
  captchaStore.set(id, captcha);
  
  // Auto-cleanup after 10 minutes
  setTimeout(() => {
    captchaStore.delete(id);
  }, 10 * 60 * 1000);
  
  return captcha;
}

export function verifyCaptcha(id, userAnswer) {
  if (!id || !userAnswer) return false;
  
  const captcha = captchaStore.get(id);
  if (!captcha) return false;
  
  // Check if expired (10 minutes)
  if (Date.now() - captcha.createdAt > 10 * 60 * 1000) {
    captchaStore.delete(id);
    return false;
  }
  
  const isValid = userAnswer.toLowerCase() === captcha.answer;
  
  // Remove after verification (one-time use)
  captchaStore.delete(id);
  
  return isValid;
}

export function cleanupExpiredCaptchas() {
  const now = Date.now();
  for (const [id, captcha] of captchaStore.entries()) {
    if (now - captcha.createdAt > 10 * 60 * 1000) {
      captchaStore.delete(id);
    }
  }
}