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
      phase?: 'fade_out' | 'fade_in';
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

  // Start promotion animation (separate from translation) - now sequential
  const startPromotionAnimation = useCallback((square: number, fromPiece: number, toPiece: number) => {
    setIsAnimating(true)
    const currentTime = Date.now()
    
    // Phase 1: Fade out the pawn (200ms)
    setPromotingPieces({
      [`promotion_phase1_${currentTime}`]: {
        fromPiece,
        toPiece: fromPiece, // Keep showing the pawn during fade out
        square,
        startTime: currentTime,
        phase: 'fade_out' as const
      }
    })

    // Phase 2: Scale up/appear the new piece (after 200ms delay)
    setTimeout(() => {
      setPromotingPieces({
        [`promotion_phase2_${currentTime + 200}`]: {
          fromPiece,
          toPiece,
          square,
          startTime: Date.now(),
          phase: 'fade_in' as const
        }
      })

      // Complete promotion animation after another 200ms
      setTimeout(() => {
        boardRef.current[square] = toPiece
        setPromotingPieces({})
        setIsAnimating(false)
      }, 200)
    }, 200)
  }, [])

  // Start translation and fading animations - now sequential for captures
  const startTranslationAnimation = useCallback((response: ServerResponse) => {
    if (!response.move_data) return

    setIsAnimating(true)
    const [from_sq_1, to_sq_1, from_sq_2, to_sq_2] = response.move_data
    const currentTime = Date.now()
    
    // Check if this is a capture
    const isCapture = from_sq_1 !== -1 && to_sq_1 === -1
    
    if (isCapture) {
      // CAPTURE SEQUENCE: First fade, then translate
      
      // Phase 1: Start fading animation for captured piece
      const capturedPiece = boardRef.current[from_sq_1]
      setFadingPieces({
        [`captured_${currentTime}`]: {
          piece: capturedPiece,
          square: from_sq_1,
          startTime: currentTime
        }
      })
      
      // Phase 2: After fade completes, update board and start translation
      setTimeout(() => {
        setFadingPieces({}) // Clear fading pieces
        
        // Update board: remove captured piece immediately after fade
        const boardAfterCapture = [...boardRef.current]
        boardAfterCapture[from_sq_1] = Piece.NO_PIECE
        boardRef.current = boardAfterCapture
        
        // Start translation animation
        if (from_sq_2 !== -1 && to_sq_2 !== -1) {
          const piece = boardRef.current[from_sq_2]
          setAnimatingPieces({
            [`primary_${Date.now()}`]: {
              piece,
              fromSquare: from_sq_2,
              toSquare: to_sq_2,
              startTime: Date.now()
            }
          })
        }
        
        // Complete translation after 300ms
        setTimeout(() => {
          setAnimatingPieces({})
          
          // Update board: move attacking piece after translation
          if (from_sq_2 !== -1 && to_sq_2 !== -1) {
            const boardAfterMove = [...boardRef.current]
            boardAfterMove[to_sq_2] = boardAfterMove[from_sq_2]
            boardAfterMove[from_sq_2] = Piece.NO_PIECE
            boardRef.current = boardAfterMove
          }
          
          // Check for engine promotion
          const hasPromotion = response.promotion_pc !== undefined && to_sq_2 !== -1
          
          if (hasPromotion) {
            setTimeout(() => {
              startPromotionAnimation(to_sq_2, boardRef.current[to_sq_2], response.promotion_pc!)
            }, 50)
          } else {
            setIsAnimating(false)
          }
        }, 300)
      }, 300) // 300ms fade, no delay
      
    } else {
      // NON-CAPTURE SEQUENCE: Handle normally (translation + castling if needed)
      const newAnimatingPieces: typeof animatingPieces = {}

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

      // Handle castling
      if (from_sq_1 !== -1 && to_sq_1 !== -1) {
        const rook = boardRef.current[from_sq_1]
        newAnimatingPieces[`secondary_${currentTime}`] = {
          piece: rook,
          fromSquare: from_sq_1,
          toSquare: to_sq_1,
          startTime: currentTime
        }
      }

      setAnimatingPieces(newAnimatingPieces)

      // Complete translation animation after 300ms
      setTimeout(() => {
        setAnimatingPieces({})
        
        // Update board incrementally after animation
        const newBoard = [...boardRef.current]
        
        // Handle primary piece movement (from_sq_2 -> to_sq_2)
        if (from_sq_2 !== -1 && to_sq_2 !== -1) {
          const piece = newBoard[from_sq_2]
          newBoard[to_sq_2] = piece
          newBoard[from_sq_2] = Piece.NO_PIECE
        }
        
        // Handle castling (from_sq_1 -> to_sq_1)
        if (from_sq_1 !== -1 && to_sq_1 !== -1) {
          const rook = newBoard[from_sq_1]
          newBoard[to_sq_1] = rook
          newBoard[from_sq_1] = Piece.NO_PIECE
        }
        
        boardRef.current = newBoard
        
        // Check for engine promotion
        const hasPromotion = response.promotion_pc !== undefined && to_sq_2 !== -1
        
        if (hasPromotion) {
          setTimeout(() => {
            startPromotionAnimation(to_sq_2, boardRef.current[to_sq_2], response.promotion_pc!)
          }, 50)
        } else {
          setIsAnimating(false)
        }
      }, 300)
    }
  }, [startPromotionAnimation])

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
          setThreats(BigInt(response.event_data));
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
        boardRef,
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
