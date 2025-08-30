"use client";

import { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSound } from "@/providers/SoundProvider";

type Piece = {
  id: number;
  correctPos: number;
  currentPos: number | null; // null = still in bank
  imgX: number;
  imgY: number;
};

const PIECE_SIZE = 100;

const ItemTypes = {
  PIECE: "piece",
};

function PuzzlePiece({
  piece,
  onDropPiece,
}: {
  piece: Piece | null;
  onDropPiece: (pieceId: number) => void;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (dragged: { id: number }) => onDropPiece(dragged.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`border border-gray-300 bg-gray-100 flex items-center justify-center transition-colors ${
        isOver ? "bg-yellow-100" : ""
      }`}
      style={{ width: PIECE_SIZE, height: PIECE_SIZE }}
    >
      {piece && (
        <div
          className="w-full h-full bg-cover"
          style={{
            backgroundImage: "url('/images/puzzle.jpg')", // default fallback
            backgroundPosition: `${piece.imgX}px ${piece.imgY}px`,
            backgroundSize: "cover",
          }}
        />
      )}
    </div>
  );
}

function DraggablePiece({ piece }: { piece: Piece }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id: piece.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="border border-gray-400 bg-gray-200 cursor-grab active:cursor-grabbing"
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: PIECE_SIZE,
        height: PIECE_SIZE,
        backgroundImage: "url('/images/puzzle.jpg')",
        backgroundPosition: `${piece.imgX}px ${piece.imgY}px`,
        backgroundSize: "cover",
      }}
    />
  );
}

export default function JigsawPuzzle() {
  const { playSound } = useSound();
  const [gridSize, setGridSize] = useState(2);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [imageUrl, setImageUrl] = useState("/images/puzzle.jpg");

  // fetch a random online image
  const fetchPuzzleImage = () => {
    // Kids-friendly safe sources (Pixabay, Unsplash with "cartoon"/"animals")
    const urls = [
      "https://picsum.photos/400/400?random=1", // placeholder
      "https://picsum.photos/400/400?random=2",
      "https://picsum.photos/400/400?random=3",
    ];
    const pick = urls[Math.floor(Math.random() * urls.length)];
    setImageUrl(pick);
  };

  useEffect(() => {
    initPuzzle(gridSize);
  }, [gridSize, imageUrl]);

  const initPuzzle = (size: number) => {
    const init: Piece[] = [];
    let id = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        init.push({
          id,
          correctPos: id,
          currentPos: null,
          imgX: -x * (PIECE_SIZE),
          imgY: -y * (PIECE_SIZE),
        });
        id++;
      }
    }
    setPieces(init.sort(() => Math.random() - 0.5));
  };

  const handleDrop = (targetIndex: number, pieceId: number) => {
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, currentPos: targetIndex } : p
      )
    );
    playSound("/sounds/click.mp3");
  };

  const isComplete =
    pieces.length > 0 && pieces.every((p) => p.currentPos === p.correctPos);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center">
        {/* Top Controls */}
        <div className="flex gap-4 mb-4">
          <label className="font-semibold">Grid:</label>
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setGridSize(n)}
              className={`px-3 py-1 rounded ${
                gridSize === n
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {n}×{n}
            </button>
          ))}
          <button
            onClick={fetchPuzzleImage}
            className="ml-4 px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            🔄 New Image
          </button>
        </div>

        {/* Puzzle Grid */}
        <div
          className="grid border-2 border-gray-400 mb-6"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${PIECE_SIZE}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${PIECE_SIZE}px)`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const piece = pieces.find((p) => p.currentPos === idx) || null;
            return (
              <PuzzlePiece
                key={idx}
                piece={piece && { ...piece, imgX: piece.imgX, imgY: piece.imgY }}
                onDropPiece={(pieceId) => handleDrop(idx, pieceId)}
              />
            );
          })}
        </div>

        {/* Piece Bank */}
        <h2 className="font-semibold mb-2">Pieces left:</h2>
        <div className="flex flex-wrap gap-2">
          {pieces
            .filter((p) => p.currentPos === null)
            .map((p) => (
              <DraggablePiece key={p.id} piece={p} />
            ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-4 text-green-600 font-bold text-xl animate-bounce">
            🎉 You solved it!
          </div>
        )}
      </div>
    </DndProvider>
  );
}
