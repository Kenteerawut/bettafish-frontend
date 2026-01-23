"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
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

  const analyze = async () => {
    if (!token || !file) return;

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("image", file);

      const r = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "analyze_failed");

      setResult(j);
    } catch (e: any) {
      setError(e.message || "วิเคราะห์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          BettaFish Classifier
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/records")}
            className="border rounded-lg px-3 py-1 text-sm hover:bg-gray-50"
          >
            Records
          </button>
          <button
            onClick={logout}
            className="border rounded-lg px-3 py-1 text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          setResult(null);
          setError("");
          setPreview(f ? URL.createObjectURL(f) : "");
        }}
        className="mb-4"
      />

      <button
        onClick={analyze}
        disabled={loading || !file}
        className="
          w-full mb-6 py-2 rounded-xl text-white font-semibold
          bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
        "
      >
        {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ปลา"}
      </button>

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm mb-4">{error}</div>
      )}

      {/* Preview */}
      {preview && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex justify-center">
          <img
            src={preview}
            className="max-h-[420px] object-contain rounded-xl shadow"
          />
        </div>
      )}

      {/* Result */}
      {result?.ok && (
        <div className="grid gap-3">
          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-500">สายพันธุ์</div>
            <div className="font-semibold text-indigo-600">
              {result.result.species_name}
            </div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-500">ลักษณะสี</div>
            <div>{result.result.color_traits}</div>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <div className="text-sm text-gray-500">คำแนะนำการเลี้ยง</div>
            <div className="text-sm leading-relaxed">
              {result.result.care_tips}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
