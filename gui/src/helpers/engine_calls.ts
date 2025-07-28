export const url = import.meta.env.VITE_PUBLIC_BACKEND_URL;

// "/create/{user_color}/game/{game_id}"
export const createGame = async (gameId: string, userIsWhite: boolean): Promise<void> => {
  const userColor = userIsWhite ? 1 : 0;
  try {
    const res = await fetch(`${url}create/${userColor}/game/${gameId}`, {
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

// "/board/{game_id}"
export const getBoard = async (game_id: string): Promise<number[]> => {
    try {
      const res = await fetch(url + "board/" + game_id);
      if (!res.ok) {
        console.error("Fetch Boards Function failed:", res.statusText);
        return [];
      }
      const data = await res.json(); // Get the object with the 'board' key
      const responseBoard: number[] = data["board"];

      // Ensure responseBoard exists and is an array before mapping
      if (!responseBoard || !Array.isArray(responseBoard)) {
          console.error("Invalid board data received:", data);
          return [];
      }

      return responseBoard;
    } catch (err) {
      console.error("Error fetching board:", err);
      return [];
    }
  };

// /game/{game_id}/moves/{square}
export const getMoves = async (game_id: string, square: number): Promise<number[]> => {
    try {
      // the endpoint returns an array with move codes
      const res = await fetch(
        `${url}game/${game_id}/moves/${square}`
      );  
      if (!res.ok) {
        console.error("Get Moves Function failed");
        return [];
      }

      const data = await res.json();

      return data["moves"];
    } catch (err) {
      console.error(err);
      return [];
    }
};
