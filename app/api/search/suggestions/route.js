import { requireUserId } from "@/lib/apiAuth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import Folder from "@/models/Folder.model";
import Tag from "@/models/Tag.model";

export async function GET(req) {
  try {
    const uid = await requireUserId();
    if (!uid) return Response.json({ ok: false }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length < 2) {
      return Response.json({ suggestions: [] });
    }

    await connectDB();

    const searchRegex = { $regex: query, $options: "i" };

    // Fetch suggestions from multiple sources
    const [noteTitles, folderTitles, tagNames] = await Promise.all([
      Note.find(
        { userId: uid, title: searchRegex, isTrashed: false },
        "title"
      )
        .limit(3)
        .lean()
        .then((notes) => notes.map((n) => ({ text: n.title, type: "note" }))),

      Folder.find(
        { userId: uid, title: searchRegex },
        "title"
      )
        .limit(3)
        .lean()
        .then((folders) => folders.map((f) => ({ text: f.title, type: "folder" }))),

      Tag.find(
        { userId: uid, name: searchRegex },
        "name"
      )
        .limit(3)
        .lean()
        .then((tags) => tags.map((t) => ({ text: t.name, type: "tag" }))),
    ]);

    // Combine and deduplicate suggestions
    const combined = [...noteTitles, ...folderTitles, ...tagNames];
    const uniqueMap = new Map();
    combined.forEach(item => {
      if (!uniqueMap.has(item.text.toLowerCase())) {
        uniqueMap.set(item.text.toLowerCase(), item);
      }
    });

    const suggestions = Array.from(uniqueMap.values())
      .concat([{ text: query, type: "query" }])
      .slice(0, 8);

    return Response.json({
      ok: true,
      suggestions,
      total: suggestions.length,
    });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
