import { requireUserId } from "@/lib/apiAuth";
import { folderDuplicatePOST } from "@/controllers/folder.controller";

export async function POST(req, { params }) {
  try {
    console.log(`📥 POST /api/folders/${params.id}/duplicate`);
    
    const uid = await requireUserId();
    
    if (!uid) {
      console.log("❌ Authentication failed: No user ID");
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log("✅ User authenticated:", uid);
    const { id } = params;
    
    if (!id) {
      return Response.json(
        { ok: false, message: "Folder ID is required" },
        { status: 400 }
      );
    }
    
    return await folderDuplicatePOST(req, uid, id);
    
  } catch (error) {
    console.error("🔥 Route POST error:", error);
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