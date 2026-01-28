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

        // ✅ FIX: record → records
        const r = await fetch(`${API}/records`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (r.status === 401) {
          logout();
          return;
        }

        const j = await r.json().catch(() => ({}));
        if (!r.ok) {
          throw new Error(j?.message || j?.error || "fetch_failed");
        }

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
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            Fish Records
          </h1>

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
            >
              ไปหน้า Analyze
            </button>

            <button
              onClick={logout}
              className="bg-white border rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow p-4">
          {loading && (
            <div className="py-8 text-center text-gray-700">
              กำลังโหลดข้อมูล...
            </div>
          )}

          {!loading && error && (
            <div className="py-4 text-red-600 font-semibold text-center">
              {error}
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="py-8 text-center text-gray-600">
              ยังไม่มีประวัติการวิเคราะห์
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
                      <span className="text-xs text-gray-500 text-center px-2">
                        {x.imageName}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {x.fishName || "ไม่ระบุชื่อปลา"}
                    </div>

                    <div className="text-sm text-gray-700">
                      type: {x.type || "-"} | color: {x.color || "-"}
                    </div>

                    {x.note && (
                      <div className="text-sm mt-1 text-gray-900">
                        {x.note}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(x.createdAt).toLocaleString()}
                    </div>
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
