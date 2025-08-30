import dynamic from "next/dynamic";
import MuteButton from "@/components/MuteButton";
import ColoringBook from "@/components/games/ColoringBook";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-purple-700">Coloring Book</h1>
          <div className="flex items-center gap-3">
            <MuteButton />
          </div>
        </div>

        <ColoringBook />
      </div>
    </main>
  );
}
