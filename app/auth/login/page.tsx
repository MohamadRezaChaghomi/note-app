"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl: "/notes",
    });
  }

  return (
    <form action={handleLogin} className="space-y-4 w-80 mx-auto mt-40">
      <input name="email" placeholder="ایمیل" className="border p-2 w-full" />
      <input
        name="password"
        type="password"
        placeholder="رمز عبور"
        className="border p-2 w-full"
      />
      <button className="bg-black text-white p-2 w-full">
        ورود
      </button>
    </form>
  );
}
