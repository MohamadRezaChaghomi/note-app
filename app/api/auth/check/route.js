import { check } from "@/controllers/auth.controller";
export async function GET(req) { return check(req); }
