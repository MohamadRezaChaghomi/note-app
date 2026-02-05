import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import User from "@/models/User.model";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ ok: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ ok: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);

    if (!user) {
      return new Response(
        JSON.stringify({ ok: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ ok: false, message: "Current password is incorrect" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Password changed successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return new Response(
      JSON.stringify({ ok: false, message: error.message }),
      { status: 500 }
    );
  }
}
