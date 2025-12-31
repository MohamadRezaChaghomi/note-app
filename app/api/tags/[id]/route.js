import { requireUserId } from "@/lib/apiAuth";
import { tagPATCH, tagDELETE } from "@/controllers/tag.controller";

export async function PATCH(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return tagPATCH(req, uid, params.id);
}

export async function DELETE(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return tagDELETE(req, uid, params.id);
}
