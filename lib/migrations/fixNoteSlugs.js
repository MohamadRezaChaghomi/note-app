import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import { createSlug } from "@/lib/utils";

/**
 * Migration to fix empty slug duplicates
 * This removes the unique constraint conflict by generating slugs for all notes
 */
export async function fixNoteSlugs() {
  try {
    await connectDB();
    
    console.log("Starting slug migration...");
    
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
        console.error(`Failed to update note ${note._id}:`, err.message);
      }
    }

    console.log(`Successfully updated ${updated} notes with new slugs`);
    return { success: true, updated };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error: error.message };
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixNoteSlugs().then(result => {
    console.log("Migration result:", result);
    process.exit(result.success ? 0 : 1);
  });
}
