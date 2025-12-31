import { listNotes } from "@/services/note.service";

export async function searchNotes(userId, { q, folderId, starred, archived, trashed }) {
  return listNotes(userId, {
    search: q || "",
    folderId: folderId || "",
    starred: starred ? "true" : "false",
    archived: archived ? "true" : "false",
    trashed: trashed ? "true" : "false"
  });
}
