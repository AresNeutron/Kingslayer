"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getBitboards, getMoves } from "../helpers/engine_calls";
import { ChessContextValue } from "../types/context";
import { requestMove, requestPromotion } from "@/helpers/websocket_calls";

const ChessContext = createContext<ChessContextValue | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const roleRef = useRef(null);
  const gameIdRef = useRef("");
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const [bitboards, setBitboards] = useState<bigint[]>([]);
  const [highlight, setHighlight] = useState<bigint>(0n);
  const [threats, setThreats] = useState<bigint>(0n);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [isPromoting, setIsPromoting] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>("");

  const promotionRef = useRef<number | null>(null); // Para almanenar la casilla del peón a promover,
  const socketRef = useRef<WebSocket | null>(null);

  // Manejo de mensajes WebSocket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const handleMessage = (messageEvent: MessageEvent) => {
      try {
        const { event: eventType, data } = JSON.parse(messageEvent.data);
        console.log(eventType);
        switch (eventType) {
          case "promotion_required":
            setIsPromoting(true);
            promotionRef.current = data.pawn_square;
            break;
          case "promotion_made":
            setIsUserTurn(false);
            break;
          case "user_move_made":
            setIsUserTurn(false);
            break;
          case "engine_move_made":
            setIsUserTurn(true);
            break;
          case "check":
            setThreats(data["threats"]);
            setGameMessage("Your king is in check!");
            setIsUserTurn(true);
            break;
          case "checkmate":
            const message = `Game Over. ${
              data["user_wins"]
                ? "Congratulations, you win!"
                : "Seems that my engine could beat you."
            }`;
            setGameMessage(message);
            break;
          case "stalemate":
            setGameMessage("Game Over. It's a match");
            break;
          default:
            console.warn("Evento WebSocket desconocido:", eventType);
        }
        updateBitboardState(gameIdRef.current);
      } catch (err) {
        console.error("Error parseando mensaje WebSocket:", err);
      }
    };

    socket.onmessage = handleMessage;
    return () => {
      socket.onmessage = null;
    };
  }, [highlight, bitboards]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    if (!isUserTurn) {
      socket.send(JSON.stringify({ event: "engine_moves" }));
    }
  }, [isUserTurn]);

  const updateBitboardState = async (gameId: string) => {
    if (gameId) {
      console.log(gameId);
      const typesList = await getBitboards(gameId);
      setBitboards(typesList);
    }
  };

  const handleLightState = async (square: number) => {
    if (gameIdRef.current) {
      const newLighted = await getMoves(gameIdRef.current, square);
      setHighlight(newLighted);
    }
  };

  const handlePromotionState = async (promotion: string) => {
    await requestPromotion(socketRef.current, promotionRef.current, promotion);
    promotionRef.current = null;
    setIsPromoting(false);
  };

  const handleMoveState = async (from_sq: number, to_sq: number) => {
    await requestMove(socketRef.current, from_sq, to_sq);
    setHighlight(0n);
    setSelectedSquare(null);
    setThreats(0n);
    setGameMessage("")
  };

  return (
    <ChessContext.Provider
      value={{
        bitboards,
        gameIdRef,
        roleRef,  
        isUserTurn,
        setIsUserTurn,
        updateBitboardState,
        highlight,
        threats,
        handleLightState,
        handlePromotionState,
        selectedSquare,
        setSelectedSquare,
        handleMoveState,
        isPromoting,
        socketRef,
        gameMessage,
        setGameMessage,
      }}
    >
      {children} {/* ← Se debe renderizar children aquí */}
    </ChessContext.Provider>
  );
};

export default ContextProvider;

export const useChessContext = () => {
  const context = useContext(ChessContext);
  if (!context) {
    throw new Error("Must be used within a AppContext Provider");
  }
  return context;
};
