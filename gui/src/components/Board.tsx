import { useChessContext } from "../hooks/useChessContext"
import Pieces from "./Pieces"
import Square from "./Square"

function Board() {
  const { roleRef } = useChessContext()

  return (
    <div className="relative animate-in zoom-in-95 duration-1000">
      {/* Medieval board frame with enhanced decorative elements */}
      <div className="absolute -inset-6 bg-gradient-to-br from-[var(--card)] via-[var(--muted)] to-[var(--secondary)] rounded-2xl border-4 border-[var(--border)] shadow-[var(--shadow-strong)]">
        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 text-3xl text-[var(--accent)] opacity-60 animate-pulse">♜</div>
        <div className="absolute -top-2 -right-2 text-3xl text-[var(--accent)] opacity-60 animate-pulse delay-500">
          ♖
        </div>
        <div className="absolute -bottom-2 -left-2 text-3xl text-[var(--accent)] opacity-60 animate-pulse delay-1000">
          ♛
        </div>
        <div className="absolute -bottom-2 -right-2 text-3xl text-[var(--accent)] opacity-60 animate-pulse delay-1500">
          ♕
        </div>

        {/* Medieval border pattern */}
        <div className="absolute inset-2 border-2 border-[var(--accent)] opacity-40 rounded-xl shadow-[var(--shadow-glow)]"></div>
      </div>

      {/* Main chess board - optimized for horizontal layout */}
      <div
        className="w-[var(--board-size)] h-[var(--board-size)] grid grid-cols-8 grid-rows-8 
                   border-4 border-[var(--accent)] rounded-xl overflow-hidden relative 
                   shadow-[var(--shadow-strong)] bg-gradient-to-br from-[var(--medieval-brown-medium)] to-[var(--medieval-brown-dark)]"
        style={{
          boxShadow: `
            inset 0 0 20px rgba(0,0,0,0.4),
            0 8px 32px rgba(0,0,0,0.6),
            0 0 0 2px var(--border),
            0 0 20px rgba(184, 134, 11, 0.2)
          `,
        }}
      >
        {/* Medieval board texture overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(184, 134, 11, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 38, 53, 0.1) 0%, transparent 50%)
            `,
          }}
        />

        {/* Adding the 64 squares with enhanced medieval wood tones */}
        {Array.from({ length: 64 }).map((_, index) => {
          const isBlack = Math.floor(index / 8) % 2 === index % 2
          const col = index % 8
          const row = roleRef.current ? 7 - Math.floor(index / 8) : Math.floor(index / 8)

          return (
            <div
              key={index}
              className="flex items-center justify-center text-xs transition-all duration-300 ease-in-out relative"
              style={{
                backgroundColor: isBlack ? "var(--medieval-brown-dark)" : "var(--medieval-brown-light)",
                boxShadow: isBlack ? "inset 0 0 10px rgba(0,0,0,0.3)" : "inset 0 0 10px rgba(184,134,11,0.1)",
              }}
            >
              {/* Enhanced wood grain effect */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: isBlack
                    ? "linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.2) 50%, transparent 60%)"
                    : "linear-gradient(45deg, transparent 40%, rgba(184,134,11,0.1) 50%, transparent 60%)",
                }}
              />
              <Square index={row * 8 + col} />
            </div>
          )
        })}
        <Pieces />
      </div>

      {/* Medieval coordinate labels - enhanced styling */}
      <div className="absolute -left-10 top-0 h-full flex flex-col justify-around text-[var(--muted-foreground)] font-bold">
        {(roleRef.current ? ["1", "2", "3", "4", "5", "6", "7", "8"] : ["8", "7", "6", "5", "4", "3", "2", "1"]).map(
          (num, i) => (
            <span key={i} className="text-lg drop-shadow-sm">
              {num}
            </span>
          ),
        )}
      </div>
      <div className="absolute -bottom-10 left-0 w-full flex justify-around text-[var(--muted-foreground)] font-bold">
        {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter, i) => (
          <span key={i} className="text-lg drop-shadow-sm">
            {letter}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Board
