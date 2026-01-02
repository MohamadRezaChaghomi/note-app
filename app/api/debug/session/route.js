import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return Response.json({ ok: true, session: session || null });
  } catch (err) {
    console.error('Debug session error:', err);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
