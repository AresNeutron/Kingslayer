import Promote from "./Promote"
import Board from "./Board"
import GameControls from "./gameControls"
import type { Dispatch, SetStateAction } from "react"
import { useChessContext } from "../hooks/useChessContext"

function Dashboard({
  setIsPlaying,
}: {
  setIsPlaying: Dispatch<SetStateAction<boolean>>
}) {
  const { isPromoting, board, roleRef } = useChessContext()

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Medieval battlefield header */}
      <div className="mb-6 text-center animate-in fade-in duration-1000">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2 tracking-wider flex items-center justify-center gap-3">
          ⚔️ THE ROYAL BATTLEFIELD ⚔️
        </h2>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto shadow-[var(--shadow-glow)]" />
      </div>

      {/* Main horizontal layout: Game Panel (Left) + Board (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Panel - Game Controls & Status */}
        <div className="w-full lg:w-96 flex-shrink-0 animate-in slide-in-from-left-5 duration-1000 delay-300">
          <GameControls setIsPlaying={setIsPlaying} isInDashboard={true} />
        </div>

        {/* Right Panel - Chess Board */}
        <div className="flex flex-col items-center justify-center relative flex-grow animate-in slide-in-from-right-5 duration-1000 delay-500">
          {roleRef.current !== null && (
            <>
              {/* Promotion modal overlay */}
              {isPromoting && <Promote />}

              {/* Chess board - only render when board data is ready */}
              {board && board.length === 64 && (
                <div className="relative">
                  {/* Medieval decorative elements around the board */}
                  <div className="absolute -top-8 -left-8 text-2xl text-[var(--accent)] opacity-40 animate-pulse">
                    🗡️
                  </div>
                  <div className="absolute -top-8 -right-8 text-2xl text-[var(--accent)] opacity-40 animate-pulse delay-500">
                    🛡️
                  </div>
                  <div className="absolute -bottom-8 -left-8 text-2xl text-[var(--accent)] opacity-40 animate-pulse delay-1000">
                    ⚔️
                  </div>
                  <div className="absolute -bottom-8 -right-8 text-2xl text-[var(--accent)] opacity-40 animate-pulse delay-1500">
                    🏰
                  </div>

                  {/* The chess board */}
                  <Board />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Medieval footer with battle lore */}
      <div className="mt-8 text-center max-w-4xl mx-auto animate-in slide-in-from-bottom-5 duration-1000 delay-700">
        <div className="bg-gradient-to-r from-[var(--card)] via-[var(--muted)] to-[var(--card)] p-4 rounded-lg border border-[var(--border)] shadow-[var(--shadow-soft)] opacity-90">
          <p className="text-sm text-[var(--card-foreground)] italic">
            "In the realm of Kingslayer, every move echoes through the halls of eternity. Strategy and valor shall
            determine the victor of this noble contest."
          </p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <div className="w-6 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
            <span className="text-[var(--accent)] animate-pulse">♔</span>
            <div className="w-6 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
