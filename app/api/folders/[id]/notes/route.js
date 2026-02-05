import { requireUserId } from "@/lib/apiAuth";
import { folderNotesGET } from "@/controllers/folder.controller";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log(`📥 GET /api/folders/${id}/notes`);
    
    const uid = await requireUserId();
    
    if (!uid) {
      console.log("❌ Authentication failed: No user ID");
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log("✅ User authenticated:", uid);
    
    if (!id) {
      return Response.json(
        { ok: false, message: "Folder ID is required" },
        { status: 400 }
      );
    }
    
    return await folderNotesGET(req, uid, id);
    
  } catch (error) {
    console.error("🔥 Route GET error:", error);
    console.error("Error details:", error.stack);
    
    return Response.json(
      { 
        ok: false, 
        message: error.message || "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}