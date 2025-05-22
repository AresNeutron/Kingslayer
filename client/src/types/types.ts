// Define the type for the bb_dict variable
export type Data = {
    [key: string]: number;
  };


  // types/websocket.ts
export type WebSocketEvent = MessageEvent & {
  data: string; // Assuming the server always sends stringified JSON
};

export type WebSocketOnEvent = (eventType: string, data: Data) => void;
