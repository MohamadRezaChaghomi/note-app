import mongoose from "mongoose";
import {
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderTree,
  getFolderStats,
  reorderFolders,
  duplicateFolder,
  searchFolders,
} from "@/services/folder.service";

export async function foldersGET(req, userId) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Handle different view types
    const view = params.view || "list";

    switch (view) {
      case "tree":
        const tree = await getFolderTree(userId);
        return Response.json({ ok: true, tree });

      case "stats":
        const stats = await getFolderStats(userId);
        return Response.json({ ok: true, stats });

      case "search":
        if (!params.q) {
          return Response.json(
            { ok: false, message: "Search query is required" },
            { status: 400 }
          );
        }
        const searchResults = await searchFolders(userId, params.q, {
          limit: parseInt(params.limit) || 20,
          offset: parseInt(params.offset) || 0,
          includeArchived: params.includeArchived === "true",
          includeNotes: params.includeNotes === "true",
        });
        return Response.json({ ok: true, ...searchResults });

      default:
        const options = {
          parentId: params.parentId !== undefined ? params.parentId : null,
          withArchived: params.withArchived === "true",
          withNoteCount: params.withNoteCount !== "false",
          search: params.search || "",
          limit: parseInt(params.limit) || 100,
          offset: parseInt(params.offset) || 0,
          sort: params.sort || "order_asc",
          treeView: params.treeView === "true",
        };

        const result = await listFolders(userId, options);
        return Response.json({ ok: true, ...result });
    }
  } catch (error) {
    console.error("Folders GET error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to fetch folders",
        code: "FETCH_FOLDERS_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function foldersPOST(req, userId) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return Response.json(
        {
          ok: false,
          message: "Folder title is required",
          code: "MISSING_TITLE",
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

    // Handle specific errors
    if (error.message.includes("already exists")) {
      return Response.json(
        {
          ok: false,
          message: error.message,
          code: "DUPLICATE_FOLDER",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to create folder",
        code: "CREATE_FOLDER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function folderGET(_req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid folder ID format",
          code: "INVALID_FOLDER_ID",
        },
        { status: 400 }
      );
    }

    const folder = await getFolder(userId, id);

    if (!folder) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
          code: "FOLDER_NOT_FOUND",
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
        code: "FETCH_FOLDER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function folderPATCH(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid folder ID format",
          code: "INVALID_FOLDER_ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return Response.json(
        {
          ok: false,
          message: "No update data provided",
          code: "NO_UPDATE_DATA",
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
          code: "FOLDER_NOT_FOUND",
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

    if (error.message.includes("already exists")) {
      return Response.json(
        {
          ok: false,
          message: error.message,
          code: "DUPLICATE_FOLDER",
        },
        { status: 409 }
      );
    }

    if (error.message.includes("cannot be its own parent")) {
      return Response.json(
        {
          ok: false,
          message: error.message,
          code: "CIRCULAR_REFERENCE",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to update folder",
        code: "UPDATE_FOLDER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function folderDELETE(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid folder ID format",
          code: "INVALID_FOLDER_ID",
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    const moveNotesTo = searchParams.get("moveNotesTo");

    const options = {
      force,
      moveNotesTo: moveNotesTo || null,
    };

    const result = await deleteFolder(userId, id, options);

    if (!result) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
          code: "FOLDER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return Response.json({
      ok: true,
      message: force
        ? "Folder permanently deleted"
        : moveNotesTo
        ? "Folder deleted and notes moved"
        : "Folder moved to archive",
    });
  } catch (error) {
    console.error("Folder DELETE error:", error);

    if (error.message.includes("contains notes")) {
      return Response.json(
        {
          ok: false,
          message: error.message,
          code: "FOLDER_HAS_NOTES",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to delete folder",
        code: "DELETE_FOLDER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function foldersBulkPATCH(req, userId) {
  try {
    const body = await req.json();

    if (!body.action) {
      return Response.json(
        {
          ok: false,
          message: "Action is required",
          code: "MISSING_ACTION",
        },
        { status: 400 }
      );
    }

    switch (body.action) {
      case "reorder":
        if (!body.folderIds || !Array.isArray(body.folderIds)) {
          return Response.json(
            {
              ok: false,
              message: "folderIds array is required",
              code: "MISSING_FOLDER_IDS",
            },
            { status: 400 }
          );
        }

        await reorderFolders(userId, body.folderIds);
        return Response.json({
          ok: true,
          message: "Folders reordered successfully",
        });

      case "archive":
      case "unarchive":
        if (!body.folderIds || !Array.isArray(body.folderIds)) {
          return Response.json(
            {
              ok: false,
              message: "folderIds array is required",
              code: "MISSING_FOLDER_IDS",
            },
            { status: 400 }
          );
        }

        const updates = body.folderIds.map((folderId) => ({
          updateOne: {
            filter: { _id: folderId, userId },
            update: { $set: { isArchived: body.action === "archive" } },
          },
        }));

        await Folder.bulkWrite(updates);
        return Response.json({
          ok: true,
          message: `${body.folderIds.length} folders ${body.action === "archive" ? "archived" : "unarchived"}`,
        });

      case "move":
        if (!body.folderIds || !Array.isArray(body.folderIds)) {
          return Response.json(
            {
              ok: false,
              message: "folderIds array is required",
              code: "MISSING_FOLDER_IDS",
            },
            { status: 400 }
          );
        }

        if (!body.parentId) {
          return Response.json(
            {
              ok: false,
              message: "parentId is required",
              code: "MISSING_PARENT_ID",
            },
            { status: 400 }
          );
        }

        const moveUpdates = body.folderIds.map((folderId) => ({
          updateOne: {
            filter: { _id: folderId, userId },
            update: { $set: { parentId: body.parentId } },
          },
        }));

        await Folder.bulkWrite(moveUpdates);
        return Response.json({
          ok: true,
          message: `${body.folderIds.length} folders moved`,
        });

      default:
        return Response.json(
          {
            ok: false,
            message: "Invalid action",
            code: "INVALID_ACTION",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Folders bulk PATCH error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to perform bulk action",
        code: "BULK_ACTION_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function folderDuplicatePOST(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid folder ID format",
          code: "INVALID_FOLDER_ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const newParentId = body.newParentId || null;

    const duplicate = await duplicateFolder(userId, id, newParentId);

    return Response.json(
      {
        ok: true,
        folder: duplicate,
        message: "Folder duplicated successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Folder duplicate error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to duplicate folder",
        code: "DUPLICATE_FOLDER_ERROR",
      },
      { status: 500 }
    );
  }
}

export async function folderNotesGET(_req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json(
        {
          ok: false,
          message: "Invalid folder ID format",
          code: "INVALID_FOLDER_ID",
        },
        { status: 400 }
      );
    }

    // Check if folder exists
    const folder = await Folder.findOne({ _id: id, userId });
    if (!folder) {
      return Response.json(
        {
          ok: false,
          message: "Folder not found",
          code: "FOLDER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Get notes in this folder
    const notes = await Note.find({ folderId: id, userId, isTrashed: false })
      .sort({ updatedAt: -1 })
      .populate("folderId", "title color")
      .lean();

    return Response.json({
      ok: true,
      notes,
      count: notes.length,
    });
  } catch (error) {
    console.error("Folder notes GET error:", error);
    return Response.json(
      {
        ok: false,
        message: error.message || "Failed to fetch folder notes",
        code: "FETCH_FOLDER_NOTES_ERROR",
      },
      { status: 500 }
    );
  }
}