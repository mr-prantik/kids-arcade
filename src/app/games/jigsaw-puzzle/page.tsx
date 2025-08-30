"use client";

import JigsawPuzzle from "@/components/games/JigsawPuzzle";

export default function JigsawPuzzlePage() {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">🧩 Jigsaw Puzzle</h1>
      <JigsawPuzzle />
    </div>
  );
}
