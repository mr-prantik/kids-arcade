import "./globals.css";
import { SessionStateProvider } from "@/providers/SessionStateProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        <SessionStateProvider>
          <SoundProvider>
            <main className="flex-1">{children}</main>
            <Footer />
          </SoundProvider>
        </SessionStateProvider>
      </body>
    </html>
  );
}

