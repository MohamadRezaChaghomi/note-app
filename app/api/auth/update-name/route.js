import { requireUserId } from "@/lib/apiAuth";
import { updateName } from "@/controllers/auth.controller";

export async function PATCH(req) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return updateName(req, uid);
}
