import { forgetPassword } from "@/controllers/auth.controller";
export async function POST(req) { return forgetPassword(req); }
