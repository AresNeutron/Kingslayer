// hooks/useWebSocket.js
import { GameMessage } from "@/types/types";
import { useRef, useCallback, RefObject } from "react";

export function useWebSocket() {
  const socketRef: RefObject<null | WebSocket> = useRef(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async (gameId: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("http", "ws");
        if (!url) {
          reject(new Error("Backend URL not configured"));
          return;
        }

        const ws = new WebSocket(`${url}ws/${gameId}`);

        ws.onopen = () => {
          console.log(`WebSocket connected for game ${gameId}`);
          socketRef.current = ws;
          resolve(ws);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          socketRef.current = null;

          // Reconexión automática si no fue cierre intencional
          if (event.code !== 1000 && event.code !== 1001) {
            reconnectTimeoutRef.current = setTimeout(() => {
              console.log("Attempting to reconnect...");
              connect(gameId);
            }, 3000);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (socketRef.current) {
      socketRef.current.close(1000, "Cierre intencional");
      socketRef.current = null;
    }
  }, []);

  const send = useCallback((message: GameMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn("WebSocket no está conectado");
    return false;
  }, []);

  const isConnected = useCallback(() => {
    return socketRef.current && socketRef.current.readyState === WebSocket.OPEN;
  }, []);

  return {
    connect,
    disconnect,
    send,
    isConnected,
    socketRef,
  };
}
