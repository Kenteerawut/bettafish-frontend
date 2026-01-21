"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function History() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      location.href = "/login";
      return;
    }

    fetch(`${API}/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then(setRows)
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-xl font-bold mb-4">📂 ประวัติการวิเคราะห์</h1>

        {rows.length === 0 && (
          <div className="text-gray-500 text-sm">ยังไม่มีประวัติ</div>
        )}

        {rows.map((r) => (
          <div key={r._id} className="border-b py-3">
            <div>
              <b>{r.species_name}</b>
            </div>
            <div className="text-sm">{r.color_traits}</div>
            <div className="text-sm">{r.care_tips}</div>
            <div className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
