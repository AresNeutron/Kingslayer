#include "BoardState.h"
#include <iostream>
#include <cassert>
#include <algorithm>

int main() {
    init_king_knight_lookups();
    init_pawn_lookups();
    generate_magic_bitboards();

    // 1) Inicialización y posición inicial
    BoardState bs;
    // Debe haber 32 piezas ocupando el tablero al inicio
    assert(__builtin_popcountll(bs.occupied_bb) == 32);

    // 2) Prueba movePiece: mover peón blanco desde e2 (12) a e4 (28)
    int e2 = 1*8 + 4;
    int e4 = 3*8 + 4;
    auto pc = bs.board[e2];
    assert(pc != NO_PIECE);
    bs.movePiece(e2, e4);
    // Verificar mailbox
    assert(bs.board[e2] == NO_PIECE);
    assert(bs.board[e4] == pc);
    // Verificar bitboards
    assert((bs.types_bb_array[pc] & (1ULL << e4)) != 0);
    assert((bs.occupied_bb & (1ULL << e2)) == 0);
    assert((bs.occupied_bb & (1ULL << e4)) != 0);

    // 3) Prueba deletePiece
    bs.deletePiece(e4);
    assert(bs.board[e4] == NO_PIECE);
    assert((bs.occupied_bb & (1ULL << e4)) == 0);

    // 4) Prueba addPiece
    bs.addPiece(e4, pc);
    assert(bs.board[e4] == pc);
    assert((bs.types_bb_array[pc] & (1ULL << e4)) != 0);

    // 5) Prueba bitboard_to_squares
    uint64_t test_bb = (1ULL<<0) | (1ULL<<63) | (1ULL<<28);
    auto squares = BoardState::bitboard_to_squares(test_bb);
    assert(squares.size() == 3);
    assert(std::find(squares.begin(), squares.end(), 0) != squares.end());
    assert(std::find(squares.begin(), squares.end(), 63) != squares.end());
    assert(std::find(squares.begin(), squares.end(), 28) != squares.end());

    // 6) Prueba get_ray_between
    BoardState bs2;
    // Reset completo
    bs2.board.fill(NO_PIECE);
    bs2.types_bb_array.fill(0ULL);
    bs2.occupied_bb = 0ULL;
    bs2.colors_bb_array = {0ULL, 0ULL};
    // Colocar rey blanco en e1 (4) y pieza en e4 (28)
    int e1 = 0*8 + 4;
    bs2.addPiece(e1, Piece(KING + WHITE * PC_NUM));
    bs2.occupied_bb |= (1ULL << e1);
    uint64_t ray = bs2.get_ray_between(WHITE, 28);
    // Debe cubrir e2 (12) y e3 (20)
    assert((ray & (1ULL<<12)) != 0);
    assert((ray & (1ULL<<20)) != 0);

    // 7) Prueba get_attackers_for_sq: colocar un caballo negro en g4 (30) que ataca e3 (20)
    BoardState bs3;
    // Reset completo
    bs3.board.fill(NO_PIECE);
    bs3.types_bb_array.fill(0ULL);
    bs3.occupied_bb = 0ULL;
    bs3.colors_bb_array = {0ULL, 0ULL};
    int g4 = 3*8 + 6;
    int e3 = 2*8 + 4;
    bs3.addPiece(g4, Piece(KNIGHT + BLACK * PC_NUM));
    // Actualizar campos auxiliares
    bs3.occupied_bb |= (1ULL << g4);
    bs3.colors_bb_array[BLACK] |= (1ULL << g4);
    bs3.types_bb_array[KNIGHT + BLACK * PC_NUM] |= (1ULL << g4);
    // Obtener atacantes de e3 para blancas moviendo (sideToMove = WHITE)
    uint64_t attackers = bs3.get_attackers_for_sq(WHITE, e3);
    // Caballo en g4 ataca e3? (offset dr=-1, df=-2) sí
    assert((attackers & (1ULL << g4)) != 0);

    // 8) Prueba get_linear_threats: torre negra en e1 amenaza rey blanco en e4
    BoardState bs4;
    bs4.board.fill(NO_PIECE);
    bs4.types_bb_array.fill(0ULL);
    bs4.occupied_bb = 0ULL;
    bs4.colors_bb_array = {0ULL, 0ULL};
    int e4_ = 3*8 + 4;
    // Colocar rey blanco en e4
    bs4.addPiece(e4_, Piece(KING + WHITE * PC_NUM));
    bs4.occupied_bb |= (1ULL << e4_);
    bs4.colors_bb_array[WHITE] |= (1ULL << e4_);
    bs4.types_bb_array[KING + WHITE * PC_NUM] |= (1ULL << e4_);
    // Colocar torre negra en e1
    bs4.addPiece(e1, Piece(ROOK + BLACK * PC_NUM));
    bs4.occupied_bb |= (1ULL << e1);
    bs4.colors_bb_array[BLACK] |= (1ULL << e1);
    bs4.types_bb_array[ROOK + BLACK * PC_NUM] |= (1ULL << e1);
    // Obtener amenazas lineales para blancas (sideToMove = WHITE)
    auto threats = bs4.get_linear_threats(WHITE);
    // Debe incluir la casilla e1 (4)
    assert(std::find(threats.begin(), threats.end(), e1) != threats.end());

    std::cout << "Todas las pruebas de BoardState pasaron con éxito.\n";
    return 0;
}