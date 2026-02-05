import { requireUserId } from "@/lib/apiAuth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import Folder from "@/models/Folder.model";
import Tag from "@/models/Tag.model";

export async function GET(req) {
  try {
    const uid = await requireUserId();
    if (!uid) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 20;
    const type = searchParams.get("type") || "all"; // all, notes, folders, tags

    if (!query || query.trim().length < 1) {
      return Response.json({ 
        ok: true,
        notes: [],
        folders: [],
        tags: [],
        total: 0
      });
    }

    await connectDB();

    const searchRegex = { $regex: query, $options: "i" };
    const results = {
      notes: [],
      folders: [],
      tags: [],
      total: 0
    };

    // Search based on type
    if (type === "all" || type === "notes") {
      const notes = await Note.find(
        {
          userId: uid,
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { tags: { $in: [] } }
          ],
          isTrashed: false
        },
        "title content folder tags createdAt isPinned isStarred priority"
      )
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      results.notes = notes.map(note => ({
        ...note,
        type: "note",
        name: note.title,
        icon: "file-text"
      }));
    }

    if (type === "all" || type === "folders") {
      const folders = await Folder.find(
        {
          userId: uid,
          $or: [
            { title: searchRegex },
            { description: searchRegex }
          ]
        },
        "title description color icon createdAt"
      )
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      results.folders = folders.map(folder => ({
        ...folder,
        type: "folder",
        name: folder.title,
        icon: folder.icon || "folder"
      }));
    }

    if (type === "all" || type === "tags") {
      const tags = await Tag.find(
        {
          userId: uid,
          $or: [
            { name: searchRegex },
            { description: searchRegex }
          ]
        },
        "name description color icon usageCount createdAt"
      )
        .limit(limit)
        .sort({ usageCount: -1, createdAt: -1 })
        .lean();

      results.tags = tags.map(tag => ({
        ...tag,
        type: "tag",
        icon: tag.icon || "tag"
      }));
    }

    results.total = results.notes.length + results.folders.length + results.tags.length;

    return Response.json({
      ok: true,
      ...results,
      query
    });
  } catch (error) {
    console.error("Search error:", error);
    return Response.json(
      { ok: false, error: error.message || "Search failed" },
      { status: 500 }
    );
  }
}
