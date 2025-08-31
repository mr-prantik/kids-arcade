"use client";

import React, { useState, useEffect } from "react";
import { useSound } from "@/providers/SoundProvider";

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [mode, setMode] = useState<"pvp" | "computer">("pvp");
  const { playSound } = useSound();

  const calculateWinner = (squares: (string | null)[]) => {
    for (const [a, b, c] of winningCombos) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);

    const w = calculateWinner(newBoard);
    if (w) {
      setWinner(w);
      playSound("/sounds/success.mp3");
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  // --- Computer move ---
  useEffect(() => {
    if (mode === "computer" && !xIsNext && !winner) {
      const emptyIndices = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((v) => v !== null) as number[];

      if (emptyIndices.length > 0) {
        const randomIndex =
          emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        const newBoard = [...board];
        newBoard[randomIndex] = "O";
        setTimeout(() => {
          setBoard(newBoard);

          const w = calculateWinner(newBoard);
          if (w) {
            setWinner(w);
            playSound("/sounds/success.mp3");
          } else {
            setXIsNext(true);
          }
        }, 600); // little delay so it feels natural
      }
    }
  }, [xIsNext, board, winner, mode, playSound]);

  const renderSquare = (i: number) => (
    <button
      key={i}
      onClick={() => handleClick(i)}
      className="w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-4xl font-bold transition-colors duration-300 hover:bg-gray-700"
    >
      <span
        className={
          board[i] === "X"
            ? "text-sky-400"
            : board[i] === "O"
            ? "text-pink-400"
            : "text-white"
        }
      >
        {board[i]}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold text-white">Tic Tac Toe</h1>

      {/* Mode selector */}
      <div className="space-x-2">
        <button
          onClick={() => {
            setMode("pvp");
            resetGame();
          }}
          className={`px-4 py-2 rounded ${
            mode === "pvp" ? "bg-sky-500" : "bg-gray-700"
          }`}
        >
          2 Players
        </button>
        <button
          onClick={() => {
            setMode("computer");
            resetGame();
          }}
          className={`px-4 py-2 rounded ${
            mode === "computer" ? "bg-sky-500" : "bg-gray-700"
          }`}
        >
          Vs Computer
        </button>
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((_, i) => renderSquare(i))}
      </div>

      {/* Status */}
      <div className="text-white">
        {winner
          ? `Winner: ${winner}`
          : board.every((s) => s !== null)
          ? "It's a draw!"
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </div>

      {/* Reset button */}
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
