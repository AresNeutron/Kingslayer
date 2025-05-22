"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createGame, url } from "@/helpers/engine_calls";
import { useChessContext } from "@/hooks/ChessContext";

function GameControls({
  setIsPlaying,
}: {
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}) {
  const [isSelectingRole, setIsSelectingRole] = useState<boolean>(false);
  const [isUserWhite, setIsUserWhite] = useState<boolean | null>(null);
  const {
    gameIdRef,
    roleRef,
    isUserTurn,
    setIsUserTurn,
    updateBitboardState,
    socketRef,
    gameMessage,
    setGameMessage,
  } = useChessContext();

  const startGame = async (isWhite: boolean) => {
    const currentId =
      gameIdRef.current !== "" ? gameIdRef.current : crypto.randomUUID();
    console.log("CURRENT ID:", currentId);

    await createGame(currentId, isWhite);
    setIsPlaying(true);
    roleRef.current = isWhite;
    gameIdRef.current = currentId;
    updateBitboardState(currentId);

    socketRef.current = new WebSocket(
      `${url.replace("http", "ws")}ws/${currentId}`
    );

    setGameMessage("New Game Started");
  };

  useEffect(()=>{
    if (gameMessage.includes("Started") && !isUserWhite) {
      setIsUserTurn(false)
      setGameMessage("")
    }
  }, [gameMessage])

  return (
    <div className="mb-6 w-2/5 rounded-lg bg-[#2a2a2a] p-6 shadow-lg">
      {/* Game Status - Compact Version */}
      {isUserWhite !== null && (
        <div className="mb-4 rounded-md bg-secondary p-3 shadow">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-primary-foreground">
              Game Status
            </h1>
            <span
              className={`text-3xl font-extrabold ${
                gameMessage.includes("Game Over")
                  ? gameMessage.includes("Congratulations, you win!")
                    ? "text-green-500" // Verde para victoria
                    : "text-red-500" // Rojo para derrota/empate
                  : "text-accent" // Color por defecto para otros estados
              }`}
            >
              {gameMessage}
            </span>
          </div>
          {gameMessage.includes("Game Over") ? (
            <div className="mt-2 text-center text-secondary-foreground">
              Hope you have enjoyed. Press the button below to play again
            </div>
          ) : (
            <div className="flex items-center justify-between text-base">
              <p className="text-secondary-foreground">
                Playing as:{" "}
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                    isUserWhite
                      ? "bg-primary-foreground text-primary"
                      : "bg-muted-foreground text-secondary"
                  }`}
                >
                  {isUserWhite ? "WHITE" : "BLACK"}
                </span>
              </p>
              {!gameMessage.includes("Started") && (
                <p
                  className={`font-semibold ${
                    isUserTurn ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {isUserTurn ? "Your Turn" : "Engine Thinking..."}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game Controls */}
      {isSelectingRole ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-4">
          <h2 className="text-xl font-semibold">Select your role</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setIsUserWhite(true);
                startGame(true);
                setIsSelectingRole(false);
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700
           rounded-md shadow-sm text-sm font-medium text-gray-700
            dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50
             dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              White
            </button>
            <button
              onClick={() => {
                setIsUserWhite(false);
                startGame(false);
                setIsSelectingRole(false);
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700
           rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none
             focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Black
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            className="rounded-md bg-[#1c4e1c] px-6 py-3 font-bold text-[#ffffff] 
                  transition-all hover:scale-105 hover:bg-opacity-90 focus:outline-none 
                  focus:ring-2 focus:ring-[#1c4e1c] focus:ring-opacity-50"
            onClick={() => {
              setIsSelectingRole(true);
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default GameControls;
