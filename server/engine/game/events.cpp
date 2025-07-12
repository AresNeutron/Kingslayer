#include "Game.h"

// These funcions can be used only right after a move takes place


// Verifies if last enemy move put ally king in check
uint64_t Game::detect_check() {
    uint64_t king_bb = board_state.king(sideToMove);
    int king_sq = __builtin_ctzll(king_bb);

    uint64_t threats = board_state.getAttackersForSq(sideToMove, king_sq);
    if (threats != 0) {
        game_event = CHECK;
    }

    return threats;
}

// Verifies if last enemy move ended the game, only called when check was previously detected
void Game::detect_game_over(uint64_t threats) {
    uint64_t king_bb = board_state.king(sideToMove);
    int king_sq = __builtin_ctzll(king_bb);

    bool double_check = (__builtin_popcountll(threats) >= 2);

    if (double_check) {
        int moveCount = get_legal_moves(king_sq);
        if (moveCount) {
            return; // No checkmate
        }   
        game_event = CHECKMATE; // double-check with no escape
        return;
    }

    uint64_t friendly_bb = board_state.color_bb(sideToMove);

    FOR_EACH_SET_BIT(friendly_bb, sq) {
        int moveCount = get_legal_moves(sq);
        if (moveCount) {
            return; // No checkmate
        }
    }
    
    if (threats > 0) {
        game_event = CHECKMATE; // King is in check and no legal moves for any piece
    } else {
        game_event = STALEMATE; // King is not in check, but no legal moves for any piece
    }
}