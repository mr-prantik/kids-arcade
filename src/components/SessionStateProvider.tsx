"use client";

import React, { createContext, useContext, useState } from "react";

export type GameSession = {
  score: number;
  time: number;
};

export type SessionStateContextType = {
  games: Record<string, GameSession>;
  updateScore: (gameKey: string, delta: number) => void;
  setTime: (gameKey: string, time: number) => void;
};

const SessionStateContext = createContext<SessionStateContextType | undefined>(undefined);

export function SessionStateProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Record<string, GameSession>>({});

  const updateScore = (gameKey: string, delta: number) => {
    setGames((prev) => ({
      ...prev,
      [gameKey]: {
        score: (prev[gameKey]?.score ?? 0) + delta,
        time: prev[gameKey]?.time ?? 0,
      },
    }));
  };

  const setTime = (gameKey: string, time: number) => {
    setGames((prev) => ({
      ...prev,
      [gameKey]: {
        score: prev[gameKey]?.score ?? 0,
        time,
      },
    }));
  };

  return (
    <SessionStateContext.Provider value={{ games, updateScore, setTime }}>
      {children}
    </SessionStateContext.Provider>
  );
}

export function useSessionState() {
  const ctx = useContext(SessionStateContext);
  if (!ctx) throw new Error("useSessionState must be used within SessionStateProvider");
  return ctx;
}
