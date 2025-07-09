"use client"
import { type Dispatch, type SetStateAction, useState } from "react"
import { createGame } from "@/helpers/engine_calls"
import { useChessContext } from "@/hooks/ChessContext"

function GameControls({
  setIsPlaying,
}: {
  setIsPlaying: Dispatch<SetStateAction<boolean>>
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

  return (
    <div className="mb-6 w-full max-w-2xl">
      {/* Medieval Game Status Banner */}
      {isUserWhite !== null && (
        <div className="mb-6 relative">
          {/* Decorative banner background */}
          <div className="bg-gradient-to-r from-[var(--secondary)] via-[var(--muted)] to-[var(--secondary)] p-6 rounded-lg border-2 border-[var(--border)] shadow-2xl relative overflow-hidden">
            {/* Medieval banner decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--accent)] via-[var(--primary-foreground)] to-[var(--accent)]" />

            <div className="relative z-10">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-[var(--primary-foreground)] tracking-wider flex items-center justify-center gap-2">
                  ⚔️ BATTLE STATUS ⚔️
                </h2>
                <div className="h-px w-32 bg-[var(--accent)] mx-auto mt-2" />
              </div>

              <div className="text-center mb-4">
                <span
                  className={`text-2xl font-bold tracking-wide ${
                    gameMessage.includes("Game Over")
                      ? gameMessage.includes("Congratulations, you win!")
                        ? "text-green-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" // Victory
                        : "text-red-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" // Defeat
                      : "text-[var(--accent)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  }`}
                >
                  {gameMessage}
                </span>
              </div>

              {gameMessage.includes("Game Over") ? (
                <div className="text-center text-[var(--secondary-foreground)] text-lg italic">
                  The battle has concluded. Prepare thy mind for another glorious encounter!
                </div>
              ) : (
                <div className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--secondary-foreground)]">Commanding:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border-2 ${
                        isUserWhite
                          ? "bg-[var(--primary-foreground)] text-[var(--primary)] border-[var(--primary-foreground)]"
                          : "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--border)]"
                      }`}
                    >
                      {isUserWhite ? "⚪ WHITE LEGION" : "⚫ BLACK LEGION"}
                    </span>
                  </div>

                  {!gameMessage.includes("Started") && (
                    <div className="flex items-center gap-2">
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
            </div>
          </div>
        </div>
      )}

      {/* Medieval Game Controls */}
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
              {/* White Army Button */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-200" />
              </button>

              {/* Black Army Button */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-200" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameControls
