// Define the type for the bb_dict variable
export type Data = {
    [key: string]: number;
  };


  // types/websocket.ts
export type WebSocketEvent = MessageEvent & {
  data: string; // Assuming the server always sends stringified JSON
};

export type WebSocketOnEvent = (eventType: string, data: Data) => void;

export interface GameMessage {
  event: string,
  data: number | null
}

export interface ServerResponse {
  move_data?: [number, number, number, number];
  promotion_pc?: number;
  event_data: number;
  event: "none" | "check" | "checkmate" | "stalemate" | "promotion";
  status: "nextturn" | "awaiting";
}