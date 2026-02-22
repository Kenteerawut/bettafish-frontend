"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Msg = {
  role: "user" | "ai";
  text: string;
};

export default function AnalyzeChatPage() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [token, setToken] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<any>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  /** ============================
   * 🔥 AUTO SCROLL CHAT
   ============================ */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return router.replace("/login");
    setToken(t);
  }, [router]);

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
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const j = await r.json();
      if (!r.ok) throw new Error("analyze_failed");

      setResult(j.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  /** ============================
   * ⭐ FORMAT AI TEXT PRO+
   ============================ */
  const renderAIText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="leading-relaxed">
        {line}
      </p>
    ));
  };

  const species = result?.breed_estimate || "-";
  const group = result?.betta_group || "-";
  const morphology = result?.morphology || "-";
  const detail = result?.short_reason || "-";

  let confidence = 0;
  const rawConfidence =
    result?.confidence ??
    result?.confidence_score ??
    0;

  if (typeof rawConfidence === "number") {
    if (rawConfidence <= 1) confidence = Math.round(rawConfidence * 100);
    else if (rawConfidence <= 100) confidence = Math.round(rawConfidence);
    else confidence = 95;
  }

  return (
    <main className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6">

      <h1 className="text-xl font-bold text-indigo-600 mb-4">
        🧬 ระบบวิเคราะห์ปลากัด GOD LEVEL
      </h1>

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
        className="w-full mb-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40"
      >
        {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์ปลา"}
      </button>

      {result && (
        <div className="space-y-3 mb-6">
          <div className="border rounded-xl p-4 bg-indigo-50">
            🐟 <b>สายพันธุ์:</b> {species}
          </div>

          <div className="border rounded-xl p-4">
            ⭐ <b>กลุ่ม:</b> {group}
          </div>

          <div className="border rounded-xl p-4">
            🧬 <b>ลักษณะโครงสร้าง:</b> {morphology}
          </div>

          <div className="border rounded-xl p-4 text-sm leading-relaxed">
            🎨 <b>รายละเอียด:</b> {detail}
          </div>

          <div className="border rounded-xl p-4">
            🔥 <b>ความมั่นใจ:</b> {confidence}%
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {result && (
        <>
          <div className="space-y-3 mb-4 max-h-[340px] overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-sm shadow-sm ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white ml-auto w-fit max-w-[85%]"
                    : "bg-gradient-to-r from-gray-50 to-white border w-fit max-w-[85%]"
                }`}
              >
                {m.role === "ai"
                  ? renderAIText(m.text)
                  : m.text}
              </div>
            ))}

            {chatLoading && (
              <div className="text-sm text-gray-500 animate-pulse">
                🤖 AI กำลังพิมพ์คำตอบ...
              </div>
            )}

            <div ref={chatEndRef} />
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 rounded-xl hover:opacity-90"
            >
              ส่ง
            </button>
          </div>
        </>
      )}
    </main>
  );
}