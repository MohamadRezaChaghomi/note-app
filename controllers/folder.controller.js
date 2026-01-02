import { listFolders, createFolder, updateFolder, deleteFolder, getFolder, getNoteCountByFolder } from "@/services/folder.service";

export async function foldersGET(_req, userId) {
  try {
    const folders = await listFolders(userId);
    return Response.json({ ok: true, folders });
  } catch (error) {
    console.error("Folders GET error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function folderGET(_req, userId, id) {
  try {
    const folder = await getFolder(userId, id);
    if (!folder) return Response.json({ ok: false, message: "Folder not found" }, { status: 404 });
    return Response.json({ ok: true, folder });
  } catch (error) {
    console.error("Folder GET error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function foldersPOST(req, userId) {
  try {
    const body = await req.json();
    const folder = await createFolder(userId, body);
    return Response.json({ ok: true, folder }, { status: 201 });
  } catch (error) {
    console.error("Folder POST error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function folderPATCH(req, userId, id) {
  try {
    const body = await req.json();
    const folder = await updateFolder(userId, id, body);
    if (!folder) return Response.json({ ok: false, message: "Folder not found" }, { status: 404 });
    return Response.json({ ok: true, folder });
  } catch (error) {
    console.error("Folder PATCH error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function folderDELETE(_req, userId, id) {
  try {
    const ok = await deleteFolder(userId, id);
    return Response.json({ ok });
  } catch (error) {
    console.error("Folder DELETE error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}
