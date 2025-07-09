#include "Game.h"
#include <cstdint>
#include <vector>
#include <iostream>


uint64_t Game::get_pseudo_legal_moves(int from_sq) {
    Piece pc = board_state.board[from_sq]; // 0-11

    uint64_t occupied = board_state.occupied_bb;

    uint64_t friendly = board_state.colors_bb_array[sideToMove];

    Type type = getType(from_sq);

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


int Game::get_legal_moves(int from_sq) {
    if (!(0 <= from_sq <= 63)) {
        std::cout << "Llamando función de obtener movimientos con número fuera del rango de escaques" << std::endl;
        return 0;
    }

    if (board_state.board[from_sq] == NO_PIECE) {
        std::cout << "Llamando función de obtener movimientos con un escaque vacío" << std::endl;
        return 0;
    }

    else if (colorOf(board_state.board[from_sq]) != sideToMove) {
        std::cout << "Error, attempting to call get_legal_moves function with a piece of the opposite turn" << std::endl;
        return 0;
    }

    uint64_t pl_moves = get_pseudo_legal_moves(from_sq);
    int captured_en_passant_pawn = NO_SQ;
    
    // Variables to be used in the loop
    uint64_t enemy_bb = board_state.colors_bb_array[1 - sideToMove];
    bool isKing = getType(from_sq) == KING;
    bool isPawn = getType(from_sq) == PAWN;

    int king_sq = __builtin_ctzll(board_state.types_bb_array[KING + PC_NUM * sideToMove]);
    uint64_t king_attackers = board_state.get_attackers_for_sq(sideToMove, king_sq);

    int numAttackers = __builtin_popcountll(king_attackers);

    // variables for check filtering
    bool isPinned = (pinned_rays[from_sq] != 0);
    uint64_t pin_ray = pinned_rays[from_sq];

    // if the king is attacked by only one enemy, you can only move to:
    int enemy_sq = numAttackers == 1 ? __builtin_ctzll(king_attackers) : NO_SQ;
    int enemy_piece = (enemy_sq != NO_SQ) ? board_state.board[enemy_sq] : NO_PIECE;

    // To capture the attacker
    uint64_t allowed_moves = numAttackers == 1 ? king_attackers : 0;

    if (
        enemy_piece == (BISHOP + PC_NUM * (1 - sideToMove)) ||
        enemy_piece == (ROOK + PC_NUM * (1 - sideToMove)) ||
        enemy_piece == (QUEEN + PC_NUM * (1 - sideToMove))
    ) {
        // To put a piece between the king and the attacker, only if its a bishop, rook or queen
        allowed_moves |= board_state.get_ray_between(sideToMove, enemy_sq);
    }

    // Variable to count the moves
    int moveCount = 0;

    // add en_passant before the loop, we have to check out its legality
    if (isPawn) pl_moves |= get_en_passant_bb(from_sq);
    

    while (pl_moves) {
        int to_sq = __builtin_ctzll(pl_moves);
        uint64_t lsb_bit = pl_moves & -pl_moves;

        pl_moves &= pl_moves - 1;
        MoveType flag = (enemy_bb & lsb_bit) ? CAPTURE : MOVE;

        // case of the king: add castling if posible, and filter attacked squares
        if (isKing) {
            // if "to_sq" is under attack, discard that move
            if (board_state.get_attackers_for_sq(sideToMove, to_sq) != 0) continue;
                
            uint16_t move_code = (flag << 12) | (from_sq << 6) | to_sq;
            movesArray[moveCount] = move_code;
            moveCount++;
            
        }

        // case of non-king pieces
        else {
            // case for promotion: "to_sq" is in the edge
            if (isPawn && ((PROMOTION_ROWS[sideToMove] >> to_sq) & 1ULL)) {
                flag = (flag == CAPTURE) ? PROMOTION_CAPTURE : PROMOTION;
            }

            // case for en-passant, "to_sq" is equal to "en_passant_sq"
            if (isPawn && to_sq == en_passant_sq) {
                flag = EN_PASSANT;
                captured_en_passant_pawn = sideToMove ? (to_sq - 8) : (to_sq + 8);
            }
            
            // Now, begins the filter
            switch (numAttackers)
            {
            // king is not in check
            case 0:
                if (isPinned && !((pin_ray >> to_sq) & 1ULL)) continue; // filter pinned moved
                break;
            // king is in check: one attacker
            case 1:
                if (
                    flag == EN_PASSANT &&
                    captured_en_passant_pawn == enemy_sq && 
                    enemy_piece == PAWN + PC_NUM * (1 - sideToMove)
                    ) break;

                else if (!((allowed_moves>>to_sq)&1)) continue;
                break;
            // king is in check: more than one attacker
            default:
                continue; // only king can move
                break;
            }

            uint16_t move_code = static_cast<uint16_t>((flag << 12) | (from_sq << 6) | to_sq);
            movesArray[moveCount] = move_code;
            moveCount++;
        }
    }

    // handle castling after the loop, it automatically ensures check detection
    if (isKing) {
        std::array<uint16_t, 2> castling_moves = get_castling_move(from_sq);

        for (int i=0; i < 2; ++i) {
            if (castling_moves[i]) {
                movesArray[moveCount] = castling_moves[i];
                moveCount++;
            }
        }
    }

    return moveCount;
}
