"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";
import { toast } from "sonner";
import { useSound } from "@/providers/SoundProvider";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLANE_WIDTH = 40;
const PLANE_HEIGHT = 40;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const OBSTACLE_SPEED = 4;
const SPAWN_INTERVAL = 1200;

type Obstacle = {
  x: number;
  y: number;
};

export default function PlaneSimulator() {
  const { updateScore, games } = useSessionState();
  const { playSound } = useSound();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [planeX, setPlaneX] = useState(CANVAS_WIDTH / 2 - PLANE_WIDTH / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const scoreKey = "plane-simulator";

  const getScore = () => games[scoreKey]?.score ?? 0;

  // Keyboard controls
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") setPlaneX((x) => Math.max(0, x - 20));
      if (e.key === "ArrowRight") setPlaneX((x) => Math.min(CANVAS_WIDTH - PLANE_WIDTH, x + 20));
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameOver]);

  // Obstacle spawn
  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      const x = Math.floor(Math.random() * (CANVAS_WIDTH - OBSTACLE_WIDTH));
      setObstacles((prev) => [...prev, { x, y: -OBSTACLE_HEIGHT }]);
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawn);
  }, [gameOver]);

  // Game loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const loop = () => {
      if (!ctx) return;

      // clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // move obstacles
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, y: o.y + OBSTACLE_SPEED }))
          .filter((o) => o.y < CANVAS_HEIGHT)
      );

      // draw plane
      ctx.fillStyle = "blue";
      ctx.fillRect(planeX, CANVAS_HEIGHT - PLANE_HEIGHT - 10, PLANE_WIDTH, PLANE_HEIGHT);

      // draw obstacles
      ctx.fillStyle = "red";
      obstacles.forEach((o) => ctx.fillRect(o.x, o.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT));

      // check collision
      for (const o of obstacles) {
        if (
          o.x < planeX + PLANE_WIDTH &&
          o.x + OBSTACLE_WIDTH > planeX &&
          o.y < CANVAS_HEIGHT - PLANE_HEIGHT - 10 + PLANE_HEIGHT &&
          o.y + OBSTACLE_HEIGHT > CANVAS_HEIGHT - PLANE_HEIGHT - 10
        ) {
          // collision: stop game
          setGameOver(true);
          setFinalScore(getScore());
          toast.error(`💥 You crashed! Final Score: ${getScore()}`);
          playSound?.("/sounds/crash.mp3");
          return; // stop loop
        }
      }

      // update score
      if (!gameOver) updateScore(scoreKey, 1);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [planeX, obstacles, gameOver, updateScore, playSound]);

  const resetGame = () => {
    setObstacles([]);
    setPlaneX(CANVAS_WIDTH / 2 - PLANE_WIDTH / 2);
    setGameOver(false);
    setFinalScore(0);
    toast("Game restarted! 🛩️");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Plane Simulator</h1>

      <p className="text-lg mb-2">
        Score: {gameOver ? finalScore : getScore()}
      </p>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border bg-white shadow"
      />

      {gameOver && (
        <p className="mt-2 text-red-600 font-semibold">
          💥 Game Over! Final Score: {finalScore}
        </p>
      )}

      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-md shadow-sm"
      >
        🔄 Restart Game
      </button>

      <p className="mt-2 text-sm text-muted-foreground">
        Use Left/Right arrows to move
      </p>
    </div>
  );
}
