"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API, hasApiBase } from "@/lib/apiConfig";

export default function AnalyzePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.replace("/login");
      return;
    }

    setToken(t);
  }, [router]);

  const analyze = async () => {
    if (!file || !token) return;

    if (!hasApiBase) {
      alert("ไม่พบ URL ของ API (NEXT_PUBLIC_API_BASE) กรุณาตั้งค่าใน .env.local");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    setAnswer(null);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const data = await res.json();
      console.log("ANALYZE RESULT =", data);

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (res.status === 401 ? "กรุณาเข้าสู่ระบบใหม่" : "วิเคราะห์ไม่สำเร็จ");
        setErrorMsg(msg);
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ";
      setErrorMsg(msg);
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
        className="px-6 py-3 bg-emerald-400 text-black rounded-xl"
      >
        {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์"}
      </button>

      {errorMsg && (
        <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-xl">
          {errorMsg}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="space-y-3 p-4 rounded-xl bg-emerald-900/20 border border-emerald-400/10">
            <div>🐟 {result?.breed_estimate || "-"}</div>
            <div>⭐ {result?.betta_group || "-"}</div>
            {(result?.short_reason || result?.breed_estimate_th) && (
              <div className="pt-2 border-t border-emerald-400/20 text-emerald-100/90 text-sm">
                💬 {result?.short_reason || result?.breed_estimate_th}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-400/10">
            <div className="text-sm mb-2 text-emerald-100/90">
              ถามเพิ่มเติมเกี่ยวกับปลาตัวนี้
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="พิมพ์คำถามเกี่ยวกับปลากัดเช่น การเลี้ยง การผสม หรือสุขภาพ..."
                className="flex-1 rounded-xl border border-emerald-400/30 bg-emerald-950/60 px-3 py-2 text-sm text-emerald-50 placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="button"
                disabled={chatLoading || !question.trim()}
                onClick={async () => {
                  if (!token || !result || !question.trim()) return;

                  if (!hasApiBase) {
                    alert(
                      "ไม่พบ URL ของ API (NEXT_PUBLIC_API_BASE) กรุณาตั้งค่าใน .env.local"
                    );
                    return;
                  }

                  try {
                    setChatLoading(true);

                    const res = await fetch(`${API}/chat`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        question: question.trim(),
                        context: result,
                      }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                      const msg =
                        data?.message ||
                        data?.error ||
                        "ถามคำถามไม่สำเร็จ";
                      setErrorMsg(msg);
                      return;
                    }

                    setAnswer(data.answer || "ไม่มีคำตอบ");
                    setQuestion("");
                  } catch (err) {
                    console.error(err);
                    const msg =
                      err instanceof Error
                        ? err.message
                        : "เกิดข้อผิดพลาดในการเชื่อมต่อ";
                    setErrorMsg(msg);
                  } finally {
                    setChatLoading(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-400 text-black text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chatLoading ? "กำลังตอบ..." : "ส่ง"}
              </button>
            </div>

            {answer && (
              <div className="mt-3 text-sm text-emerald-100/90 whitespace-pre-line">
                💬 {answer}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}