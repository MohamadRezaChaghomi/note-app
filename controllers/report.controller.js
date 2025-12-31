import { buildReport } from "@/services/report.service";

export async function reportGET() {
  const data = await buildReport();
  return Response.json({ ok: true, ...data });
}
