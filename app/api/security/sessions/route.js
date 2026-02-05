import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";

// Mock sessions data (in real app, store in database)
const activeSessions = new Map();

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userSessions = activeSessions.get(userId) || [];

    return new Response(
      JSON.stringify({
        ok: true,
        sessions: userSessions.map((s) => ({
          ...s,
          isCurrent: s._id === session.sessionToken,
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Get sessions error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    activeSessions.delete(userId);

    return new Response(
      JSON.stringify({
        ok: true,
        message: "All sessions logged out",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout all sessions error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}
