import "./globals.css";

export const metadata = {
  title: "BettaFish",
  description: "BettaFish Classifier",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen">
        {/* Background image */}
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/betta-bg.png')" }}
        />

        {/* Dark overlay (ช่วยให้ตัวอักษรอ่านง่าย) */}
        <div className="fixed inset-0 -z-10 bg-black/40" />

        {children}
      </body>
    </html>
  );
}
