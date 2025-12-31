"use client";
import { useEffect, useState } from "react";

export default function Captcha({ onChange }) {
  const [captcha, setCaptcha] = useState(null);
  const [answer, setAnswer] = useState("");

  async function refresh() {
    const res = await fetch("/api/auth/captcha");
    const data = await res.json();
    setCaptcha({ captchaId: data.captchaId, question: data.question });
    setAnswer("");
    onChange?.({ captchaId: data.captchaId, captchaAnswer: "" });
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="rounded border p-3 dark:border-gray-700">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm">
          <div className="font-semibold">Captcha</div>
          <div className="text-gray-600 dark:text-gray-300">
            {captcha?.question || "Loading..."}
          </div>
        </div>
        <button type="button" className="text-sm underline" onClick={refresh}>
          Refresh
        </button>
      </div>

      <input
        className="mt-3 w-full rounded border px-3 py-2 dark:bg-gray-900 dark:border-gray-700"
        value={answer}
        onChange={(e) => {
          const v = e.target.value;
          setAnswer(v);
          onChange?.({ captchaId: captcha?.captchaId || "", captchaAnswer: v });
        }}
        placeholder="Answer"
      />
    </div>
  );
}
