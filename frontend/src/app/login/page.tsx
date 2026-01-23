"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // มี token แล้ว → ไปหน้าแรก
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/");
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(j?.message || j?.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      localStorage.setItem("token", j.token);
      router.replace("/");
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-xl px-8 py-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-indigo-700 tracking-wide">
            BettaFish
          </h1>
          <p className="text-sm text-gray-600">
            เข้าสู่ระบบเพื่อวิเคราะห์และบันทึกข้อมูลปลากัด
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        {/* Action */}
        <button
          disabled={loading}
          className={`w-full rounded-xl py-2.5 font-semibold text-white transition
            ${
              loading
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            }`}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-indigo-600 font-medium hover:underline"
          >
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </section>
  );
}
