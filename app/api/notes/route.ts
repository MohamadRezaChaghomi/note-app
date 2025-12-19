import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  // session.user may not include `id` in the built-in types, so cast to any for now
  const userId = (session.user as any).id;
  const notes = await Note.find({ userId });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();
  await connectDB();

  const note = await Note.create({
    title,
    content,
    userId: (session.user as any).id,
  });

  return NextResponse.json(note);
}
