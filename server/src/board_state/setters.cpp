#include "BoardState.h"
#include <cstdint>

// =========================
// BOARD MANIPULATION - OPTIMIZED
// =========================
void BoardState::setStartPosition() {
    board = INITIAL_MAILBOX_BOARD;
    types_bb_array = INITIAL_PIECE_BITBOARDS;
    occupied_bb = INITIAL_OCCUPANCY_ALL;
    colors_bb_array = INITIAL_OCCUPANCY_BY_COLOR;
}

void BoardState::movePiece(int fromSq, int toSq) {
    const Piece pc = board[fromSq];
    const Color color = colorOf(pc);
    
    const uint64_t fromMask = 1ULL << fromSq;
    const uint64_t toMask = 1ULL << toSq;
    const uint64_t moveMask = fromMask | toMask;
    
    // Update piece bitboard: clear from, set to
    types_bb_array[pc] ^= moveMask;
    
    // Update color bitboard: clear from, set to
    colors_bb_array[color] ^= moveMask;
    
    // Update occupancy: clear from, set to
    occupied_bb ^= moveMask;
    
    // Update mailbox
    board[fromSq] = NO_PIECE;
    board[toSq] = pc;
}

void BoardState::addPiece(int sq, Piece pc) {
    if (pc == NO_PIECE) return;

    const uint64_t mask = 1ULL << sq;
    const Color color = colorOf(pc);
    
    // Update all bitboards
    types_bb_array[pc] |= mask;
    colors_bb_array[color] |= mask;
    occupied_bb |= mask;
    
    // Update mailbox
    board[sq] = pc;
}

Piece BoardState::deletePiece(int sq) {
    const Piece pc = board[sq];
    
    const uint64_t mask = 1ULL << sq;
    const Color color = colorOf(pc);
    
    // Update all bitboards
    types_bb_array[pc] &= ~mask;
    colors_bb_array[color] &= ~mask;
    occupied_bb &= ~mask;
    
    // Update mailbox
    board[sq] = NO_PIECE;
    
    return pc;
}


void BoardState::castling(int from_sq, int to_sq, bool reverse) {
    Piece king = reverse ? piece_at(to_sq) : piece_at(from_sq);
    Color sideToMove = colorOf(king);

    int rook_from = NO_SQ, rook_to = NO_SQ;

    // Solo para las piezas negras
    if (sideToMove == BLACK) {
        std::cout << "--- Inicia castling para NEGRAS ---" << std::endl;
        std::cout << "King from_sq: " << from_sq << ", to_sq: " << to_sq << std::endl;
        std::cout << "Reverse flag: " << (reverse ? "true" : "false") << std::endl;
    }

    if (to_sq - from_sq == +2) { // Enroque corto (King-side)
        if (sideToMove == WHITE) {
            rook_from = SQ_H1;  // 7
            rook_to   = SQ_F1;  // 5
        } else { // Caso de las negras
            rook_from = SQ_H8;  // 63
            rook_to   = SQ_F8;  // 61
            std::cout << "Enroque corto (Negras) - Rook from: " << rook_from << ", to: " << rook_to << std::endl;
        }
    } else if (to_sq - from_sq == -2) { // Enroque largo (Queen-side)
        if (sideToMove == WHITE) {
            rook_from = SQ_A1;  // 0
            rook_to   = SQ_D1;  // 3
        } else { // Caso de las negras
            rook_from = SQ_A8;  // 56
            rook_to   = SQ_D8;  // 59
            std::cout << "Enroque largo (Negras) - Rook from: " << rook_from << ", to: " << rook_to << std::endl;
        }
    } 

    if (reverse) {
        if (sideToMove == BLACK) {
            std::cout << "Revirtiendo enroque (Negras):" << std::endl;
            std::cout << "  Antes de mover torre: piece_at(" << rook_to << ") = " << (int)piece_at(rook_to) << ", piece_at(" << rook_from << ") = " << (int)piece_at(rook_from) << std::endl;
        }
        movePiece(rook_to, rook_from);
        if (sideToMove == BLACK) {
            std::cout << "  Después de mover torre: piece_at(" << rook_to << ") = " << (int)piece_at(rook_to) << ", piece_at(" << rook_from << ") = " << (int)piece_at(rook_from) << std::endl;
            std::cout << "  Antes de mover rey: piece_at(" << to_sq << ") = " << (int)piece_at(to_sq) << ", piece_at(" << from_sq << ") = " << (int)piece_at(from_sq) << std::endl;
        }
        movePiece(to_sq, from_sq);
        if (sideToMove == BLACK) {
            std::cout << "  Después de mover rey: piece_at(" << to_sq << ") = " << (int)piece_at(to_sq) << ", piece_at(" << from_sq << ") = " << (int)piece_at(from_sq) << std::endl;
        }
    } else {
        if (sideToMove == BLACK) {
            std::cout << "Aplicando enroque (Negras):" << std::endl;
            std::cout << "  Antes de mover rey: piece_at(" << from_sq << ") = " << (int)piece_at(from_sq) << ", piece_at(" << to_sq << ") = " << (int)piece_at(to_sq) << std::endl;
        }
        movePiece(from_sq, to_sq);
        if (sideToMove == BLACK) {
            std::cout << "  Después de mover rey: piece_at(" << from_sq << ") = " << (int)piece_at(from_sq) << ", piece_at(" << to_sq << ") = " << (int)piece_at(to_sq) << std::endl;
            std::cout << "  Antes de mover torre: piece_at(" << rook_from << ") = " << (int)piece_at(rook_from) << ", piece_at(" << rook_to << ") = " << (int)piece_at(rook_to) << std::endl;
        }
        movePiece(rook_from, rook_to);
        if (sideToMove == BLACK) {
            std::cout << "  Después de mover torre: piece_at(" << rook_from << ") = " << (int)piece_at(rook_from) << ", piece_at(" << rook_to << ") = " << (int)piece_at(rook_to) << std::endl;
        }
    }

    if (sideToMove == BLACK) {
        std::cout << "--- Finaliza castling para NEGRAS ---" << std::endl;
    }
}


void BoardState::promote(int promotion_sq, Type promotion) { // promotes to queen by default
    Piece pc = piece_at(promotion_sq);
    Type type = getType(pc);
    Color color = colorOf(pc);

    if (type != PAWN || !((PROMOTION_ROWS[color] >> promotion_sq) & 1ULL)) return;

    deletePiece(promotion_sq);

    Piece promotion_pc = static_cast<Piece>(color * PC_NUM + promotion);
    addPiece(promotion_sq, promotion_pc);
}