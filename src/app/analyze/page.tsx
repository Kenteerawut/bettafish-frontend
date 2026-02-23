"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function AnalyzePage() {

  const router = useRouter();

  const [file,setFile] = useState<File|null>(null);
  const [preview,setPreview] = useState("");
  const [result,setResult] = useState<any>(null);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(!token) router.replace("/login");
  },[router]);

  const analyze = async ()=>{

    const token = localStorage.getItem("token");
    if(!file || !token) return;

    setLoading(true);

    const fd = new FormData();
    fd.append("image",file);

    try{
      const r = await fetch(`${API}/analyze`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`
        },
        body:fd
      });

      const j = await r.json();

      setResult(j.result);

    }catch(e){
      console.error(e);
    }

    setLoading(false);
  };

  return(
    <main className="max-w-xl mx-auto p-6 text-white">

      <h1 className="text-2xl font-bold mb-4">
        วิเคราะห์ปลากัดด้วย AI
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e)=>{
          const f = e.target.files?.[0] || null;
          setFile(f);
          setPreview(f ? URL.createObjectURL(f) : "");
        }}
      />

      {preview && (
        <img
          src={preview}
          className="w-full mt-4 rounded-xl"
        />
      )}

      <button
        onClick={analyze}
        className="mt-4 px-4 py-2 bg-emerald-400 text-black rounded-xl"
      >
        {loading ? "กำลังวิเคราะห์..." : "เริ่มวิเคราะห์"}
      </button>

      {result && (
        <div className="mt-6">
          <div>สายพันธุ์: {result.breed_estimate}</div>
          <div>กลุ่ม: {result.betta_group}</div>
        </div>
      )}

    </main>
  );
}