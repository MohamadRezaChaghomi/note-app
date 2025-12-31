import { listNotes, createNote, getNote, updateNote, trashNote, restoreNote, deleteNoteForever } from "@/services/note.service";

export async function notesGET(req, userId) {
  const { searchParams } = new URL(req.url);
  const notes = await listNotes(userId, Object.fromEntries(searchParams.entries()));
  return Response.json({ ok: true, notes });
}

export async function notesPOST(req, userId) {
  const body = await req.json();
  const note = await createNote(userId, body);
  return Response.json({ ok: true, note }, { status: 201 });
}

export async function noteGET(_req, userId, id) {
  const note = await getNote(userId, id);
  if (!note) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, note });
}

export async function notePATCH(req, userId, id) {
  const body = await req.json();
  const note = await updateNote(userId, id, body);
  if (!note) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, note });
}

export async function noteDELETE(req, userId, id) {
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
}
