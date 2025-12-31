import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const uid = session?.user?.id;
  if (!uid) return null;
  return uid;
}
