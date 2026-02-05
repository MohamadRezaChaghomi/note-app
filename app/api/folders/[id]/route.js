import { requireUserId } from "@/lib/apiAuth";
import { folderGET, folderPATCH, folderDELETE } from "@/controllers/folder.controller";

export async function GET(req, { params }) {
  try {
    const uid = await requireUserId();
    
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    return await folderGET(req, uid, id);
  } catch (error) {
    console.error("GET error:", error);
    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const uid = await requireUserId();
    
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    return await folderPATCH(req, uid, id);
  } catch (error) {
    console.error("PATCH error:", error);
    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const uid = await requireUserId();
    
    if (!uid) {
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    return await folderDELETE(req, uid, id);
  } catch (error) {
    console.error("DELETE error:", error);
    return Response.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}