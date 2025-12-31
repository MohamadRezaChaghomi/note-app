import { validateToken } from "@/controllers/auth.controller";
export async function GET(req) { return validateToken(req); }
