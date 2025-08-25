# ⚔️ KINGSLAYER ⚔️

A full-stack chess application featuring a custom C++ chess engine with a modern React frontend and real-time WebSocket communication.

## 🏗️ Architecture

**Kingslayer** consists of three main components:

- **🎯 Chess Engine** - Custom C++ engine with optimized move generation and search algorithms
- **⚡ FastAPI Server** - WebSocket-based server managing engine instances and game sessions  
- **🎨 React Frontend** - Modern web interface with real-time gameplay and animations

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.8+) 
- **g++** compiler with C++20 support
- **Make**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Kingslayer
```

2. **Build the Chess Engine**
```bash
cd server/src
make
cd ../..
```

3. **Setup Backend**
```bash
cd server
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
cd ..
```

4. **Setup Frontend**
```bash
cd gui
npm install
cd ..
```

### Running the Application

1. **Start the Backend Server**
```bash
cd server
source env/bin/activate  # On Windows: env\Scripts\activate
python main.py
```

2. **Start the Frontend** (in a new terminal)
```bash
cd gui
npm run dev
```

3. **Open your browser** to `http://localhost:5173`

## 🎮 How It Works

### Game Flow

1. **Connect** - Frontend establishes WebSocket connection to `/ws/{game_id}`
2. **Move** - Player makes a move, sent as `move_code` to server
3. **Process** - Server forwards move to C++ engine subprocess  
4. **Respond** - Engine returns structured game state and animation data
5. **Animate** - Frontend animates pieces and updates board state
6. **Repeat** - Process continues for engine moves and game events

### Engine Protocol

The C++ engine uses a **custom protocol** (not UCI) optimized for web frontend integration:

**Engine Commands:**
```
uci          - Initialize engine
makemove X   - Make move (move_code as uint16)  
promote X    - Resolve promotion (piece type 0-5)
enginego     - Engine calculates and makes move
getmoves X   - Get legal moves for square
quit         - Shutdown
```

**Engine Response Format:**
```
event_data <number>     # Threat bitboard or promotion square
event <string>          # "none", "check", "checkmate", "stalemate", "promotion"
<status>               # "nextturn" or "awaiting"
move_data <4_ints>     # Animation: from_sq1 to_sq1 from_sq2 to_sq2 (optional)
promotion_pc <number>   # Promoted piece enum (optional)
```

### WebSocket API

**Client Messages:**
```json
{
  "event": "user_moves" | "engine_moves" | "promotion",
  "data": <move_code> | <promotion_type> | null
}
```

**Server Responses:**
```json
{
  "move_data": [from_sq_1, to_sq_1, from_sq_2, to_sq_2],
  "promotion_pc": <piece_enum>,
  "event_data": <bitboard_or_square>, 
  "event": "none|check|checkmate|stalemate|promotion",
  "status": "nextturn|awaiting"
}
```

## 🏛️ Project Structure

```
Kingslayer/
├── gui/                          # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Board.tsx         # Chess board component
│   │   │   ├── Dashboard.tsx     # Game dashboard  
│   │   │   ├── Pieces.tsx        # Chess pieces
│   │   │   └── ...
│   │   ├── context/              # React context
│   │   ├── hooks/                # Custom hooks
│   │   └── types/                # TypeScript types
│   └── package.json
│
├── server/                       # FastAPI Backend
│   ├── src/                      # C++ Chess Engine
│   │   ├── board_state/          # Board representation
│   │   ├── game/                 # Game logic
│   │   ├── search/               # Search algorithms
│   │   ├── precomputed_moves/    # Move generation
│   │   └── Makefile              # Build configuration
│   ├── main.py                   # FastAPI server
│   ├── game_manager.py           # Engine subprocess management
│   └── requirements.txt
│
└── README.md                     # This file
```

## 🔧 Engine Features

### Core Capabilities
- **Bitboard representation** for efficient board state
- **Magic bitboard** move generation for sliding pieces
- **Alpha-beta pruning** with move ordering
- **Piece-square tables** for position evaluation
- **Special move handling** (castling, en passant, promotion)

### Move Generation
- **Pre-computed** non-sliding piece moves (King, Knight, Pawn)
- **Magic bitboards** for sliding pieces (Rook, Bishop, Queen)
- **Legal move validation** with check detection
- **Attack/threat calculation** for UI highlights

## 🎨 Frontend Features

- **Real-time gameplay** via WebSocket connections
- **Smooth animations** for piece movements and captures
- **Medieval-themed UI** with custom styling
- **Responsive design** for desktop and mobile
- **Game state management** with React Context
- **TypeScript** for type safety

## ⚙️ Development

### Backend Development
```bash
cd server
source env/bin/activate
python main.py
```

### Frontend Development  
```bash
cd gui
npm run dev
```

### Engine Development
```bash
cd server/src
make clean && make
```

### Linting
```bash
# Frontend
cd gui
npm run lint

# Backend (if configured)
cd server
# Add your Python linting commands
```

## 🎯 Game Management

- **Auto-creation** - Games created when first accessed
- **Auto-cleanup** - Games deleted after 1 hour of inactivity
- **Session isolation** - Each game runs independent engine subprocess
- **Real-time updates** - Immediate WebSocket communication
- **No persistence** - Games are ephemeral (not saved to database)

## 🌐 Deployment

The server is configured for deployment with CORS support for:
- Local development (`localhost:5173`)
- Vercel deployments (`*.vercel.app`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source. See the license file for details.

## 🎪 Acknowledgments

Built with modern web technologies and classic chess programming techniques, combining the performance of C++ with the accessibility of web interfaces.

---

*"Steel thy resolve, sharpen thy wit, and prepare for battle most glorious!"* ⚔️