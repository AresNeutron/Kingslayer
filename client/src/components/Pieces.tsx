"use client"

import Image from "next/image"
import { useChessContext } from "@/hooks/ChessContext"
import { Piece } from "@/helpers/constants"

function Pieces() {
  const { roleRef, board, highlight, selectedSquare, setSelectedSquare, handleLightState, handleMoveState } =
    useChessContext()

  function handleClick(squareIndex: number, piece: number) {
    const isWhite = piece > Piece.BLACK_ROOK
    const isUserTurn = roleRef.current === isWhite

    if (!isUserTurn && selectedSquare === null) return

    if (selectedSquare !== null) {
      // Change selected piece to another of the same color
      if (isUserTurn) {
        handleLightState(squareIndex)
        setSelectedSquare(squareIndex)
        return
      }
      // Move to a square (capture or move to empty square)
      const validMoveCode = highlight.find((move) => (move & 0x3f) === squareIndex)
      if (validMoveCode !== undefined) {
        handleMoveState(validMoveCode)
      }
    } else {
      // Select a piece for the first time (and it's your turn)
      if (isUserTurn) {
        handleLightState(squareIndex)
        setSelectedSquare(squareIndex)
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 w-[var(--board-size)] h-[var(--board-size)] pointer-events-none z-10">
      <div className="relative w-full h-full">
        {board.map((piece, i) => {
          if (piece !== Piece.NO_PIECE) {
            const col = i % 8
            const row = roleRef.current ? 7 - Math.floor(i / 8) : Math.floor(i / 8)
            const isWhite = piece > Piece.BLACK_ROOK
            const isSelected = selectedSquare === i

            return (
              <div
                key={i}
                onClick={() => handleClick(i, piece)}
                className={`absolute transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center group
                  ${isSelected ? "z-20" : "z-10"}
                  hover:z-30`}
                style={{
                  width: "var(--cell-size)",
                  height: "var(--cell-size)",
                  top: `${row * 64}px`,
                  left: `${col * 64}px`,
                  pointerEvents: "auto",
                }}
              >
                {/* Medieval piece background glow for selected pieces */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${
                        isWhite ? "hsla(45, 85%, 55%, 0.4)" : "hsla(280, 50%, 40%, 0.4)"
                      } 0%, transparent 70%)`,
                      boxShadow: `0 0 30px ${isWhite ? "hsla(45, 85%, 55%, 0.6)" : "hsla(280, 50%, 40%, 0.6)"}`,
                    }}
                  />
                )}

                {/* Medieval piece container with enhanced styling */}
                <div
                  className={`relative w-full h-full flex items-center justify-center transition-all duration-200 ease-in-out
                    ${isSelected ? "scale-110" : ""}
                    group-hover:scale-105 group-hover:rotate-1
                    ${isSelected ? "animate-bounce" : ""}`}
                  style={{
                    filter: `
                      drop-shadow(0 4px 8px rgba(0,0,0,0.4))
                      drop-shadow(0 2px 4px rgba(0,0,0,0.3))
                      ${isSelected ? "drop-shadow(0 0 20px rgba(255,215,0,0.5))" : ""}
                    `,
                  }}
                >
                  {/* Fix for white piece transparency - add background */}
                  {isWhite && (
                    <div
                      className="absolute inset-2 rounded-full opacity-20"
                      style={{
                        background: "radial-gradient(circle, #f4e4d0 0%, transparent 70%)",
                      }}
                    />
                  )}

                  <Image
                    src={`/images/${piece}.png`}
                    alt={`Chess piece ${piece}`}
                    width={64}
                    height={64}
                    className={`object-contain transition-all duration-200 ease-in-out relative z-10
                      ${isWhite ? "brightness-110 contrast-110" : "brightness-95"}
                      group-hover:brightness-110
                      ${isSelected ? "brightness-125" : ""}`}
                    style={{
                      // Enhanced styling for medieval look
                      filter: `
                        ${isWhite ? "drop-shadow(0 0 2px rgba(244,228,208,0.8))" : ""}
                        ${isSelected ? "drop-shadow(0 0 10px rgba(255,215,0,0.8))" : ""}
                        saturate(1.1)
                        contrast(1.05)
                      `,
                    }}
                  />

                  {/* Medieval piece border effect */}
                  <div
                    className={`absolute inset-1 rounded-full border transition-all duration-200 ease-in-out pointer-events-none
                      ${isSelected ? "border-yellow-400 opacity-60" : "border-transparent"}
                      ${isSelected ? "animate-pulse" : ""}`}
                    style={{
                      boxShadow: isSelected ? "inset 0 0 10px rgba(255,215,0,0.3)" : "none",
                    }}
                  />
                </div>

                {/* Medieval hover effect - subtle glow */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${
                      isWhite ? "rgba(244,228,208,0.3)" : "rgba(139,38,53,0.3)"
                    } 0%, transparent 70%)`,
                  }}
                />
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default Pieces
