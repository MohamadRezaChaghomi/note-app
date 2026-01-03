import { requireUserId } from "@/lib/apiAuth";
import { 
  noteGET, 
  notePATCH, 
  noteDELETE,
  noteDuplicatePOST,
  noteExportGET
} from "@/controllers/note.controller";

export async function GET(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return noteGET(req, uid, params.id);
}

export async function PATCH(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return notePATCH(req, uid, params.id);
}

export async function DELETE(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  return noteDELETE(req, uid, params.id);
}

// Additional endpoints for specific actions
export async function POST(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  
  // Check action type
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  
  if (action === "duplicate") {
    return noteDuplicatePOST(req, uid, params.id);
  }
  
  if (action === "export") {
    return noteExportGET(req, uid, params.id);
  }
  
  return Response.json({ 
    ok: false, 
    message: "Invalid action" 
  }, { status: 400 });
}