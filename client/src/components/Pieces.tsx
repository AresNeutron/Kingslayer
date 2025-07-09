import Image from "next/image";
import { useChessContext } from "@/hooks/ChessContext";
import { Piece } from "@/helpers/constants";

function Pieces() {
  const {
    roleRef,
    board, // 'bitboards' ahora es 'board'
    highlight,
    selectedSquare,
    setSelectedSquare,
    handleLightState,
    handleMoveState,
  } = useChessContext();

  function handleClick(squareIndex: number, piece: number) {
    const isWhite = piece > Piece.BLACK_ROOK;
    const isUserTurn = roleRef.current === isWhite;

    if (!isUserTurn && selectedSquare === null) return; // No es tu turno para seleccionar

    // Si ya hay una pieza seleccionada
    if (selectedSquare !== null) {
      // Caso 1: Cambiar de pieza seleccionada a otra del mismo color
      if (isUserTurn) {
        handleLightState(squareIndex);
        setSelectedSquare(squareIndex);
        return; // Terminamos la ejecución aquí
      }
      
      // Caso 2: Mover a una casilla (captura o movimiento a casilla vacía)
      // Buscamos si el 'squareIndex' es un destino válido en el array 'highlight'
      const validMoveCode = highlight.find(move => (move & 0x3F) === squareIndex);
      if (validMoveCode !== undefined) {
        handleMoveState(validMoveCode);
      }

    } else {
      // Caso 3: Seleccionar una pieza por primera vez (y es tu turno)
      if (isUserTurn) {
        handleLightState(squareIndex);
        setSelectedSquare(squareIndex);
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 w-[var(--board-size)] h-[var(--board-size)] pointer-events-none z-10">
      <div className='relative w-full h-full'> 
        {/* Renderizamos las piezas iterando sobre el nuevo array 'board' */}
        {board.map((piece, i) => {
          // Solo renderizamos si hay una pieza en la casilla (NO_PIECE = 12)
          if (piece !== Piece.NO_PIECE) {
            const col = i % 8;
            // Invertir filas si el usuario juega con blancas para que el tablero no se vea al revés
            const row = roleRef.current ? (7 - Math.floor(i / 8)) : Math.floor(i / 8);
          
            return (
              <div
                key={i}
                onClick={() => handleClick(i, piece)}
                className="absolute transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center"
                style={{
                  width: 'var(--cell-size)',
                  height: 'var(--cell-size)',
                  top: `${row * (64)}px`,
                  left: `${col * 64}px`,
                  // transform: `translate(${col * 100}%, ${row * 100}%)`,
                  // Habilitamos los eventos de puntero solo en las piezas, no en el contenedor
                  pointerEvents: 'auto'
                }}
              >
                <Image
                  src={`/images/${piece}.png`}
                  alt={`Chess piece ${piece}`}
                  width={64}
                  height={64}
                  className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in hover:scale-110"
                />            
              </div>
            );
          }
          return null; // No renderizar nada si no hay pieza
        })}
      </div>
    </div>
  );
}

export default Pieces;
