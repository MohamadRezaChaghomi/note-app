import { listTags, createTag, updateTag, deleteTag } from "@/services/tag.service";

export async function tagsGET(_req, userId) {
  const tags = await listTags(userId);
  return Response.json({ ok: true, tags });
}

export async function tagsPOST(req, userId) {
  const body = await req.json();
  const tag = await createTag(userId, body);
  return Response.json({ ok: true, tag }, { status: 201 });
}

export async function tagPATCH(req, userId, id) {
  const body = await req.json();
  const tag = await updateTag(userId, id, body);
  if (!tag) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, tag });
}

export async function tagDELETE(_req, userId, id) {
  const ok = await deleteTag(userId, id);
  return Response.json({ ok });
}
