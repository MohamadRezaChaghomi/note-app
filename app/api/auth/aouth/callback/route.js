// app/api/auth/oauth/callback/route.js
import { oauthCallback } from "@/controllers/auth.controller";

export async function POST(req) {
  return oauthCallback(req);
}