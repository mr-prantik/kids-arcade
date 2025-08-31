"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useSessionState } from "@/providers/SessionStateProvider";
import { useSound } from "@/providers/SoundProvider";

const CHOICES = ["Rock", "Paper", "Scissors"] as const;
type Choice = typeof CHOICES[number];

function getWinner(player: Choice, computer: Choice): "win" | "lose" | "draw" {
  if (player === computer) return "draw";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    return "win";
  }
  return "lose";
}

export default function RockPaperScissor() {
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

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>("");

  const playRound = (choice: Choice) => {
    const comp = CHOICES[Math.floor(Math.random() * CHOICES.length)];
    const outcome = getWinner(choice, comp);

    setPlayerChoice(choice);
    setComputerChoice(comp);

    if (outcome === "win") {
      incScore("rockPaperScissors", 1);
      setResult("You Win 🎉");
      toast.success("You Win!");
      try {
        sound?.playSound?.("/sounds/success.mp3");
      } catch {}
    } else if (outcome === "lose") {
      setResult("You Lose 😢");
      toast.error("You Lose!");
      try {
        sound?.playSound?.("/sounds/error.mp3");
      } catch {}
    } else {
      setResult("It's a Draw 🤝");
      toast("It's a Draw");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Rock Paper Scissors</h1>
      <div className="mb-2">Score: {getScore("rockPaperScissors")}</div>

      <div className="flex space-x-4 mb-6">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            onClick={() => playRound(choice)}
            className="px-4 py-2 rounded-xl bg-pink-300 hover:bg-pink-400 text-lg font-semibold shadow-md"
          >
            {choice}
          </button>
        ))}
      </div>

      {playerChoice && computerChoice && (
        <div className="text-center">
          <p className="mb-2">
            You chose: <strong>{playerChoice}</strong>
          </p>
          <p className="mb-2">
            Computer chose: <strong>{computerChoice}</strong>
          </p>
          <p className="text-xl font-bold">{result}</p>
        </div>
      )}
    </div>
  );
}
