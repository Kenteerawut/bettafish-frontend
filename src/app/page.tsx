"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-emerald-50">
      <section className="grid gap-10 md:grid-cols-[3fr,2fr] items-center">
        
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              BETTA AI
            </span>
          </h1>

          <p className="text-sm md:text-base text-emerald-100/80">
            ระบบช่วยวิเคราะห์สายพันธุ์ปลากัดด้วย AI สำหรับนักเลี้ยง นักเพาะ
            และคนที่รักปลากัด
          </p>

          <div className="space-y-3 text-sm text-emerald-100/80">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">🌿</span>
              <p>อัปโหลดรูปปลากัดเพื่อให้ AI วิเคราะห์สายพันธุ์และกลุ่มหลัก</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">📊</span>
              <p>บันทึกผลการวิเคราะห์ย้อนหลัง พร้อมรูปและโน้ตคำอธิบาย</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">💬</span>
              <p>ถามคำถามเพิ่มเติมเกี่ยวกับปลาตัวนั้นได้หลังวิเคราะห์เสร็จ</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => router.push("/analyze")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-black font-semibold shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:scale-[1.03] transition-transform"
            >
              🔍 เริ่มวิเคราะห์ปลากัด
            </button>

            <button
              onClick={() => router.push("/records")}
              className="px-5 py-3 rounded-2xl border border-emerald-400/40 bg-emerald-950/40 text-emerald-100 text-sm hover:bg-emerald-900/60 transition-colors"
            >
              ดูประวัติการวิเคราะห์
            </button>
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="relative">
          <div className="rounded-[32px] bg-emerald-900/40 border border-emerald-400/20 shadow-[0_0_60px_rgba(16,185,129,0.45)] overflow-hidden">

            <div className="px-6 pt-5 pb-3 text-xs text-emerald-100/80 bg-emerald-950/60 font-semibold tracking-wide">
              BETTA AI
            </div>

            <div className="px-6 py-4">
              {/* IMAGE PREVIEW */}
              <div className="rounded-2xl overflow-hidden bg-black/60 mb-4">
                <div className="aspect-video relative">
                  <Image
                    src="/images/betta.png"
                    alt="Betta fish preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* DEMO RESULT */}
              <div className="space-y-2 text-xs text-emerald-100/90">
                <div>🐟 สายพันธุ์: Wild Betta (ตัวอย่าง)</div>
                <div>⭐ กลุ่ม: Wild Betta (ปลาป่า)</div>
                <div>🧬 โครงสร้าง: Wild Body</div>
                <div className="text-emerald-100/80">
                  💬 รายละเอียด: ตัวอย่างคำอธิบายจาก AI เกี่ยวกับฟอร์มและสีของปลา
                </div>

                <div className="pt-1">
                  ความมั่นใจ: 95%
                  <div className="mt-1 h-2 rounded-full bg-emerald-900/60 overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-emerald-400 to-teal-300" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </section>
    </main>
  );
}