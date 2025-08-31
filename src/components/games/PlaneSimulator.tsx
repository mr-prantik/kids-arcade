"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";
import { toast } from "sonner";
import { useSound } from "@/providers/SoundProvider";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLANE_WIDTH = 40;
const PLANE_HEIGHT = 40;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 40;

const ENEMY_SPEED = 1.5;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 3;
const ENEMY_BULLET_SPEED = 2;
const SPAWN_INTERVAL = 1500;
const FIRE_INTERVAL = 300;

type Enemy = { x: number; y: number };
type Bullet = { x: number; y: number; from: "player" | "enemy" };

export default function PlaneSimulator() {
  const { updateScore, games } = useSessionState();
  const { playSound } = useSound();
  const scoreKey = "plane-simulator";

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [planeX, setPlaneX] = useState(CANVAS_WIDTH / 2 - PLANE_WIDTH / 2);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const getScore = () => games[scoreKey]?.score ?? 0;

  // game objects (kept in refs for sync updates)
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);

  // keyboard controls
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") setPlaneX((x) => Math.max(0, x - 20));
      if (e.key === "ArrowRight") setPlaneX((x) => Math.min(CANVAS_WIDTH - PLANE_WIDTH, x + 20));
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [gameOver]);

  // mobile touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouch = (e: TouchEvent) => {
      if (gameOver) return;
      const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      setPlaneX(Math.min(Math.max(touchX - PLANE_WIDTH / 2, 0), CANVAS_WIDTH - PLANE_WIDTH));
    };
    canvas.addEventListener("touchmove", handleTouch);
    return () => canvas.removeEventListener("touchmove", handleTouch);
  }, [gameOver]);

  // spawn enemies
  useEffect(() => {
    if (gameOver) return;
    const spawn = setInterval(() => {
      const x = Math.floor(Math.random() * (CANVAS_WIDTH - ENEMY_WIDTH));
      enemiesRef.current.push({ x, y: -ENEMY_HEIGHT });
    }, SPAWN_INTERVAL);
    return () => clearInterval(spawn);
  }, [gameOver]);

  // player auto fire
  useEffect(() => {
    if (gameOver) return;
    const fire = setInterval(() => {
      bulletsRef.current.push({
        x: planeX + PLANE_WIDTH / 2 - BULLET_WIDTH / 2,
        y: CANVAS_HEIGHT - PLANE_HEIGHT - 20,
        from: "player",
      });
      playSound?.("/sounds/shoot.mp3");
    }, FIRE_INTERVAL);
    return () => clearInterval(fire);
  }, [planeX, gameOver, playSound]);

  // enemy fire
  useEffect(() => {
    if (gameOver) return;
    const fire = setInterval(() => {
      enemiesRef.current.forEach((enemy) => {
        bulletsRef.current.push({
          x: enemy.x + ENEMY_WIDTH / 2 - BULLET_WIDTH / 2,
          y: enemy.y + ENEMY_HEIGHT,
          from: "enemy",
        });
      });
    }, 1200);
    return () => clearInterval(fire);
  }, [gameOver]);

  // main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const loop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // draw player
      ctx.fillStyle = "blue";
      ctx.fillRect(planeX, CANVAS_HEIGHT - PLANE_HEIGHT - 10, PLANE_WIDTH, PLANE_HEIGHT);

      // move enemies
      enemiesRef.current = enemiesRef.current
        .map((e) => ({ ...e, y: e.y + ENEMY_SPEED }))
        .filter((e) => e.y < CANVAS_HEIGHT);

      // draw enemies
      ctx.fillStyle = "red";
      enemiesRef.current.forEach((e) => ctx.fillRect(e.x, e.y, ENEMY_WIDTH, ENEMY_HEIGHT));

      // move bullets
      bulletsRef.current = bulletsRef.current
        .map((b) => ({
          ...b,
          y: b.from === "player" ? b.y - BULLET_SPEED : b.y + ENEMY_BULLET_SPEED,
        }))
        .filter((b) => b.y > 0 && b.y < CANVAS_HEIGHT);

      // draw bullets
      ctx.fillStyle = "yellow";
      bulletsRef.current.forEach((b) => ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT));

      // collision detection
      bulletsRef.current.forEach((b) => {
        if (b.from === "player") {
          enemiesRef.current.forEach((e) => {
            if (
              b.x < e.x + ENEMY_WIDTH &&
              b.x + BULLET_WIDTH > e.x &&
              b.y < e.y + ENEMY_HEIGHT &&
              b.y + BULLET_HEIGHT > e.y
            ) {
              // hit enemy
              enemiesRef.current = enemiesRef.current.filter((en) => en !== e);
              bulletsRef.current = bulletsRef.current.filter((bl) => bl !== b);
              updateScore(scoreKey, 100);
              playSound?.("/sounds/explosion.mp3");
            }
          });
        } else {
          // enemy bullet vs player
          if (
            b.x < planeX + PLANE_WIDTH &&
            b.x + BULLET_WIDTH > planeX &&
            b.y < CANVAS_HEIGHT - PLANE_HEIGHT - 10 + PLANE_HEIGHT &&
            b.y + BULLET_HEIGHT > CANVAS_HEIGHT - PLANE_HEIGHT - 10
          ) {
            setGameOver(true);
            setFinalScore(getScore());
            toast.error(`💥 You got shot! Final Score: ${getScore()}`);
            playSound?.("/sounds/crash.mp3");
          }
        }
      });

      if (!gameOver) updateScore(scoreKey, 1);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [planeX, gameOver, updateScore, playSound]);

  const resetGame = () => {
    enemiesRef.current = [];
    bulletsRef.current = [];
    setPlaneX(CANVAS_WIDTH / 2 - PLANE_WIDTH / 2);
    setGameOver(false);
    setFinalScore(0);
    toast("Game restarted! 🛩️");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Plane Simulator</h1>

      <p className="text-lg mb-2">Score: {gameOver ? finalScore : getScore()}</p>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border bg-white shadow touch-none"
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
        Use Left/Right arrows (desktop) or swipe/drag (mobile) to move. Plane fires automatically. 🚀
      </p>
    </div>
  );
}
