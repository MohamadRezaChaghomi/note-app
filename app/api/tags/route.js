import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import * as tagController from "@/controllers/tag.controller";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");

    if (view === "stats") {
      const stats = await tagController.getTagStats(req, session.user.id);
      return new Response(
        JSON.stringify({ ok: true, stats }),
        { status: 200 }
      );
    }

    const result = await tagController.getTags(
      req,
      session.user.id,
      Object.fromEntries(searchParams)
    );

    return new Response(
      JSON.stringify({ ok: true, ...result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/tags error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const tag = await tagController.createTag(req, session.user.id, body);

    return new Response(
      JSON.stringify({ ok: true, tag }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/tags error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: error.message.includes("already exists") ? 400 : 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, tagIds } = body;

    if (action === "bulkDelete") {
      const result = await tagController.bulkDeleteTags(req, session.user.id, body);
      return new Response(
        JSON.stringify({ 
          ok: true, 
          message: `${result.deletedCount} tag(s) deleted successfully` 
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, message: "Invalid action" }),
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH /api/tags error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}
