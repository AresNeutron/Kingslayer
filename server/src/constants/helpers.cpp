#include "Helpers.h"

RookMoveData get_castling_rook_move(int king_from, int king_to) {
    RookMoveData rook_move = { -1, -1 }; // Inicializamos con valores por defecto

    if (king_to - king_from == +2) { // Enroque corto (King-side)
        if (king_from == SQ_E1) { // Rey blanco
            rook_move.from_sq = SQ_H1;
            rook_move.to_sq   = SQ_F1;
        } else if (king_from == SQ_E8) { // Rey negro
            rook_move.from_sq = SQ_H8;
            rook_move.to_sq   = SQ_F8;
        }
    } else if (king_to - king_from == -2) { // Enroque largo (Queen-side)
        if (king_from == SQ_E1) { // Rey blanco
            rook_move.from_sq = SQ_A1;
            rook_move.to_sq   = SQ_D1;
        } else if (king_from == SQ_E8) { // Rey negro
            rook_move.from_sq = SQ_A8;
            rook_move.to_sq   = SQ_D8;
        }
    }

    return rook_move;
}