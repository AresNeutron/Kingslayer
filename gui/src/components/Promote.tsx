"use client"

import { useState } from "react"
import { Piece } from "../helpers/constants"
import { useChessContext } from "../hooks/useChessContext"

function Promote() {
  const { handlePromotionState, roleRef } = useChessContext()
  const color = roleRef.current ? "white" : "black"
  const isWhite = roleRef.current

  const optionsList: number[] =
    color == "white"
      ? [Piece.WHITE_QUEEN, Piece.WHITE_ROOK, Piece.WHITE_BISHOP, Piece.WHITE_KNIGHT]
      : [Piece.BLACK_QUEEN, Piece.BLACK_ROOK, Piece.BLACK_BISHOP, Piece.BLACK_KNIGHT]

  // Medieval titles for each piece
  const pieceNames = {
    [Piece.WHITE_QUEEN]: "Her Majesty",
    [Piece.WHITE_ROOK]: "The Tower Lord",
    [Piece.WHITE_BISHOP]: "The High Cleric",
    [Piece.WHITE_KNIGHT]: "Sir Knight",
    [Piece.BLACK_QUEEN]: "Dark Empress",
    [Piece.BLACK_ROOK]: "Shadow Tower",
    [Piece.BLACK_BISHOP]: "Dark Prelate",
    [Piece.BLACK_KNIGHT]: "Black Knight",
  }

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      {/* Medieval scroll/banner background */}
      <div className="relative max-w-2xl mx-4 animate-in zoom-in-95 duration-700">
        {/* Decorative banner background */}
        <div className="relative bg-gradient-to-b from-[var(--card)] via-[var(--muted)] to-[var(--secondary)] p-8 rounded-2xl border-4 border-[var(--border)] shadow-[var(--shadow-strong)]">
          {/* Medieval banner decoration */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-[var(--accent)] via-[var(--medieval-gold-light)] to-[var(--accent)] rounded-t-xl shadow-[var(--shadow-glow)]" />
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-[var(--accent)] via-[var(--medieval-gold-light)] to-[var(--accent)] rounded-b-xl shadow-[var(--shadow-glow)]" />

          {/* Corner decorations */}
          <div className="absolute -top-3 -left-3 text-4xl text-[var(--accent)] opacity-80 animate-pulse">♔</div>
          <div className="absolute -top-3 -right-3 text-4xl text-[var(--accent)] opacity-80 animate-pulse delay-500">
            ♕
          </div>
          <div className="absolute -bottom-3 -left-3 text-4xl text-[var(--accent)] opacity-80 animate-pulse delay-1000">
            ⚔️
          </div>
          <div className="absolute -bottom-3 -right-3 text-4xl text-[var(--accent)] opacity-80 animate-pulse delay-1500">
            🏰
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center">
            {/* Medieval title */}
            <div className="mb-8 animate-in slide-in-from-top-5 duration-700">
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-2 tracking-wider">🎖️ ROYAL ASCENSION 🎖️</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto rounded-full mb-4 shadow-[var(--shadow-glow)]" />
              <p className="text-xl text-[var(--card-foreground)] italic">
                Your humble pawn has reached the realm's edge!
              </p>
              <p className="text-lg text-[var(--muted-foreground)] mt-2">
                Choose the noble rank to bestow upon this brave soul:
              </p>
            </div>

            {/* Piece selection grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {optionsList.map((option, index) => (
                <div
                  key={index}
                  className={`group relative cursor-pointer transition-all duration-300 ease-in-out transform animate-in zoom-in-50 duration-500
                    ${selectedPiece === option ? "scale-110 z-20" : "hover:scale-105 z-10"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setSelectedPiece(option)}
                  onMouseLeave={() => setSelectedPiece(null)}
                  onClick={() => handlePromotionState(option)}
                >
                  {/* Medieval piece card */}
                  <div
                    className={`relative bg-gradient-to-b from-[var(--secondary)] to-[var(--muted)] 
                      p-6 rounded-xl border-2 transition-all duration-300 ease-in-out shadow-[var(--shadow-soft)]
                      ${
                        selectedPiece === option
                          ? "border-[var(--accent)] shadow-[var(--shadow-glow)]"
                          : "border-[var(--border)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-medium)]"
                      }`}
                    style={{
                      background:
                        selectedPiece === option
                          ? `linear-gradient(135deg, ${
                              isWhite ? "var(--card)" : "var(--background)"
                            } 0%, ${isWhite ? "var(--muted)" : "var(--card)"} 100%)`
                          : undefined,
                      boxShadow:
                        selectedPiece === option
                          ? `0 0 30px ${isWhite ? "rgba(184, 134, 11, 0.4)" : "rgba(139, 38, 53, 0.4)"}`
                          : undefined,
                    }}
                  >
                    {/* Glowing effect for selected piece */}
                    {selectedPiece === option && (
                      <div
                        className="absolute inset-0 rounded-xl animate-pulse"
                        style={{
                          background: `radial-gradient(circle, ${
                            isWhite ? "rgba(184, 134, 11, 0.2)" : "rgba(139, 38, 53, 0.2)"
                          } 0%, transparent 70%)`,
                        }}
                      />
                    )}

                    {/* Piece image container */}
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      {/* Background glow for white pieces */}
                      {isWhite && (
                        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[var(--foreground)] to-transparent opacity-20" />
                      )}

                      <img
                        src={`/images/${option}.png`}
                        alt={`${option}`}
                        width={80}
                        height={80}
                        className={`object-contain transition-all duration-200 ease-in-out relative z-10
                          ${isWhite ? "brightness-110 contrast-110" : "brightness-95"}
                          ${
                            selectedPiece === option ? "brightness-125 drop-shadow-[0_0_15px_rgba(184,134,11,0.6)]" : ""
                          }
                          group-hover:brightness-110`}
                        style={{
                          filter: `
                            ${isWhite ? "drop-shadow(0 0 3px rgba(244,228,208,0.8))" : ""}
                            saturate(1.1) contrast(1.05)
                          `,
                        }}
                      />
                    </div>

                    {/* Medieval piece title */}
                    <div className="text-center">
                      <h3
                        className={`text-lg font-bold mb-1 transition-colors duration-200
                        ${selectedPiece === option ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}
                      >
                        {pieceNames[option as keyof typeof pieceNames]}
                      </h3>
                      <div
                        className={`h-px w-16 mx-auto transition-all duration-200
                        ${
                          selectedPiece === option
                            ? "bg-[var(--accent)] shadow-[var(--shadow-glow)]"
                            : "bg-[var(--border)]"
                        }`}
                      />
                    </div>

                    {/* Selection indicator */}
                    {selectedPiece === option && (
                      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Medieval instruction text */}
            <div className="text-center animate-in slide-in-from-bottom-3 duration-700 delay-500">
              <p className="text-[var(--muted-foreground)] italic">
                Click upon your chosen noble to complete the ceremony
              </p>
              <div className="flex justify-center items-center mt-4 space-x-2">
                <div className="w-4 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
                <span className="text-[var(--accent)] animate-pulse">⚔️</span>
                <div className="w-4 h-px bg-[var(--accent)] shadow-[var(--shadow-glow)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Promote
