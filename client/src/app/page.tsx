"use client"
import Dashboard from "@/components/Dashboard"
import { useState } from "react"
import GameControls from "@/components/gameControls"

export default function Home() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      {/* Medieval decorative border */}
      <div className="absolute inset-4 border-2 border-[var(--border)] rounded-lg opacity-30 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title with medieval styling */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-6xl font-bold text-[var(--primary-foreground)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-wider">
            ⚔️ KINGSLAYER ⚔️
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto rounded-full" />
        </div>

        {!isPlaying && (
          <div className="mb-12 max-w-3xl text-center bg-[var(--secondary)] bg-opacity-40 p-8 rounded-lg border border-[var(--border)] backdrop-blur-sm">
            {/* Medieval welcome message */}
            <div className="mb-6">
              <h2 className="mb-4 text-3xl text-[var(--accent)] font-semibold tracking-wide">
                Hail and Well Met, Noble Challenger!
              </h2>
              <div className="h-px w-24 bg-[var(--accent)] mx-auto mb-6" />
            </div>

            <div className="space-y-6 text-[var(--secondary-foreground)]">
              <p className="text-xl leading-relaxed italic">
                Welcome to the grand halls of <span className="text-[var(--accent)] font-semibold">Kingslayer</span>,
                where minds clash like steel upon steel, and only the wisest strategist shall claim victory.
              </p>

              <p className="text-lg leading-relaxed">
                Though this humble interface may appear modest to thine eyes, know that beneath lies a formidable chess
                engine—forged in the depths of the server realm, ever-growing in cunning and might.
              </p>

              <p className="text-lg leading-relaxed font-medium text-[var(--accent-foreground)]">
                Steel thy resolve, sharpen thy wit, and prepare for battle most glorious!
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <span className="text-2xl text-[var(--accent)]">♔</span>
              <div className="w-16 h-px bg-[var(--accent)]" />
              <span className="text-2xl text-[var(--accent)]">⚔️</span>
              <div className="w-16 h-px bg-[var(--accent)]" />
              <span className="text-2xl text-[var(--accent)]">♚</span>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>
          </div>
        )}

        <GameControls setIsPlaying={setIsPlaying} />

        {isPlaying && (
          <div className="mt-8 w-full flex justify-center">
            <Dashboard />
          </div>
        )}
      </div>

      {/* Corner decorative elements */}
      <div className="absolute top-8 left-8 text-4xl text-[var(--accent)] opacity-20 pointer-events-none">♜</div>
      <div className="absolute top-8 right-8 text-4xl text-[var(--accent)] opacity-20 pointer-events-none">♖</div>
      <div className="absolute bottom-8 left-8 text-4xl text-[var(--accent)] opacity-20 pointer-events-none">♞</div>
      <div className="absolute bottom-8 right-8 text-4xl text-[var(--accent)] opacity-20 pointer-events-none">♘</div>
    </div>
  )
}
