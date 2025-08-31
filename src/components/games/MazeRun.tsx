"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";
import { toast } from "sonner";
import { useSound } from "@/providers/SoundProvider";

/**
 * Maze Run – simple grid maze
 * Player moves with arrow keys / WASD to reach the goal.
 */

const GRID_SIZE = 7; // 7x7 grid
// 0 = path, 1 = wall
const MAZE_LAYOUT: number[][] = [
  [0,1,0,0,0,0,0],
  [0,1,0,1,1,1,0],
  [0,0,0,1,0,0,0],
  [0,1,1,1,0,1,0],
  [0,0,0,0,0,1,0],
  [0,1,1,1,1,1,0],
  [0,0,0,0,0,0,0],
];

const START_POS = { x: 0, y: 0 };
const GOAL_POS = { x: 6, y: 6 };

export default function MazeRun() {
  const session = useSessionState() as any;
  const sound = useSound?.();

  const getScore = (key: string) => session?.getScore?.(key) ?? session?.scores?.[key] ?? 0;
  const incScore = (key: string, delta = 1) => {
    if (session?.incScore) return session.incScore(key, delta);
    if (session?.setScores)
      session.setScores((prev: any) => ({ ...(prev||{}), [key]: (prev?.[key] ?? 0) + delta }));
  };

  const [player, setPlayer] = useState(START_POS);

  const handleMove = useCallback((dx: number, dy: number) => {
    setPlayer((prev) => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (
        newX >= 0 &&
        newX < GRID_SIZE &&
        newY >= 0 &&
        newY < GRID_SIZE &&
        MAZE_LAYOUT[newY][newX] === 0
      ) {
        return { x: newX, y: newY };
      }
      return prev; // blocked
    });
  }, []);

  // keyboard controls
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") handleMove(0, -1);
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") handleMove(0, 1);
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") handleMove(-1, 0);
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") handleMove(1, 0);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handleMove]);

  // check win
  useEffect(() => {
    if (player.x === GOAL_POS.x && player.y === GOAL_POS.y) {
      incScore("mazeRun", 1);
      toast.success("🎉 You reached the goal!");
      try { sound?.playSound?.("/sounds/success.mp3"); } catch {}
      setPlayer(START_POS); // restart
    }
  }, [player, sound]);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Maze Run</h1>
      <div className="mb-2">Score: {getScore("mazeRun")}</div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 40px)` }}>
        {MAZE_LAYOUT.map((row, y) =>
          row.map((cell, x) => {
            const isPlayer = player.x === x && player.y === y;
            const isGoal = GOAL_POS.x === x && GOAL_POS.y === y;
            return (
              <div
                key={`${x}-${y}`}
                className={`w-10 h-10 flex items-center justify-center border
                  ${cell === 1 ? "bg-gray-700" : "bg-white"}
                  ${isGoal ? "bg-green-400" : ""}
                  ${isPlayer ? "bg-blue-400" : ""}
                `}
              >
                {isPlayer ? "🙂" : isGoal ? "⭐" : ""}
              </div>
            );
          })
        )}
      </div>
      <p className="mt-4 text-gray-600 text-sm">
        Use Arrow Keys or WASD to move
      </p>
    </div>
  );
}
