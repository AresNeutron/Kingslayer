"use client"

import { Target, Swords, Sparkles } from 'lucide-react'
import { MoveType } from "../helpers/constants"
import { useChessContext } from "../hooks/useChessContext"

function Square({ index }: { index: number }) {
  const { selectedSquare, handleMoveState, highlight, threats } = useChessContext()

  let bg = ""
  let moveCode: number | undefined = 0
  let isMoveTarget = false

  if (selectedSquare === index) {
    bg = "yellow"
  } else {
    if (highlight && highlight.length > 0) {
      // Find the first movement that points to this 'index'
      moveCode = highlight.find((move) => (move & 0x3f) === index)
      if (moveCode !== undefined) {
        // Extract move type (4 upper bits)
        const moveType = moveCode >> 12
        isMoveTarget = index == (moveCode & 0x3f)
        switch (moveType) {
          case MoveType.MOVE:
            bg = "blue" // Normal movement
            break
          case MoveType.CAPTURE:
            bg = "red" // Captures
            break
          case MoveType.PROMOTION_CAPTURE:
          case MoveType.CASTLING:
          case MoveType.EN_PASSANT:
          case MoveType.PROMOTION:
            bg = "violet" // Special movements
            break
        }
      }
    }
    if (!bg) {
      const threatMask = 1n << BigInt(index)
      if (BigInt(threats) & threatMask) {
        bg = "red"
      }
    }
  }

  return (
    <div
      onClick={() => {
        // Execute movement if there's a selected piece and the square is a valid target
        if (selectedSquare !== null && isMoveTarget && moveCode !== undefined) {
          handleMoveState(moveCode)
        }
      }}
      className={`absolute w-[var(--cell-size)] h-[var(--cell-size)] flex items-center justify-center
        ${isMoveTarget ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}
        rounded-xl transition-all duration-500 ease-in-out transform
        ${isMoveTarget ? "hover:scale-105" : ""}
        ${bg}`}
      style={{
        // Enhanced medieval-style highlights with warmer, darker colors
        ...(bg === "yellow" && {
          background: "radial-gradient(circle, rgba(184, 134, 11, 0.4) 0%, rgba(218, 165, 32, 0.2) 100%)",
          boxShadow: `
            inset 0 0 0 3px rgba(184, 134, 11, 0.8),
            0 0 20px rgba(184, 134, 11, 0.4),
            inset 0 0 8px rgba(218, 165, 32, 0.3)
          `,
          animation: "pulse 2s infinite",
        }),
        ...(bg === "blue" && {
          background: "radial-gradient(circle, rgba(107, 68, 35, 0.4) 0%, rgba(139, 69, 19, 0.2) 100%)",
          boxShadow: `
            inset 0 0 0 2px rgba(184, 134, 11, 0.6),
            0 0 15px rgba(107, 68, 35, 0.3)
          `,
        }),
        ...(bg === "red" && {
          background: "radial-gradient(circle, rgba(139, 38, 53, 0.5) 0%, rgba(160, 48, 63, 0.3) 100%)",
          boxShadow: `
            inset 0 0 0 2px rgba(139, 38, 53, 0.8),
            0 0 18px rgba(139, 38, 53, 0.4),
            inset 0 0 8px rgba(160, 48, 63, 0.2)
          `,
        }),
        ...(bg === "violet" && {
          background: "radial-gradient(circle, rgba(101, 67, 33, 0.5) 0%, rgba(139, 38, 53, 0.2) 100%)",
          boxShadow: `
            inset 0 0 0 2px rgba(184, 134, 11, 0.7),
            0 0 15px rgba(101, 67, 33, 0.4),
            inset 0 0 6px rgba(139, 38, 53, 0.2)
          `,
        }),
      }}
    >
      {/* Enhanced medieval-style move indicators with Lucide React icons */}
      {isMoveTarget && bg === "blue" && (
        <div className="animate-in fade-in duration-500 delay-100">
          <Target 
            className="w-6 h-6 text-[var(--medieval-gold)] opacity-90 animate-pulse" 
            strokeWidth={2.5}
          />
        </div>
      )}
      {isMoveTarget && bg === "red" && (
        <div className="animate-in fade-in duration-500 delay-150">
          <Swords 
            className="w-7 h-7 text-[var(--medieval-burgundy-light)] opacity-90 animate-pulse" 
            strokeWidth={2.5}
          />
        </div>
      )}
      {isMoveTarget && bg === "violet" && (
        <div className="animate-in fade-in duration-500 delay-200">
          <Sparkles 
            className="w-6 h-6 text-[var(--medieval-gold-light)] opacity-90 animate-pulse" 
            strokeWidth={2.5}
          />
        </div>
      )}
    </div>
  )
}

export default Square
