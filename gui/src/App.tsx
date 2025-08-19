"use client"

import { useState } from "react"
import GameControls from "./components/gameControls"
import Dashboard from "./components/Dashboard"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  return (
    <div className="min-h-screen p-2 sm:p-4 relative">
      {/* Medieval decorative border with new colors */}
      <div className="absolute inset-2 sm:inset-4 border-2 border-[var(--border)] rounded-lg opacity-40 pointer-events-none shadow-[var(--shadow-soft)]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 sm:mb-8 text-center animate-in fade-in duration-1000">
          <h1 className="mb-2 sm:mb-4 text-4xl sm:text-6xl mobile-title font-bold text-[var(--foreground)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider">
            ⚔️ KINGSLAYER ⚔️
          </h1>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto rounded-full shadow-[var(--shadow-glow)]" />
        </div>

        {!isPlaying && (
          <div className="mb-6 sm:mb-12 max-w-3xl text-center bg-gradient-to-br from-[var(--card)] via-[var(--muted)] to-[var(--card)] bg-opacity-90 p-4 sm:p-8 rounded-xl border-2 border-[var(--border)] backdrop-blur-sm shadow-[var(--shadow-medium)] animate-in slide-in-from-bottom-5 duration-1000 delay-300 mx-2">
            <div className="mb-4 sm:mb-6">
              <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl mobile-subtitle text-[var(--accent)] font-semibold tracking-wide">
                Hail and Well Met, Noble Challenger!
              </h2>
              <div className="h-px w-16 sm:w-24 bg-[var(--accent)] mx-auto mb-4 sm:mb-6 shadow-[var(--shadow-glow)]" />
            </div>

            <div className="space-y-4 sm:space-y-6 text-[var(--card-foreground)]">
              <p className="text-lg sm:text-xl mobile-text leading-relaxed italic">
                Welcome to the grand halls of <span className="text-[var(--accent)] font-semibold">Kingslayer</span>,
                where minds clash like steel upon steel, and only the wisest strategist shall claim victory.
              </p>

              <p className="text-base sm:text-lg mobile-text leading-relaxed">
                Though this humble interface may appear modest to thine eyes, know that beneath lies a formidable chess
                engine—forged in the depths of the server realm, ever-growing in cunning and might.
              </p>

              <p className="text-base sm:text-lg mobile-text leading-relaxed font-medium text-[var(--accent)]">
                Steel thy resolve, sharpen thy wit, and prepare for battle most glorious!
              </p>
            </div>

            <div className="flex justify-center items-center mt-6 sm:mt-8 space-x-2 sm:space-x-4">
              <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <span className="text-xl sm:text-2xl text-[var(--accent)] animate-pulse">♔</span>
              <div className="w-12 sm:w-16 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
              <span className="text-xl sm:text-2xl text-[var(--accent)] animate-pulse delay-500">⚔️</span>
              <div className="w-12 sm:w-16 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
              <span className="text-xl sm:text-2xl text-[var(--accent)] animate-pulse delay-1000">♚</span>
              <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>
          </div>
        )}

        {/* Game controls */}
        {!isPlaying && <GameControls setIsPlaying={setIsPlaying} />}

        {/* Dashboard */}
        {isPlaying && <Dashboard setIsPlaying={setIsPlaying} />}
      </div>

      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-2xl sm:text-4xl text-[var(--accent)] opacity-30 pointer-events-none animate-pulse">
        ♜
      </div>
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 text-2xl sm:text-4xl text-[var(--accent)] opacity-30 pointer-events-none animate-pulse delay-1000">
        ♖
      </div>
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-2xl sm:text-4xl text-[var(--accent)] opacity-30 pointer-events-none animate-pulse delay-500">
        ♞
      </div>
      <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-2xl sm:text-4xl text-[var(--accent)] opacity-30 pointer-events-none animate-pulse delay-1500">
        ♘
      </div>
    </div>
  )
}
