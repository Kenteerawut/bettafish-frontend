import BettaBackground from "@/components/BettaBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="relative min-h-screen overflow-hidden">
        {/* พื้นหลังสี / gradient */}
        <div className="fixed inset-0 z-0 bg-white" />

        {/* ปลากัด (background layer) */}
        <BettaBackground />

        {/* เนื้อหาจริง (login / popup) */}
        <main className="relative z-20 min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
