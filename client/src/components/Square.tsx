import { useChessContext } from "@/hooks/ChessContext";

//This component only renders if its position is lighted
function Square({ index }:{ index: number}) {
  const { selectedSquare, handleMoveState, highlight, threats} = useChessContext();
  
  const mask = 1n << BigInt(index);
  let bg = ""; 
  if (selectedSquare === index)      bg = "yellow";
  else if (BigInt(highlight) & mask) bg = "blue";
  else if (BigInt(threats) & mask) bg = "red"

  return (
    <div
      onClick={() => {
        if (selectedSquare !== null && bg === "blue")  handleMoveState(selectedSquare, index);
      }
    }
      className={`absolute w-[var(--cell-size)] h-[var(--cell-size)] flex items-center justify-center
      pointer-events-auto cursor-pointer rounded-md transition-all duration-300 ease-in-out ${bg}`}
    ></div>
  );
  };

export default Square;