import "./globals.css";
import Navbar from "@/components/Navbar";
import ForestBackground from "@/components/ForestBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen text-white bg-stone-950">

        <ForestBackground />
        <Navbar />

        <main className="pt-24 relative z-10">
          {children}
        </main>

      </body>
    </html>
  );
}