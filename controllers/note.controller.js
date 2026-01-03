import mongoose from "mongoose";
import { 
  listNotes, 
  createNote, 
  getNote, 
  updateNote, 
  trashNote, 
  restoreNote, 
  deleteNoteForever,
  bulkUpdateNotes,
  shareNote,
  duplicateNote,
  exportNote
} from "@/services/note.service";

export async function notesGET(req, userId) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Clean parameters
    const cleanedParams = {};
    
    // Convert numeric parameters
    if (params.page) cleanedParams.page = parseInt(params.page) || 1;
    if (params.limit) cleanedParams.limit = parseInt(params.limit) || 12;
    
    // Copy other parameters
    ['sort', 'search', 'status', 'folderId', 'tags', 'priority', 'dateRange', 'withTrashed', 'pinnedFirst']
      .forEach(key => {
        if (params[key] !== undefined) cleanedParams[key] = params[key];
      });
    
    const result = await listNotes(userId, cleanedParams);
    
    return Response.json({ 
      ok: true, 
      ...result 
    });
  } catch (error) {
    console.error("Notes GET error:", error);
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to fetch notes",
      code: "FETCH_NOTES_ERROR"
    }, { status: 500 });
  }
}

export async function notesPOST(req, userId) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.title?.trim()) {
      return Response.json({ 
        ok: false, 
        message: "Title is required",
        code: "MISSING_TITLE"
      }, { status: 400 });
    }
    
    if (!body.folderId) {
      return Response.json({ 
        ok: false, 
        message: "Folder is required",
        code: "MISSING_FOLDER"
      }, { status: 400 });
    }
    
    const note = await createNote(userId, body);
    
    return Response.json({ 
      ok: true, 
      note,
      message: "Note created successfully"
    }, { status: 201 });
    
  } catch (error) {
    console.error("Note POST error:", error);
    
    // Handle specific errors
    if (error.message.includes("Folder not found")) {
      return Response.json({ 
        ok: false, 
        message: error.message,
        code: "FOLDER_NOT_FOUND"
      }, { status: 404 });
    }
    
    if (error.name === 'ValidationError') {
      return Response.json({ 
        ok: false, 
        message: "Validation failed",
        details: Object.values(error.errors).map(e => e.message),
        code: "VALIDATION_ERROR"
      }, { status: 400 });
    }
    
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to create note",
      code: "CREATE_NOTE_ERROR"
    }, { status: 500 });
  }
}

export async function noteGET(_req, userId, id) {
  try {
    // Validate note ID
    if (!id) {
      return Response.json({ 
        ok: false, 
        message: "Note ID is required",
        code: "MISSING_NOTE_ID"
      }, { status: 400 });
    }
    
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ 
        ok: false, 
        message: "Invalid note ID format",
        code: "INVALID_NOTE_ID"
      }, { status: 400 });
    }

    const note = await getNote(userId, id);
    if (!note) {
      return Response.json({ 
        ok: false, 
        message: "Note not found or you don't have permission to access it",
        code: "NOTE_NOT_FOUND"
      }, { status: 404 });
    }

    return Response.json({ 
      ok: true, 
      note,
      message: "Note retrieved successfully"
    });
    
  } catch (error) {
    console.error("Note GET error:", error);
    return Response.json({ 
      ok: false, 
      message: "Failed to retrieve note",
      code: "FETCH_NOTE_ERROR"
    }, { status: 500 });
  }
}

export async function notePATCH(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ 
        ok: false, 
        message: "Invalid note ID format",
        code: "INVALID_NOTE_ID"
      }, { status: 400 });
    }

    const body = await req.json();
    
    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return Response.json({ 
        ok: false, 
        message: "No update data provided",
        code: "NO_UPDATE_DATA"
      }, { status: 400 });
    }
    
    // Check if note exists and user has permission
    const existingNote = await getNote(userId, id);
    if (!existingNote) {
      return Response.json({ 
        ok: false, 
        message: "Note not found",
        code: "NOTE_NOT_FOUND"
      }, { status: 404 });
    }
    
    const note = await updateNote(userId, id, body);
    
    return Response.json({ 
      ok: true, 
      note,
      message: "Note updated successfully"
    });
    
  } catch (error) {
    console.error("Note PATCH error:", error);
    
    if (error.name === 'ValidationError') {
      return Response.json({ 
        ok: false, 
        message: "Validation failed",
        details: Object.values(error.errors).map(e => e.message),
        code: "VALIDATION_ERROR"
      }, { status: 400 });
    }
    
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to update note",
      code: "UPDATE_NOTE_ERROR"
    }, { status: 500 });
  }
}

export async function noteDELETE(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ 
        ok: false, 
        message: "Invalid note ID format",
        code: "INVALID_NOTE_ID"
      }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "trash";
    const force = searchParams.get("force") === "true";

    let result;
    
    switch (mode.toLowerCase()) {
      case "trash":
        result = await trashNote(userId, id);
        if (!result) {
          return Response.json({ 
            ok: false, 
            message: "Note not found",
            code: "NOTE_NOT_FOUND"
          }, { status: 404 });
        }
        return Response.json({ 
          ok: true, 
          note: result,
          message: "Note moved to trash"
        });
        
      case "restore":
        result = await restoreNote(userId, id);
        if (!result) {
          return Response.json({ 
            ok: false, 
            message: "Note not found in trash",
            code: "NOTE_NOT_TRASHED"
          }, { status: 404 });
        }
        return Response.json({ 
          ok: true, 
          note: result,
          message: "Note restored from trash"
        });
        
      case "hard":
        if (!force) {
          // Check if note is in trash
          const note = await getNote(userId, id);
          if (note && !note.isTrashed) {
            return Response.json({ 
              ok: false, 
              message: "Note must be trashed before permanent deletion. Use force=true to override.",
              code: "NOTE_NOT_TRASHED"
            }, { status: 400 });
          }
        }
        
        result = await deleteNoteForever(userId, id);
        if (!result) {
          return Response.json({ 
            ok: false, 
            message: "Note not found",
            code: "NOTE_NOT_FOUND"
          }, { status: 404 });
        }
        return Response.json({ 
          ok: true, 
          message: "Note permanently deleted"
        });
        
      default:
        return Response.json({ 
          ok: false, 
          message: "Invalid deletion mode. Use 'trash', 'restore', or 'hard'",
          code: "INVALID_DELETION_MODE"
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Note DELETE error:", error);
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to delete note",
      code: "DELETE_NOTE_ERROR"
    }, { status: 500 });
  }
}

export async function notesBulkPATCH(req, userId) {
  try {
    const body = await req.json();
    
    if (!body.noteIds || !Array.isArray(body.noteIds) || body.noteIds.length === 0) {
      return Response.json({ 
        ok: false, 
        message: "No notes selected",
        code: "NO_NOTES_SELECTED"
      }, { status: 400 });
    }
    
    if (!body.updates || Object.keys(body.updates).length === 0) {
      return Response.json({ 
        ok: false, 
        message: "No update data provided",
        code: "NO_UPDATE_DATA"
      }, { status: 400 });
    }
    
    const count = await bulkUpdateNotes(userId, body.noteIds, body.updates);
    
    return Response.json({ 
      ok: true, 
      count,
      message: `${count} notes updated successfully`
    });
    
  } catch (error) {
    console.error("Bulk PATCH error:", error);
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to update notes",
      code: "BULK_UPDATE_ERROR"
    }, { status: 500 });
  }
}

export async function noteDuplicatePOST(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ 
        ok: false, 
        message: "Invalid note ID format",
        code: "INVALID_NOTE_ID"
      }, { status: 400 });
    }
    
    const body = await req.json();
    const newFolderId = body.newFolderId || null;
    
    const duplicate = await duplicateNote(userId, id, newFolderId);
    
    return Response.json({ 
      ok: true, 
      note: duplicate,
      message: "Note duplicated successfully"
    }, { status: 201 });
    
  } catch (error) {
    console.error("Note duplicate error:", error);
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to duplicate note",
      code: "DUPLICATE_NOTE_ERROR"
    }, { status: 500 });
  }
}

export async function noteExportGET(req, userId, id) {
  try {
    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ 
        ok: false, 
        message: "Invalid note ID format",
        code: "INVALID_NOTE_ID"
      }, { status: 400 });
    }
    
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";
    
    // Check if note exists
    const note = await getNote(userId, id);
    if (!note) {
      return Response.json({ 
        ok: false, 
        message: "Note not found",
        code: "NOTE_NOT_FOUND"
      }, { status: 404 });
    }
    
    const content = await exportNote(userId, id, format);
    
    // Set appropriate headers for download
    const headers = {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${note.title}.${format}"`
    };
    
    if (format === 'txt') {
      headers['Content-Type'] = 'text/plain';
    } else if (format === 'md') {
      headers['Content-Type'] = 'text/markdown';
    }
    
    return new Response(content, { headers });
    
  } catch (error) {
    console.error("Note export error:", error);
    return Response.json({ 
      ok: false, 
      message: error.message || "Failed to export note",
      code: "EXPORT_NOTE_ERROR"
    }, { status: 500 });
  }
}

