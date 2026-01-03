import { buildReport } from "@/services/report.service";

export async function reportGET(range = '14days') {
  try {
    const data = await buildReport(range);
    return Response.json({ 
      ok: true, 
      ...data,
      meta: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (err) {
    console.error('Report controller error:', err);
    return Response.json({ 
      ok: false, 
      error: err.message,
      code: 'REPORT_GENERATION_FAILED'
    }, { status: 500 });
  }
}