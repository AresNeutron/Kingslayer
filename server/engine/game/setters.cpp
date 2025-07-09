#include "Game.h"
#include <array>
#include <cstdlib>
#include <iostream>

// Revisar esto, no funciona bien
void Game::make_castling(int from_sq, int to_sq, bool reverse) {
    int rook_from = NO_SQ, rook_to = NO_SQ;

    if (to_sq - from_sq == +2) {
        if (sideToMove == WHITE) {
            rook_from = SQ_H1;  // 7
            rook_to   = SQ_F1;  // 5
        } else {
            rook_from = SQ_H8;  // 63
            rook_to   = SQ_F8;  // 61
        }
    } else if (to_sq - from_sq == -2) {
        if (sideToMove == WHITE) {
            rook_from = SQ_A1;  // 0
            rook_to   = SQ_D1;  // 3
        } else {
            rook_from = SQ_A8;  // 56
            rook_to   = SQ_D8;  // 59
        }
    } else {
        std::cerr << "Error: make_castling llamado con movimiento no estándar: from="
                  << from_sq << " to=" << to_sq << std::endl;
        return;
    }

    

    if (reverse) {
        board_state.movePiece(rook_to, rook_from);
        board_state.movePiece(to_sq, from_sq);
    } else {
        board_state.movePiece(from_sq, to_sq);
        board_state.movePiece(rook_from, rook_to);
    }
}

void Game::make_promotion(Type promotion) { // promotes to queen by default
    if (!((PROMOTION_ROWS[sideToMove] >> promotion_sq) & 1ULL)) return;

    board_state.deletePiece(promotion_sq);

    Piece promotion_pc = static_cast<Piece>(sideToMove * PC_NUM + promotion);
    board_state.addPiece(promotion_sq, promotion_pc);

    promotion_sq = NO_SQ;
}


void Game::update_castling_rights(int to_sq) {
    Type type = getType(to_sq);
    // early exit if piece is neither rook nor king
    if (type != ROOK && type != KING) return;

    if (castling_rights == 0) return;

    switch (type)
    {
    case KING:{
        uint8_t remaining_rights = sideToMove ? 0b1100U : 0b0011U;
        castling_rights &= remaining_rights;
        }
        break;
    
    case ROOK:{
        int rook_idx = getCastlingIdx(to_sq);
        castling_rights &= ~(1U << rook_idx);
        }
        break;

    default:
        break;
    }
}