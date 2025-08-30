import GameGrid from "@/components/GameGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
      <h1 className="p-6 text-center text-4xl font-extrabold text-purple-700">
        Kids Mini-Games 🎮
      </h1>
      <GameGrid />
    </main>
  );
}
