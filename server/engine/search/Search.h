#pragma once
#include "../board_state/BoardState.h"
#include "../game/Game.h"

class Search {
public:
    // complete this class

    // the class uses methods that reference an instance of Game
    // but this class doesn't contain game at all

    int evaluate_board(const BoardState& board_state, Color sideToMove) const;

    // these two functions above must be defined later

    // Función Minimax con Poda Alfa-Beta
    double negamax(Game& game, int depth, double alpha, double beta); // Recibe una referencia a Game

    // Función para puntuar y ordenar movimientos
    void score_moves(Game& game, std::vector<uint16_t>& moves) const;
};