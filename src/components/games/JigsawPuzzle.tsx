// "use client";

// import React, { useState, useEffect } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// type PieceProps = {
//   id: number;
//   index: number;
//   image: string;
//   size: number;
//   gridSize: number;
//   movePiece: (from: number, to: number) => void;
// };

// // Draggable Puzzle Piece
// function Piece({ id, index, image, size, gridSize, movePiece }: PieceProps) {
//   const [{ isDragging }, drag] = useDrag(
//     () => ({
//       type: "PIECE",
//       item: { index },
//       collect: (monitor) => ({
//         isDragging: monitor.isDragging(),
//       }),
//     }),
//     [index]
//   );

//   const [, drop] = useDrop(
//     () => ({
//       accept: "PIECE",
//       drop: (item: { index: number }) => {
//         movePiece(item.index, index);
//       },
//     }),
//     [index, movePiece]
//   );

//   const x = (id % gridSize) * size;
//   const y = Math.floor(id / gridSize) * size;

//   return (
//     <div
//       ref={(node) => drag(drop(node))}
//       className="border border-gray-300"
//       style={{
//         width: size,
//         height: size,
//         backgroundImage: `url(${image})`,
//         backgroundSize: `${gridSize * size}px ${gridSize * size}px`,
//         backgroundPosition: `-${x}px -${y}px`,
//         opacity: isDragging ? 0.5 : 1,
//         cursor: "grab",
//       }}
//     />
//   );
// }

// export default function JigsawPuzzle() {
//   const [gridSize, setGridSize] = useState(2);
//   const [pieces, setPieces] = useState<number[]>([]);
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const pieceSize = 100;

//   // Shuffle utility
//   const shuffle = (array: number[]) =>
//     [...array].sort(() => Math.random() - 0.5);

//   // Fetch random image from Pixabay
//   const fetchImage = async () => {
//     try {
//       const res = await fetch(
//         `https://pixabay.com/api/?key=${
//           process.env.NEXT_PUBLIC_PIXABAY_KEY
//         }&q=cartoon+animal&image_type=illustration&safesearch=true&per_page=50`
//       );
//       const data = await res.json();
//       if (data.hits?.length) {
//         const randomImg =
//           data.hits[Math.floor(Math.random() * data.hits.length)].webformatURL;
//         setImageUrl(randomImg);
//       } else {
//         toast.error("No puzzle images found.");
//       }
//     } catch (e) {
//       toast.error("Error fetching puzzle image.");
//     }
//   };

//   // Reset game with new shuffled pieces
//   const resetGame = () => {
//     const total = gridSize * gridSize;
//     setPieces(shuffle([...Array(total).keys()]));
//     fetchImage();
//   };

//   // On mount or grid change → reset
//   useEffect(() => {
//     resetGame();
//   }, [gridSize]);

//   // Move piece handler
//   const movePiece = (from: number, to: number) => {
//     const updated = [...pieces];
//     [updated[from], updated[to]] = [updated[to], updated[from]];
//     setPieces(updated);
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4 p-4">
//       <h1 className="text-2xl font-bold">Jigsaw Puzzle</h1>

//       {/* Controls */}
//       <div className="flex gap-2">
//         <Button onClick={() => setGridSize(2)}>2×2</Button>
//         <Button onClick={() => setGridSize(3)}>3×3</Button>
//         <Button onClick={() => setGridSize(4)}>4×4</Button>
//         <Button onClick={resetGame}>🔄 New Puzzle</Button>
//       </div>

//       {/* Puzzle Board */}
//       <DndProvider backend={HTML5Backend}>
//         <div
//           className="grid gap-1"
//           style={{
//             gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
//           }}
//         >
//           {pieces.map((id, idx) => (
//             <Piece
//               key={idx}
//               id={id}
//               index={idx}
//               image={imageUrl}
//               size={pieceSize}
//               gridSize={gridSize}
//               movePiece={movePiece}
//             />
//           ))}
//         </div>
//       </DndProvider>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PieceProps = {
  id: number;
  index: number;
  image: string;
  size: number;
  gridSize: number;
  movePiece: (from: number, to: number) => void;
};

// Draggable Puzzle Piece
function Piece({ id, index, image, size, gridSize, movePiece }: PieceProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "PIECE",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "PIECE",
      drop: (item: { index: number }) => {
        movePiece(item.index, index);
      },
    }),
    [index, movePiece]
  );

  // ✅ Correct way: chain drag + drop on the same ref
  drag(drop(ref));

  const x = (id % gridSize) * size;
  const y = Math.floor(id / gridSize) * size;

  return (
    <div
      ref={ref}
      className="border border-gray-300"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${image})`,
        backgroundSize: `${gridSize * size}px ${gridSize * size}px`,
        backgroundPosition: `-${x}px -${y}px`,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    />
  );
}

export default function JigsawPuzzle() {
  const [gridSize, setGridSize] = useState(2);
  const [pieces, setPieces] = useState<number[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const pieceSize = 100;

  // Shuffle utility
  const shuffle = (array: number[]) =>
    [...array].sort(() => Math.random() - 0.5);

  // Fetch random image from Pixabay
  const fetchImage = async () => {
    try {
      const res = await fetch(
        `https://pixabay.com/api/?key=${
          process.env.PUBLIC_PIXABAY
        }&q=cartoon+animal&image_type=illustration&safesearch=true&per_page=50`
      );
      const data = await res.json();
      if (data.hits?.length) {
        const randomImg =
          data.hits[Math.floor(Math.random() * data.hits.length)].webformatURL;
        setImageUrl(randomImg);
      } else {
        toast.error("No puzzle images found.");
      }
    } catch (e) {
      toast.error("Error fetching puzzle image.");
    }
  };

  // Reset game with new shuffled pieces
  const resetGame = () => {
    const total = gridSize * gridSize;
    setPieces(shuffle([...Array(total).keys()]));
    fetchImage();
  };

  // On mount or grid change → reset
  useEffect(() => {
    resetGame();
  }, [gridSize]);

  // Move piece handler
  const movePiece = (from: number, to: number) => {
    const updated = [...pieces];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    setPieces(updated);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Jigsaw Puzzle</h1>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={() => setGridSize(2)}>2×2</Button>
        <Button onClick={() => setGridSize(3)}>3×3</Button>
        <Button onClick={() => setGridSize(4)}>4×4</Button>
        <Button onClick={resetGame}>🔄 New Puzzle</Button>
      </div>

      {/* Puzzle Board */}
      <DndProvider backend={HTML5Backend}>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
          }}
        >
          {pieces.map((id, idx) => (
            <Piece
              key={idx}
              id={id}
              index={idx}
              image={imageUrl}
              size={pieceSize}
              gridSize={gridSize}
              movePiece={movePiece}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
}
