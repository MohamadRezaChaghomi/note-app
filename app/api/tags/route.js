import { requireUserId } from "@/lib/apiAuth";
import { tagsGET, tagsPOST } from "@/controllers/tag.controller";

export async function GET(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return tagsGET(req, uid);
}

export async function POST(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return tagsPOST(req, uid);
}
