export const MoveType = {
  MOVE: 0,
  CAPTURE: 1,
  CASTLING: 2,
  EN_PASSANT: 3,
  PROMOTION: 4,
  PROMOTION_CAPTURE: 5,
};

export const Piece = {
    BLACK_BISHOP: 0,
    BLACK_KING: 1,
    BLACK_KNIGHT: 2,
    BLACK_PAWN: 3,
    BLACK_QUEEN: 4,
    BLACK_ROOK: 5,
    WHITE_BISHOP: 6,
    WHITE_KING: 7,
    WHITE_KNIGHT: 8,
    WHITE_PAWN: 9,
    WHITE_QUEEN: 10,
    WHITE_ROOK: 11,
    NO_PIECE: 12
};

export const initialBoard = [
  // Rank 1 (White pieces, indexes 0-7)
  Piece.WHITE_ROOK, Piece.WHITE_KNIGHT, Piece.WHITE_BISHOP, Piece.WHITE_QUEEN,
  Piece.WHITE_KING, Piece.WHITE_BISHOP, Piece.WHITE_KNIGHT, Piece.WHITE_ROOK,
  
  // Rank 2 (White pawns, indexes 8-15)
  Piece.WHITE_PAWN, Piece.WHITE_PAWN, Piece.WHITE_PAWN, Piece.WHITE_PAWN,
  Piece.WHITE_PAWN, Piece.WHITE_PAWN, Piece.WHITE_PAWN, Piece.WHITE_PAWN,

  // Ranks 3-6 (Empty squares, indexes 16-47)
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE, Piece.NO_PIECE,
  
  // Rank 7 (Black pawns, indexes 48-55)
  Piece.BLACK_PAWN, Piece.BLACK_PAWN, Piece.BLACK_PAWN, Piece.BLACK_PAWN,
  Piece.BLACK_PAWN, Piece.BLACK_PAWN, Piece.BLACK_PAWN, Piece.BLACK_PAWN,
  
  // Rank 8 (Black pieces, indexes 56-63)
  Piece.BLACK_ROOK, Piece.BLACK_KNIGHT, Piece.BLACK_BISHOP, Piece.BLACK_QUEEN,
  Piece.BLACK_KING, Piece.BLACK_BISHOP, Piece.BLACK_KNIGHT, Piece.BLACK_ROOK,
]