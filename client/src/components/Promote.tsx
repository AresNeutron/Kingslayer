"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { useChessContext } from "@/hooks/ChessContext";

function Promote() {
  const { handlePromotionState, roleRef } = useChessContext();
  const optionsList: string[] = ["queen", "bishop", "rook", "knight"]

  // Track window dimensions for dynamic resizing
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const promoteWidth = 400;
  const xPos = Math.round((windowSize.width - promoteWidth) / 2); // Esto debería funcionar
  const yPos = Math.round(windowSize.height / 2);
  const color = roleRef.current ? "white" : "black"

  return (
    <div
      style={{ top: `${yPos}px`, left: `${2 * xPos}px` }}
      className="promotionContainer"
    >
      <h3 className="promotionInfo">Choose a promotion:</h3>
      <div>
        {Object.keys(optionsList).map((option, index) => (
          <div
            key={index}
            className="promotionPiece"
            onClick={() => {
              handlePromotionState(`${color}_${option}`);
            }}
          >
            <Image
              src={`/public/images/${color}_${option}.png`}
              alt={`${color}_${option}`}
              layout="fill"
              // O usar la prop layout="fill" si la imagen debe ocupar el contenedor padre
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Promote;
