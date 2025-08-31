"use client";

import React, { useEffect, useState } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";
import { useSound } from "@/providers/SoundProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HOLES = 9; // 3x3 grid
const GAME_TIME = 30; // seconds
const MOLE_INTERVAL = 800; // ms

export default function WhackAMole() {
  const { getScore, incScore, resetScore } = useSessionState();
  const sound = useSound?.();

  const [activeHole, setActiveHole] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_TIME);
  const [playing, setPlaying] = useState(false);

  // mole popping interval
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActiveHole(Math.floor(Math.random() * HOLES));
      try {
        sound?.playSound?.("/sounds/pop.mp3");
      } catch {}
    }, MOLE_INTERVAL);
    return () => clearInterval(id);
  }, [playing, sound]);

  // countdown timer
  useEffect(() => {
    if (!playing) return;
    if (timeLeft <= 0) {
      setPlaying(false);
      setActiveHole(null);
      toast.info("Game over!");
      try {
        sound?.playSound?.("/sounds/gameover.mp3");
      } catch {}
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, playing, sound]);

  const handleWhack = (idx: number) => {
    if (idx === activeHole) {
      incScore("whackAMole", 1);
      setActiveHole(null);
      toast.success("Whack! +1");
      try {
        sound?.playSound?.("/sounds/bonk.mp3");
      } catch {}
    } else {
      toast.error("Miss!");
      try {
        sound?.playSound?.("/sounds/miss.mp3");
      } catch {}
    }
  };

  const startGame = () => {
    resetScore("whackAMole");
    setTimeLeft(GAME_TIME);
    setPlaying(true);
    toast("Go! Hit the moles 🎯");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Whack-a-Mole</h1>

      <div className="mb-2">Score: {getScore("whackAMole")}</div>
      <div className="mb-4">Time Left: {timeLeft}s</div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: HOLES }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleWhack(idx)}
            className={`w-20 h-20 rounded-full transition-colors text-2xl focus:outline-none
              ${idx === activeHole ? "bg-yellow-400" : "bg-gray-300"}`}
            aria-label={`hole-${idx}`}
          >
            {idx === activeHole ? "🐹" : ""}
          </button>
        ))}
      </div>

      {!playing ? (
        <Button onClick={startGame}>Start Game</Button>
      ) : (
        <Button onClick={() => { setPlaying(false); setActiveHole(null); }}>Stop</Button>
      )}
    </div>
  );
}
