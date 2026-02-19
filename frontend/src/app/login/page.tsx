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

  // มี token แล้ว → เด้งหน้าแรก
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-4">

      {/* CARD */}
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border"
      >
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-indigo-700">
            Betta AI
          </h1>
          <p className="text-sm text-gray-500">
            ระบบวิเคราะห์สายพันธุ์ปลากัดอัจฉริยะ
          </p>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          <input
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-sm text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        {/* LOGIN BUTTON */}
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

        {/* FOOTER */}
        <div className="text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </div>
  );
}
