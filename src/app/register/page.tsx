"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API, hasApiBase } from "@/lib/apiConfig";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

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

    if (!email.trim() || !password.trim() || !confirm.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (password !== confirm) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify({ email, password }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        setError(j?.message || j?.error || "สมัครไม่สำเร็จ");
        return;
      }

      // backend ส่ง token → เข้าใช้งานได้เลย
      if (j?.token) {
        localStorage.setItem("token", j.token);
        router.replace("/");
        return;
      }

      // ไม่ส่ง token → ไป login
      router.replace("/login");
    } catch (e) {
      console.error("Register fetch error:", e);
      setError(
        "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจสอบว่า (1) Backend รันอยู่ (2) NEXT_PUBLIC_API_BASE ใน .env.local ถูกต้อง (เช่น http://localhost:3001)"
      );
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
            สมัครสมาชิกเพื่อบันทึกและดูประวัติการวิเคราะห์
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
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ยืนยันรหัสผ่าน"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
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
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          มีบัญชีแล้ว?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-indigo-600 font-medium hover:underline"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
    </section>
  );
}
