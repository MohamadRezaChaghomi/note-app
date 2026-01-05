import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireUserId() {
  try {
    console.log("🔐 Checking user authentication...");
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log("❌ No session found");
      return null;
    }
    
    if (!session.user) {
      console.log("❌ No user in session");
      return null;
    }
    
    if (!session.user.id) {
      console.log("❌ No user ID in session");
      return null;
    }
    
    console.log("✅ User authenticated:", session.user.id);
    return session.user.id;
    
  } catch (error) {
    console.error("🔴 Authentication error:", error);
    return null;
  }
}