#include "BoardState.h"
#include <cstdint>
#include <vector>
#include <iostream>

void BoardState::movePiece(int fromSq, int toSq) {
    int bit_count = __builtin_popcountll(occupied_bb);

    Piece pc = board[fromSq];

    if (pc == NO_PIECE) {
        std::cout << "Este escaque está vacío" << std::endl;
        std::cout << fromSq << std::endl;
        return;
    }

    int color = colorOf(pc);

    uint64_t mFrom = (1ULL << fromSq);
    uint64_t mTo   = (1ULL << toSq);

    // Borra “from”
    types_bb_array[pc]   &= ~mFrom;
    occupied_bb     &= ~mFrom;
    colors_bb_array[color] &= ~mFrom;

    // Pone “to”
    types_bb_array[pc]   |= mTo;
    occupied_bb     |= mTo;
    colors_bb_array[color] |= mTo;

    // Actualiza mailbox
    board[fromSq] = NO_PIECE;
    board[toSq]   = pc;

    if (__builtin_popcountll(occupied_bb) != bit_count) {
        std::cout << "Error en la función de mover piezas" << std::endl;
        std::cout << bit_count << std::endl;
        std::cout << __builtin_popcountll(occupied_bb) << std::endl;
    }
}

void BoardState::addPiece(int sq, Piece pc) {
    if (pc == NO_PIECE) return;

    int bit_count = __builtin_popcountll(occupied_bb);

    board[sq] = pc;
    int color = colorOf(pc);

    uint64_t mask = (1ULL << sq);

    types_bb_array[pc]   |= mask;
    occupied_bb     |= mask;
    colors_bb_array[color] |= mask;

    if (__builtin_popcountll(occupied_bb) != (bit_count + 1)) {
        std::cout << "Error durante la addición" << std::endl;
    }
}


Piece BoardState::deletePiece(int sq) {
    int bit_count = __builtin_popcountll(occupied_bb);

    Piece pc = board[sq];
    int color = colorOf(pc);

    uint64_t mask = (1ULL << sq);

    types_bb_array[pc]   &= ~mask;
    occupied_bb     &= ~mask;
    colors_bb_array[color] &= ~mask;

    board[sq] = NO_PIECE;

    if (__builtin_popcountll(occupied_bb) != (bit_count - 1)) {
        std::cout << "Error en la Eliminación" << std::endl;
    }

    return pc;
}