import { listNotes, createNote, getNote, updateNote, trashNote, restoreNote, deleteNoteForever } from "@/services/note.service";
import Note from "@/models/Note.model";

export async function notesGET(req, userId) {
  try {
    const { searchParams } = new URL(req.url);
    const notes = await listNotes(userId, Object.fromEntries(searchParams.entries()));
    return Response.json({ ok: true, notes });
  } catch (error) {
    console.error("Notes GET error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function notesPOST(req, userId) {
  try {
    const body = await req.json();
    const note = await createNote(userId, body);
    return Response.json({ ok: true, note }, { status: 201 });
  } catch (error) {
    console.error("Note POST error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function noteGET(_req, userId, id) {
  try {
    const note = await getNote(userId, id);
    if (!note) {
      // check if note exists but belongs to another user
      try {
        const other = await Note.findById(id).lean();
        if (other) {
          console.warn(`User ${userId} attempted to access note ${id} owned by ${other.userId}`);
          return Response.json({ ok: false, message: "Access denied for this note" }, { status: 403 });
        }
      } catch (e) {
        console.error('Note lookup error:', e);
      }
      return Response.json({ ok: false, message: "Note not found" }, { status: 404 });
    }

    return Response.json({ ok: true, note });
  } catch (error) {
    console.error("Note GET error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function notePATCH(req, userId, id) {
  try {
    const body = await req.json();
    const note = await updateNote(userId, id, body);
    if (!note) return Response.json({ ok: false, message: "Note not found" }, { status: 404 });
    return Response.json({ ok: true, note });
  } catch (error) {
    console.error("Note PATCH error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 400 });
  }
}

export async function noteDELETE(req, userId, id) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "trash"; // trash | restore | hard

    if (mode === "trash") {
      const note = await trashNote(userId, id);
      return Response.json({ ok: true, note });
    }
    if (mode === "restore") {
      const note = await restoreNote(userId, id);
      return Response.json({ ok: true, note });
    }
    const ok = await deleteNoteForever(userId, id);
    return Response.json({ ok });
  } catch (error) {
    console.error("Note DELETE error:", error);
    return Response.json({ ok: false, message: error.message }, { status: 500 });
  }
}
