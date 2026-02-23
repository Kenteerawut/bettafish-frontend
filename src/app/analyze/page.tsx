"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🔥 FIX: รองรับทั้งกรณี ENV มี /api หรือไม่มี
 */
const BASE = process.env.NEXT_PUBLIC_API_BASE || "";
const API = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

export default function AnalyzePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.replace("/login");
    setToken(t);
  }, [router]);

  const analyze = async () => {
    if (!file || !token) return;

    setLoading(true);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const endpoint = `${API}/analyze`;
      console.log("🔥 CALL API =", endpoint);

      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const j = await r.json();
      console.log("ANALYZE RESULT =", j);

      if (!r.ok) throw new Error("analyze_failed");

      setResult(j.result);
    } catch (err) {
      console.error(err);
      alert("วิเคราะห์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 text-emerald-50">
      <h1 className="text-3xl font-bold mb-6">
        วิเคราะห์สายพันธุ์ปลากัดด้วย AI
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : "");
        }}
        className="mb-4"
      />

      {preview && (
        <img
          src={preview}
          className="w-full max-h-[300px] object-contain mb-4"
        />
      )}

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="px-6 py-3 bg-emerald-400 text-black rounded-xl"
      >
        {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์"}
      </button>

      {result && (
        <div className="mt-6 space-y-2">
          <div>🐟 {result?.breed_estimate}</div>
          <div>⭐ {result?.betta_group}</div>
        </div>
      )}
    </main>
  );
}