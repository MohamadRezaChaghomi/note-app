import { requireUserId } from "@/lib/apiAuth";
import { connectDB } from "@/lib/db";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
  try {
    const uid = await requireUserId();
    if (!uid) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return Response.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const admins = await User.find({ role: "admin" })
      .select("_id name email role createdAt lastLogin")
      .lean();

    return Response.json({
      ok: true,
      admins,
      total: admins.length
    });
  } catch (error) {
    console.error("Get admins error:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const uid = await requireUserId();
    if (!uid) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return Response.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email || !email.trim()) {
      return Response.json({ ok: false, error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Check if already admin
    if (user.role === "admin") {
      return Response.json({ ok: false, error: "User is already an admin" }, { status: 400 });
    }

    // Update to admin
    user.role = "admin";
    await user.save();

    return Response.json({
      ok: true,
      message: `${user.name} is now an admin`,
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Add admin error:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const uid = await requireUserId();
    if (!uid) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return Response.json({ ok: false, error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return Response.json({ ok: false, error: "User ID is required" }, { status: 400 });
    }

    // Prevent removing self as admin
    if (userId === uid) {
      return Response.json(
        { ok: false, error: "Cannot remove yourself as admin" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // Count total admins
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 1) {
      return Response.json(
        { ok: false, error: "Cannot remove the last admin" },
        { status: 400 }
      );
    }

    user.role = "user";
    await user.save();

    return Response.json({
      ok: true,
      message: `${user.name} is no longer an admin`
    });
  } catch (error) {
    console.error("Remove admin error:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
