#include "Game.h"
#include <array>
#include <cstdlib>
#include <iostream>


void Game::make_promotion(Type promotion) { // promotes to queen by default
    if (!((PROMOTION_ROWS[sideToMove] >> promotion_sq) & 1ULL)) return;

    board_state.deletePiece(promotion_sq);

    Piece promotion_pc = static_cast<Piece>(sideToMove * PC_NUM + promotion);
    board_state.addPiece(promotion_sq, promotion_pc);

    promotion_sq = NO_SQ;
}


void Game::update_castling_rights(int to_sq) {
    Piece pc = board_state.piece_at(to_sq);
    Type type = board_state.getType(pc);
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