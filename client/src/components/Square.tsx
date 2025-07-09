"use client"

import { MoveType } from "@/helpers/constants"
import { useChessContext } from "@/hooks/ChessContext"

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
        rounded-lg transition-all duration-300 ease-in-out transform
        ${isMoveTarget ? "hover:scale-105" : ""}
        ${bg}`}
      style={{
        // Enhanced medieval-style highlights with better visual feedback
        ...(bg === "yellow" && {
          background: "radial-gradient(circle, hsla(45, 85%, 55%, 0.6) 0%, hsla(45, 85%, 65%, 0.4) 100%)",
          boxShadow: `
            inset 0 0 0 3px hsla(45, 85%, 65%, 0.9),
            0 0 20px hsla(45, 85%, 55%, 0.5),
            inset 0 0 10px hsla(45, 85%, 75%, 0.3)
          `,
          animation: "pulse 2s infinite",
        }),
        ...(bg === "blue" && {
          background: "radial-gradient(circle, hsla(220, 60%, 35%, 0.5) 0%, hsla(220, 60%, 45%, 0.3) 100%)",
          boxShadow: `
            inset 0 0 0 2px hsla(220, 60%, 45%, 0.8),
            0 0 15px hsla(220, 60%, 35%, 0.4)
          `,
        }),
        ...(bg === "red" && {
          background: "radial-gradient(circle, hsla(355, 70%, 45%, 0.6) 0%, hsla(355, 70%, 55%, 0.4) 100%)",
          boxShadow: `
            inset 0 0 0 2px hsla(355, 70%, 55%, 0.9),
            0 0 20px hsla(355, 70%, 45%, 0.5),
            inset 0 0 10px hsla(355, 70%, 65%, 0.3)
          `,
        }),
        ...(bg === "violet" && {
          background: "radial-gradient(circle, hsla(280, 50%, 40%, 0.6) 0%, hsla(280, 50%, 50%, 0.4) 100%)",
          boxShadow: `
            inset 0 0 0 2px hsla(280, 50%, 50%, 0.8),
            0 0 15px hsla(280, 50%, 40%, 0.4),
            inset 0 0 8px hsla(280, 50%, 60%, 0.3)
          `,
        }),
      }}
    >
      {/* Medieval-style move indicator dots */}
      {isMoveTarget && bg === "blue" && (
        <div className="w-4 h-4 bg-[var(--accent)] rounded-full opacity-80 shadow-lg animate-pulse" />
      )}
      {isMoveTarget && bg === "red" && (
        <div className="w-6 h-6 border-4 border-red-400 rounded-full opacity-80 shadow-lg animate-pulse" />
      )}
      {isMoveTarget && bg === "violet" && (
        <div className="w-5 h-5 bg-purple-400 rounded-full opacity-80 shadow-lg animate-pulse transform rotate-45" />
      )}
    </div>
  )
}

export default Square
