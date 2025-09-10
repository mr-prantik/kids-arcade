"use client";

import React from "react";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white z-50">
      <h1 className="text-4xl font-bold mb-4">Game Over 💀</h1>
      <p className="text-2xl mb-6">Final Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-lg rounded-xl shadow-lg transition-transform transform hover:scale-105"
      >
        Restart 🔄
      </button>
    </div>
  );
};

export default GameOverScreen;
