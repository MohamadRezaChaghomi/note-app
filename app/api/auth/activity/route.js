import { activity } from "@/controllers/auth.controller";
export async function POST(req) { return activity(req); }
