#include "Game.h"

void Game::user_moves(uint16_t move_code) {
    make_move(move_code);

    if (promotion_sq != NO_SQ) {
        std::cout << static_cast<int>(promotion_sq) << std::endl;
        std::cout << eventMessages[PROMOTION] << std::endl; // "promotion"
    } else {
        changeTurn();

        // these detectors can only be called in own turn
        uint64_t threats = detect_check();
        detect_game_over();

        std::cout << threats << std::endl;
        std::cout << eventMessages[game_event] << std::endl;
    }
    std::cout << "readyok\n";
}


void Game::resolve_promotion(int promotion) {
    board_state.promote(promotion_sq, static_cast<Type>(promotion));
    promotion_sq = NO_SQ;
    
    changeTurn();

    // these detectors can only be called in own turn
    uint64_t threats = detect_check();
    detect_game_over();

    std::cout << threats << std::endl;
    std::cout << eventMessages[game_event] << std::endl;
    std::cout << "readyok\n";
}


// use this function for both user_moves and engine_moves, but not for resolve_promotion,
// since UI handles promotion animation by itself
void Game::stream_move_data(uint16_t move_code) {
    int from_sq = (move_code >> 6) & 0b111111U;
    int to_sq = move_code & 0b111111U;
    MoveType move_type = static_cast<MoveType>(move_code >> 12);

    // initialized with NO_SQ for all squares, equivalent to -1
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
            // board_state.castling(from_sq, to_sq); // ok, here we have a problem
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

    std::cout << stream_data.from_sq_1 << std::endl;
    std::cout << stream_data.from_sq_2 << std::endl;
    std::cout << stream_data.to_sq_1 << std::endl;
    std::cout << stream_data.to_sq_2 << std::endl;
}