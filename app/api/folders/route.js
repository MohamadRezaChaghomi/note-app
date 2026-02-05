import { requireUserId } from "@/lib/apiAuth";
import {
  foldersGET,
  foldersPOST
} from "@/controllers/folder.controller";

export async function GET(req) {
  try {
    const uid = await requireUserId();
    
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return await foldersGET(req, uid);
  } catch (error) {
    console.error("Route GET error:", error);
    return Response.json(
      { 
        ok: false, 
        message: error.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const uid = await requireUserId();
    
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return await foldersPOST(req, uid);
  } catch (error) {
    console.error("Route POST error:", error);
    return Response.json(
      { 
        ok: false, 
        message: error.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}