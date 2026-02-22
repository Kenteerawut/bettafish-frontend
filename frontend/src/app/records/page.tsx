"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type FishRecord = {
  _id: string;
  imageName?: string;
  imageUrl?: string;
  image?: string;
  fileUrl?: string;

  fishName?: string;
  type?: string;
  color?: string;
  note?: string;

  breed_estimate?: string;
  betta_group?: string;

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
        setLoading(true);
        setError("");

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
          throw new Error(j?.message || "fetch_failed");
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
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-700">
            🐟 ประวัติการวิเคราะห์ปลา
          </h1>

          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white rounded-xl px-4 py-2 hover:bg-indigo-700"
          >
            กลับหน้า Analyze
          </button>
        </header>

        {/* CONTENT */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {loading && (
            <div className="text-center py-10 text-gray-600">
              กำลังโหลดข้อมูล...
            </div>
          )}

          {!loading && error && (
            <div className="text-center text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="text-center text-gray-600">
              ยังไม่มีประวัติการวิเคราะห์
            </div>
          )}

          {!loading && rows.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {rows.map((x) => {
                // ⭐ GOD DATA FALLBACK SYSTEM
                const img =
                  x.imageUrl ||
                  x.image ||
                  x.fileUrl ||
                  "";

                const species =
                  x.breed_estimate ||
                  x.type ||
                  "ไม่ระบุสายพันธุ์";

                const group =
                  x.betta_group ||
                  x.color ||
                  "-";

                return (
                  <div
                    key={x._id}
                    className="rounded-2xl border bg-white shadow hover:shadow-lg transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={x.imageName || "fish"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 px-3 text-center">
                          {x.imageName || "No Image"}
                        </span>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="p-4 space-y-2">

                      <div className="font-semibold text-gray-900">
                        {x.fishName || "ไม่ระบุชื่อปลา"}
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">

                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {species}
                        </span>

                        {group !== "-" && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {group}
                          </span>
                        )}
                      </div>

                      {x.note && (
                        <div className="text-sm text-gray-700">
                          {x.note}
                        </div>
                      )}

                      <div className="text-xs text-gray-400 pt-2">
                        {new Date(x.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}