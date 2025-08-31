// "use client";

// import React, { useEffect, useState } from "react";
// import { useSessionState } from "@/providers/SessionStateProvider";
// import { useSound } from "@/providers/SoundProvider";
// import { toast } from "sonner";
// import { RefreshCw, Cpu, Users } from "lucide-react";

// const LINES: number[][] = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

// export default function TicTacToe() {
//   // session keys for simple per-player score tracking
//   const keyX = "tic-tac-toe-X";
//   const keyO = "tic-tac-toe-O";

//   const { updateScore, games } = useSessionState();
//   const { playSound } = useSound();

//   const [board, setBoard] = useState<string[]>(Array(9).fill(""));
//   const [current, setCurrent] = useState<"X" | "O">("X");
//   const [vsComputer, setVsComputer] = useState(true);
//   const [isOver, setIsOver] = useState(false);
//   const [winner, setWinner] = useState<null | "X" | "O" | "draw">(null);
//   const [thinking, setThinking] = useState(false);

//   const calcWinner = (b: string[]) => {
//     for (const [a, bb, c] of LINES) {
//       if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a] as "X" | "O";
//     }
//     if (b.every(Boolean)) return "draw";
//     return null;
//   };

//   const finish = (w: "X" | "O" | "draw") => {
//     setIsOver(true);
//     setWinner(w);
//     if (w === "draw") {
//       toast("It's a draw!");
//       playSound?.("/sounds/draw.mp3");
//     } else {
//       toast.success(`${w} wins!`);
//       playSound?.("/sounds/win.mp3");
//       // update score per player key
//       updateScore(w === "X" ? keyX : keyO, 1);
//     }
//   };

//   const handleClick = (i: number) => {
//     if (isOver || board[i] !== "") return;
//     if (vsComputer && current === "O") return; // wait for computer

//     const nb = [...board];
//     nb[i] = current;
//     setBoard(nb);
//     playSound?.("/sounds/click.mp3");

//     const w = calcWinner(nb);
//     if (w) finish(w);
//     else setCurrent(current === "X" ? "O" : "X");
//   };

//   const reset = () => {
//     setBoard(Array(9).fill(""));
//     setCurrent("X");
//     setIsOver(false);
//     setWinner(null);
//   };

//   const findBestMove = (b: string[], comp = "O", human = "X") => {
//     // win
//     for (let i = 0; i < 9; i++) {
//       if (!b[i]) {
//         const t = [...b];
//         t[i] = comp;
//         if (calcWinner(t) === comp) return i;
//       }
//     }
//     // block
//     for (let i = 0; i < 9; i++) {
//       if (!b[i]) {
//         const t = [...b];
//         t[i] = human;
//         if (calcWinner(t) === human) return i;
//       }
//     }
//     // center
//     if (!b[4]) return 4;
//     // corners
//     const corners = [0, 2, 6, 8].filter((i) => !b[i]);
//     if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
//     // sides
//     const sides = [1, 3, 5, 7].filter((i) => !b[i]);
//     if (sides.length) return sides[Math.floor(Math.random() * sides.length)];
//     return -1;
//   };

//   // COMPUTER AUTOMATION
//   useEffect(() => {
//     if (!vsComputer || isOver) return;
//     if (current === "O") {
//       setThinking(true);
//       const t = setTimeout(() => {
//         const move = findBestMove(board, "O", "X");
//         let chosen = move;
//         if (move === -1) {
//           const empties = board.map((v, i) => (v ? null : i)).filter((n) => n !== null) as number[];
//           if (empties.length) chosen = empties[Math.floor(Math.random() * empties.length)];
//           else return;
//         }

//         const nb = [...board];
//         nb[chosen] = "O";
//         playSound?.("/sounds/click.mp3");
//         setBoard(nb);

//         const w = calcWinner(nb);
//         if (w) finish(w);
//         else setCurrent("X"); // player turn

//         setThinking(false);
//       }, 450);
//       return () => clearTimeout(t);
//     }
//   }, [current, vsComputer, isOver, board, playSound]);

//   // Score values from session store (may be undefined)
//   const scoreX = games[keyX]?.score ?? 0;
//   const scoreO = games[keyO]?.score ?? 0;

//   return (
//     <div className="mx-auto max-w-xl p-6">
//       <div className="mb-4 flex items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">Tic-Tac-Toe</h2>
//           <p className="text-sm text-muted-foreground">Play vs computer or 2 players</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setVsComputer((v) => !v)}
//             className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1 text-sm shadow-sm"
//           >
//             {vsComputer ? <Cpu className="h-4 w-4" /> : <Users className="h-4 w-4" />}
//             {vsComputer ? "Vs Computer" : "2 Players"}
//           </button>

//           <button
//             onClick={reset}
//             className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1 text-sm shadow-sm"
//             title="Reset"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Reset
//           </button>
//         </div>
//       </div>

//       <div className="mb-4 flex items-center justify-between rounded-lg bg-white/60 p-3 shadow">
//         <div className="flex gap-4">
//           <div className="text-sm">
//             <div className="text-xs text-muted-foreground">Player X</div>
//             <div className="font-medium">Score: {scoreX}</div>
//           </div>
//           <div className="text-sm">
//             <div className="text-xs text-muted-foreground">Player O</div>
//             <div className="font-medium">Score: {scoreO}</div>
//           </div>
//         </div>

//         <div className="text-sm">
//           <div className="text-xs text-muted-foreground">Turn</div>
//           <div className="font-semibold">
//             {isOver ? (winner === "draw" ? "Draw" : `${winner} won`) : thinking ? "Thinking…" : current}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-3 rounded-lg bg-gradient-to-b from-white/60 to-white/40 p-4 shadow-inner">
//         {board.map((cell, i) => (
//           <button
//             key={i}
//             onClick={() => handleClick(i)}
//             className={`aspect-square flex items-center justify-center rounded-lg bg-white text-4xl font-bold shadow-md transition hover:scale-105 ${
//               cell ? (cell === "X" ? "text-pink-600" : "text-blue-600") : "text-gray-400"
//             }`}
//           >
//             {cell}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 flex items-center justify-between gap-4 text-sm">
//         <div className="text-muted-foreground">Tip: Click a square to play. X always starts.</div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => {
//               setBoard(Array(9).fill(""));
//               setCurrent("X");
//               setIsOver(false);
//               setWinner(null);
//             }}
//             className="rounded-md bg-violet-600 px-3 py-1 text-white shadow-sm"
//           >
//             New Round
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

//------------------------------------------------------------------------------
// "use client";

// import React, { useState, useEffect } from "react";
// import { useSound } from "@/providers/SoundProvider";

// const winningCombos = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

// const TicTacToe: React.FC = () => {
//   const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
//   const [xIsNext, setXIsNext] = useState(true);
//   const [winner, setWinner] = useState<string | null>(null);
//   const [mode, setMode] = useState<"pvp" | "computer">("pvp");
//   const { playSound } = useSound();

//   const calculateWinner = (squares: (string | null)[]) => {
//     for (let [a, b, c] of winningCombos) {
//       if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//         return squares[a];
//       }
//     }
//     return null;
//   };

//   const handleClick = (i: number) => {
//     if (board[i] || winner) return;

//     const newBoard = [...board];
//     newBoard[i] = xIsNext ? "X" : "O";
//     setBoard(newBoard);

//     const w = calculateWinner(newBoard);
//     if (w) {
//       setWinner(w);
//       playSound("/sounds/success.mp3");
//     } else {
//       setXIsNext(!xIsNext);
//     }
//   };

//   const resetGame = () => {
//     setBoard(Array(9).fill(null));
//     setXIsNext(true);
//     setWinner(null);
//   };

//   // --- Computer move ---
//   useEffect(() => {
//     if (mode === "computer" && !xIsNext && !winner) {
//       const emptyIndices = board
//         .map((val, idx) => (val === null ? idx : null))
//         .filter((v) => v !== null) as number[];

//       if (emptyIndices.length > 0) {
//         const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
//         const newBoard = [...board];
//         newBoard[randomIndex] = "O";
//         setTimeout(() => {
//           setBoard(newBoard);

//           const w = calculateWinner(newBoard);
//           if (w) {
//             setWinner(w);
//             playSound("/sounds/success.mp3");
//           } else {
//             setXIsNext(true);
//           }
//         }, 600); // little delay so it feels natural
//       }
//     }
//   }, [xIsNext, board, winner, mode, playSound]);

//   const renderSquare = (i: number) => (
//     <button
//       key={i}
//       onClick={() => handleClick(i)}
//       className="w-20 h-20 border-2 border-gray-400 flex items-center justify-center text-4xl font-bold transition-colors duration-300 hover:bg-gray-700"
//     >
//       <span
//         className={
//           board[i] === "X"
//             ? "text-sky-400"
//             : board[i] === "O"
//             ? "text-pink-400"
//             : "text-white"
//         }
//       >
//         {board[i]}
//       </span>
//     </button>
//   );

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <h1 className="text-2xl font-bold text-white">Tic Tac Toe</h1>

//       {/* Mode selector */}
//       <div className="space-x-2">
//         <button
//           onClick={() => {
//             setMode("pvp");
//             resetGame();
//           }}
//           className={`px-4 py-2 rounded ${
//             mode === "pvp" ? "bg-sky-500" : "bg-gray-700"
//           }`}
//         >
//           2 Players
//         </button>
//         <button
//           onClick={() => {
//             setMode("computer");
//             resetGame();
//           }}
//           className={`px-4 py-2 rounded ${
//             mode === "computer" ? "bg-sky-500" : "bg-gray-700"
//           }`}
//         >
//           Vs Computer
//         </button>
//       </div>

//       {/* Game grid */}
//       <div className="grid grid-cols-3 gap-2">
//         {board.map((_, i) => renderSquare(i))}
//       </div>

//       {/* Status */}
//       <div className="text-white">
//         {winner
//           ? `Winner: ${winner}`
//           : board.every((s) => s !== null)
//           ? "It's a draw!"
//           : `Next Player: ${xIsNext ? "X" : "O"}`}
//       </div>

//       {/* Reset button */}
//       <button
//         onClick={resetGame}
//         className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600"
//       >
//         Reset Game
//       </button>
//     </div>
//   );
// };

// export default TicTacToe;

//-------------------------------------------------------------------------------------------------------


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
