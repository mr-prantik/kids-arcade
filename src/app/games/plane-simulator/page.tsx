"use client";

import dynamic from "next/dynamic";

const PlaneSimulator = dynamic(
  () => import("@/components/games/PlaneSimulator"),
  { ssr: false }
);

export default function Page() {
  return <PlaneSimulator />;
}
