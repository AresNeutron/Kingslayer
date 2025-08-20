# Kingslayer Chess Engine Server

A FastAPI-based WebSocket server that manages instances of the Kingslayer chess engine written in C++. Each game session runs its own engine subprocess and communicates via a custom UCI-like protocol.

## Architecture Overview

- **FastAPI Server** (`main.py`) - WebSocket endpoints and game session management
- **GameManager** (`game_manager.py`) - Subprocess management and engine communication
- **C++ Engine** (`./src/engine`) - Chess engine binary with custom protocol
- **Auto-cleanup** - Games are automatically deleted after 1 hour of inactivity

## Engine Protocol

The engine uses a **custom streaming format** (not standard UCI) that provides structured data for frontend animations and game state management.

### Engine Commands (Input)
```
uci          - Initialize engine  
isready      - Check if ready
ucinewgame   - Start new game
makemove X   - User makes move X (move_code as uint16)
promote X    - Resolve promotion to piece type X (0-5)
enginego     - Engine makes its move
getmoves X   - Get legal moves for square X
quit         - Shutdown engine
```

### Engine Response Format (Output)

The engine outputs structured data in this **exact order**:

#### Required Fields (always present):
```
event_data <number>     # Threat bitboard OR promotion square
event <string>          # Game event: "none", "check", "checkmate", "stalemate", "promotion"  
<status>               # "nextturn" or "awaiting"
```

#### Optional Fields (when applicable):
```
move_data <4_integers>  # Animation data: from_sq_1 to_sq_1 from_sq_2 to_sq_2
promotion_pc <number>   # Promoted piece enum (0-11) or 12 (NO_PIECE)
```

### Response Examples

**Regular Move:**
```
move_data -1 -1 12 28
event_data 0
event none
nextturn
```

**User Promotion (Waiting for Input):**
```
move_data -1 -1 8 0  
event_data 0
event promotion
awaiting
```

**User Promotion Resolution:**
```
move_data -1 -1 -1 63
promotion_pc 4
event_data 2048
event check
nextturn
```

**Engine Promotion:**
```
move_data -1 -1 48 56
promotion_pc 10
event_data 0
event none  
nextturn
```

**Castling:**
```
move_data 7 5 4 6
event_data 0
event none
nextturn
```

## WebSocket API

### Connection
```
ws://localhost:8000/ws/{game_id}
```

### Message Format

**Client → Server:**
```json
{
  "event": "user_moves" | "engine_moves" | "promotion",
  "data": <move_code> | <promotion_type> | null
}
```

**Server → Client:**
```json
{
  "move_data": [from_sq_1, to_sq_1, from_sq_2, to_sq_2],  // optional
  "promotion_pc": <piece_enum>,                            // optional  
  "event_data": <bitboard_or_square>,                      // required
  "event": "none|check|checkmate|stalemate|promotion",     // required
  "status": "nextturn|awaiting"                            // required
}
```

### Events Explained

#### `user_moves`
- **Input:** `move_code` (uint16) 
- **Response:** Move animation data + game state
- **Special:** If promotion needed, returns `event: "promotion"` + `status: "awaiting"`

#### `engine_moves`  
- **Input:** None
- **Response:** Engine move + optional promotion data + game state

#### `promotion`
- **Input:** `promotion_type` (0-5: BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK)
- **Response:** Promoted piece + resulting game state

## Data Types Reference

### Piece Enums (0-11)
```cpp
BLACK_BISHOP = 0    WHITE_BISHOP = 6
BLACK_KING = 1      WHITE_KING = 7  
BLACK_KNIGHT = 2    WHITE_KNIGHT = 8
BLACK_PAWN = 3      WHITE_PAWN = 9
BLACK_QUEEN = 4     WHITE_QUEEN = 10
BLACK_ROOK = 5      WHITE_ROOK = 11
NO_PIECE = 12
```

### Move Data Format
- **`from_sq_1, to_sq_1`**: Secondary animation (rook in castling, captured piece fade)
- **`from_sq_2, to_sq_2`**: Primary move (piece being moved)
- **`-1`**: NO_SQ (no animation for that position)

### Game Events
- **`"none"`**: Normal move, no special conditions
- **`"check"`**: Current player is in check  
- **`"checkmate"`**: Game over, current player loses
- **`"stalemate"`**: Game over, draw
- **`"promotion"`**: User promotion required (only for user moves)

### Status Values
- **`"nextturn"`**: Turn completed, game continues
- **`"awaiting"`**: Waiting for user input (promotion choice)

## Game Session Management

- **Auto-creation**: New GameManager created when game_id first accessed
- **Auto-cleanup**: Games deleted after 1 hour of inactivity
- **WebSocket disconnect**: Game immediately deleted (data lost)
- **Subprocess management**: Each game runs its own engine process

## Example Usage Flow

1. **Connect:** `ws://localhost:8000/ws/game123`
2. **User Move:** Send `{"event": "user_moves", "data": 4096}`  
3. **Response:** Receive move animation + game state
4. **Engine Move:** Send `{"event": "engine_moves", "data": null}`
5. **Response:** Receive engine move + game state
6. **Promotion:** If needed, send `{"event": "promotion", "data": 4}` (Queen)

## Development Notes

- Engine must be compiled and placed at `./src/engine`
- Server runs on port 8000 by default
- CORS configured for localhost:5173 and Vercel deployments
- All game data is ephemeral (not persisted to database)
- Engine protocol is **custom**, not standard UCI

This server bridges the gap between the custom C++ chess engine and web frontends, providing real-time game state and animation data through WebSocket connections.