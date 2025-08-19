"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { Sword, Crown, Shield, Sparkles, Play, RotateCcw, Zap } from "lucide-react"
import { createGame } from "../helpers/engine_calls"
import { useChessContext } from "../hooks/useChessContext"

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
  const [showButtons, setShowButtons] = useState(true)

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

  const resetGame = () => {
    setShowButtons(false)
    setTimeout(() => {
      setIsPlaying(false)
      setIsSelectingRole(false)
      setIsUserWhite(null)
      gameIdRef.current = ""
      roleRef.current = null
      setGameMessage("")
      setShowButtons(true)
    }, 300)
  }

  // Dashboard mode with consistent dark theme
  if (isInDashboard) {
    return (
      <div className="w-full space-y-3 sm:space-y-4">
        <div className="relative animate-in slide-in-from-left-5 duration-700">
          <div className="bg-gradient-to-br from-[var(--card)] via-[var(--muted)] to-[var(--secondary)] backdrop-blur-sm p-4 sm:p-6 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-medium)] relative overflow-hidden">
            {/* Medieval banner decoration */}
            <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-[var(--accent)] via-[var(--medieval-gold-light)] to-[var(--accent)] shadow-[var(--shadow-glow)]" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, rgba(184, 134, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 38, 53, 0.2) 0%, transparent 50%)`,
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-3 sm:mb-4 animate-in zoom-in-50 duration-500 delay-200">
                <h3 className="text-lg sm:text-xl mobile-subtitle font-bold text-[var(--foreground)] tracking-wider flex items-center justify-center gap-2 sm:gap-3">
                  <Sword className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)] animate-pulse" />
                  BATTLE STATUS
                  <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)] animate-pulse" />
                </h3>
                <div className="h-0.5 w-16 sm:w-24 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto mt-2 animate-in slide-in-from-bottom-2 duration-700 delay-300 shadow-[var(--shadow-glow)]" />
              </div>

              <div className="text-center mb-3 sm:mb-4 animate-in fade-in duration-500 delay-400">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--secondary)]/80 backdrop-blur-sm rounded-lg border border-[var(--border)] shadow-[var(--shadow-soft)]">
                  {gameMessage.includes("Game Over") ? (
                    <Crown
                      className={`w-4 sm:w-5 h-4 sm:h-5 ${
                        gameMessage.includes("Congratulations, you win!")
                          ? "text-green-400"
                          : "text-[var(--destructive)]"
                      } animate-bounce`}
                    />
                  ) : (
                    <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)] animate-spin" />
                  )}
                  <span
                    className={`text-base sm:text-lg mobile-text font-bold tracking-wide ${
                      gameMessage.includes("Game Over")
                        ? gameMessage.includes("Congratulations, you win!")
                          ? "text-green-400 drop-shadow-sm"
                          : "text-[var(--destructive)] drop-shadow-sm"
                        : "text-[var(--accent)] drop-shadow-sm"
                    }`}
                  >
                    {gameMessage || "Battle Ready"}
                  </span>
                </div>
              </div>

              {/* Game Status Content */}
              {gameMessage.includes("Game Over") ? (
                <div className="text-center text-[var(--card-foreground)] mb-3 sm:mb-4 italic animate-in slide-in-from-bottom-3 duration-700 delay-500">
                  <div className="bg-[var(--muted)]/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-[var(--border)]">
                    <span className="text-sm sm:text-base mobile-text">
                      The battle has concluded. Prepare thy mind for another glorious encounter!
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 animate-in slide-in-from-bottom-3 duration-700 delay-600">
                  {roleRef.current !== null && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm sm:text-base mobile-text text-[var(--muted-foreground)] font-medium">
                        Commanding:
                      </span>
                      <div
                        className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm mobile-text font-bold border-2 shadow-[var(--shadow-soft)] backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${
                          roleRef.current
                            ? "bg-[var(--foreground)]/90 text-[var(--background)] border-[var(--foreground)]"
                            : "bg-[var(--background)]/90 text-[var(--foreground)] border-[var(--accent)]"
                        }`}
                      >
                        {roleRef.current ? (
                          <>
                            <Crown className="w-3 sm:w-4 h-3 sm:h-4" />
                            WHITE LEGION
                          </>
                        ) : (
                          <>
                            <Shield className="w-3 sm:w-4 h-3 sm:h-4" />
                            BLACK LEGION
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {!gameMessage.includes("Started") && roleRef.current !== null && (
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-base sm:text-lg mobile-text transition-all duration-500 border-2 shadow-[var(--shadow-soft)] ${
                          isUserTurn
                            ? "bg-green-900/80 text-green-300 border-green-600 animate-pulse shadow-green-900/50"
                            : "bg-[var(--muted)]/80 text-[var(--muted-foreground)] border-[var(--border)]"
                        }`}
                      >
                        {isUserTurn ? (
                          <>
                            <Zap className="w-4 sm:w-5 h-4 sm:h-5 animate-bounce" />
                            YOUR MOVE
                          </>
                        ) : (
                          <>
                            <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-[var(--accent)] rounded-full animate-spin border-t-transparent" />
                            ENEMY PLOTTING...
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 sm:mt-6 space-y-3 animate-in slide-in-from-bottom-4 duration-700 delay-700">
                <div className="text-center">
                  <button
                    onClick={resetGame}
                    className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-[var(--accent)] via-[var(--medieval-gold)] to-[var(--medieval-gold-light)] text-[var(--background)] font-bold text-sm sm:text-base mobile-text rounded-xl border-2 border-[var(--accent)] shadow-[var(--shadow-medium)] transform transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-[var(--shadow-glow)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 overflow-hidden animate-in zoom-in-75 duration-800 delay-900"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse" />

                    {/* Button content */}
                    <span className="relative flex items-center gap-1 sm:gap-2">
                      <RotateCcw className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                      FORGE NEW BATTLE
                      <Sword className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)] p-3 sm:p-4 rounded-xl border border-[var(--border)] shadow-[var(--shadow-soft)] animate-in slide-in-from-right-5 duration-700 delay-300">
          <h4 className="text-base sm:text-lg mobile-subtitle font-bold text-[var(--foreground)] mb-2 sm:mb-3 text-center flex items-center justify-center gap-2">
            <Sword className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)]" />
            BATTLE COMMANDS
            <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--accent)]" />
          </h4>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mobile-text text-[var(--card-foreground)]">
            {[
              { icon: "🎯", text: "Click pieces to select and move", delay: "delay-100" },
              { icon: "🔵", text: "Blue highlights show valid moves", delay: "delay-200" },
              { icon: "🔴", text: "Red highlights show captures", delay: "delay-300" },
              { icon: "🟣", text: "Purple shows special moves", delay: "delay-400" },
              { icon: "⟲", text: "Reverse Move button undoes last action", delay: "delay-500" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[var(--secondary)]/60 rounded-lg transition-all duration-300 hover:bg-[var(--secondary)]/80 hover:scale-105 animate-in slide-in-from-left-3 duration-500 ${item.delay}`}
              >
                <span className="text-sm sm:text-lg">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`mb-4 sm:mb-6 w-full max-w-2xl transition-all duration-500 px-2 ${showButtons ? "animate-in slide-in-from-bottom-5" : "animate-out slide-out-to-bottom-5"}`}
    >
      <div className="bg-gradient-to-br from-[var(--card)] via-[var(--muted)] to-[var(--secondary)] backdrop-blur-md p-4 sm:p-8 rounded-2xl border-2 border-[var(--border)] shadow-[var(--shadow-medium)] relative overflow-hidden">
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[var(--accent)]/40 animate-pulse">
          <Crown className="w-4 sm:w-6 h-4 sm:h-6" />
        </div>
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-[var(--accent)]/40 animate-pulse delay-1000">
          <Shield className="w-4 sm:w-6 h-4 sm:h-6" />
        </div>
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-[var(--accent)]/40 animate-pulse delay-500">
          <Sword className="w-4 sm:w-6 h-4 sm:h-6" />
        </div>
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-[var(--accent)]/40 animate-pulse delay-1500">
          <Sparkles className="w-4 sm:w-6 h-4 sm:h-6" />
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, rgba(184, 134, 11, 0.4) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(139, 38, 53, 0.3) 0%, transparent 60%)`,
            }}
          />
        </div>

        {isSelectingRole ? (
          <div className="flex flex-col items-center space-y-4 sm:space-y-8 relative z-10">
            <div className="text-center animate-in zoom-in-50 duration-700">
              <h3 className="text-2xl sm:text-3xl mobile-subtitle font-bold text-[var(--foreground)] mb-2 sm:mb-3 tracking-wide flex items-center justify-center gap-2 sm:gap-3">
                <Crown className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--accent)] animate-bounce" />
                Choose Thy Banner
                <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-[var(--accent)] animate-bounce delay-300" />
              </h3>
              <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent mx-auto mb-3 sm:mb-4 animate-in slide-in-from-bottom-2 duration-1000 delay-300 shadow-[var(--shadow-glow)]" />
              <p className="text-[var(--muted-foreground)] italic text-base sm:text-lg mobile-text animate-in fade-in duration-1000 delay-500">
                Will you lead the forces of light or embrace the shadows?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 animate-in slide-in-from-bottom-5 duration-1000 delay-700 w-full">
              <button
                onClick={() => {
                  setIsUserWhite(true)
                  startGame(true)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-br from-[var(--foreground)] via-[var(--card-foreground)] to-[var(--foreground)] text-[var(--background)] font-bold text-lg sm:text-xl mobile-subtitle rounded-2xl border-3 border-[var(--foreground)] shadow-[var(--shadow-medium)] transform transition-all duration-500 hover:scale-110 hover:-rotate-2 hover:shadow-[var(--shadow-glow)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden animate-in zoom-in-75 duration-800 delay-900"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:animate-pulse" />

                {/* Loading spinner */}
                {isCreating && isUserWhite === true && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--foreground)]/80 backdrop-blur-sm rounded-2xl">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 border-3 border-[var(--background)] rounded-full animate-spin border-t-transparent" />
                  </div>
                )}

                <span className="relative flex items-center gap-2 sm:gap-3 group-hover:scale-105 transition-transform duration-300">
                  <Crown className="w-5 sm:w-7 h-5 sm:h-7 text-[var(--background)] group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
                  WHITE LEGION
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white border-2 border-[var(--background)] rounded-full shadow-lg" />
                </span>
              </button>

              <button
                onClick={() => {
                  setIsUserWhite(false)
                  startGame(false)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-br from-[var(--background)] via-[var(--card)] to-[var(--muted)] text-[var(--foreground)] font-bold text-lg sm:text-xl mobile-subtitle rounded-2xl border-3 border-[var(--accent)] shadow-[var(--shadow-medium)] transform transition-all duration-500 hover:scale-110 hover:rotate-2 hover:shadow-[var(--shadow-glow)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden animate-in zoom-in-75 duration-800 delay-1100"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent -skew-x-12 group-hover:animate-pulse" />

                {/* Loading spinner */}
                {isCreating && isUserWhite === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm rounded-2xl">
                    <div className="w-6 sm:w-8 h-6 sm:h-8 border-3 border-[var(--accent)] rounded-full animate-spin border-t-transparent" />
                  </div>
                )}

                <span className="relative flex items-center gap-2 sm:gap-3 group-hover:scale-105 transition-transform duration-300">
                  <Shield className="w-5 sm:w-7 h-5 sm:h-7 text-[var(--accent)] group-hover:-rotate-12 group-hover:scale-125 transition-all duration-500" />
                  BLACK LEGION
                  <div className="w-3 sm:w-4 h-3 sm:h-4 bg-[var(--background)] border-2 border-[var(--accent)] rounded-full shadow-lg" />
                </span>
              </button>
            </div>

            {isCreating && (
              <div className="text-center animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-[var(--muted)]/80 backdrop-blur-sm rounded-lg border border-[var(--border)] shadow-[var(--shadow-soft)]">
                  <div className="w-4 sm:w-6 h-4 sm:h-6 border-3 border-[var(--accent)] rounded-full animate-spin border-t-transparent" />
                  <span className="text-[var(--foreground)] font-bold text-base sm:text-lg mobile-text">
                    Forging the battlefield...
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center relative z-10 animate-in zoom-in-50 duration-700">
            <button
              className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-gradient-to-br from-[var(--accent)] via-[var(--medieval-gold)] to-[var(--medieval-gold-light)] text-[var(--background)] font-bold text-xl sm:text-2xl mobile-subtitle rounded-2xl border-3 border-[var(--accent)] shadow-[var(--shadow-medium)] transform transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-[var(--shadow-glow)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)] focus:ring-opacity-50 tracking-wide overflow-hidden"
              onClick={() => {
                setIsSelectingRole(true)
              }}
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-pulse" />

              <span className="relative flex items-center gap-2 sm:gap-4 group-hover:scale-105 transition-transform duration-300">
                <Play className="w-6 sm:w-8 h-6 sm:h-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                FORGE NEW BATTLE
                <Sword className="w-6 sm:w-8 h-6 sm:h-8 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500" />
              </span>

              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:animate-ping" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameControls
