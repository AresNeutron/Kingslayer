#include "Game.h"
#include <cstdlib>
#include <iostream>


void Game::make_move(uint16_t move_code) {
    int from_sq = ((move_code >> 6) & 0b111111U);

    if (board_state.board[from_sq] == NO_PIECE) {
        std::cout << "Error, attempting to call make_move function with empty square" << std::endl;
        std::cout << move_code << std::endl;
        return;
    }

    else if (colorOf(board_state.board[from_sq]) != sideToMove) {
        std::cout << "Error, attempting to call make_move function with a piece of the opposite turn" << std::endl;
        std::cout << "From sq: " << from_sq << std::endl;
        std::cout << "To sq: " << static_cast<int>(move_code & 0b111111U) << std::endl;
        std::cout << "Side To move: " << (sideToMove == WHITE ? "White" : "Black") << std::endl;
        return;
    }

    int to_sq = (move_code & 0b111111U);
    MoveType move_type = static_cast<MoveType>(move_code >> 12);

    Piece captured_piece = NO_PIECE;
    int new_ep_sq = NO_SQ;

    switch (move_type)
    {
    case MOVE: {
        // oportunity for en-passant can only be given with pawn moving two squares
        if (
            getType(from_sq) == PAWN && // piece is a pawn
            std::abs(from_sq - to_sq) == 16 // and moved two steps
        ) new_ep_sq = sideToMove ? (to_sq - 8) : (to_sq + 8);

        board_state.movePiece(from_sq, to_sq);
        break;
    }
    case CAPTURE: {
        captured_piece = board_state.deletePiece(to_sq);
        board_state.movePiece(from_sq, to_sq);
        break;
    }
    case CASTLING:
        make_castling(from_sq, to_sq);
        break;

    case EN_PASSANT: {
        int enemy_pawn_sq = sideToMove ? (to_sq - 8) : (to_sq + 8);
        captured_piece = board_state.deletePiece(enemy_pawn_sq);
        board_state.movePiece(from_sq, to_sq);
        break;
        }
    case PROMOTION: {
        board_state.movePiece(from_sq, to_sq);
        promotion_sq = to_sq;
        break;
    }
    case PROMOTION_CAPTURE: {
        captured_piece = board_state.deletePiece(to_sq);
        board_state.movePiece(from_sq, to_sq);
        promotion_sq = to_sq;
        break;
    }
    default:
        std::cout << "Error, calling make_move function with an undefined move type" << std::endl;
        return;
        break;
    };

    UndoInfo new_stored_move = {
        move_code, captured_piece, en_passant_sq, castling_rights
    };
    undo_stack[ply] = new_stored_move;

    en_passant_sq = new_ep_sq;
    update_castling_rights(to_sq);
}


void Game::unmake_move() {
    UndoInfo last_stored_move = undo_stack[ply];
    uint16_t move_code = last_stored_move.move_code;
    
    int to_sq = (move_code & 0b111111U);

    if (board_state.board[to_sq] == NO_PIECE) {
        std::cout << "Unmake Move Error, attempting to call function with empty square" << std::endl;
        std::cout << move_code << std::endl;
        return;
    }
    
    int from_sq = ((move_code >> 6) & 0b111111U);
    MoveType move_type = static_cast<MoveType>(move_code >> 12);

    switch (move_type)
    {
    case MOVE:
        board_state.movePiece(to_sq, from_sq);
        break;
    
    case CAPTURE:
        board_state.movePiece(to_sq, from_sq);
        board_state.addPiece(to_sq, last_stored_move.captured_piece);
        break;

    case CASTLING:
        make_castling(from_sq, to_sq, true);
        break;

    case EN_PASSANT: {
        int enemy_pawn_sq = sideToMove ? (to_sq - 8) : (to_sq + 8);
        board_state.movePiece(to_sq, from_sq);
        board_state.addPiece(enemy_pawn_sq, last_stored_move.captured_piece);
        break;
    }
    case PROMOTION: {
        board_state.deletePiece(to_sq);
        Piece ally_pawn = static_cast<Piece>(PAWN + (sideToMove * PC_NUM));
        board_state.addPiece(from_sq, ally_pawn);
        break;
    }
    case PROMOTION_CAPTURE: {
        board_state.deletePiece(to_sq);
        board_state.addPiece(to_sq, last_stored_move.captured_piece);

        Piece ally_pawn = static_cast<Piece>(PAWN + (sideToMove * PC_NUM));
        board_state.addPiece(from_sq, ally_pawn);
        break;
    }
    default:
        std::cout << "Unmake Move Error, attempting to call function with undefined move type" << std::endl;
        return;
        break;
    };

    castling_rights = last_stored_move.prev_castling_rights;
    en_passant_sq = last_stored_move.prev_en_passant_sq;
    promotion_sq = NO_SQ;
}
