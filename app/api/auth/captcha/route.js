import { createCaptcha } from "@/lib/captcha";

export async function GET() {
  const c = createCaptcha();
  return Response.json({ ok: true, ...c });
}
