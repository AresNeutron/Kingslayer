"use client"

import Promote from "@/components/Promote"
import Board from "@/components/Board"
import { useChessContext } from "@/hooks/ChessContext"

function Dashboard() {
  const { isPromoting, board, roleRef } = useChessContext()

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      {/* Medieval battlefield header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-[var(--primary-foreground)] mb-2 tracking-wider flex items-center justify-center gap-3">
          ⚔️ THE BATTLEFIELD ⚔️
        </h2>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto" />
      </div>

      {/* Main game area - centered and compact */}
      <div className="flex flex-col items-center justify-center relative">
        {roleRef.current !== null && (
          <>
            {/* Promotion modal overlay */}
            {isPromoting && <Promote />}

            {/* Chess board - only render when board data is ready */}
            {board && board.length === 64 && (
              <div className="relative">
                {/* Medieval battle status indicator */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-[var(--secondary)] to-[var(--muted)] px-4 py-2 rounded-full border border-[var(--border)] shadow-lg">
                    <span className="text-sm font-semibold text-[var(--primary-foreground)] flex items-center gap-2">
                      🏰 <span>Battle in Progress</span> ⚔️
                    </span>
                  </div>
                </div>

                {/* The chess board */}
                <Board />

                {/* Medieval decorative elements around the board */}
                <div className="absolute -top-8 -left-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">🗡️</div>
                <div className="absolute -top-8 -right-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">🛡️</div>
                <div className="absolute -bottom-8 -left-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
                  ⚔️
                </div>
                <div className="absolute -bottom-8 -right-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
                  🏰
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Medieval footer with battle statistics or lore */}
      <div className="mt-8 text-center max-w-2xl">
        <div className="bg-gradient-to-r from-[var(--secondary)] via-[var(--muted)] to-[var(--secondary)] p-4 rounded-lg border border-[var(--border)] shadow-lg opacity-80">
          <p className="text-sm text-[var(--secondary-foreground)] italic">
            "In the realm of Kingslayer, every move echoes through the halls of eternity. Strategy and valor shall
            determine the victor of this noble contest."
          </p>
          <div className="flex justify-center items-center mt-2 space-x-2">
            <div className="w-6 h-px bg-[var(--accent)]" />
            <span className="text-[var(--accent)]">♔</span>
            <div className="w-6 h-px bg-[var(--accent)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
