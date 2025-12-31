const store = new Map(); // captchaId -> { answer, exp }

export function createCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const answer = String(a + b);
  const captchaId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  store.set(captchaId, { answer, exp: Date.now() + 5 * 60 * 1000 }); // 5 min
  return { captchaId, question: `${a} + ${b} = ?` };
}

export function verifyCaptcha(captchaId, userAnswer) {
  const item = store.get(captchaId);
  if (!item) return false;
  if (Date.now() > item.exp) {
    store.delete(captchaId);
    return false;
  }
  const ok = String(userAnswer ?? "").trim() === item.answer;
  store.delete(captchaId); // one-time
  return ok;
}
