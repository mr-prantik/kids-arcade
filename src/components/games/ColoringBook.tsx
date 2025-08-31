// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { toast } from "sonner";
// import { useSessionState } from "@/providers/SessionStateProvider";
// import { useSound } from "@/providers/SoundProvider";
// import { Download, Trash2, RefreshCw } from "lucide-react";

// /**
//  * Simple Coloring Book (pixel grid)
//  * - Default grid: cols=12, rows=8 (big tappable cells for kids)
//  * - Palette: array of colors
//  * - Tools: brush (single cell), bucket (flood fill)
//  * - Export PNG: renders a canvas based on the grid and downloads it
//  * - Session key: "coloring-book" => score = number of uniquely filled cells
//  */

// type Cell = string | null; // css color or null (empty)

// const DEFAULT_COLS = 12;
// const DEFAULT_ROWS = 8;

// const PALETTE = [
//   "#FFB6C1", // lightpink
//   "#FFD580", // peach
//   "#A0E7E5", // mint/sea
//   "#B5EAD7", // pale green
//   "#C7CEEA", // light purple
//   "#FF9AA2", // soft coral
//   "#BFD7EA", // soft blue
//   "#FFF5BA", // pale yellow
//   "#FFFFFF", // white (eraser)
// ];

// export default function ColoringBook() {
//   const sessionKey = "coloring-book";
//   const { updateScore, setTime, games } = useSessionState();
//   const { playSound } = useSound();

//   const [cols] = useState(DEFAULT_COLS);
//   const [rows] = useState(DEFAULT_ROWS);

//   // flat array of length cols*rows; index = r*cols + c
//   const initialGrid = useMemo(() => Array<Cell>(cols * rows).fill(null), [cols, rows]);
//   const [grid, setGrid] = useState<Cell[]>(initialGrid);

//   const [activeColor, setActiveColor] = useState<string>(PALETTE[0]);
//   const [tool, setTool] = useState<"brush" | "bucket">("brush");

//   // update session score = number of non-null cells
//   useEffect(() => {
//     const filled = grid.filter(Boolean).length;
//     const prev = games[sessionKey]?.score ?? 0;
//     // set delta based on difference between current filled and previous known
//     // We'll set by replacing with difference so session accumulates over time:
//     // But to keep it simple: updateScore with (filled - prev)
//     updateScore(sessionKey, filled - prev);
//     // Also update time to help other features (not critical)
//     setTime(sessionKey, 0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [grid]);

//   const indexToRC = (idx: number) => [Math.floor(idx / cols), idx % cols] as const;
//   const rcToIndex = (r: number, c: number) => r * cols + c;

//   const applyBrush = (idx: number) => {
//     setGrid((prev) => {
//       const cur = prev[idx];
//       // if same color and not null, consider it unchanged
//       if (cur === activeColor) return prev;
//       const next = [...prev];
//       next[idx] = activeColor === "#FFFFFF" ? null : activeColor; // white acts as eraser -> null
//       return next;
//     });
//     playSound?.("/sounds/click.mp3");
//   };

//   // flood fill (4-directional) from idx, replacing existing color region with activeColor
//   const floodFill = (startIdx: number) => {
//     setGrid((prev) => {
//       const target = prev[startIdx]; // color to replace (can be null)
//       const replacement = activeColor === "#FFFFFF" ? null : activeColor;
//       if (target === replacement) return prev; // nothing to do

//       const next = [...prev];
//       const stack = [startIdx];
//       const visited = new Set<number>();

//       while (stack.length) {
//         const idx = stack.pop()!;
//         if (visited.has(idx)) continue;
//         visited.add(idx);

//         if (next[idx] !== target) continue;
//         next[idx] = replacement;

//         const [r, c] = indexToRC(idx);
//         // neighbors: up, down, left, right
//         if (r > 0) stack.push(rcToIndex(r - 1, c));
//         if (r < rows - 1) stack.push(rcToIndex(r + 1, c));
//         if (c > 0) stack.push(rcToIndex(r, c - 1));
//         if (c < cols - 1) stack.push(rcToIndex(r, c + 1));
//       }

//       return next;
//     });
//     playSound?.("/sounds/click.mp3");
//   };

//   const handleCell = (idx: number) => {
//     if (tool === "brush") applyBrush(idx);
//     else floodFill(idx);
//   };

//   const clearGrid = () => {
//     setGrid(Array(cols * rows).fill(null));
//     playSound?.("/sounds/clear.mp3");
//     toast("Canvas cleared — start a new creation!");
//   };

//   const newCanvas = () => {
//     setGrid(Array(cols * rows).fill(null));
//     playSound?.("/sounds/click.mp3");
//     toast("New canvas ready!");
//   };

//   const exportPNG = async () => {
//     // draw to offscreen canvas and download
//     const scale = 40; // pixels per grid cell (big image)
//     const canvas = document.createElement("canvas");
//     canvas.width = cols * scale;
//     canvas.height = rows * scale;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//       toast.error("Unable to export image");
//       return;
//     }
//     // background white
//     ctx.fillStyle = "#FFFFFF";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // draw each cell
//     for (let r = 0; r < rows; r++) {
//       for (let c = 0; c < cols; c++) {
//         const idx = rcToIndex(r, c);
//         const color = grid[idx];
//         ctx.fillStyle = color ?? "#FFFFFF";
//         ctx.fillRect(c * scale, r * scale, scale, scale);
//       }
//     }

//     // optionally draw grid lines for charm
//     ctx.strokeStyle = "rgba(0,0,0,0.05)";
//     for (let x = 0; x <= canvas.width; x += scale) {
//       ctx.beginPath();
//       ctx.moveTo(x + 0.5, 0);
//       ctx.lineTo(x + 0.5, canvas.height);
//       ctx.stroke();
//     }
//     for (let y = 0; y <= canvas.height; y += scale) {
//       ctx.beginPath();
//       ctx.moveTo(0, y + 0.5);
//       ctx.lineTo(canvas.width, y + 0.5);
//       ctx.stroke();
//     }

//     canvas.toBlob((blob) => {
//       if (!blob) {
//         toast.error("Export failed");
//         return;
//       }
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `coloring-${Date.now()}.png`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);
//       playSound?.("/sounds/export.mp3");
//       toast.success("Exported PNG!");
//     }, "image/png");
//   };

//   const filledCells = grid.filter(Boolean).length;
//   const sessionScore = games[sessionKey]?.score ?? 0;

//   return (
//     <div className="mx-auto max-w-3xl p-6">
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Coloring Book</h2>
//           <p className="text-sm text-muted-foreground">Tap colors then fill the big squares — try the bucket tool for fast fills!</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="rounded-md bg-white/80 px-3 py-1 text-sm shadow-sm text-center">
//             <div className="text-xs text-muted-foreground">Filled</div>
//             <div className="font-medium">{filledCells}/{cols * rows}</div>
//           </div>

//           <div className="rounded-md bg-white/80 px-3 py-1 text-sm shadow-sm text-center">
//             <div className="text-xs text-muted-foreground">Session Score</div>
//             <div className="font-medium">{sessionScore}</div>
//           </div>

//           <button onClick={newCanvas} className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1 text-sm shadow-sm" title="New Canvas">
//             <RefreshCw className="h-4 w-4" />
//             New
//           </button>

//           <button onClick={clearGrid} className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1 text-sm shadow-sm" title="Clear">
//             <Trash2 className="h-4 w-4" />
//             Clear
//           </button>

//           <button onClick={exportPNG} className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1 text-sm shadow-sm" title="Export PNG">
//             <Download className="h-4 w-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="mb-4 flex flex-wrap items-center gap-3">
//         <div className="flex items-center gap-2 rounded-lg bg-white/80 p-2 shadow-sm">
//           <div className="text-xs text-muted-foreground">Tool</div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setTool("brush")}
//               className={`px-3 py-1 rounded-md ${tool === "brush" ? "bg-violet-600 text-white" : "bg-white/80"}`}
//             >
//               Brush
//             </button>
//             <button
//               onClick={() => setTool("bucket")}
//               className={`px-3 py-1 rounded-md ${tool === "bucket" ? "bg-violet-600 text-white" : "bg-white/80"}`}
//             >
//               Bucket
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 rounded-lg bg-white/80 p-2 shadow-sm">
//           <div className="text-xs text-muted-foreground">Palette</div>
//           <div className="flex gap-2">
//             {PALETTE.map((c) => (
//               <button
//                 key={c}
//                 onClick={() => setActiveColor(c)}
//                 className={`h-8 w-8 rounded-lg shadow-sm ring-2 ${activeColor === c ? "ring-offset-2 ring-violet-300" : "ring-white/50"}`}
//                 style={{ backgroundColor: c }}
//                 title={c}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Grid */}
//       <div
//         className="grid gap-1 touch-none select-none rounded-lg p-2"
//         style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
//       >
//         {grid.map((cell, idx) => (
//           <button
//             key={idx}
//             onClick={() => handleCell(idx)}
//             className={`aspect-[4/3] rounded-md border transition-transform focus:outline-none`}
//             style={{
//               backgroundColor: cell ?? "#FFFFFF",
//               borderColor: cell ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.06)",
//             }}
//             aria-label={`pixel-${idx}`}
//           />
//         ))}
//       </div>

//       <div className="mt-4 text-sm text-muted-foreground">
//         Tip: Choose a color then tap squares. Use the bucket tool to fill an area. Export to save your art as PNG.
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useSessionState } from "@/providers/SessionStateProvider";

const ColoringBook = () => {
  const { getScore, setScore, resetScore } = useSessionState();
  const sessionKey = "coloring-book";

  const [grid, setGrid] = useState<boolean[]>(Array(25).fill(false));

  useEffect(() => {
    resetScore(sessionKey);
  }, [resetScore, sessionKey]);

  useEffect(() => {
    const filled = grid.filter(Boolean).length;
    setScore(sessionKey, filled); // ✅ replaces updateScore
  }, [grid, setScore, sessionKey]);

  const fillCell = (i: number) => {
    setGrid((prev) => prev.map((cell, idx) => (idx === i ? true : cell)));
  };

  return (
    <div>
      <h2>Coloring Book</h2>
      <p>Filled: {getScore(sessionKey)}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 40px)",
          gap: "5px",
        }}
      >
        {grid.map((cell, i) => (
          <div
            key={i}
            onClick={() => fillCell(i)}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: cell ? "blue" : "lightgray",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColoringBook;
