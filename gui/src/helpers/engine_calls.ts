export const url =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_PUBLIC_BACKEND_URL) || "http://localhost:8000/"

// "/create/{user_color}/game/{game_id}"
export const createGame = async (gameId: string, userIsWhite: boolean): Promise<void> => {
  const userColor = userIsWhite ? 1 : 0
  try {
    const res = await fetch(`${url}create/${userColor}/game/${gameId}`, {
      method: "POST",
    })
    if (res.ok) {
      console.log("New game created!")
    }
    const data = await res.json()
    console.log(data)
  } catch (error) {
    console.error("Error resetting game:", error)
  }
}

// /game/{game_id}/moves/{square}
export const getMoves = async (game_id: string, square: number): Promise<number[]> => {
  try {
    // the endpoint returns an array with move codes
    const res = await fetch(`${url}game/${game_id}/moves/${square}`)
    if (!res.ok) {
      console.error("Get Moves Function failed")
      return []
    }

    const data = await res.json()

    return data["moves"]
  } catch (err) {
    console.error(err)
    return []
  }
}
