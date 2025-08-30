"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type GameState = {
  score: number;
  timeSpent: number; // seconds
};

type SessionState = {
  games: Record<string, GameState>;
  updateScore: (game: string, delta: number) => void;
  setTime: (game: string, seconds: number) => void;
  reset: () => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionStateProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Record<string, GameState>>({});

  const updateScore = (game: string, delta: number) => {
    setGames((prev) => ({
      ...prev,
      [game]: {
        ...prev[game],
        score: (prev[game]?.score ?? 0) + delta,
        timeSpent: prev[game]?.timeSpent ?? 0,
      },
    }));
  };

  const setTime = (game: string, seconds: number) => {
    setGames((prev) => ({
      ...prev,
      [game]: {
        ...prev[game],
        score: prev[game]?.score ?? 0,
        timeSpent: seconds,
      },
    }));
  };

  const reset = () => setGames({}); // clears all session state

  return (
    <SessionContext.Provider value={{ games, updateScore, setTime, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionState() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessionState must be used inside SessionStateProvider");
  }
  return ctx;
}
