"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!; // แนะนำเป็น .../api

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.replace("/login");
      return;
    }
    setToken(t);
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const onPick = (f: File | null) => {
    setFile(f);
    setResult(null);
    setError("");
    if (!f) return setPreview("");
    setPreview(URL.createObjectURL(f));
  };

  const analyze = async () => {
    if (!token) return;
    if (!file) {
      setError("กรุณาเลือกรูปก่อน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ ส่งเป็น multipart/form-data ให้ตรง multer
      const fd = new FormData();
      fd.append("image", file); // ต้องชื่อ "image" ตาม upload.single("image")

      const r = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ ห้ามใส่ Content-Type เอง เดี๋ยว boundary พัง
        },
        body: fd,
      });

      const j = await r.json().catch(() => ({}));

      if (r.status === 401) return logout();
      if (!r.ok) throw new Error(j?.message || j?.error || "analyze_failed");

      setResult(j);
    } catch (e: any) {
      setError(e?.message || "วิเคราะห์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            BettaFish Classifier
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/records")}
              className="bg-white border rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50"
            >
              Records
            </button>
            <button
              onClick={logout}
              className="bg-white border rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow p-6">
          <div className="text-xs text-gray-700 mb-3">API: {API}</div>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPick(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900"
            />

            <button
              onClick={analyze}
              disabled={loading || !file}
              className={`rounded-lg px-4 py-2 text-white ${
                loading || !file
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ + บันทึก"}
            </button>
          </div>

          {error && (
            <div className="text-red-600 font-semibold text-sm mb-3">
              {error}
            </div>
          )}

          {preview && (
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-[420px] object-contain rounded-xl border"
              />
            </div>
          )}

          {result?.ok && (
            <div className="mb-3 text-sm text-green-700 font-semibold">
              ✅ วิเคราะห์สำเร็จ + บันทึกแล้ว (recordId: {result.recordId})
            </div>
          )}

          {result && (
            <pre className="text-xs bg-gray-50 border rounded-xl p-4 overflow-auto text-gray-900">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </main>
  );
}
