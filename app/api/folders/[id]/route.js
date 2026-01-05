import { requireUserId } from "@/lib/apiAuth";
import { folderGET, folderPATCH, folderDELETE } from "@/controllers/folder.controller";

export async function GET(req, { params }) {
  console.log(`🔄 GET /api/folders/${params.id} route called`);
  
  try {
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
    return await folderGET(req, uid, id);
    
  } catch (error) {
    console.error("🔥 Route GET error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
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

export async function PATCH(req, { params }) {
  console.log(`🔄 PATCH /api/folders/${params.id} route called`);
  
  try {
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
    return await folderPATCH(req, uid, id);
    
  } catch (error) {
    console.error("🔥 Route PATCH error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
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

export async function DELETE(req, { params }) {
  console.log(`🔄 DELETE /api/folders/${params.id} route called`);
  
  try {
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
    return await folderDELETE(req, uid, id);
    
  } catch (error) {
    console.error("🔥 Route DELETE error:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
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