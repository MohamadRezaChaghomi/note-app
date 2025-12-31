import { requireUserId } from "@/lib/apiAuth";
import { foldersGET, foldersPOST } from "@/controllers/folder.controller";

export async function GET(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return foldersGET(req, uid);
}

export async function POST(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return foldersPOST(req, uid);
}
