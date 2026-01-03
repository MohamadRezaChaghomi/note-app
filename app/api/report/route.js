import { reportGET } from '@/controllers/report.controller';

export async function GET(req) {
  const url = new URL(req.url);
  const range = url.searchParams.get('range') || '14days';
  
  try {
    return await reportGET(range);
  } catch (err) {
    console.error('Report route error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}