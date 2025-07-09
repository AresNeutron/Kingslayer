#include "Game.h"
#include <limits>

double Game::negamax(int depth, double alpha, double beta, int color_multiplier) {
    if (depth == 0) {
        return color_multiplier * board_state.eval_state();
    }

    double value = -std::numeric_limits<double>::infinity();

    uint64_t bb = getSideBitboard();
    set_pinned_pieces();

    while (bb) {
        int fromSq = __builtin_ctzll(bb);
        bb &= bb - 1;

        int moveCount = get_legal_moves(fromSq);
        std::vector<uint16_t> movesVector(movesArray.begin(), movesArray.begin() + moveCount);

        for (uint16_t moveCode : movesVector) {
            game_event = NONE;
            make_move(moveCode);

            if (promotion_sq != NO_SQ) make_promotion();  // promote to queen by default

            changeTurn();

            detect_check();

            ply++;

            double score;
            if (game_event == CHECKMATE) {
                score = color_multiplier * CHECK_BONUS;
            } else {
                score = -negamax(depth - 1, -beta, -alpha, -color_multiplier);
                score += (game_event == CHECK) ? (color_multiplier * CHECK_BONUS) : 0;
            }

            ply--;
            changeTurn();
            unmake_move();

            if (score > value) value = score;
            if (value > alpha) alpha = value;

            if (alpha >= beta) {
                return value;
            }
        }
    }

    return value;
}


uint16_t Game::find_best_move(int depth, bool is_engine_white) {
    double bestScore = -std::numeric_limits<double>::infinity();
    uint16_t bestMove = 0;

    double alpha = -std::numeric_limits<double>::infinity();
    double beta  =  std::numeric_limits<double>::infinity();
    int engine_multiplier = is_engine_white ? 1 : -1;

    uint64_t bb = getSideBitboard();
    set_pinned_pieces();

    while (bb) {
        int fromSq = __builtin_ctzll(bb);
        bb &= bb - 1;

        int moveCount = get_legal_moves(fromSq);
        std::vector<uint16_t> movesVector(movesArray.begin(), movesArray.begin() + moveCount);

        for (uint16_t moveCode : movesVector) {
            game_event = NONE;
            make_move(moveCode);

            if (promotion_sq != NO_SQ) make_promotion();

            changeTurn();

            // Turn changed, verify if enemy move put king in check or mate
            detect_check();

            ply++;

            double score;
            if (game_event == CHECK) {
                score = engine_multiplier * CHECK_BONUS;
            } else {
                score = -negamax(depth - 1, -beta, -alpha, -engine_multiplier);
                score += (game_event == CHECK) ? (engine_multiplier * CHECK_BONUS) : 0;
            }

            // Deshacer movimiento
            ply--;
            changeTurn();
            unmake_move();

            // Convertir puntuación a perspectiva del motor
            double engineScore = score;

            if (engineScore > bestScore) {
                bestScore = engineScore;
                bestMove = moveCode;
            }
            if (engineScore > alpha) {
                alpha = engineScore;
            }
        }
    }
    return bestMove;
}