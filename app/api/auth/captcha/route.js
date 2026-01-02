import { generateCaptcha } from "@/lib/captcha";

export async function GET() {
  const c = generateCaptcha();
  return Response.json({ ok: true, ...c });
}
