// import GameCard from "./GameCard";
// import {
//   Gamepad2,
//   Brain,
//   Palette,
//   Puzzle,
//   Calculator,
//   Keyboard,
//   MoveRight,
//   MousePointerClick,
//   Hand,
//   PartyPopper, // ✅ instead of Balloon
// } from "lucide-react";

// const games = [
//   { title: "Tic Tac Toe", desc: "Play Xs and Os", href: "/games/tic-tac-toe", icon: <Gamepad2 /> },
//   { title: "Memory Match", desc: "Find the pairs", href: "/games/memory-match", icon: <Brain /> },
//   { title: "Coloring Book", desc: "Fill with colors", href: "/games/coloring-book", icon: <Palette /> },
//   { title: "Jigsaw Puzzle", desc: "Complete the puzzle", href: "/games/jigsaw-puzzle", icon: <Puzzle /> },
//   { title: "Number Quiz", desc: "Math problems", href: "/games/number-quiz", icon: <Calculator /> },
//   { title: "Typing Game", desc: "Type fast!", href: "/games/typing-game", icon: <Keyboard /> },
//   { title: "Maze Run", desc: "Find the exit", href: "/games/maze-run", icon: <MoveRight /> },
//   { title: "Whack-a-Mole", desc: "Click fast!", href: "/games/whack-a-mole", icon: <MousePointerClick /> },
//   { title: "Rock Paper Scissors", desc: "Beat the computer", href: "/games/rps", icon: <Hand /> },
//   { title: "Balloon Pop", desc: "Pop before they fly!", href: "/games/balloon-pop", icon: <PartyPopper /> }, // 🎈
// ];

// export default function GameGrid() {
//   return (
//     <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       {games.map((g) => (
//         <GameCard
//           key={g.href}
//           title={g.title}
//           description={g.desc}
//           href={g.href}
//           icon={g.icon}
//         />
//       ))}
//     </div>
//   );
// }

import GameCard from "./GameCard";
import {
  CircleDot,
  Brain,
  Palette,
  Puzzle,
  Calculator,
  Keyboard,
  Map,
  Hammer,
  Hand,
  PartyPopper,
} from "lucide-react";


const games = [
  { title: "Tic Tac Toe", desc: "Play Xs and Os", href: "/games/tic-tac-toe", icon: <CircleDot /> },
  { title: "Memory Match", desc: "Find the pairs", href: "/games/memory-match", icon: <Brain /> },
  { title: "Coloring Book", desc: "Fill with colors", href: "/games/coloring-book", icon: <Palette /> },
  { title: "Jigsaw Puzzle", desc: "Complete the puzzle", href: "/games/jigsaw-puzzle", icon: <Puzzle /> },
  { title: "Number Quiz", desc: "Math problems", href: "/games/number-quiz", icon: <Calculator /> },
  { title: "Typing Game", desc: "Type fast!", href: "/games/typing-game", icon: <Keyboard /> },
  { title: "Maze Run", desc: "Find the exit", href: "/games/maze-run", icon: <Map /> },
  { title: "Whack-a-Mole", desc: "Click fast!", href: "/games/whack-a-mole", icon: <Hammer /> },
  { title: "Rock Paper Scissors", desc: "Beat the computer", href: "/games/rps", icon: <Hand /> },
  { title: "Balloon Pop", desc: "Pop before they fly!", href: "/games/balloon-pop", icon: <PartyPopper /> },
];

export default function GameGrid() {
  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map((g) => (
        <GameCard
          key={g.href}
          title={g.title}
          description={g.desc}
          href={g.href}
          icon={g.icon}
        />
      ))}
    </div>
  );
}