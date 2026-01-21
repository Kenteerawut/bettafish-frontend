"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type FishRecord = {
  _id: string;
  userId: string;
  fishName?: string;
  type?: string;
  color?: string;
  note?: string;
  imageName: string;
  imageUrl?: string;
  createdAt: string;
};

export default function RecordsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<FishRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setError("");
        setLoading(true);

        const r = await fetch(`${API}/record`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (r.status === 401) return logout();

        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j?.message || j?.error || "fetch_failed");

        setRows(Array.isArray(j) ? j : []);
      } catch (e: any) {
        setError(e?.message || "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">Fish Records</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
            >
              ไปหน้าอัปโหลด/วิเคราะห์
            </button>
            <button
              onClick={logout}
              className="bg-white border rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50"
            >
              ออกจากระบบ
            </button>
          </div>
        </header>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow p-4">
          <div className="text-xs text-gray-700 mb-3">API: {API}</div>

          {loading && <div className="py-8 text-center text-gray-900">กำลังโหลด...</div>}

          {!loading && error && <div className="py-4 text-red-600 font-semibold">{error}</div>}

          {!loading && !error && rows.length === 0 && (
            <div className="py-8 text-center text-gray-700">
              ยังไม่มีข้อมูล ลองไปหน้า “อัปโหลด/วิเคราะห์” แล้วบันทึกผล
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <ul className="divide-y">
              {rows.map((x) => (
                <li key={x._id} className="py-4 flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    {x.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={x.imageUrl}
                        alt={x.imageName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-600 px-2 text-center">
                        {x.imageName}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {x.fishName || "(ไม่มีชื่อปลา)"}
                    </div>
                    <div className="text-sm text-gray-700">
                      type: {x.type || "-"} | color: {x.color || "-"}
                    </div>
                    {x.note && <div className="text-sm mt-1 text-gray-900">{x.note}</div>}
                    <div className="text-xs text-gray-600 mt-1">
                      createdAt: {new Date(x.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">id: {x._id}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
