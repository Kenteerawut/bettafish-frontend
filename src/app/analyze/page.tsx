"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 🔥 HOTFIX PRODUCTION
 * ห้ามใช้ env ตอนนี้ เพราะ build ไปแล้ว
 */
const API = "https://betta-backend-production.up.railway.app/api";

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

  /**
   * ✅ LOAD TOKEN
   */
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.replace("/login");
      return;
    }
    setToken(t);
  }, [router]);

  /**
   * ✅ PREVIEW IMAGE FIX
   */
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  /**
   * ✅ TYPEWRITER SAFE
   */
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;

    if (last.role !== "ai") {
      setDisplayedMessages(messages);
      return;
    }

    let i = 0;

    setDisplayedMessages(
      messages.map((m) => ({
        ...m,
        text: m.role === "ai" ? "" : m.text,
      }))
    );

    const interval = setInterval(() => {
      i++;
      setDisplayedMessages((prev) => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = {
          role: "ai",
          text: last.text.slice(0, i),
        };
        return newArr;
      });

      if (i >= last.text.length) clearInterval(interval);
    }, 12);

    return () => clearInterval(interval);
  }, [messages]);

  /**
   * ==========================
   * 🔍 ANALYZE
   * ==========================
   */
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const j = await r.json();

      if (!r.ok) {
        console.log("ANALYZE ERROR:", j);
        throw new Error("analyze_failed");
      }

      setResult(j.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ==========================
   * 💬 CHAT
   * ==========================
   */
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

      if (!r.ok) {
        console.log("CHAT ERROR:", j);
        throw new Error("chat_failed");
      }

      setMessages((m) => [...m, { role: "ai", text: j.answer }]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 text-white">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
        }}
      />

      {preview && (
        <img
          src={preview}
          className="w-full max-h-[320px] object-contain mt-4"
        />
      )}

      <button onClick={analyze} disabled={!file || loading}>
        {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์"}
      </button>
    </main>
  );
}