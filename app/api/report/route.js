import { reportGET } from '@/controllers/report.controller';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req) {
  try {
    // Check admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Admin access required' }),
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || '14days';
    
    return await reportGET(range);
  } catch (err) {
    console.error('Report route error:', err);
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}