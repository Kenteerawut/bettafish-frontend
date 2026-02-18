import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className="
        bg-gradient-to-br
        from-indigo-100
        via-purple-50
        to-pink-100
        min-h-screen
        "
      >
        <Navbar />

        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
