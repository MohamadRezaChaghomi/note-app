// lib/apiAuth.js - نسخه اصلاح شده
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function requireUserId() {
  try {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) console.log("🔐 [apiAuth] Checking session...");
    
    const session = await getServerSession(authOptions);
    
    if (isDev) {
      console.log("🔐 [apiAuth] Session details:", {
        exists: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });
    }
    
    if (!session?.user?.id) {
      if (isDev) console.log("❌ [apiAuth] No session or user ID");
      return null;
    }
    
    if (isDev) console.log("✅ [apiAuth] User authenticated:", session.user.id);
    return session.user.id;
    
  } catch (error) {
    console.error("🔴 [apiAuth] Error:", error);
    return null;
  }
}