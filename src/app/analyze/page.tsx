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

  const [file,setFile] = useState<File|null>(null);
  const [preview,setPreview] = useState("");
  const [result,setResult] = useState<any>(null);

  const [input,setInput] = useState("");
  const [messages,setMessages] = useState<Msg[]>([]);
  const [displayedMessages,setDisplayedMessages] = useState<Msg[]>([]);

  const [loading,setLoading] = useState(false);
  const [chatLoading,setChatLoading] = useState(false);

  // ✅ auth check
  useEffect(()=>{
    const t = localStorage.getItem("token");
    if(!t) router.replace("/login");
  },[router]);

  // ✅ auto scroll chat
  useEffect(()=>{
    chatEndRef.current?.scrollIntoView({behavior:"smooth"});
  },[displayedMessages,chatLoading]);

  // ✅ TYPEWRITER FIX (stable)
  useEffect(()=>{
    const last = messages[messages.length-1];
    if(!last) return;

    if(last.role !== "ai"){
      setDisplayedMessages(messages);
      return;
    }

    let i=0;

    setDisplayedMessages(messages.map(m=>(
      m.role==="ai" ? {...m,text:""} : m
    )));

    const interval = setInterval(()=>{
      i++;

      setDisplayedMessages(prev=>{
        const arr=[...prev];
        arr[arr.length-1]={
          role:"ai",
          text:last.text.slice(0,i)
        };
        return arr;
      });

      if(i>=last.text.length) clearInterval(interval);

    },12);

    return()=>clearInterval(interval);

  },[messages]);

  // ============================
  // 🔥 ANALYZE
  // ============================
  const analyze = async ()=>{

    const token = localStorage.getItem("token");
    if(!file || !token) return;

    setLoading(true);
    setMessages([]);
    setDisplayedMessages([]);
    setResult(null);

    try{

      const fd = new FormData();
      fd.append("image",file);

      const r = await fetch(`${API}/analyze`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:fd
      });

      const j = await r.json();
      if(!r.ok) throw new Error("analyze_failed");

      setResult(j.result);

    }catch(e){
      console.error(e);
    }

    setLoading(false);
  };

  // ============================
  // 🔥 CHAT
  // ============================
  const sendChat = async ()=>{

    const token = localStorage.getItem("token");
    if(!input.trim() || !token || !result) return;

    const question = input;
    setInput("");

    setMessages(m=>[...m,{role:"user",text:question}]);
    setDisplayedMessages(m=>[...m,{role:"user",text:question}]);

    setChatLoading(true);

    try{

      const r = await fetch(`${API}/chat`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          question,
          context:result
        })
      });

      const j = await r.json();
      if(!r.ok) throw new Error("chat_failed");

      setMessages(m=>[...m,{role:"ai",text:j.answer}]);

    }catch(e){
      console.error(e);
    }

    setChatLoading(false);
  };

  const species = result?.breed_estimate || "-";
  const group = result?.betta_group || "-";
  const morphology = result?.morphology || "-";
  const detail = result?.short_reason || "-";

  let confidence = 0;
  const rawConfidence = result?.confidence ?? result?.confidence_score ?? 0;

  if(typeof rawConfidence==="number"){
    if(rawConfidence<=1) confidence=Math.round(rawConfidence*100);
    else if(rawConfidence<=100) confidence=Math.round(rawConfidence);
    else confidence=95;
  }

  return(
    <main className="relative max-w-3xl mx-auto p-6 text-emerald-50">

      <div className="
        bg-emerald-950/40 backdrop-blur-2xl
        border border-emerald-400/20
        rounded-[28px]
        shadow-[0_0_120px_rgba(16,185,129,0.25)]
        p-6
      ">

        <div className="mb-8 text-center">
          <h1 className="
            text-3xl md:text-4xl font-extrabold
            bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-300
            bg-clip-text text-transparent
          ">
            🌿 วิเคราะห์สายพันธุ์ปลากัดด้วย AI
          </h1>
        </div>

        {/* FILE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>{
            const f=e.target.files?.[0]||null;
            setFile(f);
            setPreview(f?URL.createObjectURL(f):"");
          }}
          className="mb-4"
        />

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="w-full max-h-[320px] object-contain rounded-2xl border border-emerald-400/20 mb-4"
          />
        )}

        <button
          onClick={analyze}
          className="w-full mb-6 py-3 rounded-2xl
          bg-gradient-to-r from-emerald-400 to-teal-400
          text-black font-semibold"
        >
          {loading ? "กำลังวิเคราะห์..." : "🔍 เริ่มวิเคราะห์"}
        </button>

        {result && (
          <>
            <div className="space-y-3 mb-6 text-[15px]">
              <div>🐟 สายพันธุ์: {species}</div>
              <div>⭐ กลุ่ม: {group}</div>
              <div>🧬 โครงสร้าง: {morphology}</div>
              <div>🎨 รายละเอียด: {detail}</div>
              <div>🔥 ความมั่นใจ: {confidence}%</div>
            </div>

            {/* CHAT BOX */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e)=>setInput(e.target.value)}
                className="flex-1 rounded-xl px-3 py-2 bg-black/40"
              />
              <button
                onClick={sendChat}
                className="px-5 rounded-xl bg-emerald-300 text-black"
              >
                ส่ง
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {displayedMessages.map((m,i)=>(
                <div key={i}>
                  {m.role==="user" ? "👤 " : "🤖 "}
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
          </>
        )}

      </div>
    </main>
  );
}