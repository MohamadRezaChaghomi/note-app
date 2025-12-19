import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">📝 Note App</h1>
      <div className="flex gap-4">
        <Link href="/login">ورود</Link>
        <Link href="/register">ثبت نام</Link>
      </div>
    </main>
  );
}
