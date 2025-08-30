import TicTacToe from "@/components/games/TicTacToe";
import MuteButton from "@/components/MuteButton";

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-purple-700">Tic-Tac-Toe</h1>
          <div className="flex items-center gap-3">
            <MuteButton />
          </div>
        </div>

        <TicTacToe />
      </div>
    </main>
  );
}
