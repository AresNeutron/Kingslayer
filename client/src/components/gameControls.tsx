"use client"
import { type Dispatch, type SetStateAction, useState } from "react"
import { createGame } from "@/helpers/engine_calls"
import { useChessContext } from "@/hooks/ChessContext"

function GameControls({
  setIsPlaying,
  isInDashboard = false,
}: {
  setIsPlaying: Dispatch<SetStateAction<boolean>>
  isInDashboard?: boolean
}) {
  const [isSelectingRole, setIsSelectingRole] = useState<boolean>(false)
  const [isUserWhite, setIsUserWhite] = useState<boolean | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const {
    gameIdRef,
    roleRef,
    isUserTurn,
    setIsUserTurn,
    updateBitboardState,
    gameMessage,
    setGameMessage,
    initializeWebSocket,
    handleUnmakeMove
  } = useChessContext()

  const startGame = async (isWhite: boolean) => {
    if (isCreating) return
    setIsCreating(true)
    setGameMessage("Forging the battlefield...")
    try {
      const gameId = crypto.randomUUID()
      await createGame(gameId, isWhite)
      gameIdRef.current = gameId
      roleRef.current = isWhite
      await initializeWebSocket(gameId)
      updateBitboardState(gameId)
      setIsUserTurn(isWhite)
      setIsPlaying(true)
      setGameMessage("")
    } catch (error) {
      console.error("Error creating game:", error)
      setGameMessage("The forge has failed us...")
      gameIdRef.current = ""
      roleRef.current = null
    } finally {
      setIsCreating(false)
    }
  }

  const resetGame = () => {
    setIsPlaying(false)
    setIsSelectingRole(false)
    setIsUserWhite(null)
    gameIdRef.current = ""
    roleRef.current = null
    setGameMessage("")
  }

  // Placeholder function for undo move - you'll implement the logic
  const handleUndoMove = () => {
    handleUnmakeMove();
    console.log("Undo move requested")
  }

  // When in Dashboard mode, always show the game status panel
  if (isInDashboard) {
    return (
      <div className="w-full space-y-4">
        {/* Medieval Game Status Panel - Always visible in dashboard */}
        <div className="relative">
          <div className="bg-gradient-to-b from-[var(--secondary)] via-[var(--muted)] to-[var(--secondary)] p-6 rounded-lg border-2 border-[var(--border)] shadow-2xl relative overflow-hidden">
            {/* Medieval banner decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent)] via-[var(--primary-foreground)] to-[var(--accent)]" />

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-[var(--primary-foreground)] tracking-wider flex items-center justify-center gap-2">
                  ⚔️ BATTLE STATUS ⚔️
                </h3>
                <div className="h-px w-24 bg-[var(--accent)] mx-auto mt-2" />
              </div>

              {/* Game Message */}
              <div className="text-center mb-4">
                <span
                  className={`text-lg font-bold tracking-wide ${
                    gameMessage.includes("Game Over")
                      ? gameMessage.includes("Congratulations, you win!")
                        ? "text-green-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        : "text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      : "text-[var(--accent)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  }`}
                >
                  {gameMessage || "Battle Ready"}
                </span>
              </div>

              {/* Game Status Content */}
              {gameMessage.includes("Game Over") ? (
                <div className="text-center text-[var(--secondary-foreground)] mb-4 italic">
                  The battle has concluded. Prepare thy mind for another glorious encounter!
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Player Color Display */}
                  {roleRef.current !== null && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[var(--secondary-foreground)]">Commanding:</span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border-2 ${
                          roleRef.current
                            ? "bg-[var(--primary-foreground)] text-[var(--primary)] border-[var(--primary-foreground)]"
                            : "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--border)]"
                        }`}
                      >
                        {roleRef.current ? "⚪ WHITE LEGION" : "⚫ BLACK LEGION"}
                      </span>
                    </div>
                  )}

                  {/* Turn Indicator */}
                  {!gameMessage.includes("Started") && roleRef.current !== null && (
                    <div className="text-center">
                      <span
                        className={`font-bold text-lg ${
                          isUserTurn ? "text-[var(--accent)] animate-pulse" : "text-[var(--muted-foreground)]"
                        }`}
                      >
                        {isUserTurn ? "⚔️ YOUR MOVE" : "🤔 ENEMY PLOTTING..."}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Battle Actions - New Game and Undo Move buttons */}
              <div className="mt-4 space-y-3">
                {/* Undo Move Button - Only show during active game */}
                {!gameMessage.includes("Game Over") && roleRef.current !== null && (
                  <div className="text-center">
                    <button
                      onClick={handleUndoMove}
                      className="group relative px-4 py-2 bg-gradient-to-b from-[var(--muted)] to-[var(--secondary)] text-[var(--primary-foreground)] font-bold text-sm rounded-lg border-2 border-[var(--border)] shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--muted)] focus:ring-opacity-50 hover:from-[var(--secondary)] hover:to-[var(--muted)]"
                      title="Reverse your last move"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg transform group-hover:-rotate-12 transition-transform duration-200">
                          ⟲
                        </span>
                        <span className="tracking-wide">REVERSE MOVE</span>
                      </span>
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200" />
                    </button>
                  </div>
                )}

                {/* New Game Button */}
                <div className="text-center">
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-gradient-to-b from-[var(--accent)] to-[var(--primary)] text-[var(--primary-foreground)] font-bold rounded-lg border-2 border-[var(--border)] shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50"
                  >
                    ⚔️ FORGE NEW BATTLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Game Info Panel */}
        <div className="bg-gradient-to-b from-[var(--secondary)] to-[var(--muted)] p-4 rounded-lg border border-[var(--border)] shadow-lg">
          <h4 className="text-lg font-bold text-[var(--primary-foreground)] mb-3 text-center">⚔️ BATTLE COMMANDS ⚔️</h4>
          <div className="space-y-2 text-sm text-[var(--secondary-foreground)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)]">🎯</span>
              <span>Click pieces to select and move</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)]">🔵</span>
              <span>Blue highlights show valid moves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)]">🔴</span>
              <span>Red highlights show captures</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)]">🟣</span>
              <span>Purple shows special moves</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent)]">⟲</span>
              <span>Reverse Move button undoes last action</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original GameControls for landing page
  return (
    <div className="mb-6 w-full max-w-2xl">
      <div className="bg-gradient-to-b from-[var(--secondary)] to-[var(--muted)] p-8 rounded-lg border-2 border-[var(--border)] shadow-2xl relative">
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 text-[var(--accent)] opacity-30">♜</div>
        <div className="absolute top-2 right-2 text-[var(--accent)] opacity-30">♖</div>
        <div className="absolute bottom-2 left-2 text-[var(--accent)] opacity-30">♛</div>
        <div className="absolute bottom-2 right-2 text-[var(--accent)] opacity-30">♕</div>

        {isSelectingRole ? (
          <div className="flex flex-col items-center space-y-6 relative z-10">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-[var(--primary-foreground)] mb-2 tracking-wide">
                Choose Thy Banner
              </h3>
              <div className="h-px w-24 bg-[var(--accent)] mx-auto mb-4" />
              <p className="text-[var(--secondary-foreground)] italic">
                Will you lead the forces of light or embrace the shadows?
              </p>
            </div>

            <div className="flex space-x-6">
              <button
                onClick={() => {
                  setIsUserWhite(true)
                  startGame(true)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-8 py-4 bg-gradient-to-b from-[var(--primary-foreground)] to-[var(--secondary-foreground)] text-[var(--primary)] font-bold text-lg rounded-lg border-2 border-[var(--border)] shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">⚪ WHITE LEGION</span>
              </button>

              <button
                onClick={() => {
                  setIsUserWhite(false)
                  startGame(false)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-8 py-4 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] font-bold text-lg rounded-lg border-2 border-[var(--border)] shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">⚫ BLACK LEGION</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center relative z-10">
            <button
              className="group relative px-10 py-4 bg-gradient-to-b from-[var(--accent)] to-[var(--primary)] text-[var(--primary-foreground)] font-bold text-xl rounded-lg border-2 border-[var(--border)] shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 tracking-wide"
              onClick={() => {
                setIsSelectingRole(true)
              }}
            >
              <span className="flex items-center gap-3">⚔️ FORGE NEW BATTLE ⚔️</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameControls
