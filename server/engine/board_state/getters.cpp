#include "BoardState.h"
#include <cstdint>
#include <vector>

uint64_t BoardState::get_attackers_for_sq(Color sideToMove, int sq) const{
    Color oppColor = static_cast<Color>(1 - sideToMove); 
    uint64_t bitboard = 1ULL << sq; 
    int enemy_idx = oppColor * PC_NUM;

    uint64_t attackers = 0ULL;

    // --- Lookup precomputado (simétrico) ---
    attackers |= (types_bb_array[KING + enemy_idx] & king_lookup[sq]);
    attackers |= (types_bb_array[KNIGHT + enemy_idx] & knight_lookup[sq]);

    // --- Peones ---
    uint64_t pawnAttackers = types_bb_array[PAWN + enemy_idx];
    if (oppColor == WHITE) {
        // White pawns attack NE (sq - 7) and NW (sq - 9)
        // attackers |= ((king_bb << 9) & types_list[PAWN_IDX + color_index])
        attackers |= ((bitboard >> 9) & pawnAttackers);
        attackers |= ((bitboard >> 7) & pawnAttackers);
    } else {
        // Black pawns attack SE (sq + 7) and SW (sq + 9)
        attackers |= ((bitboard << 9) & pawnAttackers);
        attackers |= ((bitboard << 7) & pawnAttackers);
    }

    // --- Deslizadores: alfiles y reinas (diagonales) ---
    uint64_t bishop_mask = bishop_masks[sq];
    uint64_t occ_diag = occupied_bb & bishop_mask;
    uint64_t bishop_magic_index = (occ_diag * BISHOP_MAGICS[sq]) >> bishop_magic_shifts[sq];
    uint64_t bishop_attacks = bishop_magic_attack_table[bishop_magic_offsets[sq] + bishop_magic_index];
    attackers |= (bishop_attacks & (types_bb_array[BISHOP + enemy_idx] | types_bb_array[QUEEN + enemy_idx]));

    // --- Torres y reinas (líneas rectas) ---
    uint64_t rook_mask = rook_masks[sq];
    uint64_t occ_line = occupied_bb & rook_mask;
    uint64_t rook_magic_index = (occ_line * ROOK_MAGICS[sq]) >> rook_magic_shifts[sq];
    uint64_t rook_attacks = rook_magic_attack_table[rook_magic_offsets[sq] + rook_magic_index];;
    attackers |= (rook_attacks & (types_bb_array[ROOK + enemy_idx] | types_bb_array[QUEEN + enemy_idx]));

    return attackers;
}


std::vector<int> BoardState::get_linear_threats(int sideToMove) const {
    // Now this must return an array, not a long int
    Piece kingPiece = static_cast<Piece>(KING + sideToMove * PC_NUM); // index of the king
    uint64_t kingBB = types_bb_array[kingPiece];

    int kingSq = __builtin_ctzll(kingBB); // Posición del rey (asume único rey)

    int oppColor = 1 - sideToMove;  
    int enemy_idx = oppColor * PC_NUM;
    uint64_t enemy_bb = colors_bb_array[oppColor];

    uint64_t threats = 0ULL;

    // --- Deslizadores: alfiles y reinas (diagonales) ---
    uint64_t bishop_mask = bishop_masks[kingSq];
    uint64_t occ_diag = enemy_bb & bishop_mask;
    uint64_t bishop_magic_index = (occ_diag * BISHOP_MAGICS[kingSq]) >> bishop_magic_shifts[kingSq];
    uint64_t bishop_attacks = bishop_magic_attack_table[bishop_magic_offsets[kingSq] + bishop_magic_index];
    threats |= (bishop_attacks & (types_bb_array[BISHOP + enemy_idx] | types_bb_array[QUEEN + enemy_idx]));

    // --- Torres y reinas (líneas rectas) ---
    uint64_t rook_mask = rook_masks[kingSq];
    uint64_t occ_line = enemy_bb & rook_mask;
    uint64_t rook_magic_index = (occ_line * ROOK_MAGICS[kingSq]) >> rook_magic_shifts[kingSq];
    uint64_t rook_attacks = rook_magic_attack_table[rook_magic_offsets[kingSq] + rook_magic_index];;
    threats |= (rook_attacks & (types_bb_array[ROOK + enemy_idx] | types_bb_array[QUEEN + enemy_idx]));

    return bitboard_to_squares(threats);
}


int BoardState::eval_state() {
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