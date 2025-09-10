"use client";

import FruitNinja from "@/components/games/FruitNinja";

export default function FruitNinjaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-700 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 drop-shadow-lg">
        🍉 Fruit Ninja 🍌
      </h1>
      <p className="mb-6 text-lg opacity-80">Swipe through fruits to cut them down!</p>

      <div className="w-full max-w-4xl aspect-video border-4 border-yellow-400 rounded-xl shadow-xl overflow-hidden">
        <FruitNinja />
      </div>
    </div>
  );
}
