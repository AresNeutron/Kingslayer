#include "Game.h"

void Game::user_moves(uint16_t move_code) {
    // make the move
    make_move(move_code);

    if (promotion_sq != NO_SQ) {
        std::cout << static_cast<int>(promotion_sq) << std::endl;
        std::cout << eventMessages[PROMOTION] << std::endl; // "promotion"
    } else {
        changeTurn();

        // these detectors can only be called in own turn
        uint64_t threats = detect_check();
        detect_game_over(threats);

        std::cout << threats << std::endl;
        std::cout << eventMessages[game_event] << std::endl;
    }
    std::cout << "readyok\n";
}


void Game::engine_moves(Color engine_color) {
    if (engine_color != sideToMove) {
        std::cout << "Error, attempting to move engine in opposite turn\n";
        std::cout << "error" << std::endl;
        return;
    }

    // Depth of 1, no recursion by now, it's not ready
    uint16_t best = find_best_move(1, engine_color == 1);

    make_move(best);
    
    if (promotion_sq != NO_SQ) {
        make_promotion(); // promote to queen by default
    }

    changeTurn();

    uint64_t threats = detect_check();
    detect_game_over(threats);

    std::cout << threats << std::endl;
    std::cout << eventMessages[game_event] << std::endl;
    std::cout << "readyok\n";
}


void Game::resolve_promotion(char input) {
    Type ptype = QUEEN; // queen by default
    switch (input) {
        case 'r': ptype = ROOK;    break;
        case 'b': ptype = BISHOP;  break;
        case 'k': ptype = KNIGHT;  break;
        case 'q': default:         break;
    }
    make_promotion(ptype);
    
    changeTurn();
    
    uint64_t threats = detect_check();
    detect_game_over(threats);

    std::cout << threats << std::endl;
    std::cout << eventMessages[game_event] << std::endl;
    std::cout << "readyok\n";
}