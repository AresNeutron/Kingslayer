"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { getMoves } from "../helpers/engine_calls"
import { useWebSocket } from "../hooks/useWebSocket"
import { ChessContext } from "../hooks/useChessContext"
import type { ServerResponse } from "../types/types"
import { initialBoard, Piece } from "../helpers/constants"

const ChessProvider = ({ children }: { children: ReactNode }) => {
  const roleRef = useRef(null)
  const gameIdRef = useRef("")
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true)
  const boardRef = useRef<number[]>(initialBoard)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [animatingPieces, setAnimatingPieces] = useState<{
    [key: string]: {
      piece: number;
      fromSquare: number;
      toSquare: number;
      startTime: number;
    }
  }>({})
  
  // Fading pieces state for captures
  const [fadingPieces, setFadingPieces] = useState<{
    [key: string]: {
      piece: number;
      square: number;
      startTime: number;
    }
  }>({})
  
  // Promotion animation state
  const [promotingPieces, setPromotingPieces] = useState<{
    [key: string]: {
      fromPiece: number;
      toPiece: number;
      square: number;
      startTime: number;
    }
  }>({})
  const [highlight, setHighlight] = useState<number[]>([])
  const [threats, setThreats] = useState<bigint>(0n)
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null)
  const [isPromoting, setIsPromoting] = useState<boolean>(false)
  const [gameMessage, setGameMessage] = useState<string>("")

  const promotionRef = useRef<number | null>(null) // Para almanenar la casilla del peón a promover,
  const socketRef = useRef<WebSocket | null>(null)

  // Hook WebSocket optimizado
  const { connect, send, isConnected: wsConnected } = useWebSocket()

  // Calculate board updates without applying them (for post-animation)
  const calculateBoardUpdates = useCallback((response: ServerResponse) => {
    if (!response.move_data) return boardRef.current

    const [from_sq_1, to_sq_1, from_sq_2, to_sq_2] = response.move_data
    const newBoard = [...boardRef.current]
    
    // Handle primary piece movement (from_sq_2 -> to_sq_2)
    if (from_sq_2 !== -1 && to_sq_2 !== -1) {
      const piece = newBoard[from_sq_2]
      newBoard[to_sq_2] = piece
      newBoard[from_sq_2] = Piece.NO_PIECE
    }
    
    // Handle secondary movement/capture (from_sq_1 -> to_sq_1)
    if (from_sq_1 !== -1) {
      if (to_sq_1 === -1) {
        // Capture: remove piece at from_sq_1
        newBoard[from_sq_1] = Piece.NO_PIECE
      } else {
        // Castling: move rook from from_sq_1 to to_sq_1
        const rook = newBoard[from_sq_1]
        newBoard[to_sq_1] = rook
        newBoard[from_sq_1] = Piece.NO_PIECE
      }
    }
    
    // Handle promotion
    if (response.promotion_pc !== undefined && to_sq_2 !== -1) {
      newBoard[to_sq_2] = response.promotion_pc
    }
    
    return newBoard
  }, [])

  // Start promotion animation (separate from translation)
  const startPromotionAnimation = useCallback((square: number, fromPiece: number, toPiece: number) => {
    setIsAnimating(true)
    const currentTime = Date.now()
    
    setPromotingPieces({
      [`promotion_${currentTime}`]: {
        fromPiece,
        toPiece,
        square,
        startTime: currentTime
      }
    })

    // Complete promotion animation after 200ms
    setTimeout(() => {
      boardRef.current[square] = toPiece
      setPromotingPieces({})
      setIsAnimating(false)
    }, 200)
  }, [])

  // Start translation and fading animations
  const startTranslationAnimation = useCallback((response: ServerResponse) => {
    if (!response.move_data) return

    setIsAnimating(true)
    const [from_sq_1, to_sq_1, from_sq_2, to_sq_2] = response.move_data
    const currentTime = Date.now()
    const newAnimatingPieces: typeof animatingPieces = {}
    const newFadingPieces: typeof fadingPieces = {}

    // Primary piece animation (from_sq_2 -> to_sq_2)
    if (from_sq_2 !== -1 && to_sq_2 !== -1) {
      const piece = boardRef.current[from_sq_2]
      newAnimatingPieces[`primary_${currentTime}`] = {
        piece,
        fromSquare: from_sq_2,
        toSquare: to_sq_2,
        startTime: currentTime
      }
    }

    // Handle capture or castling
    if (from_sq_1 !== -1) {
      if (to_sq_1 === -1) {
        // Capture: fade piece at from_sq_1
        const capturedPiece = boardRef.current[from_sq_1]
        newFadingPieces[`captured_${currentTime}`] = {
          piece: capturedPiece,
          square: from_sq_1,
          startTime: currentTime
        }
      } else {
        // Castling: animate rook from from_sq_1 to to_sq_1
        const rook = boardRef.current[from_sq_1]
        newAnimatingPieces[`secondary_${currentTime}`] = {
          piece: rook,
          fromSquare: from_sq_1,
          toSquare: to_sq_1,
          startTime: currentTime
        }
      }
    }

    setAnimatingPieces(newAnimatingPieces)
    setFadingPieces(newFadingPieces)

    // Check for engine promotion (has move_data AND promotion_pc)
    const hasPromotion = response.promotion_pc !== undefined && to_sq_2 !== -1
    
    // Complete translation animation after 300ms
    setTimeout(() => {
      const newBoard = calculateBoardUpdates(response)
      
      if (hasPromotion) {
        // For engine promotion: don't apply promotion_pc yet, start promotion animation
        const boardWithoutPromotion = [...newBoard]
        boardWithoutPromotion[to_sq_2] = boardRef.current[from_sq_2] // Keep the pawn
        boardRef.current = boardWithoutPromotion
        
        // Start promotion animation after translation completes
        setTimeout(() => {
          startPromotionAnimation(to_sq_2, boardRef.current[from_sq_2], response.promotion_pc!)
        }, 50) // Small delay between phases
      } else {
        // Normal move: apply all updates
        boardRef.current = newBoard
        setIsAnimating(false)
      }
      
      setAnimatingPieces({})
      setFadingPieces({})
    }, 300)
  }, [calculateBoardUpdates, startPromotionAnimation])

  const handleMessage = useCallback((messageEvent: MessageEvent) => {
    try {
      const response: ServerResponse = JSON.parse(messageEvent.data)
      console.log("WebSocket response:", response)

      // Start animation instead of immediate board update
      startTranslationAnimation(response)

      // Handle game events
      switch (response.event) {
        case "promotion":
          setIsPromoting(true)
          promotionRef.current = response.event_data
          break

        case "none":
          if (response.status === "nextturn") {
            setIsUserTurn((prevState) => !prevState)
          }
          setThreats(0n)
          setGameMessage("")
          break

        case "check":
          setThreats(BigInt(response.event_data))
          setGameMessage("CHECK!")
          if (response.status === "nextturn") {
            setIsUserTurn((prevState) => !prevState)
          }
          break

        case "checkmate":
          setGameMessage("Game Over")
          setIsUserTurn(false)
          break

        case "stalemate":
          setGameMessage("Game Over. It's a match")
          setIsUserTurn(false)
          break

        default:
          console.warn("Unknown WebSocket event:", response.event)
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err)
    }
  }, [startTranslationAnimation])

  const initializeWebSocket = useCallback(
    async (gameId: string) => {
      try {
        const ws = await connect(gameId)
        socketRef.current = ws

        // Configurar handlers
        ws.onmessage = handleMessage

        return ws
      } catch (error) {
        console.error("Error conectando WebSocket:", error)
        setGameMessage("Error de conexión")
        throw error
      }
    },
    [connect, handleMessage],
  )

  // this useEffect works to call the engine move
  // but sometimes the console triggers the warn message
  // gotta find a way to fix it
  useEffect(() => {
    console.log("use effect is being triggered")
    if (!isUserTurn) {
      let success;
      setTimeout(() => {
        {success = send({ event: "engine_moves", data: null })}
      }, 500) 
      if (!success) {
        console.warn("Could not call server to move engine")
      }
    }
  }, [isUserTurn, send])


  const handleLightState = async (square: number) => {
    if (gameIdRef.current) {
      const newLighted = await getMoves(gameIdRef.current, square)
      setHighlight(newLighted)
    }
  }

  const handlePromotionState = useCallback(
    (promotion: number) => {
      if (!wsConnected()) {
        setGameMessage("No hay conexión")
        return
      }

      const success = send({
        event: "promotion",
        data: promotion % 6, // divide by 6 to ensure it's a piece type
      })

      if (success) {
        setIsPromoting(false)
        promotionRef.current = null
      }
    },
    [send, wsConnected],
  )

  const handleMoveState = useCallback(
    (move_code: number) => {
      if (!wsConnected()) {
        setGameMessage("No hay conexión")
      }

      const success = send({
        event: "user_moves",
        data: move_code,
      })

      if (success) {
        setHighlight([])
        setSelectedSquare(null)
        setThreats(0n)
        setGameMessage("")
      }
    },
    [send, wsConnected],
  )

  return (
    <ChessContext.Provider
      value={{
        board: boardRef.current,
        isAnimating,
        animatingPieces,
        fadingPieces,
        promotingPieces,
        gameIdRef,
        roleRef,
        isUserTurn,
        setIsUserTurn,
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
      {children}
    </ChessContext.Provider>
  )
}

export default ChessProvider
export { ChessProvider }
