"use client";

import { useEffect, useState } from "react";

const API = "https://betta-backend-production.up.railway.app/api";
const ASSET = "https://betta-backend-production.up.railway.app";

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
        setRecords(Array.isArray(j) ? j : j.records || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 text-emerald-50">
      <h1 className="text-3xl font-bold mb-6">
        🐟 ประวัติการวิเคราะห์ปลา
      </h1>

      <div className="grid md:grid-cols-2 gap-5">
        {records.map((item) => {
          const imageSrc = item.imageName
            ? `${ASSET}/uploads/${item.imageName}`
            : null;

          return (
            <div
              key={item._id}
              className="rounded-2xl overflow-hidden bg-emerald-900/20 border border-emerald-400/10"
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  className="w-full h-[220px] object-cover"
                />
              )}

              <div className="p-4 space-y-2 text-sm">
                <div className="font-semibold">
                  {item.fishName || "ไม่ระบุชื่อปลา"}
                </div>

                <div>{item.type || "ไม่ระบุสายพันธุ์"}</div>

                <div className="text-xs opacity-60">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}