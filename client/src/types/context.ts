// types/chessContext.ts

import { Dispatch, RefObject, SetStateAction } from "react";

export interface ChessContextValue {
  bitboards: bigint[];
  gameIdRef: RefObject<string>;
  roleRef: RefObject<boolean | null>;
  isUserTurn: boolean;
  setIsUserTurn: Dispatch<SetStateAction<boolean>>;
  updateBitboardState: (gameId: string) => Promise<void>;
  highlight: bigint;
  threats: bigint;
  handleLightState: (square: number) => Promise<void>;
  handlePromotionState: (promotion: string) => Promise<void>;
  selectedSquare: number | null;
  setSelectedSquare: Dispatch<SetStateAction<number | null>>;
  handleMoveState: (from_pos: number, to_pos: number) => Promise<void>;
  isPromoting: boolean;
  socketRef: RefObject<WebSocket | null>;
  gameMessage: string;
  setGameMessage: Dispatch<SetStateAction<string>>;
}
