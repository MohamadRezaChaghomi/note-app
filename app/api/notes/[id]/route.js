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
  const { id } = await params;
  return noteGET(req, uid, id);
}

export async function PATCH(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  const { id } = await params;
  return notePATCH(req, uid, id);
}

export async function DELETE(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  const { id } = await params;
  return noteDELETE(req, uid, id);
}

// Additional endpoints for specific actions
export async function POST(req, { params }) {
  const uid = await requireUserId();
  if (!uid) return Response.json({ ok: false }, { status: 401 });
  const { id } = await params;
  
  // Check action type
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  
  if (action === "duplicate") {
    return noteDuplicatePOST(req, uid, id);
  }
  
  if (action === "export") {
    return noteExportGET(req, uid, id);
  }
  
  return Response.json({ 
    ok: false, 
    message: "Invalid action" 
  }, { status: 400 });
}