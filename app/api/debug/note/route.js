import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import { requireUserId } from "@/lib/apiAuth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const uid = await requireUserId();

    if (!id) return Response.json({ ok: false, message: 'Missing id param' }, { status: 400 });

    const note = await Note.findById(id).lean();
    if (!note) return Response.json({ ok: false, message: 'Note not found', note: null }, { status: 404 });

    return Response.json({ ok: true, note, yourUserId: uid || null });
  } catch (err) {
    console.error('Debug note error:', err);
    return Response.json({ ok: false, message: err.message }, { status: 500 });
  }
}
