import { requireUserId } from "@/lib/apiAuth";
import { notesGET, notesPOST } from "@/controllers/note.controller";

export async function GET(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return notesGET(req, uid);
}

export async function POST(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return notesPOST(req, uid);
}
