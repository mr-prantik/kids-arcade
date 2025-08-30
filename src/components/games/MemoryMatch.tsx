"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { useSessionState } from "@/providers/SessionStateProvider";
import { useSound } from "@/providers/SoundProvider";
import { RefreshCw } from "lucide-react";

/**
 * Memory Match - simple emoji pairs, 4x4 grid
 * - Score: +1 per matched pair (session key "memory-match")
 * - Timer recorded to session via setTime("memory-match", seconds)
 */

type Card = {
  id: number;
  face: string;
  matched: boolean;
  flipped: boolean;
};

const EMOJIS = ["🐶","🐱","🦊","🐼","🐵","🦁","🐸","🐷"]; // 8 unique -> 16 cards

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch() {
  const { updateScore, setTime, games } = useSessionState();
  const { playSound } = useSound();

  const sessionKey = "memory-match";

  // Build initial deck once per mount / new round
  const [round, setRound] = useState(0);
  const deck = useMemo(() => {
    const pairs: Card[] = EMOJIS.flatMap((e, idx) => [
      { id: idx * 2, face: e, matched: false, flipped: false },
      { id: idx * 2 + 1, face: e, matched: false, flipped: false },
    ]);
    return shuffle(pairs);
  }, [round]);

  const [cards, setCards] = useState<Card[]>(deck);
  useEffect(() => setCards(deck), [deck]);

  // game state
  const [first, setFirst] = useState<number | null>(null); // index
  const [second, setSecond] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);

  // timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    // start timer on mount / new round
    setSeconds(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      // commit final time to session
      setTime(sessionKey, seconds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // commit periodic time to session (every 5 seconds)
  useEffect(() => {
    const id = setInterval(() => setTime(sessionKey, seconds), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  // apply points from session if present
  const sessionScore = games[sessionKey]?.score ?? 0;

  useEffect(() => {
    // if completed (matched all) => toast and play sound
    if (matchedCount === EMOJIS.length) {
      toast.success(`You found all pairs! Moves: ${moves}, Time: ${seconds}s`);
      playSound?.("/sounds/win.mp3");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCount]);

  const flipCard = (index: number) => {
    if (busy) return;
    setCards((prev) => {
      if (prev[index].flipped || prev[index].matched) return prev;
      const copy = prev.map((c, i) => (i === index ? { ...c, flipped: true } : c));
      return copy;
    });

    playSound?.("/sounds/click.mp3");

    if (first === null) {
      setFirst(index);
      return;
    }

    if (first !== null && second === null && index !== first) {
      setSecond(index);
      setMoves((m) => m + 1);
      setBusy(true);

      // evaluate after short delay so kids see the second card
      setTimeout(() => {
        setCards((prev) => {
          const a = prev[first];
          const b = prev[index];
          const copy = [...prev];
          if (a.face === b.face) {
            // match
            copy[first] = { ...a, matched: true, flipped: true };
            copy[index] = { ...b, matched: true, flipped: true };
            setMatchedCount((mc) => mc + 1);
            updateScore(sessionKey, 1); // +1 per pair
            playSound?.("/sounds/match.mp3");
          } else {
            // mismatch -> flip back
            copy[first] = { ...a, flipped: false };
            copy[index] = { ...b, flipped: false };
            playSound?.("/sounds/mismatch.mp3");
          }
          return copy;
        });

        setFirst(null);
        setSecond(null);
        setBusy(false);
      }, 750); // short reveal for kids
    }
  };

  const newRound = () => {
    setRound((r) => r + 1);
    setFirst(null);
    setSecond(null);
    setBusy(false);
    setMoves(0);
    setMatchedCount(0);
    // reset deck and timer are handled by effects
    toast("Shuffling cards... good luck!");
    playSound?.("/sounds/click.mp3");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Memory Match</h2>
          <p className="text-sm text-muted-foreground">Find pairs — flip two cards at a time</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-md bg-white/80 px-3 py-1 text-sm shadow-sm">
            <div className="text-xs text-muted-foreground">Score</div>
            <div className="font-medium">{sessionScore}</div>
          </div>

          <div className="rounded-md bg-white/80 px-3 py-1 text-sm shadow-sm">
            <div className="text-xs text-muted-foreground">Moves</div>
            <div className="font-medium">{moves}</div>
          </div>

          <div className="rounded-md bg-white/80 px-3 py-1 text-sm shadow-sm">
            <div className="text-xs text-muted-foreground">Time</div>
            <div className="font-medium">{seconds}s</div>
          </div>

          <button
            onClick={newRound}
            className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1 text-sm shadow-sm"
            title="New round"
          >
            <RefreshCw className="h-4 w-4" />
            New Round
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <button
            key={c.id}
            onClick={() => flipCard(i)}
            disabled={c.flipped || c.matched || busy}
            aria-label={`card-${i}`}
            className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-transform
              ${c.flipped || c.matched ? "bg-white shadow-md scale-100" : "bg-gradient-to-br from-pink-200 to-blue-200 hover:scale-105"}
              ${c.matched ? "opacity-80" : ""}`}
          >
            <span className={`text-3xl`}>{c.flipped || c.matched ? c.face : "❔"}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Tip: Tap two cards to find a pair. Pairs stay revealed.
      </div>
    </div>
  );
}
