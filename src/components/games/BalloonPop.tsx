"use client";

import React, { useEffect, useState } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";
import { useSound } from "@/providers/SoundProvider";
import { toast } from "sonner";

type Balloon = {
  id: number;
  left: number;
  bottom: number;
  speed: number;
};

export default function BalloonPop() {
  const session = useSessionState() as any;
  const sound = useSound?.();

  const getScore = (key: string) =>
    session?.getScore?.(key) ?? session?.scores?.[key] ?? 0;
  const incScore = (key: string, delta = 1) => {
    if (session?.incScore) return session.incScore(key, delta);
    if (session?.setScores)
      session.setScores((prev: any) => ({
        ...(prev || {}),
        [key]: (prev?.[key] ?? 0) + delta,
      }));
  };

  const [balloons, setBalloons] = useState<Balloon[]>([]);

  // Spawn balloons periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 80 + 10, // 10–90% left
          bottom: 0,
          speed: Math.random() * 2 + 1, // upward speed
        },
      ]);
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, []);

  // Move balloons upward
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, bottom: b.bottom + b.speed }))
          .filter((b) => b.bottom < 100) // remove if out of screen
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  const popBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    incScore("balloonPop", 1);
    toast.success("Pop! 🎈");
    try {
      sound?.playSound?.("/sounds/pop.mp3");
    } catch {}
  };

  return (
    <div className="relative w-full h-[500px] bg-sky-100 overflow-hidden rounded-lg">
      <h1 className="text-2xl font-bold text-center p-4">Balloon Pop 🎈</h1>
      <div className="text-center mb-2">Score: {getScore("balloonPop")}</div>

      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          onClick={() => popBalloon(balloon.id)}
          className="absolute w-12 h-16 rounded-full cursor-pointer shadow-lg"
          style={{
            left: `${balloon.left}%`,
            bottom: `${balloon.bottom}px`,
            backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa"][
              balloon.id % 4
            ],
          }}
        ></div>
      ))}
    </div>
  );
}
