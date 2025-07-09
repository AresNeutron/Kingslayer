// BoardState.h

#pragma once
#include "../constants/Types.h"
#include "../constants/InitialState.h"
#include "../constants/PSQ_tables.h"

#include "../precomputed_moves/non_sliding_moves/data.h"
#include "../precomputed_moves/sliding_moves/data.h"

#include <array>
#include <cstdint>
#include <vector>
#include <iostream>

class BoardState {
public:
    std::array<Piece, 64> board;

    std::array<uint64_t, PC_NUM * 2> types_bb_array;

    uint64_t occupied_bb;

    std::array<uint64_t, 2> colors_bb_array;

public:
    BoardState() {
        setStartPosition();
    }

    void setStartPosition() {
        board = INITIAL_MAILBOX_BOARD;
        types_bb_array = INITIAL_PIECE_BITBOARDS;
        occupied_bb = INITIAL_OCCUPANCY_ALL;
        colors_bb_array = INITIAL_OCCUPANCY_BY_COLOR;
    }

    inline void printBoardArray() const {
        for (int i = 0; i < 64; ++i) {
            std::cout << static_cast<int>(board[i]) << std::endl;
        }
    }

    uint64_t get_ray_between(Color sideToMove, int sq) const;

    static std::vector<int> bitboard_to_squares(uint64_t bitboard);

    static void print_bitboard(uint64_t bitboard);

    void movePiece(int fromSq, int toSq);

    Piece deletePiece(int sq);

    void addPiece(int sq, Piece pc);

    uint64_t get_attackers_for_sq(Color sideToMove, int sq) const;

    std::vector<int> get_linear_threats(int sideToMove) const;

    int eval_state();
};