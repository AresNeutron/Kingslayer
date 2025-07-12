#include "BoardState.h"
#include <cstdint>
#include <array>
#include <iostream>

void BoardState::print_bitboard(uint64_t bitboard) {
    for (int rank = 7; rank >= 0; --rank) {
        for (int file = 0; file < 8; ++file) {
            const int square = rank * 8 + file;
            std::cout << ((bitboard & (1ULL << square)) ? "1 " : ". ");
        }
        std::cout << '\n';
    }
    std::cout << '\n';
}


int BoardState::eval_state() const {
    int score = 0;

    for (int sq = 0; sq < 64; ++sq) {
        Piece pc = board[sq];
        if (pc == NO_PIECE) {
            continue;
        }

        int sign = colorOf(pc) ? +1 : -1;

        int baseIndex = pc - (colorOf(pc) * PC_NUM);
        int base_value = PIECE_BASE_VALUE[baseIndex];

        const auto& psq_table = get_table_by_piece(pc);
        int psq_value = psq_table[sq];

        score += sign * (base_value + psq_value);
    }

    return score;
}