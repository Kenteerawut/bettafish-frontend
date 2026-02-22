import "./globals.css";
import TopBar from "@/components/TopBar";

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
        <TopBar />

        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}