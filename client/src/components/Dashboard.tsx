"use client"

import Promote from "@/components/Promote"
import Board from "@/components/Board"
import GameControls from "@/components/gameControls"
import { useChessContext } from "@/hooks/ChessContext"
import type { Dispatch, SetStateAction } from "react"

function Dashboard({ setIsPlaying }: { setIsPlaying: Dispatch<SetStateAction<boolean>> }) {
  const { isPromoting, board, roleRef } = useChessContext()

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Medieval battlefield header */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-[var(--primary-foreground)] mb-2 tracking-wider flex items-center justify-center gap-3">
          ⚔️ THE ROYAL BATTLEFIELD ⚔️
        </h2>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto" />
      </div>

      {/* Main horizontal layout: Game Panel (Left) + Board (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Panel - Game Controls & Status */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <GameControls setIsPlaying={setIsPlaying} isInDashboard={true} />
        </div>

        {/* Right Panel - Chess Board */}
        <div className="flex flex-col items-center justify-center relative flex-grow">
          {roleRef.current !== null && (
            <>
              {/* Promotion modal overlay */}
              {isPromoting && <Promote />}

              {/* Chess board - only render when board data is ready */}
              {board && board.length === 64 && (
                <div className="relative">
                  {/* Medieval decorative elements around the board */}
                  <div className="absolute -top-8 -left-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
                    🗡️
                  </div>
                  <div className="absolute -top-8 -right-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
                    🛡️
                  </div>
                  <div className="absolute -bottom-8 -left-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
                    ⚔️
                  </div>
                  <div className="absolute -bottom-8 -right-8 text-2xl text-[var(--accent)] opacity-30 animate-pulse">
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
      <div className="mt-8 text-center max-w-4xl mx-auto">
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
