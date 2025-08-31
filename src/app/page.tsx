// "use client";

// import Link from "next/link";

// const games = [
//   { name: "Tic-Tac-Toe", path: "/games/tic-tac-toe", emoji: "❌⭕" },
//   { name: "Memory Match", path: "/games/memory-match", emoji: "🧠" },
//   { name: "Coloring Book", path: "/games/coloring-book", emoji: "🎨" },
//   { name: "Jigsaw Puzzle", path: "/games/jigsaw-puzzle", emoji: "🧩" },
//   { name: "Number Quiz", path: "/games/number-quiz", emoji: "🔢" },
//   { name: "Typing Game", path: "/games/typing-game", emoji: "⌨️" },
//   { name: "Maze Run", path: "/games/maze-run", emoji: "🌀" },
//   { name: "Whack-a-Mole", path: "/games/whack-a-mole", emoji: "🔨" },
//   { name: "Rock Paper Scissors", path: "/games/rock-paper-scissors", emoji: "✊✋✌️" },
//   { name: "Balloon Pop", path: "/games/balloon-pop", emoji: "🎈" },
//   {name: "Plane Simulator", path: "/games/plane-simulator", emoji: "🌀"},
// ];

// export default function Home() {
//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-5xl font-bold text-center mb-6 text-pink-400 drop-shadow-lg">
//         🎉 Fun Mini Games 🎉
//       </h1>
//       <p className="text-center text-gray-300 mb-10 text-lg">
//         10 quick and fun games for kids (ages 5–10).  
//         Play, learn, and enjoy — no login required!
//       </p>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {games.map((game) => (
//           <Link
//             key={game.name}
//             href={game.path}
//             className="bg-gradient-to-br from-pink-500/90 to-purple-600/90 shadow-xl rounded-2xl p-6 text-center hover:scale-110 hover:rotate-1 transition-transform duration-300 border border-pink-300"
//           >
//             <div className="text-5xl mb-3">{game.emoji}</div>
//             <div className="text-lg font-semibold text-white">{game.name}</div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";

const games = [
  { name: "Tic-Tac-Toe", emoji: "❌⭕", path: "/games/tic-tac-toe" },
  { name: "Memory Match", emoji: "🧠", path: "/games/memory-match" },
  { name: "Coloring Book", emoji: "🎨", path: "/games/coloring-book" },
  { name: "Jigsaw Puzzle", emoji: "🧩", path: "/games/jigsaw-puzzle" },
  { name: "Number Quiz", emoji: "🔢", path: "/games/number-quiz" },
  { name: "Typing Game", emoji: "⌨️", path: "/games/typing-game" },
  { name: "Maze Run", emoji: "🌀", path: "/games/maze-run" },
  { name: "Whack-a-Mole", emoji: "🔨", path: "/games/whack-a-mole" },
  { name: "Rock Paper Scissors", emoji: "✊✋✌️", path: "/games/rock-paper-scissors" },
  { name: "Balloon Pop", emoji: "🎈", path: "/games/balloon-pop" },
  { name: "Plane Simulator", emoji: "✈️", path: "/games/plane-simulator" },
];

export default function GamesLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold my-8 text-pink-400">Choose a Game 🎮</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 p-6 w-full max-w-6xl">
        {games.map((game) => (
          <Link
            key={game.name}
            href={game.path}
            className="flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg 
                       bg-gradient-to-br from-purple-700 to-purple-900 
                       hover:scale-105 transition-transform duration-300"
          >
            <span className="text-5xl mb-4">{game.emoji}</span>
            <span className="text-lg font-semibold text-center">{game.name}</span>
          </Link>
        ))}
      </div>

      
    </div>
  );
}






