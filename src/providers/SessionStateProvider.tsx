"use client";

import React, { createContext, useContext, useState } from "react";

export type GameSession = {
  score: number;
  time: number;
};

export type SessionStateContextType = {
  games: Record<string, GameSession>;
  // Old API (backward compatible)
  getScore: (gameKey: string) => number;
  setScore: (gameKey: string, value: number) => void;
  incScore: (gameKey: string, delta?: number) => void;
  resetScore: (gameKey?: string) => void;
  // New API
  updateScore: (gameKey: string, delta: number) => void;
  setTime: (gameKey: string, time: number) => void;
};

const SessionStateContext = createContext<SessionStateContextType | undefined>(undefined);

export function SessionStateProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<Record<string, GameSession>>({});

  // --- Old API ---
  const getScore = (gameKey: string) => games[gameKey]?.score ?? 0;

  const setScore = (gameKey: string, value: number) => {
    setGames((prev) => ({
      ...prev,
      [gameKey]: { score: value, time: prev[gameKey]?.time ?? 0 },
    }));
  };

  const incScore = (gameKey: string, delta: number = 1) => {
    setGames((prev) => ({
      ...prev,
      [gameKey]: {
        score: (prev[gameKey]?.score ?? 0) + delta,
        time: prev[gameKey]?.time ?? 0,
      },
    }));
  };

  const resetScore = (gameKey?: string) => {
    if (gameKey) {
      setGames((prev) => ({
        ...prev,
        [gameKey]: { score: 0, time: prev[gameKey]?.time ?? 0 },
      }));
    } else {
      setGames({});
    }
  };

  // --- New API ---
  const updateScore = (gameKey: string, delta: number) => {
    incScore(gameKey, delta);
  };

  const setTime = (gameKey: string, time: number) => {
    setGames((prev) => ({
      ...prev,
      [gameKey]: { score: prev[gameKey]?.score ?? 0, time },
    }));
  };

  return (
    <SessionStateContext.Provider
      value={{
        games,
        getScore,
        setScore,
        incScore,
        resetScore,
        updateScore,
        setTime,
      }}
    >
      {children}
    </SessionStateContext.Provider>
  );
}

export function useSessionState() {
  const ctx = useContext(SessionStateContext);
  if (!ctx) throw new Error("useSessionState must be used within SessionStateProvider");
  return ctx;
}

