import { verifyCode } from "@/controllers/auth.controller";
export async function POST(req) { return verifyCode(req); }