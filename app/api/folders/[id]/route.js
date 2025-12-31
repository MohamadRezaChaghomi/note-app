import { requireUserId } from "@/lib/apiAuth";
import { folderPATCH, folderDELETE } from "@/controllers/folder.controller";

export async function PATCH(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return folderPATCH(req, uid, params.id);
}

export async function DELETE(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return folderDELETE(req, uid, params.id);
}
