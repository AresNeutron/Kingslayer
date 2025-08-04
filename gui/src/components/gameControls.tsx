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

  // When in Dashboard mode, always show the game status panel
  if (isInDashboard) {
    return (
      <div className="w-full space-y-4">
        {/* Medieval Game Status Panel - Enhanced with better lighting */}
        <div className="relative animate-in slide-in-from-left-5 duration-700">
          <div className="bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/95 backdrop-blur-sm p-6 rounded-xl border-2 border-amber-200/60 shadow-2xl relative overflow-hidden">
            {/* Enhanced medieval banner decoration with glow */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 shadow-lg" />

            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 20%, rgba(217, 119, 6, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)`,
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="text-center mb-4 animate-in zoom-in-50 duration-500 delay-200">
                <h3 className="text-xl font-bold text-amber-900 tracking-wider flex items-center justify-center gap-2">
                  <Sword className="w-5 h-5 text-amber-700 animate-pulse" />
                  BATTLE STATUS
                  <Shield className="w-5 h-5 text-amber-700 animate-pulse" />
                </h3>
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2 animate-in slide-in-from-bottom-2 duration-700 delay-300" />
              </div>

              {/* Enhanced Game Message with better visibility */}
              <div className="text-center mb-4 animate-in fade-in duration-500 delay-400">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200 shadow-lg">
                  {gameMessage.includes("Game Over") ? (
                    <Crown
                      className={`w-5 h-5 ${
                        gameMessage.includes("Congratulations, you win!") ? "text-green-600" : "text-red-500"
                      } animate-bounce`}
                    />
                  ) : (
                    <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
                  )}
                  <span
                    className={`text-lg font-bold tracking-wide ${
                      gameMessage.includes("Game Over")
                        ? gameMessage.includes("Congratulations, you win!")
                          ? "text-green-700 drop-shadow-sm"
                          : "text-red-600 drop-shadow-sm"
                        : "text-amber-800 drop-shadow-sm"
                    }`}
                  >
                    {gameMessage || "Battle Ready"}
                  </span>
                </div>
              </div>

              {/* Enhanced Game Status Content */}
              {gameMessage.includes("Game Over") ? (
                <div className="text-center text-amber-700 mb-4 italic animate-in slide-in-from-bottom-3 duration-700 delay-500">
                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200">
                    The battle has concluded. Prepare thy mind for another glorious encounter!
                  </div>
                </div>
              ) : (
                <div className="space-y-3 animate-in slide-in-from-bottom-3 duration-700 delay-600">
                  {/* Enhanced Player Color Display */}
                  {roleRef.current !== null && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-amber-700 font-medium">Commanding:</span>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 ${
                          roleRef.current
                            ? "bg-white/90 text-amber-800 border-amber-300 shadow-amber-200"
                            : "bg-amber-800/90 text-amber-100 border-amber-600 shadow-amber-900"
                        }`}
                      >
                        {roleRef.current ? (
                          <>
                            <Crown className="w-4 h-4" />
                            WHITE LEGION
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            BLACK LEGION
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Turn Indicator */}
                  {!gameMessage.includes("Started") && roleRef.current !== null && (
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg transition-all duration-500 ${
                          isUserTurn
                            ? "bg-green-100 text-green-800 border-2 border-green-300 animate-pulse shadow-green-200 shadow-lg"
                            : "bg-orange-100 text-orange-800 border-2 border-orange-300 shadow-orange-200 shadow-lg"
                        }`}
                      >
                        {isUserTurn ? (
                          <>
                            <Zap className="w-5 h-5 animate-bounce" />
                            YOUR MOVE
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 border-2 border-orange-600 rounded-full animate-spin border-t-transparent" />
                            ENEMY PLOTTING...
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Battle Actions */}
              <div className="mt-6 space-y-3 animate-in slide-in-from-bottom-4 duration-700 delay-700">
                <div className="text-center">
                  <button
                    onClick={resetGame}
                    className="group relative px-6 py-3 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white font-bold rounded-xl border-2 border-amber-400 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-amber-500/50 focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50 overflow-hidden"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-pulse" />

                    {/* Button content */}
                    <span className="relative flex items-center gap-2">
                      <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      FORGE NEW BATTLE
                      <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>

                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/0 via-amber-400/0 to-amber-400/0 group-hover:from-amber-400/20 group-hover:via-amber-500/30 group-hover:to-orange-500/20 transition-all duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Additional Game Info Panel */}
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/85 to-amber-100/90 backdrop-blur-sm p-4 rounded-xl border border-amber-200/60 shadow-xl animate-in slide-in-from-right-5 duration-700 delay-300">
          <h4 className="text-lg font-bold text-amber-900 mb-3 text-center flex items-center justify-center gap-2">
            <Sword className="w-5 h-5 text-amber-700" />
            BATTLE COMMANDS
            <Shield className="w-5 h-5 text-amber-700" />
          </h4>
          <div className="space-y-2 text-sm text-amber-800">
            {[
              { icon: "🎯", text: "Click pieces to select and move", delay: "delay-100" },
              { icon: "🔵", text: "Blue highlights show valid moves", delay: "delay-200" },
              { icon: "🔴", text: "Red highlights show captures", delay: "delay-300" },
              { icon: "🟣", text: "Purple shows special moves", delay: "delay-400" },
              { icon: "⟲", text: "Reverse Move button undoes last action", delay: "delay-500" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 bg-white/60 rounded-lg transition-all duration-300 hover:bg-white/80 hover:scale-105 animate-in slide-in-from-left-3 duration-500 ${item.delay}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Enhanced Original GameControls for landing page
  return (
    <div
      className={`mb-6 w-full max-w-2xl transition-all duration-500 ${showButtons ? "animate-in slide-in-from-bottom-5" : "animate-out slide-out-to-bottom-5"}`}
    >
      <div className="bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/95 backdrop-blur-md p-8 rounded-2xl border-2 border-amber-200/60 shadow-2xl relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute top-3 left-3 text-amber-600/40 animate-pulse">
          <Crown className="w-6 h-6" />
        </div>
        <div className="absolute top-3 right-3 text-amber-600/40 animate-pulse delay-1000">
          <Shield className="w-6 h-6" />
        </div>
        <div className="absolute bottom-3 left-3 text-amber-600/40 animate-pulse delay-500">
          <Sword className="w-6 h-6" />
        </div>
        <div className="absolute bottom-3 right-3 text-amber-600/40 animate-pulse delay-1500">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, rgba(217, 119, 6, 0.4) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 60%)`,
            }}
          />
        </div>

        {isSelectingRole ? (
          <div className="flex flex-col items-center space-y-8 relative z-10">
            <div className="text-center animate-in zoom-in-50 duration-700">
              <h3 className="text-3xl font-bold text-amber-900 mb-3 tracking-wide flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-amber-700 animate-bounce" />
                Choose Thy Banner
                <Shield className="w-8 h-8 text-amber-700 animate-bounce delay-300" />
              </h3>
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-4 animate-in slide-in-from-bottom-2 duration-1000 delay-300" />
              <p className="text-amber-700 italic text-lg animate-in fade-in duration-1000 delay-500">
                Will you lead the forces of light or embrace the shadows?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 animate-in slide-in-from-bottom-5 duration-1000 delay-700">
              <button
                onClick={() => {
                  setIsUserWhite(true)
                  startGame(true)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-8 py-6 bg-gradient-to-br from-white via-amber-50 to-orange-50 text-amber-900 font-bold text-xl rounded-2xl border-3 border-amber-300 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:-rotate-2 hover:shadow-amber-300/50 focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden animate-in zoom-in-75 duration-800 delay-900"
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 group-hover:animate-pulse" />

                {/* Loading spinner for creating state */}
                {isCreating && isUserWhite === true && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                    <div className="w-8 h-8 border-3 border-amber-600 rounded-full animate-spin border-t-transparent" />
                  </div>
                )}

                <span className="relative flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <Crown className="w-7 h-7 text-amber-600 group-hover:rotate-12 group-hover:scale-125 transition-all duration-500" />
                  WHITE LEGION
                  <div className="w-4 h-4 bg-white border-2 border-amber-400 rounded-full shadow-lg" />
                </span>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-300/0 via-amber-400/0 to-orange-400/0 group-hover:from-amber-300/30 group-hover:via-amber-400/40 group-hover:to-orange-400/30 transition-all duration-700" />
              </button>

              <button
                onClick={() => {
                  setIsUserWhite(false)
                  startGame(false)
                  setIsSelectingRole(false)
                }}
                disabled={isCreating}
                className="group relative px-8 py-6 bg-gradient-to-br from-amber-800 via-amber-900 to-orange-900 text-amber-100 font-bold text-xl rounded-2xl border-3 border-amber-600 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-2 hover:shadow-amber-800/50 focus:outline-none focus:ring-4 focus:ring-amber-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden animate-in zoom-in-75 duration-800 delay-1100"
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -skew-x-12 group-hover:animate-pulse" />

                {/* Loading spinner for creating state */}
                {isCreating && isUserWhite === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-amber-900/80 backdrop-blur-sm rounded-2xl">
                    <div className="w-8 h-8 border-3 border-amber-300 rounded-full animate-spin border-t-transparent" />
                  </div>
                )}

                <span className="relative flex items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-amber-400 group-hover:-rotate-12 group-hover:scale-125 transition-all duration-500" />
                  BLACK LEGION
                  <div className="w-4 h-4 bg-amber-900 border-2 border-amber-400 rounded-full shadow-lg" />
                </span>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-700/0 via-amber-800/0 to-orange-800/0 group-hover:from-amber-700/30 group-hover:via-amber-800/40 group-hover:to-orange-800/30 transition-all duration-700" />
              </button>
            </div>

            {/* Enhanced loading message */}
            {isCreating && (
              <div className="text-center animate-in fade-in duration-500">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-100/80 backdrop-blur-sm rounded-lg border border-amber-300 shadow-lg">
                  <div className="w-6 h-6 border-3 border-amber-600 rounded-full animate-spin border-t-transparent" />
                  <span className="text-amber-800 font-bold text-lg">Forging the battlefield...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center relative z-10 animate-in zoom-in-50 duration-700">
            <button
              className="group relative px-12 py-6 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white font-bold text-2xl rounded-2xl border-3 border-amber-400 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-1 hover:shadow-amber-500/60 focus:outline-none focus:ring-4 focus:ring-amber-400 focus:ring-opacity-50 tracking-wide overflow-hidden"
              onClick={() => {
                setIsSelectingRole(true)
              }}
            >
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 group-hover:animate-pulse" />

              <span className="relative flex items-center gap-4 group-hover:scale-105 transition-transform duration-300">
                <Play className="w-8 h-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                FORGE NEW BATTLE
                <Sword className="w-8 h-8 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500" />
              </span>

              {/* Enhanced glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/0 via-amber-500/0 to-orange-500/0 group-hover:from-amber-400/40 group-hover:via-amber-500/50 group-hover:to-orange-500/40 transition-all duration-700" />

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
