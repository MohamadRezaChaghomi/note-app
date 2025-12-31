import { listFolders, createFolder, updateFolder, deleteFolder } from "@/services/folder.service";

export async function foldersGET(_req, userId) {
  const folders = await listFolders(userId);
  return Response.json({ ok: true, folders });
}

export async function foldersPOST(req, userId) {
  const body = await req.json();
  const folder = await createFolder(userId, body);
  return Response.json({ ok: true, folder }, { status: 201 });
}

export async function folderPATCH(req, userId, id) {
  const body = await req.json();
  const folder = await updateFolder(userId, id, body);
  if (!folder) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, folder });
}

export async function folderDELETE(_req, userId, id) {
  const ok = await deleteFolder(userId, id);
  return Response.json({ ok });
}
