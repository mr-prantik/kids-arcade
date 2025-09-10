"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
//import arcadeAnimation from "@/assets/animations/arcade.json"; 
import loadingAnimation from "@/assets/animations/loading.json"; 
import arcadeAnimation from "@/assets/animations/gamingGeneracional.json"; 


const games = [
  { name: "Memory Match", emoji: "🧠", path: "/games/memory-match" },
  { name: "Jigsaw Puzzle", emoji: "🧩", path: "/games/jigsaw-puzzle" },
  { name: "Whack-a-Mole", emoji: "🔨", path: "/games/whack-a-mole" },
  { name: "Balloon Pop", emoji: "🎈", path: "/games/balloon-pop" },
  { name: "Plane Simulator", emoji: "✈️", path: "/games/plane-simulator" },
  { name: "Platformer", emoji: "⌨️", path: "/games/platformer" },
  { name: "Fruit-Ninja", emoji: "🍉", path: "/games/fruit-ninja" },
];

export default function GamesLanding() {
  const [loading, setLoading] = useState(true);

  // Simulate loading time (or trigger once data is ready)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black">
        <Lottie
          animationData={loadingAnimation}
          loop
          autoplay
          className="w-48 h-48"
        />
        <p className="text-white text-lg mt-4 animate-pulse">
          Loading fun games...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black text-white flex flex-col items-center overflow-hidden">
      {/* Animated background glow orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl font-extrabold my-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-yellow-300"
      >
        🎮 Kids Arcade
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="text-lg text-gray-300 mb-10 px-4 text-center max-w-2xl"
      >
        Choose your favorite game and start playing! Fun challenges await 🚀
      </motion.p>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 p-6 w-full max-w-6xl">
        {games.map((game, index) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link
              href={game.path}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg 
                         bg-gradient-to-br from-purple-700 to-purple-900 
                         hover:scale-110 hover:shadow-pink-500/50 
                         transition-transform duration-300"
            >
              {/* Floating Emoji */}
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300"
              >
                {game.emoji}
              </motion.span>
              <span className="text-lg font-semibold text-center">{game.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 🎬 Lottie Animation Bottom Right */}
      <div className="absolute bottom-4 right-4 w-36 h-36 pointer-events-none">
        <Lottie animationData={arcadeAnimation} loop autoplay />
      </div>
    </div>
  );
}

