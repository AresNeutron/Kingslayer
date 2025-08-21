"use client"

import { useEffect, useState } from "react"
import { Piece } from "../helpers/constants"
import { useChessContext } from "../hooks/useChessContext"

function Pieces() {
  const { roleRef, board, highlight, selectedSquare, setSelectedSquare, handleLightState, handleMoveState, isAnimating, animatingPieces, fadingPieces } =
    useChessContext()

  // Force re-renders during animations
  const [, setAnimationFrame] = useState(0)

  useEffect(() => {
    if (isAnimating && (Object.keys(animatingPieces).length > 0 || Object.keys(fadingPieces).length > 0)) {
      const animateFrame = () => {
        setAnimationFrame(prev => prev + 1)
        requestAnimationFrame(animateFrame)
      }
      const frameId = requestAnimationFrame(animateFrame)
      
      // Stop animation loop when pieces finish animating
      const stopTimer = setTimeout(() => {
        cancelAnimationFrame(frameId)
      }, 320) // Slightly longer than animation duration

      return () => {
        cancelAnimationFrame(frameId)
        clearTimeout(stopTimer)
      }
    }
  }, [isAnimating, animatingPieces, fadingPieces])

  // Helper function to calculate piece position
  function getSquarePosition(squareIndex: number) {
    const col = squareIndex % 8
    const row = roleRef.current ? 7 - Math.floor(squareIndex / 8) : Math.floor(squareIndex / 8)
    return { col, row }
  }

  function handleClick(squareIndex: number, piece: number) {
    // Block interactions during animations
    if (isAnimating) return
    
    const isWhite = piece > Piece.BLACK_ROOK
    const canUserMove = roleRef.current === isWhite

    if (!canUserMove && selectedSquare === null) return

    if (selectedSquare !== null) {
      // Change selected piece to another of the same color
      if (canUserMove) {
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
      if (canUserMove) {
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
            // Check if this piece is currently animating from this square
            const isAnimatingFromHere = Object.values(animatingPieces).some(
              animPiece => animPiece.fromSquare === i
            )
            
            // Check if this piece is currently fading at this square
            const isFadingHere = Object.values(fadingPieces).some(
              fadePiece => fadePiece.square === i
            )
            
            // Don't render pieces that are animating from this position or fading
            if (isAnimatingFromHere || isFadingHere) return null
            
            const { col, row } = getSquarePosition(i)
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
                  top: `calc(${row} * var(--cell-size))`,
                  left: `calc(${col} * var(--cell-size))`,
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

                  <img
                    src={`/images/${piece}.png`}
                    alt={`Chess piece ${piece}`}
                    className={`object-contain transition-all duration-200 ease-in-out relative z-10
                      ${isWhite ? "brightness-110 contrast-110" : "brightness-95"}
                      group-hover:brightness-110
                      ${isSelected ? "brightness-125" : ""}`}
                    style={{
                      width: "var(--piece-size)",
                      height: "var(--piece-size)",
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
        
        {/* Render animating pieces */}
        {Object.entries(animatingPieces).map(([animId, animPiece]) => {
          const fromPos = getSquarePosition(animPiece.fromSquare)
          const toPos = getSquarePosition(animPiece.toSquare)
          const isWhite = animPiece.piece > Piece.BLACK_ROOK
          
          // Calculate animation progress (0 to 1)
          const elapsed = Date.now() - animPiece.startTime
          const progress = Math.min(elapsed / 300, 1) // 300ms animation duration
          
          // Calculate current position
          const currentCol = fromPos.col + (toPos.col - fromPos.col) * progress
          const currentRow = fromPos.row + (toPos.row - fromPos.row) * progress
          
          return (
            <div
              key={animId}
              className="absolute transition-none flex items-center justify-center pointer-events-none z-30"
              style={{
                width: "var(--cell-size)",
                height: "var(--cell-size)",
                top: `calc(${currentRow} * var(--cell-size))`,
                left: `calc(${currentCol} * var(--cell-size))`,
                transform: `translateZ(0)`, // Force hardware acceleration
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background glow for white pieces during animation */}
                {isWhite && (
                  <div
                    className="absolute inset-2 rounded-full opacity-20"
                    style={{
                      background: "radial-gradient(circle, #f4e4d0 0%, transparent 70%)",
                    }}
                  />
                )}

                <img
                  src={`/images/${animPiece.piece}.png`}
                  alt={`Animating chess piece ${animPiece.piece}`}
                  className={`object-contain relative z-10
                    ${isWhite ? "brightness-110 contrast-110" : "brightness-95"}`}
                  style={{
                    width: "var(--piece-size)",
                    height: "var(--piece-size)",
                    filter: `
                      ${isWhite ? "drop-shadow(0 0 2px rgba(244,228,208,0.8))" : ""}
                      saturate(1.1)
                      contrast(1.05)
                    `,
                  }}
                />
              </div>
            </div>
          )
        })}
        
        {/* Render fading pieces (captures) */}
        {Object.entries(fadingPieces).map(([fadeId, fadePiece]) => {
          const { col, row } = getSquarePosition(fadePiece.square)
          const isWhite = fadePiece.piece > Piece.BLACK_ROOK
          
          // Calculate fade progress (0 to 1, where 1 is fully transparent)
          const elapsed = Date.now() - fadePiece.startTime
          const fadeProgress = Math.min(elapsed / 300, 1) // 300ms fade duration
          const opacity = 1 - fadeProgress // Start at 1, fade to 0
          
          return (
            <div
              key={fadeId}
              className="absolute transition-none flex items-center justify-center pointer-events-none z-25"
              style={{
                width: "var(--cell-size)",
                height: "var(--cell-size)",
                top: `calc(${row} * var(--cell-size))`,
                left: `calc(${col} * var(--cell-size))`,
                opacity: opacity,
                transform: `translateZ(0)`, // Force hardware acceleration
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Background glow for white pieces during fade */}
                {isWhite && (
                  <div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: "radial-gradient(circle, #f4e4d0 0%, transparent 70%)",
                      opacity: opacity * 0.2,
                    }}
                  />
                )}

                <img
                  src={`/images/${fadePiece.piece}.png`}
                  alt={`Fading chess piece ${fadePiece.piece}`}
                  className={`object-contain relative z-10
                    ${isWhite ? "brightness-110 contrast-110" : "brightness-95"}`}
                  style={{
                    width: "var(--piece-size)",
                    height: "var(--piece-size)",
                    filter: `
                      ${isWhite ? "drop-shadow(0 0 2px rgba(244,228,208,0.8))" : ""}
                      saturate(1.1)
                      contrast(1.05)
                    `,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Pieces
