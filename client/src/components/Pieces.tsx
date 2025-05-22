import { useMemo } from "react";
import Image from "next/image";
import { useChessContext } from "@/hooks/ChessContext";
import { PIECE_TYPES } from "@/helpers/constants";


function Pieces() {
  const {
    roleRef,
    bitboards,
    highlight,
    selectedSquare,
    setSelectedSquare,
    handleLightState,
    handleMoveState,
  } = useChessContext();

  const imageWidth = 64; //width set to the images

  // 2. Calcular un array de 64 posiciones con el tipo de pieza o null
  const pieceArray = useMemo(() => {
    const squares = Array(64).fill(null)
    bitboards.forEach((type_bb, index) => {
      // Sólo procesamos claves de pieza, no "white_pieces"/"black_pieces"
      let mask = type_bb
      while (mask) {
        // extraer el LSB
        const lsb = mask & -mask
        const idx = Number(BigInt.asUintN(64, BigInt(Math.log2(Number(lsb)))))
        squares[idx] = PIECE_TYPES[index]  // e.g. "white_knight"
        mask &= mask - 1n         // eliminar el bit menos significativo
      }
      })
    return squares
  }, [bitboards])

  function handleClick(square: number, pieceType: string) {
    const is_white = pieceType.includes("white")
    const isUserWhite = roleRef.current

    if (selectedSquare !== null) {
      // Para cambiar de pieza seleccionada
      if ((isUserWhite && is_white) || (!isUserWhite && !is_white)) {
        handleLightState(square);
        setSelectedSquare(square);

      // Para capturar
      } else {
        if (BigInt(highlight) & (1n << BigInt(square))) handleMoveState(selectedSquare, square)
      }
    } else {
      // Para seleccionar la pieza que se mueve
      if ((isUserWhite && is_white) || (!isUserWhite && !is_white)) {
        handleLightState(square);
        setSelectedSquare(square);
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 w-[var(--board-size)]
            h-[var(--board-size)] pointer-events-none z-50">
      <div className='relative w-full h-full'> 
        {/* Adding the pieces*/}
        {pieceArray.map((pieceType: string, i: number) =>{
          if (pieceType !== null) {
          const col =   i % 8  // Column

          // Invert the rows if user plays as white
          const row = roleRef.current ? (7 - Math.floor(i / 8)) : Math.floor(i / 8)
          
          return (
            <div
              key={i} // Important: Add a unique key prop
              onClick={() => {
                  handleClick(i, pieceType)
                }
              }
              className="absolute transition-all duration-300 ease-in-out pointer-events-none
               cursor-pointer flex items-center justify-center"
              style={{
                top: `${row * (imageWidth - 1)}px`,
                left: `${col * imageWidth - 1}px`,
              }}
            >
            <Image
              src={`/images/${pieceType}.png`}
              alt={pieceType}
              width={64}
              height={64}
              className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
               transition-transform duration-200 ease-in pointer-events-auto hover:scale-110"
              // O usar la prop layout="fill" si la imagen debe ocupar el contenedor padre
            />            
            </div>
          );
          }})}
      </div>
    </div>
  );
}

export default Pieces;