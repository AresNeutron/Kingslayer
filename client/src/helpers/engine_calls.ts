export  const url = "http://127.0.0.1:8000/"

// "/create/{is_user_white}/game/{game_id}"
export const createGame = async (gameId: string, isUserWhite: boolean): Promise<void> => {
  try {
    const res = await fetch(`${url}create/${isUserWhite}/game/${gameId}`, {
      method: "POST",
    });
    if (res.ok) {
      console.log("New game created!");
    }
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.error("Error resetting game:", error);
  }
};

// "/bitboards/{game_id}"
export const getBitboards = async (game_id: string): Promise<bigint[]> => {
    try {
      const res = await fetch(url + "bitboards/" + game_id);
      if (!res.ok) {
        console.error("Fetch Boards Function failed");
        return [];
      }
      const dataList: bigint[] = await res.json();

      const typesList = dataList.map(int => BigInt(int))

      return typesList
    } catch (err) {
      console.error(err);
      return [];
    }
  };


export const getMoves = async (game_id: string, square: number): Promise<bigint> => {
    try {
      const res = await fetch(
        `${url}game/${game_id}/moves/${square}`
      );  
      if (!res.ok) {
        console.error("Get Moves Function failed");
        return BigInt(0);
      }

      const legal_moves = await res.json();

      // This will return the bitboard of moves
      return legal_moves;
    } catch (err) {
      console.error(err);
      return BigInt(0);
    }
};
