export const requestPromotion = async (
  websocket: WebSocket | null,
  pawn_square: number | null,
  promotion: string
) => {
  if (
    websocket &&
    websocket.readyState === WebSocket.OPEN &&
    pawn_square !== null
  ) {
    websocket.send(
      JSON.stringify({
        event: "promotion",
        data: { pawn_square, promotion },
      })
    );
  } else {
    console.error("WebSocket no está conectado");
  }
};

export const requestMove = async (
  websocket: WebSocket | null,
  from_sq: number,
  to_sq: number
) => {
  // Si la conexión existe y está abierta, enviar los datos con el evento
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    console.log("sending data");
    websocket.send(
      JSON.stringify({
        event: "user_moves",
        data: { from_sq, to_sq },
      })
    );
  } else {
    console.error("WebSocket no está conectado");
  }
};
