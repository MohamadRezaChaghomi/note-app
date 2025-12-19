import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";

export async function GET(req: Request, { params }: { params: { id: string } }) {
	// TODO: Re-enable auth check after styling is complete
	// const session = await getServerSession(authOptions);
	// if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const { id } = params;

	// Mock data for testing
	const mockNotes: Record<string, any> = {
		"1": { _id: "1", title: "خلاصه جلسه", content: "نکات مهم جلسه امروز:\n• نقطه اول\n• نقطه دوم\n• نقطه سوم", folder: "درس‌ها", createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-18") },
		"2": { _id: "2", title: "تمرین الگوریتم", content: "پیاده‌سازی مرتب‌سازی سریع\n\nکد مثال:\nconst sort = (arr) => {...}", folder: "درس‌ها", createdAt: new Date("2025-12-05"), updatedAt: new Date("2025-12-15") },
		"3": { _id: "3", title: "ایده اپ", content: "طرح اولیه رابط کاربری\n\nبخش‌های اصلی:\n- ناوبار\n- سایدبار\n- صفحه محتوا", folder: "پروژه‌ها", createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-19") },
		"4": { _id: "4", title: "یادداشت سریع", content: "خرید کتاب برنامه‌نویسی", folder: "quick", createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
	};

	if (mockNotes[id]) {
		return NextResponse.json(mockNotes[id]);
	}

	try {
		await connectDB();
		const note = await Note.findById(id);
		if (!note) return NextResponse.json({ message: "Not found" }, { status: 404 });
		return NextResponse.json(note);
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json({ message: "Not found" }, { status: 404 });
	}
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
	// TODO: Re-enable auth check after styling is complete
	// const session = await getServerSession(authOptions);
	// if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	await connectDB();
	const { id } = params;
	const data = await req.json();

	const note = await Note.findByIdAndUpdate(
		id,
		{ ...data },
		{ new: true }
	);

	if (!note) return NextResponse.json({ message: "Not found" }, { status: 404 });

	return NextResponse.json(note);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions);
	if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	await connectDB();
	const { id } = params;
	await Note.findByIdAndDelete(id);
	return NextResponse.json({ success: true });
}
