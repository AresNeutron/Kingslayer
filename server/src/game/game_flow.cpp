#include "Game.h"

void Game::user_moves(uint16_t move_code) {
    make_move(move_code);
    stream_move_data(move_code);
    // we don't stream promotion_pc here, it's not necessary

    if (promotion_sq != NO_SQ) {
        std::cout << "event_data " << static_cast<int>(promotion_sq) << std::endl;
        std::cout << "event " << eventMessages[PROMOTION] << std::endl; // "promotion"
        std::cout << "awaiting\n";
    } else {
        changeTurn();

        // these detectors can only be called in own turn
        uint64_t threats = detect_check();
        detect_game_over();

        std::cout << "event_data " << threats << std::endl;
        std::cout << "event " << eventMessages[game_event] << std::endl;
        std::cout << "nextturn\n";
    }
    
}


void Game::user_promotion(int promotion) {
    Piece promotion_pc = board_state.promote(static_cast<int>(promotion_sq), static_cast<Type>(promotion));
    
    changeTurn();

    // these detectors can only be called in own turn
    uint64_t threats = detect_check();
    detect_game_over();

    // stream adapted to match the move_data format
    std::cout << "move_data " << -1 << " " << -1 << " " << -1 << " " << static_cast<int>(promotion_sq) << std::endl;
    std::cout << "promotion_pc " << static_cast<int>(promotion_pc) << std::endl;
    std::cout << "event_data " << threats << std::endl;
    std::cout << "event " << eventMessages[game_event] << std::endl;
    std::cout << "nextturn\n";

    promotion_sq = NO_SQ;
}


// use this function for both user_moves and engine_moves
void Game::stream_move_data(uint16_t move_code) {
    int from_sq = (move_code >> 6) & 0b111111U;
    int to_sq = move_code & 0b111111U;
    MoveType move_type = static_cast<MoveType>(move_code >> 12);

    MoveStream stream_data = {NO_SQ, NO_SQ, from_sq, to_sq};

    switch (move_type) {
        case MOVE: 
        case PROMOTION:
            break; // nothing to do, stream_data is already initialized
        
        case CAPTURE:
        case PROMOTION_CAPTURE:
        {
            // to_sq is the captured piece, UI will make it fade if to_sq_1 is set to NO_SQ
            stream_data.from_sq_1 = to_sq; 
            break;
        }
        
        case CASTLING: {
            RookMoveData rook_move = get_castling_rook_move(from_sq, to_sq);
            stream_data.from_sq_1 = rook_move.from_sq;
            stream_data.to_sq_1 = rook_move.to_sq;
            break;
        }
        
        case EN_PASSANT: {
            int captured_pawn_sq = sideToMove == WHITE ? (to_sq - 8) : (to_sq + 8);
            stream_data.from_sq_1 = captured_pawn_sq;
            break;
        }
        
        default: {
            std::cout << "Error, calling stream_move_data function with an undefined move type: " 
                      << static_cast<int>(move_type) << std::endl;
            return;
        }
    }

    std::cout << "move_data " << stream_data.from_sq_1 << " " << stream_data.to_sq_1 << " ";
    std::cout << stream_data.from_sq_2 << " " << stream_data.to_sq_2 << " " << std::endl;
}


// this is the new stream format I figured out for the UCI
// printed in console as strings would be something like this:
// ** move_data -1 -1 12 28  // these are squares, -1 is equivalent to NO_SQ
// ** promotion_pc 12   // 12 is equivalent to NO_PIECE, meaning not promoted
// ** event: "none" or "check" or "checkmate" or "stalemate" or "promotion"
// ** event_data: x  // x can be either a bitboard with threats if was event was check, or the promotion square if was event was promotion if user promotion was detected
// ** 'nextturn' or 'awating' // 'nextturn' means the turn has changed, 'awating' means engine is waiting for user input, in user promotion, for example