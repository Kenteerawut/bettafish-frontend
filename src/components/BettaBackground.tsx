"use client";

export default function BettaBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* background image */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: "url('/betta-bg.png')" }}
      />
      {/* overlay ให้ตัวหนังสืออ่านง่าย */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
