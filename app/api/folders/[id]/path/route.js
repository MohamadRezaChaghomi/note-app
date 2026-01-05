import { requireUserId } from "@/lib/apiAuth";
import Folder from "@/models/Folder.model";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const uid = await requireUserId();
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    if (!id) {
      return Response.json(
        { ok: false, message: "Folder ID is required" },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if folder exists and belongs to user
    const folder = await Folder.findOne({ _id: id, userId: uid });
    if (!folder) {
      return Response.json(
        { ok: false, message: "Folder not found" },
        { status: 404 }
      );
    }
    
    // Get breadcrumb path
    let path = [];
    let current = folder;
    
    while (current) {
      path.unshift({
        _id: current._id,
        title: current.title,
        color: current.color,
      });
      
      if (current.parentId) {
        current = await Folder.findOne({ _id: current.parentId, userId: uid });
      } else {
        current = null;
      }
    }
    
    return Response.json({
      ok: true,
      path,
    });
  } catch (error) {
    console.error("Route GET error:", error);
    return Response.json(
      { ok: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}