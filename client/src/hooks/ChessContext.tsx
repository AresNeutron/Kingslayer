"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getBoard, getMoves } from "../helpers/engine_calls";
import { ChessContextValue } from "../types/context";
import { useWebSocket } from "./useWebSocket";

const ChessContext = createContext<ChessContextValue | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const roleRef = useRef(null);
  const gameIdRef = useRef("");
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const [board, setBoard] = useState<number[]>([]);
  const [highlight, setHighlight] = useState<number[]>([]);
  const [threats, setThreats] = useState<bigint>(0n);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [isPromoting, setIsPromoting] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>("");

  const promotionRef = useRef<number | null>(null); // Para almanenar la casilla del peón a promover,
  const socketRef = useRef<WebSocket | null>(null);

  // Hook WebSocket optimizado
  const { connect, send, isConnected: wsConnected } = useWebSocket();

  const initializeWebSocket = useCallback(
    async (gameId: string) => {
      try {
        const ws = await connect(gameId);
        socketRef.current = ws;

        // Configurar handlers
        ws.onmessage = handleMessage;

        return ws;
      } catch (error) {
        console.error("Error conectando WebSocket:", error);
        setGameMessage("Error de conexión");
        throw error;
      }
    },
    [connect]
  );

  // These are the possible server messages: "none", "check", "checkmate", "stalemate", "promotion"
  const handleMessage = useCallback((messageEvent: MessageEvent) => {
    try {
      const { event: eventType, data } = JSON.parse(messageEvent.data);
      console.log("WebSocket event:", eventType);

      switch (eventType) {
        case "promotion":
          setIsPromoting(true);
          promotionRef.current = data.pawn_square;
          break;

        case "none":
          setIsUserTurn((prevState) => !prevState);
          break;

        case "check":
          setThreats(data);
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
          setIsUserTurn(false);
          break;

        case "stalemate":
          setGameMessage("Game Over. It's a match");
          setIsUserTurn(false);
          break;

        default:
          console.warn("Evento WebSocket desconocido:", eventType);
      }

      // Actualizar tablero después de procesar el mensaje
      updateBitboardState(gameIdRef.current);
    } catch (err) {
      console.error("Error parseando mensaje WebSocket:", err);
    }
  }, []);

  useEffect(() => {
    console.log("use effect is being triggered");
    if (!isUserTurn) {
      const success = send({ event: "engine_moves", data: null });
      if (!success) {
        console.warn("Could not call server to move engine");
      }
    }
  }, [isUserTurn, send]);

  const updateBitboardState = async (gameId: string) => {
    if (gameId) {
      console.log("Board Updated");
      const board = await getBoard(gameId);
      setBoard(board);
    }
  };

  const handleLightState = async (square: number) => {
    if (gameIdRef.current) {
      const newLighted = await getMoves(gameIdRef.current, square);
      setHighlight(newLighted);
    }
  };

  const handlePromotionState = useCallback(
    (promotion: number) => {
      if (!wsConnected()) {
        setGameMessage("No hay conexión");
        return;
      }

      const success = send({
        event: "promotion",
        data: promotion,
      });

      if (success) {
        setIsPromoting(false);
        promotionRef.current = null;
      }
    },
    [send, wsConnected]
  );

  const handleMoveState = useCallback(
    (move_code: number) => {
      if (!wsConnected()) {
        setGameMessage("No hay conexión");
      }

      const success = send({
        event: "user_moves",
        data: move_code,
      });

      if (success) {
        setHighlight([]);
        setSelectedSquare(null);
        setThreats(0n);
        setGameMessage("");
      }
    },
    [send, wsConnected]
  );

  return (
    <ChessContext.Provider
      value={{
        board,
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
        initializeWebSocket,
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
