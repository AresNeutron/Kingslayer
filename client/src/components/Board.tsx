import { useChessContext } from "@/hooks/ChessContext";
import Pieces from "./Pieces";
import Square from "./Square";

function Board() {
  const { roleRef } = useChessContext()

  return (
    <div className="w-[var(--board-size)] h-[var(--board-size)] grid grid-cols-8
     grid-rows-8 border-solid border-[var(--accent)] border-6 rounded-xl
      overflow-hidden relative bg-gradient-to-tr from-zinc-800 to-zinc-900">
      {/*Adding the 64 squares. Since this won't change we can use boardArray */}
      {Array.from({ length: 64 }).map((_, index) => {
          const isBlack = Math.floor(index / 8) % 2 === index % 2;
          const col =   index % 8  // Column
          
          // Invert the row if user plays as white 
          const row = roleRef.current ? (7 - Math.floor(index / 8)) : Math.floor(index / 8)

          return (
            <div
              key={index}
              className="flex items-center justify-center text-xs text-zinc-500
              transition-colors duration-300 ease-in-out"
              style={{
                backgroundColor: isBlack ? "#6e8a3a" : "#aad751", // Chessboard colors
              }}
            >
                {<Square index = {row * 8 + col}
                />}
            </div>
          );
        })
      }
      <Pieces/>
    </div>
  );
}

export default Board;
