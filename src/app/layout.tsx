import "./globals.css";
import type { Metadata } from "next";
import { SessionStateProvider } from "@/providers/SessionStateProvider";
import { SoundProvider } from "@/providers/SoundProvider";

export const metadata: Metadata = {
  title: "Kids Mini Games",
  description: "10 fun games for kids (5–10)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionStateProvider>
          <SoundProvider>
            {children}
          </SoundProvider>
        </SessionStateProvider>
      </body>
    </html>
  );
}
