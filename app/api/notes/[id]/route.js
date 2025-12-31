import { requireUserId } from "@/lib/apiAuth";
import { noteGET, notePATCH, noteDELETE } from "@/controllers/note.controller";

export async function GET(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return noteGET(req, uid, params.id);
}

export async function PATCH(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return notePATCH(req, uid, params.id);
}

export async function DELETE(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return noteDELETE(req, uid, params.id);
}
