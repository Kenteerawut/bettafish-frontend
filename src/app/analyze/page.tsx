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
  const [displayedMessages, setDisplayedMessages] = useState<Msg[]>([]);

  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages, chatLoading]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return router.replace("/login");
    setToken(t);
  }, [router]);

  /** TYPEWRITER AI */
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;

    if (last.role !== "ai") {
      setDisplayedMessages(messages);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedMessages((prev) => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = {
          role: "ai",
          text: last.text.slice(0, i),
        };
        return newArr;
      });
      i++;
      if (i > last.text.length) clearInterval(interval);
    }, 12);

    return () => clearInterval(interval);
  }, [messages]);

  const analyze = async () => {
    if (!file || !token) return;

    setLoading(true);
    setMessages([]);
    setDisplayedMessages([]);
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
    setDisplayedMessages((m) => [...m, { role: "user", text: question }]);
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
      setDisplayedMessages((m) => [...m, { role: "ai", text: "" }]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const renderAIText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="leading-relaxed text-emerald-100">
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
    result?.confidence ?? result?.confidence_score ?? 0;

  if (typeof rawConfidence === "number") {
    if (rawConfidence <= 1) confidence = Math.round(rawConfidence * 100);
    else if (rawConfidence <= 100) confidence = Math.round(rawConfidence);
    else confidence = 95;
  }

  return (
    <main className="relative max-w-3xl mx-auto p-6 text-emerald-50">

      <div className="
        bg-emerald-950/40 backdrop-blur-2xl
        border border-emerald-400/20
        rounded-[28px]
        shadow-[0_0_120px_rgba(16,185,129,0.25)]
        p-6
      ">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="
            text-3xl md:text-4xl font-extrabold tracking-wide
            bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-300
            bg-clip-text text-transparent
          ">
            🌿 วิเคราะห์สายพันธุ์ปลากัดด้วย AI
          </h1>

          <p className="text-emerald-200/70 text-sm mt-2">
            ระบบวิเคราะห์ภาพปลากัดอัตโนมัติ
          </p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setPreview(f ? URL.createObjectURL(f) : "");
            setMessages([]);
            setDisplayedMessages([]);
            setResult(null);
          }}
          className="mb-4 text-sm text-emerald-200"
        />

        {preview && (
          <img
            src={preview}
            className="w-full max-h-[320px] object-contain rounded-2xl border border-emerald-400/20 mb-4"
          />
        )}

        <button
          onClick={analyze}
          disabled={!file || loading}
          className="
          w-full mb-6 py-3 rounded-2xl
          bg-gradient-to-r from-emerald-400 to-teal-400
          text-black font-semibold
          hover:scale-[1.03] transition-all
          disabled:opacity-40"
        >
          {loading ? "กำลังวิเคราะห์..." : "🔍 เริ่มวิเคราะห์"}
        </button>

        {result && (
          <>
            <div className="space-y-3 mb-6 text-[15px]">
              <div className="p-4 rounded-2xl bg-emerald-800/20 border border-emerald-400/20">
                🐟 <b>สายพันธุ์:</b> {species}
              </div>

              <div className="p-4 rounded-2xl border border-emerald-400/10">
                ⭐ <b>กลุ่ม:</b> {group}
              </div>

              <div className="p-4 rounded-2xl border border-emerald-400/10">
                🧬 <b>ลักษณะโครงสร้าง:</b> {morphology}
              </div>

              <div className="p-4 rounded-2xl border border-emerald-400/10">
                🎨 <b>รายละเอียด:</b> {detail}
              </div>

              <div className="p-4 rounded-2xl border border-emerald-400/10">
                🔥 <b>ความมั่นใจ:</b> {confidence}%
                <div className="w-full bg-black/40 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 🤖 WHITE AI GLOW INFO */}
            <div
              className="
              mb-3
              rounded-2xl
              border border-emerald-400/20
              bg-emerald-950/40
              backdrop-blur-xl
              px-4 py-3
              text-xs
              text-white/90
              leading-relaxed
              shadow-[0_0_35px_rgba(16,185,129,0.25)]
              animate-[pulse_6s_ease-in-out_infinite]
            "
            >
              <div className="flex items-start gap-2">
                <span className="text-white text-sm drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                  🧠
                </span>
                <p>
                  สามารถพิมพ์ลักษณะเพิ่มเติมของปลากัด เช่น สี ลักษณะครีบ หรือพฤติกรรม
                  เพื่อช่วยให้ AI วิเคราะห์สายพันธุ์ได้แม่นยำมากขึ้น
                  เนื่องจากระบบต้องการข้อมูลมากกว่าภาพเพียง 1 รูป
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="พิมพ์ข้อมูลเพิ่มเติมเพื่อเพิ่มความแม่นยำ..."
                className="
                flex-1 rounded-xl px-3 py-2 text-sm
                bg-black/40 border border-emerald-400/20
                text-white placeholder:text-white/40"
              />
              <button
                onClick={sendChat}
                className="
                px-5 rounded-xl
                bg-gradient-to-r from-emerald-300 to-teal-300
                text-black font-semibold
                hover:scale-105"
              >
                ส่ง
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}