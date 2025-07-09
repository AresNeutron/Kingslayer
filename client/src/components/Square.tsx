import { MoveType } from "@/helpers/constants";
import { useChessContext } from "@/hooks/ChessContext";

function Square({ index }: { index: number }) {
  const { selectedSquare, handleMoveState, highlight, threats } =
    useChessContext();

  let bg = "";
  let moveCode: number | undefined = 0;
  let isMoveTarget = false;

  if (selectedSquare === index) {
    bg = "yellow";
  } else {
    if (highlight && highlight.length > 0) {
      // Usamos .find() para encontrar el primer movimiento que apunte a este 'index'
      moveCode = highlight.find((move) => (move & 0x3f) === index); // 0x3F es la máscara para los primeros 6 bits (0-63)

      if (moveCode !== undefined) {
        // Si encontramos un movimiento, extraemos el tipo de movimiento (los 4 bits superiores)
        const moveType = moveCode >> 12;
        isMoveTarget = index == (moveCode & 0x3f);

        switch (moveType) {
          case MoveType.MOVE:
            bg = "blue"; // Movimiento normal
            break;
          case MoveType.CAPTURE:
            bg = "red"; // Capturas
            break;
          case MoveType.PROMOTION_CAPTURE:
          case MoveType.CASTLING:
          case MoveType.EN_PASSANT:
          case MoveType.PROMOTION:
            bg = "violet"; // Otros movimientos especiales
            break;
        }
      }
    }

    if (!bg) {
      const threatMask = 1n << BigInt(index);
      if (BigInt(threats) & threatMask) {
        bg = "red";
      }
    }
  }

  return (
    <div
      onClick={() => {
        // El movimiento se ejecuta si hay una pieza seleccionada y la casilla es un destino válido
        if (selectedSquare !== null && isMoveTarget && moveCode !== undefined) {
          handleMoveState(moveCode);
        }
      }}
      className={`absolute w-[var(--cell-size)] h-[var(--cell-size)] flex items-center justify-center
      ${
        isMoveTarget
          ? "pointer-events-auto cursor-pointer"
          : "pointer-events-none"
      } 
      rounded-md transition-all duration-300 ease-in-out ${bg}`}
    ></div>
  );
}

export default Square;
