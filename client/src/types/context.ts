// types/chessContext.ts

import { Dispatch, RefObject, SetStateAction } from "react";

export interface ChessContextValue {
  board: number[];
  gameIdRef: RefObject<string>;
  roleRef: RefObject<boolean | null>;
  isUserTurn: boolean;
  setIsUserTurn: Dispatch<SetStateAction<boolean>>;
  updateBitboardState: (gameId: string) => Promise<void>;
  highlight: number[];
  threats: bigint;
  handleLightState: (square: number) => Promise<void>;
  handlePromotionState: (promotion: number) => void;
  selectedSquare: number | null;
  setSelectedSquare: Dispatch<SetStateAction<number | null>>;
  handleMoveState: (move_code: number) => void;
  handleUnmakeMove: () => void;
  isPromoting: boolean;
  socketRef: RefObject<WebSocket | null>;
  gameMessage: string;
  setGameMessage: Dispatch<SetStateAction<string>>;
  initializeWebSocket: (gameId: string) => Promise<WebSocket>;
}
