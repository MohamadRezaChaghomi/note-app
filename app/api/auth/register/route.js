import { register } from "@/controllers/auth.controller";

export async function POST(req) {
  return register(req);
}