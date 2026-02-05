import {
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderNotes,
} from "@/services/folder.service";

export async function foldersGET(req, userId) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let folders = await listFolders(userId);

    // فیلتر کردن بر اساس جستجو
    if (search) {
      folders = folders.filter(
        folder =>
          folder.title.toLowerCase().includes(search.toLowerCase()) ||
          folder.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return Response.json({
      ok: true,
      folders,
    });
  } catch (error) {
    console.error("Folders GET error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to fetch folders",
      },
      { status: 500 }
    );
  }
}

export async function foldersPOST(req, userId) {
  try {
    const body = await req.json();

    if (!body.title?.trim()) {
      return Response.json(
        {
          ok: false,
          message: "Folder title is required",
        },
        { status: 400 }
      );
    }

    const folder = await createFolder(userId, body);

    return Response.json(
      {
        ok: true,
        folder,
        message: "Folder created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Folder POST error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to create folder",
      },
      { status: 500 }
    );
  }
}

export async function folderGET(_req, userId, id) {
  try {
    const folder = await getFolder(userId, id);

    if (!folder) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      folder,
    });
  } catch (error) {
    console.error("Folder GET error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to fetch folder",
      },
      { status: 500 }
    );
  }
}

export async function folderPATCH(req, userId, id) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return Response.json(
        {
          ok: false,
          message: "No update data provided",
        },
        { status: 400 }
      );
    }

    const folder = await updateFolder(userId, id, body);

    if (!folder) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      folder,
      message: "Folder updated successfully",
    });
  } catch (error) {
    console.error("Folder PATCH error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to update folder",
      },
      { status: 500 }
    );
  }
}

export async function folderDELETE(_req, userId, id) {
  try {
    const result = await deleteFolder(userId, id);

    if (!result) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Folder DELETE error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to delete folder",
      },
      { status: 500 }
    );
  }
}

export async function folderNotesGET(_req, userId, folderId) {
  try {
    const notes = await getFolderNotes(userId, folderId);

    return Response.json({
      ok: true,
      notes,
    });
  } catch (error) {
    console.error("Folder notes GET error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to fetch folder notes",
      },
      { status: 500 }
    );
  }
}