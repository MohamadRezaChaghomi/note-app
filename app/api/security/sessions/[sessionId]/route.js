import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { sessionId } = await params;

    // Mock logout session
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Session logged out successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout session error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}
