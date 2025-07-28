import { createContext, useContext } from "react";
import type { ChessContextValue } from "../types/context";

export const ChessContext = createContext<ChessContextValue | undefined>(undefined);

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    // Es buena práctica ser específico sobre qué proveedor se espera
    throw new Error("useChessContext must be used within a ChessProvider");
  }
  return context;
};