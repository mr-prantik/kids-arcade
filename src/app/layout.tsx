// import "./globals.css";
// import type { Metadata } from "next";
// import { SessionStateProvider } from "@/providers/SessionStateProvider";
// import { SoundProvider } from "@/providers/SoundProvider";

// export const metadata: Metadata = {
//   title: "Kids Mini Games",
//   description: "10 fun games for kids (5–10)",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionStateProvider>
//           <SoundProvider>
//             {children}
//           </SoundProvider>
//         </SessionStateProvider>
//       </body>
//     </html>
//   );
// }

//-----------------------------------------------------------------------------------------------------
// import "./globals.css";
// import { SessionStateProvider } from "@/providers/SessionStateProvider"; // default
// import { SoundProvider } from "@/providers/SoundProvider"; // named
// import { Toaster } from "sonner"; // from sonner package

// export const metadata = {
//   title: "Game Hub",
//   description: "Mini games for kids",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionStateProvider>
//           <SoundProvider>
//             {children}
//             <Toaster richColors position="top-center" />
//           </SoundProvider>
//         </SessionStateProvider>
//       </body>
//     </html>
//   );
// }
//-----------------------------------------------------------------------------------------------

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

