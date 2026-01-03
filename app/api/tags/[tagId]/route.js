import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import * as tagController from "@/controllers/tag.controller";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { tagId } = params;
    const tag = await tagController.getTag(req, tagId, session.user.id);

    return new Response(
      JSON.stringify({ ok: true, tag }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/tags/[tagId] error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { tagId } = params;
    const { action, ...body } = await req.json();

    if (action === "toggleFavorite") {
      const tag = await tagController.toggleFavorite(req, tagId, session.user.id);
      return new Response(
        JSON.stringify({ ok: true, tag }),
        { status: 200 }
      );
    }

    const tag = await tagController.updateTag(req, tagId, session.user.id, body);

    return new Response(
      JSON.stringify({ ok: true, tag }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/tags/[tagId] error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: error.message.includes("not found") ? 404 : 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { tagId } = params;
    const tag = await tagController.deleteTag(req, tagId, session.user.id);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        message: "Tag deleted successfully",
        tag 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/tags/[tagId] error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: error.message.includes("not found") ? 404 : 500 }
    );
  }
}
