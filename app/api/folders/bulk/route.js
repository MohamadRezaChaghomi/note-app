import { requireUserId } from "@/lib/apiAuth";
import { foldersBulkPATCH } from "@/controllers/folder.controller";

export async function PATCH(req) {
  try {
    const uid = await requireUserId();
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    return await foldersBulkPATCH(req, uid);
  } catch (error) {
    console.error("Route PATCH error:", error);
    return Response.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}