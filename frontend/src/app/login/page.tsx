"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!; // ต้องเป็น .../api

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // มี token แล้ว ให้เข้าหน้าอัปโหลด/วิเคราะห์ (หน้าแรก)
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
      router.replace("/"); // ไปหน้าอัปโหลด/วิเคราะห์
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={submit}
        className="bg-white/90 backdrop-blur rounded-2xl shadow p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-1">
          BettaFish Login
        </h1>
        <p className="text-center text-sm text-gray-700 mb-4">
          เข้าสู่ระบบเพื่อใช้งานวิเคราะห์และบันทึกประวัติ
        </p>

        <input
          className="w-full border rounded p-2 mb-3 bg-white text-gray-900 placeholder:text-gray-400"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full border rounded p-2 mb-3 bg-white text-gray-900 placeholder:text-gray-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="text-red-600 font-semibold text-sm mb-2">{error}</div>
        )}

        <button
          disabled={loading}
          className={`w-full rounded p-2 text-white ${
            loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="w-full mt-3 border rounded p-2 text-gray-900 bg-white hover:bg-gray-50"
        >
          ยังไม่มีบัญชี? สมัครสมาชิก
        </button>

        <div className="text-xs text-gray-700 mt-3">API: {API}</div>
      </form>
    </main>
  );
}
