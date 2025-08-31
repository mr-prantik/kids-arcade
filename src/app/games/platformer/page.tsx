"use client";

import dynamic from "next/dynamic";

const Platformer = dynamic(() => import("@/components/games/Platformer"), {
  ssr: false,
  loading: () => <p className="text-white">Loading Platformer...</p>,
});

export default function Page() {
  return <Platformer />;
}
