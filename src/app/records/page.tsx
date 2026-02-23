"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const r = await fetch(`${API}/records`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const j = await r.json();

        console.log("📦 RECORD DATA =", j);

        // backend ส่ง array ตรง ๆ
        setRecords(Array.isArray(j) ? j : j.records || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <main className="relative max-w-6xl mx-auto p-6 text-emerald-50">

      {/* 🌫️ BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-20
        bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.25),transparent_40%)]
        bg-[radial-gradient(circle_at_85%_70%,rgba(34,211,238,0.15),transparent_50%)]
      " />

      <div className="
        bg-emerald-950/40
        backdrop-blur-2xl
        border border-emerald-400/20
        rounded-[28px]
        shadow-[0_0_60px_rgba(16,185,129,0.25)]
        p-6
      ">
        <h1 className="
          text-3xl font-bold mb-6
          bg-gradient-to-r from-emerald-200 via-teal-300 to-cyan-300
          bg-clip-text text-transparent
        ">
          🐟 ประวัติการวิเคราะห์ปลา
        </h1>

        {records.length === 0 && (
          <div className="text-emerald-300/60">
            ยังไม่มีประวัติการวิเคราะห์
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {records.map((item) => {

            // ⭐ FIX จริง — ใช้ imageName แทน imageUrl
            const imageSrc =
              item.imageName
                ? `${API}/uploads/${item.imageName}`
                : null;

            return (
              <div
                key={item._id}
                className="
                rounded-2xl overflow-hidden
                bg-emerald-900/20
                border border-emerald-400/10
                hover:scale-[1.02]
                transition-all
                "
              >
                {imageSrc && (
                  <img
                    src={imageSrc}
                    className="w-full h-[220px] object-cover"
                    onError={(e) => {
                      console.log("❌ IMAGE LOAD FAIL:", imageSrc);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}

                <div className="p-4 space-y-2 text-sm">
                  <div className="text-emerald-200 font-semibold">
                    {item.fishName || "ไม่ระบุชื่อปลา"}
                  </div>

                  <div className="text-emerald-300/70">
                    {item.type || "ไม่ระบุสายพันธุ์"}
                  </div>

                  <div className="text-xs text-emerald-400/50">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}