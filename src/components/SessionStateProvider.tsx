// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";

// type GameState = {
//   score: number;
//   timeSpent: number; // seconds
// };

// type SessionState = {
//   games: Record<string, GameState>;
//   updateScore: (game: string, delta: number) => void;
//   setTime: (game: string, seconds: number) => void;
//   reset: () => void;
// };

// const SessionContext = createContext<SessionState | undefined>(undefined);

// export function SessionStateProvider({ children }: { children: ReactNode }) {
//   const [games, setGames] = useState<Record<string, GameState>>({});

//   const updateScore = (game: string, delta: number) => {
//     setGames((prev) => ({
//       ...prev,
//       [game]: {
//         ...prev[game],
//         score: (prev[game]?.score ?? 0) + delta,
//         timeSpent: prev[game]?.timeSpent ?? 0,
//       },
//     }));
//   };

//   const setTime = (game: string, seconds: number) => {
//     setGames((prev) => ({
//       ...prev,
//       [game]: {
//         ...prev[game],
//         score: prev[game]?.score ?? 0,
//         timeSpent: seconds,
//       },
//     }));
//   };

//   const reset = () => setGames({}); // clears all session state

//   return (
//     <SessionContext.Provider value={{ games, updateScore, setTime, reset }}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export function useSessionState() {
//   const ctx = useContext(SessionContext);
//   if (!ctx) {
//     throw new Error("useSessionState must be used inside SessionStateProvider");
//   }
//   return ctx;
// }



"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Scores = Record<string, number>;

export type SessionStateContextType = {
  scores: Scores;
  getScore: (key: string) => number;
  setScore: (key: string, value: number) => void;
  incScore: (key: string, delta?: number) => void;
  resetScore: (key?: string) => void;
};

const SessionStateContext = createContext<SessionStateContextType | undefined>(undefined);

export function SessionStateProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Scores>({});

  useEffect(() => {
    console.log("[SessionStateProvider] mounted");
    return () => {
      console.log("[SessionStateProvider] unmounted");
    };
  }, []);

  const getScore = (key: string) => scores[key] ?? 0;
  const setScore = (key: string, value: number) =>
    setScores((prev) => ({ ...prev, [key]: value }));
  const incScore = (key: string, delta = 1) =>
    setScores((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + delta }));
  const resetScore = (key?: string) => {
    if (key) setScores((prev) => ({ ...prev, [key]: 0 }));
    else setScores({});
  };

  return (
    <SessionStateContext.Provider
      value={{ scores, getScore, setScore, incScore, resetScore }}
    >
      {children}
    </SessionStateContext.Provider>
  );
}

export function useSessionState(): SessionStateContextType {
  const ctx = useContext(SessionStateContext);
  if (!ctx) {
    throw new Error("useSessionState must be used inside SessionStateProvider");
  }
  return ctx;
}

