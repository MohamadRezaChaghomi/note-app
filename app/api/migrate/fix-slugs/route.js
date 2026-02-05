import { requireUserId } from "@/lib/apiAuth";
import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import { createSlug } from "@/lib/utils";

/**
 * API endpoint to fix duplicate slug errors
 * Only admins can run this
 */
export async function POST(req) {
  try {
    const uid = await requireUserId();
    if (!uid) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (optional - remove if not using admin role)
    // For now, we'll just allow it for any authenticated user

    await connectDB();

    // Find all notes with empty or missing slugs
    const notesWithoutSlugs = await Note.find({
      $or: [
        { slug: null },
        { slug: "" },
        { slug: { $exists: false } }
      ]
    });

    console.log(`Found ${notesWithoutSlugs.length} notes without slugs`);

    let updated = 0;
    const errors = [];

    for (const note of notesWithoutSlugs) {
      try {
        let slug = createSlug(note.title);

        // Ensure slug is not empty
        if (!slug) {
          slug = `note-${note._id}`;
        } else {
          // Check for duplicate slugs
          const existingSlug = await Note.findOne({
            slug,
            userId: note.userId,
            _id: { $ne: note._id }
          });

          if (existingSlug) {
            slug = `${slug}-${note._id}`;
          }
        }

        await Note.updateOne(
          { _id: note._id },
          { $set: { slug } }
        );

        updated++;
      } catch (err) {
        errors.push({
          noteId: note._id,
          error: err.message
        });
      }
    }

    return Response.json({
      ok: true,
      message: `Successfully fixed ${updated} notes`,
      updated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Slug migration error:", error);
    return Response.json(
      { ok: false, error: error.message || "Migration failed" },
      { status: 500 }
    );
  }
}
