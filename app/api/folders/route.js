import { requireUserId } from "@/lib/apiAuth";
import { 
  foldersGET, 
  foldersPOST, 
  foldersBulkPATCH 
} from "@/controllers/folder.controller";

export async function GET(req) {
  console.log("🔄 GET /api/folders route called");
  
  try {
    // احراز هویت کاربر
    const uid = await requireUserId();
    
    if (!uid) {
      console.log("❌ Authentication failed: No user ID");
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log("✅ User authenticated:", uid);
    return await foldersGET(req, uid);
    
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

export async function POST(req) {
  console.log("🔄 POST /api/folders route called");
  
  try {
    // احراز هویت کاربر
    const uid = await requireUserId();
    
    if (!uid) {
      console.log("❌ Authentication failed: No user ID");
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log("✅ User authenticated:", uid);
    return await foldersPOST(req, uid);
    
  } catch (error) {
    console.error("🔥 Route POST error:", error);
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

export async function PATCH(req) {
  console.log("🔄 PATCH /api/folders route called");
  
  try {
    // احراز هویت کاربر
    const uid = await requireUserId();
    
    if (!uid) {
      console.log("❌ Authentication failed: No user ID");
      return Response.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    console.log("✅ User authenticated:", uid);
    return await foldersBulkPATCH(req, uid);
    
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