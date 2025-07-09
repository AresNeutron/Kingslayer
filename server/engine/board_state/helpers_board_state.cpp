#include "BoardState.h"
#include <cstdint>
#include <array>
#include <iostream>

void BoardState::print_bitboard(uint64_t bitboard) {
    for (int rank = 7; rank >= 0; --rank) { // Iteramos de la fila 7 a la 0 (de arriba a abajo)
        for (int file = 0; file < 8; ++file) { // Iteramos de la columna 0 a la 7
            int square = rank * 8 + file;
            // Verificamos si el bit correspondiente a la casilla está encendido
            if (bitboard & (1ULL << square)) { // Usar 1ULL para el bitboard
                std::cout << "1 ";
            } else {
                std::cout << ". ";
            }
        }
        std::cout << std::endl; // Nueva línea al final de cada fila
    }
    std::cout << std::endl; // Línea extra para separar visualizaciones
}

std::vector<int> BoardState::bitboard_to_squares(uint64_t bitboard) {
    std::vector<int> squares;
    squares.reserve(__builtin_popcountll(bitboard)); // Pre-allocate para evitar reallocaciones
    
    while (bitboard) {
        int square = __builtin_ctzll(bitboard); // Count trailing zeros (64-bit)
        squares.push_back(square);
        bitboard &= bitboard - 1; // Clear lowest set bit (Brian Kernighan's trick)
    }
    
    return squares;
}


uint64_t BoardState::get_ray_between(Color sideToMove, int sq) const {
    Piece kingPiece = static_cast<Piece>(KING + sideToMove * PC_NUM); // index of the king
    uint64_t kingBB = types_bb_array[kingPiece];

    int king_sq = __builtin_ctzll(kingBB);

    uint64_t ray_mask = 0ULL;

    int r1 = sq / 8;
    int f1 = sq % 8;

    int r2 = king_sq / 8;
    int f2 = king_sq % 8;

    int dr = (r2 > r1) ? 1 : ((r2 < r1) ? -1 : 0);
    int df = (f2 > f1) ? 1 : ((f2 < f1) ? -1 : 0);

    // Calcular el incremento/decremento en el índice de la casilla para dar un paso
    int step_delta = dr * 8 + df;

    // Empezar desde la primera casilla después de 'sq' en dirección a 'king_sq'
    int current_sq = sq + step_delta;

    while (current_sq != king_sq) {
        ray_mask |= (1ULL << current_sq);
        current_sq += step_delta;
    }

    return ray_mask;
}