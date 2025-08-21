import type { Dispatch, RefObject, SetStateAction } from "react";

export interface ChessContextValue {
  board: number[];
  gameIdRef: RefObject<string>;
  roleRef: RefObject<boolean | null>;
  isUserTurn: boolean;
  setIsUserTurn: Dispatch<SetStateAction<boolean>>;
  highlight: number[];
  threats: bigint;
  handleLightState: (square: number) => Promise<void>;
  handlePromotionState: (promotion: number) => void;
  selectedSquare: number | null;
  setSelectedSquare: Dispatch<SetStateAction<number | null>>;
  handleMoveState: (move_code: number) => void;
  isPromoting: boolean;
  isAnimating: boolean;
  animatingPieces: {
    [key: string]: {
      piece: number;
      fromSquare: number;
      toSquare: number;
      startTime: number;
    }
  };
  fadingPieces: {
    [key: string]: {
      piece: number;
      square: number;
      startTime: number;
    }
  };
  socketRef: RefObject<WebSocket | null>;
  gameMessage: string;
  setGameMessage: Dispatch<SetStateAction<string>>;
  initializeWebSocket: (gameId: string) => Promise<WebSocket>;
}
