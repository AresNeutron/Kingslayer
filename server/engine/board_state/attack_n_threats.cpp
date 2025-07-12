#include "BoardState.h"
#include <cstdint>
#include <vector>

uint64_t BoardState::getAttackersForSq(Color sideToMove, int sq) const{
    Color oppColor = static_cast<Color>(1 - sideToMove); 
    int enemy_idx = oppColor * PC_NUM;

    uint64_t attackers = 0ULL;

    // --- Lookup precomputado (simétrico) ---
    attackers |= (types_bb_array[KING + enemy_idx] & king_lookup[sq]);
    attackers |= (types_bb_array[KNIGHT + enemy_idx] & knight_lookup[sq]);

    // Pawn attacks - optimized with direct lookup
    const uint64_t pawnAttackers = types_bb_array[PAWN + enemy_idx];
    if (oppColor == WHITE) {
        attackers |= pawnAttackers & black_pawn_attacks_lookup[sq];
    } else {
        attackers |= pawnAttackers & white_pawn_attacks_lookup[sq];
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


uint64_t BoardState::getLinearThreats(Color sideToMove) const {
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

    return threats;
}

uint64_t BoardState::getRayBetween(Color sideToMove, int sq) const {
    // Get king position
    const Piece kingPiece = static_cast<Piece>(KING + sideToMove * PC_NUM);
    const uint64_t kingBB = types_bb_array[kingPiece];
    const int king_sq = __builtin_ctzll(kingBB);
    
    // O(1) lookup instead of runtime calculation
    return ray_between_table[sq][king_sq];
}

