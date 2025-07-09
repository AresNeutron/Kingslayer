#include <iostream>
#include <string>
#include <sstream>
#include <unordered_map>
#include "./game/Game.h"
#include "./board_state/BoardState.h"

Game game;

enum class Command {
    UCINEWGAME, ENGINEMOVES, GETBOARD,
    GETMOVES, USERMOVES, PROMOTE, QUIT, UNKNOWN
};

Command obtain_command(const std::string& token) {
    static const std::unordered_map<std::string, Command> command_map = {
        {"ucinewgame", Command::UCINEWGAME},
        {"enginego", Command::ENGINEMOVES},
        {"getboard", Command::GETBOARD},
        {"getmoves", Command::GETMOVES},
        {"promote", Command::PROMOTE},
        {"makemove", Command::USERMOVES},
        {"quit", Command::QUIT}
    };

    auto it = command_map.find(token);
    return it != command_map.end() ? it->second : Command::UNKNOWN;
}

void uci_loop() {
    std::string line;

    while (std::getline(std::cin, line)) {
        std::istringstream iss(line);
        std::string token;
        iss >> token;

        switch (obtain_command(token)) {
            case Command::UCINEWGAME:
                game = Game();
                std::cout << "New Game Started\n";
                std::cout << "readyok\n";
                break;

            case Command::ENGINEMOVES:{
                int engine_color;
                iss >> engine_color;
                if (engine_color != 0 && engine_color != 1) {
                    std::cout << "Invalid engine color in UCI\n";
                    std::cout << "error" << std::endl;
                    break;
                }

                game.engine_moves(static_cast<Color>(engine_color));

                break;
            }

            case Command::GETBOARD: {
                game.board_state.printBoardArray();
                std::cout << "readyok\n";
                break;
            }

            case Command::GETMOVES: {
                int square;
                iss >> square;
                if (square < 0 || square > 63) {
                    std::cout << "Invalid square\n";
                    std::cout << "error" << std::endl;
                    break;
                }

                int num_moves = game.get_legal_moves(square);
                const std::array<uint16_t, MAX_MOVES>& moves = game.movesArray;

                for (int i = 0; i < num_moves; ++i) {
                    std::cout << moves[i] << std::endl;
                }

                std::cout << "readyok\n";
                break;
            }

            case Command::USERMOVES: {
                uint16_t move_code;
                iss >> move_code;

                game.user_moves(move_code);
                break;
            }

            case Command::PROMOTE: {
                char pchar;
                iss >> pchar;
                
                game.resolve_promotion(pchar);
                break;
            }


            case Command::QUIT:
                return;

            default:
                std::cout << "Unknown command: " << token << "\n";
                break;
        }
    }
}

int main() {
    init_king_knight_lookups();
    init_pawn_lookups();
    generate_magic_bitboards();

    uci_loop();
    return 0;
}
