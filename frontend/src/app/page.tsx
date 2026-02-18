"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Msg = {
  role: "user" | "ai";
  text: string;
};

export default function AnalyzeChatPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return router.replace("/login");
    setToken(t);
  }, [router]);

  // ✅ วิเคราะห์รูป
  const analyze = async () => {
    if (!file || !token) return;

    setLoading(true);
    setMessages([]);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const r = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const j = await r.json();
      if (!r.ok) throw new Error("analyze_failed");

      // 🔥 backend ส่ง raw
      setResult(j.raw);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ส่งคำถาม chat
  const sendChat = async () => {
    if (!input.trim() || !token || !result) return;

    const question = input;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: question }]);
    setChatLoading(true);

    try {
      const r = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          context: result,
        }),
      });

      const j = await r.json();
      if (!r.ok) throw new Error("chat_failed");

      setMessages((m) => [...m, { role: "ai", text: j.answer }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6">
      <h1 className="text-xl font-bold text-indigo-600 mb-4">
        Chat วิเคราะห์ปลากัด
      </h1>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : "");
          setMessages([]);
          setResult(null);
        }}
        className="mb-3"
      />

      {preview && (
        <img
          src={preview}
          className="w-full max-h-[320px] object-contain rounded-xl border mb-4"
        />
      )}

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="w-full mb-6 py-2 rounded-xl bg-indigo-600 text-white disabled:bg-indigo-300"
      >
        {loading ? "กำลังวิเคราะห์..." : "วิเคราะห์ปลา"}
      </button>

      {/* ✅ RESULT จาก AI */}
      {result && (
        <div className="border rounded-xl p-3 whitespace-pre-line mb-6">
          {result.answer}
        </div>
      )}

      {/* CHAT */}
      {result && (
        <>
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white text-right"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {m.text}
              </div>
            ))}

            {chatLoading && (
              <div className="text-sm text-gray-500">AI กำลังตอบ…</div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ถามเรื่องปลากัด เช่น หางลีบ แก้ยังไง"
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
            />
            <button
              onClick={sendChat}
              className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700"
            >
              ส่ง
            </button>
          </div>
        </>
      )}
    </main>
  );
}
