import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import User from "@/models/User.model";
import Tag from "@/models/Tag.model";

export async function buildReport() {
  await connectDB();

  const totalUsers = await User.countDocuments();
  const totalNotes = await Note.countDocuments();
  const totalTags = await Tag.countDocuments();

  // Top users by note count
  const topUsers = await Note.aggregate([
    { $group: { _id: "$userId", notes: { $sum: 1 } } },
    { $sort: { notes: -1 } },
    { $limit: 10 }
  ]);

  const topUsersEnriched = await Promise.all(
    topUsers.map(async (u) => {
      const user = await User.findById(u._id).lean();
      return { userId: String(u._id), email: user?.email || "unknown", notes: u.notes };
    })
  );

  // Daily notes created (last 14 days)
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const daily = await Note.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $year: "$createdAt" },
          m: { $month: "$createdAt" },
          d: { $dayOfMonth: "$createdAt" }
        },
        created: { $sum: 1 }
      }
    },
    { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } }
  ]);

  const activityDaily = daily.map((x) => ({
    date: `${x._id.y}-${String(x._id.m).padStart(2, "0")}-${String(x._id.d).padStart(2, "0")}`,
    created: x.created
  }));

  return {
    systemSummary: { totalUsers, totalNotes, totalTags },
    usersPerformance: topUsersEnriched,
    activityDaily
  };
}
