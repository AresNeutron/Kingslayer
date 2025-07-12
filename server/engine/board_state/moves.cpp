#include "BoardState.h"

uint64_t BoardState::getPseudoLegalMoves(int from_sq) const {
    Piece pc = piece_at(from_sq); // 0-11

    uint64_t occupied = occupied_bb;

    uint64_t friendly = getFriendlyBB(pc);

    Type type = getType(pc);

    uint64_t moves = 0;

    switch (type) {
        case KNIGHT:
            moves = knight_lookup[from_sq];
            break;
        case KING:
            moves = king_lookup[from_sq];
            break;
        case PAWN: {
            uint64_t p_moves = (colorOf(pc) ? white_pawn_moves_lookup[from_sq] : black_pawn_moves_lookup[from_sq]) & ~occupied;
            uint64_t p_attacks = (colorOf(pc) ? white_pawn_attacks_lookup[from_sq] : black_pawn_attacks_lookup[from_sq]) & occupied;

            // Obstáculo directo frente al peón
            if ((pc == WHITE_PAWN && (occupied >> (from_sq + 8)) & 1) ||
                (pc == BLACK_PAWN && (occupied >> (from_sq - 8)) & 1)) {
                p_moves = 0;
            }

            moves = p_moves | p_attacks;
            break;
        }
        case ROOK: {
            uint64_t mask = rook_masks[from_sq];
            uint64_t occupied_mask = occupied & mask;
            uint64_t magic_index = (occupied_mask * ROOK_MAGICS[from_sq]) >> rook_magic_shifts[from_sq];
            moves = rook_magic_attack_table[rook_magic_offsets[from_sq] + magic_index];
            break;
        }
        case BISHOP: {
            uint64_t mask = bishop_masks[from_sq];
            uint64_t occupied_mask = occupied & mask;
            uint64_t magic_index = (occupied_mask * BISHOP_MAGICS[from_sq]) >> bishop_magic_shifts[from_sq];
            moves = bishop_magic_attack_table[bishop_magic_offsets[from_sq] + magic_index];
            break;
        }
        case QUEEN: {
            uint64_t rook_mask = rook_masks[from_sq];
            uint64_t occupied_for_rook = occupied & rook_mask;
            uint64_t rook_magic_index = (occupied_for_rook * ROOK_MAGICS[from_sq]) >> rook_magic_shifts[from_sq];
            uint64_t rook_moves = rook_magic_attack_table[rook_magic_offsets[from_sq] + rook_magic_index];

            uint64_t bishop_mask = bishop_masks[from_sq];
            uint64_t occupied_for_bishop = occupied & bishop_mask;
            uint64_t bishop_magic_index = (occupied_for_bishop * BISHOP_MAGICS[from_sq]) >> bishop_magic_shifts[from_sq];
            uint64_t bishop_moves = bishop_magic_attack_table[bishop_magic_offsets[from_sq] + bishop_magic_index];

            moves = rook_moves | bishop_moves;
            break;
        }
    }

    return moves & ~friendly;
};
