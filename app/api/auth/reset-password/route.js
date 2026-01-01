import { reset } from "@/controllers/auth.controller";

export async function POST(req) {
  return reset(req);
}
