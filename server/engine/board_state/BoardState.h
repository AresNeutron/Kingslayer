// BoardState.h
#pragma once

#include "../constants/Types.h"
#include "../constants/StaticData.h"
#include "../constants/PSQ_tables.h"
#include "../constants/Rays.h"
#include "../precomputed_moves/non_sliding_moves/data.h"
#include "../precomputed_moves/sliding_moves/data.h"

#include <array>
#include <cstdint>
#include <vector>
#include <iostream>

class BoardState {
private:
    // Core board representation
    std::array<Piece, 64> board;                    // Mailbox representation
    std::array<uint64_t, 12> types_bb_array;        // Bitboards by piece type
    uint64_t occupied_bb;                            // All occupied squares
    std::array<uint64_t, 2> colors_bb_array;        // Bitboards by color

public:
    // =========================
    // CONSTRUCTORS & SETUP
    // =========================
    
    BoardState() {
        setStartPosition();
    }
    
    void setStartPosition();

    // =========================
    // FAST INLINE ACCESSORS
    // =========================
    inline uint64_t getFriendlyBB(Piece pc) const noexcept {
        return colors_bb_array[colorOf(pc)];
    }

    inline Type getType(Piece pc) const noexcept {
        return static_cast<Type>(pc % PC_NUM);
    }

    inline uint64_t piece_bb(Piece pc) const noexcept { 
        return types_bb_array[pc]; 
    }
    
    inline uint64_t color_bb(Color c) const noexcept { 
        return colors_bb_array[c]; 
    }
    
    inline uint64_t occupied() const noexcept { 
        return occupied_bb; 
    }
    
    inline Piece piece_at(int sq) const noexcept { 
        return board[sq]; 
    }

    inline uint64_t king(Color c) const noexcept {
        return types_bb_array[c == WHITE ? WHITE_KING : BLACK_KING];
    }

    // =========================
    // BOARD MANIPULATION
    // =========================
    
    void movePiece(int fromSq, int toSq);
    Piece deletePiece(int sq);
    void addPiece(int sq, Piece pc);

    // =========================
    // GAME LOGIC FUNTIONS
    // =========================

    uint64_t getPseudoLegalMoves(int fromSq) const;
    void castling(int from_sq, int to_sq, bool reverse = false );

    // =========================
    // ATTACK & THREAT QUERIES
    // =========================
    
    uint64_t getAttackersForSq(Color sideToMove, int sq) const;
    uint64_t getLinearThreats(Color sideToMove) const;
    uint64_t getRayBetween(Color sideToMove, int sq) const;

    // =========================
    // UTILITY & DEBUG
    // =========================
    
    inline void printBoardArray() const {
        for (int i = 0; i < 64; ++i) {
            std::cout << static_cast<int>(board[i]) << std::endl;
        }
    }

    // Debug only function
    static void print_bitboard(uint64_t bitboard);
};