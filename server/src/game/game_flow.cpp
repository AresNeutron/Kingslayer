#include "Game.h"

void Game::user_moves(uint16_t move_code) {
    // make the move
    make_move(move_code);

    if (promotion_sq != NO_SQ) {
        std::cout << static_cast<int>(promotion_sq) << std::endl;
        std::cout << eventMessages[PROMOTION] << std::endl; // "promotion"
    } else {
        changeTurn();
        increase_ply();

        // these detectors can only be called in own turn
        uint64_t threats = detect_check();
        if (game_event == CHECK) detect_game_over();
        set_pinned_pieces();

        std::cout << threats << std::endl;
        std::cout << eventMessages[game_event] << std::endl;
    }
    std::cout << "readyok\n";
}


// void Game::engine_moves(Color engine_color) {
//     if (engine_color != sideToMove) {
//         std::cout << "Error, attempting to move engine in opposite turn\n";
//         std::cout << "error" << std::endl;
//         return;
//     }

//     // Depth of 1, no recursion by now, it's not ready
//     uint16_t best = find_best_move(1, engine_color == 1);

//     make_move(best);
    
//     if (promotion_sq != NO_SQ) {
//         board_state.promote(promotion_sq); // promote to queen by default
//         promotion_sq = NO_SQ;
//     }

//     changeTurn();

//     uint64_t threats = detect_check();
//     detect_game_over(threats);

//     std::cout << threats << std::endl;
//     std::cout << eventMessages[game_event] << std::endl;
//     std::cout << "readyok\n";
// }


void Game::resolve_promotion(char input) {
    Type ptype = QUEEN; // queen by default
    switch (input) {
        case 'r': ptype = ROOK;    break;
        case 'b': ptype = BISHOP;  break;
        case 'k': ptype = KNIGHT;  break;
        case 'q': default:         break;
    }
    board_state.promote(promotion_sq, ptype);
    promotion_sq = NO_SQ;
    
    changeTurn();
    increase_ply();

    // these detectors can only be called in own turn
    uint64_t threats = detect_check();
    if (game_event == CHECK) detect_game_over();
    set_pinned_pieces();

    std::cout << threats << std::endl;
    std::cout << eventMessages[game_event] << std::endl;
    std::cout << "readyok\n";
}


// struct UndoInfo {
//     uint16_t move_code;  // static_cast<uint16_t>((from_sq << 6) | to_sq);
//     Piece captured_piece;
//     int8_t prev_en_passant_sq;
//     uint8_t prev_castling_rights;
// };

void Game::print_undo_stack() {
    std::cout << "Undo stack with ply = " << ply << std::endl;
    for (int i= 0; i < ply; ++i) {
        // put endline for all these prints
        uint16_t moveCode = undo_stack[i].move_code;
        std::cout << "From: " << ((moveCode >> 6) & 0b111111U) << std::endl;
        std::cout << "To: " << (moveCode & 0b111111U) << std::endl;
        std::cout << "Move Type: " << static_cast<int>(moveCode >> 12) << std::endl;
        std::cout << "Captured Piece: " << static_cast<int>(undo_stack[i].captured_piece) << std::endl; 
        std::cout << "En Passant Square: " << static_cast<int>(undo_stack[i].prev_en_passant_sq) << std::endl;
        std::cout << "Castling Rights: " << static_cast<int>(undo_stack[i].prev_castling_rights) << std::endl;
        std::cout << "---------------------" << std::endl;
    }
}