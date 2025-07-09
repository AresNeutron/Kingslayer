#include "../board_state/BoardState.h"
#include "../constants/PSQ_tables.h"

#ifndef POSITION_H
#define POSITION_H

#include <cstdint>
#include <vector>
#include <cassert>

struct UndoInfo {
    uint16_t move_code;  // static_cast<uint16_t>((from_sq << 6) | to_sq);
    Piece captured_piece;
    int8_t prev_en_passant_sq;
    uint8_t prev_castling_rights;
};

constexpr std::array<const char*, 5> eventMessages = {
    "none", "check", "checkmate", "stalemate", "promotion"
};

constexpr int MAX_DEPTH = 10; // This is the max secure depth by now
constexpr int MAX_MOVES = 40;


class Game {
public:
    BoardState board_state;

    uint8_t castling_rights;

    int8_t en_passant_sq;

    int8_t promotion_sq;

    Color sideToMove;
    
    std::array<uint64_t,64> pinned_rays; // the ray if there is a pinned piece at sq, else 0

    GameEvent game_event;

    std::array<UndoInfo, MAX_DEPTH> undo_stack;
    
    std::array<uint16_t, MAX_MOVES> movesArray;
    
    int ply;

    Game()
    : castling_rights(INITIAL_CASTLING_RIGHTS)
    , en_passant_sq(NO_SQ)
    , promotion_sq(NO_SQ)
    , sideToMove(WHITE)
    , game_event(NONE)
    , ply(0)
    {
        board_state = BoardState();
        pinned_rays.fill(0ULL);
        movesArray.fill(0ULL);
    }

    int get_legal_moves(int sq);

    void make_move(uint16_t move_code);

    void make_promotion(Type promotion = QUEEN);

    void unmake_move();

    inline void changeTurn() {
        sideToMove = Color(1 - sideToMove);
    }

    inline Type getType(int from_sq) {
        return static_cast<Type>(board_state.board[from_sq] % PC_NUM);
    };

    inline uint64_t getSideBitboard() {
        return board_state.colors_bb_array[sideToMove];
    }

    void make_castling(int from_sq, int to_sq, bool reverse = false);

    void update_castling_rights(int to_sq);

    uint64_t get_en_passant_bb(int sq) const;

    std::array<uint16_t, 2> get_castling_move(int king_sq) const;

    uint64_t get_pseudo_legal_moves(int sq);

    void set_pinned_pieces();

    uint64_t detect_check();

    void detect_game_over(uint64_t threats);

    double negamax(int depth, double alpha, double beta, int color_multiplier);

    uint16_t find_best_move(int depth, bool is_engine_white);

    void user_moves(uint16_t move_code);

    void engine_moves(Color engine_color);

    void resolve_promotion(char input);
};


#endif // POSITION_H


