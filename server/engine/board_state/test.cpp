#include "BoardState.h"
#include <iostream>
#include <cassert>
#include <algorithm>

int main() {
    init_king_knight_lookups();
    init_pawn_lookups();
    init_ray_tables();
    generate_magic_bitboards();

    // 1) Inicialización y posición inicial
    BoardState bs;
    // Debe haber 32 piezas ocupando el tablero al inicio
    assert(__builtin_popcountll(bs.occupied()) == 32);

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

    // 6) Prueba get_ray_between (Testing ray_between_table directly)
    BoardState bs2; // bs2 is not strictly needed for these direct table lookups, but keep it for context.
    // Reset completo (these resets are irrelevant for direct ray_between_table access)
    bs2.board.fill(NO_PIECE);
    bs2.types_bb_array.fill(0ULL);
    bs2.occupied_bb = 0ULL;
    bs2.colors_bb_array = {0ULL, 0ULL};
    
    // Test Case 6.1: Vertical Ray (e1 to e4) - Confirmed Working
    int sq_e1 = 0*8 + 4;  // Square e1 (4)
    int sq_e4 = 3*8 + 4;  // Square e4 (28)
    uint64_t ray_e1_e4 = ray_between_table[sq_e1][sq_e4];
    std::cout << "Ray (e1 to e4):" << std::endl;
    BoardState::print_bitboard(ray_e1_e4);
    assert((ray_e1_e4 & (1ULL<<12)) != 0); // e2
    assert((ray_e1_e4 & (1ULL<<20)) != 0); // e3
    assert(__builtin_popcountll(ray_e1_e4) == 2); // Exactly 2 squares between
    std::cout << "Test e1 to e4 PASSED." << std::endl;

    // Test Case 6.2: Horizontal Ray (a1 to h1)
    int sq_a1 = 0*8 + 0; // Square a1 (0)
    int sq_h1 = 0*8 + 7; // Square h1 (7)
    uint64_t ray_a1_h1 = ray_between_table[sq_a1][sq_h1];
    std::cout << "Ray (a1 to h1):" << std::endl;
    BoardState::print_bitboard(ray_a1_h1);
    // Expected squares: b1(1), c1(2), d1(3), e1(4), f1(5), g1(6)
    assert((ray_a1_h1 & (1ULL<<1)) != 0);
    assert((ray_a1_h1 & (1ULL<<2)) != 0);
    assert((ray_a1_h1 & (1ULL<<3)) != 0);
    assert((ray_a1_h1 & (1ULL<<4)) != 0);
    assert((ray_a1_h1 & (1ULL<<5)) != 0);
    assert((ray_a1_h1 & (1ULL<<6)) != 0);
    assert(__builtin_popcountll(ray_a1_h1) == 6); // Exactly 6 squares between
    std::cout << "Test a1 to h1 PASSED." << std::endl;

    // Test Case 6.3: Diagonal Ray (a1 to h8 - increasing rank/file)
    int sq_a1_diag = 0*8 + 0; // Square a1 (0)
    int sq_h8_diag = 7*8 + 7; // Square h8 (63)
    uint64_t ray_a1_h8 = ray_between_table[sq_a1_diag][sq_h8_diag];
    std::cout << "Ray (a1 to h8):" << std::endl;
    BoardState::print_bitboard(ray_a1_h8);
    // Expected squares: b2(9), c3(18), d4(27), e5(36), f6(45), g7(54)
    assert((ray_a1_h8 & (1ULL<<9)) != 0);
    assert((ray_a1_h8 & (1ULL<<18)) != 0);
    assert((ray_a1_h8 & (1ULL<<27)) != 0);
    assert((ray_a1_h8 & (1ULL<<36)) != 0);
    assert((ray_a1_h8 & (1ULL<<45)) != 0);
    assert((ray_a1_h8 & (1ULL<<54)) != 0);
    assert(__builtin_popcountll(ray_a1_h8) == 6);
    std::cout << "Test a1 to h8 PASSED." << std::endl;

    // Test Case 6.4: Diagonal Ray (a8 to h1 - decreasing rank/increasing file)
    int sq_a8 = 7*8 + 0; // Square a8 (56)
    int sq_h1_diag = 0*8 + 7; // Square h1 (7)
    uint64_t ray_a8_h1 = ray_between_table[sq_a8][sq_h1_diag];
    std::cout << "Ray (a8 to h1):" << std::endl;
    BoardState::print_bitboard(ray_a8_h1);
    // Expected squares: b7(49), c6(42), d5(35), e4(28), f3(21), g2(14)
    assert((ray_a8_h1 & (1ULL<<49)) != 0);
    assert((ray_a8_h1 & (1ULL<<42)) != 0);
    assert((ray_a8_h1 & (1ULL<<35)) != 0);
    assert((ray_a8_h1 & (1ULL<<28)) != 0);
    assert((ray_a8_h1 & (1ULL<<21)) != 0);
    assert((ray_a8_h1 & (1ULL<<14)) != 0);
    assert(__builtin_popcountll(ray_a8_h1) == 6);
    std::cout << "Test a8 to h1 PASSED." << std::endl;

    // Test Case 6.5: Adjacent Aligned Squares (Should yield empty ray)
    int sq_a2 = 1*8 + 0; // Square a2 (8)
    uint64_t ray_a1_a2 = ray_between_table[sq_a1][sq_a2];
    std::cout << "Ray (a1 to a2 - adjacent):" << std::endl;
    BoardState::print_bitboard(ray_a1_a2);
    assert(ray_a1_a2 == 0ULL); // No squares between adjacent ones
    std::cout << "Test a1 to a2 PASSED." << std::endl;

    // Test Case 6.6: Non-Aligned Squares (Should yield empty ray, as init_ray_tables skips them)
    int sq_a1_non_aligned = 0*8 + 0; // Square a1 (0)
    int sq_b3_non_aligned = 2*8 + 1; // Square b3 (17)
    uint64_t ray_a1_b3 = ray_between_table[sq_a1_non_aligned][sq_b3_non_aligned];
    std::cout << "Ray (a1 to b3 - non-aligned):" << std::endl;
    BoardState::print_bitboard(ray_a1_b3);
    assert(ray_a1_b3 == 0ULL); // Should be empty if not aligned
    std::cout << "Test a1 to b3 PASSED." << std::endl;

    // Test Case 6.7: Reverse Direction (e4 to e1) - should be same as e1 to e4
    uint64_t ray_e4_e1 = ray_between_table[sq_e4][sq_e1];
    std::cout << "Ray (e4 to e1):" << std::endl;
    BoardState::print_bitboard(ray_e4_e1);
    assert((ray_e4_e1 & (1ULL<<12)) != 0); // e2
    assert((ray_e4_e1 & (1ULL<<20)) != 0); // e3
    assert(__builtin_popcountll(ray_e4_e1) == 2);
    assert(ray_e4_e1 == ray_e1_e4); // Should be identical
    std::cout << "Test e4 to e1 PASSED." << std::endl;

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
    int e1 = 4;
    bs4.addPiece(e1, Piece(ROOK + BLACK * PC_NUM));
    bs4.occupied_bb |= (1ULL << e1);
    bs4.colors_bb_array[BLACK] |= (1ULL << e1);
    bs4.types_bb_array[ROOK + BLACK * PC_NUM] |= (1ULL << e1);
    // Obtener amenazas lineales para blancas (sideToMove = WHITE)
    auto threats = bs4.get_linear_threats(WHITE);
    // Debe incluir la casilla e1 (4)

    std::cout << "Todas las pruebas de BoardState pasaron con éxito.\n";
    return 0;
}