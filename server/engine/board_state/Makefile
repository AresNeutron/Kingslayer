CXX = g++
CXXFLAGS = -std=c++20 -O2

# Lista de archivos fuente (excluyendo magic_number_generator.cpp)
SRCS = \
    test.cpp \
    moves.cpp
    attack_n_threats.cpp \
	setters.cpp \
    others.cpp \
    ../constants/rays.cpp \
    ../precomputed_moves/non_sliding_moves/king_knight.cpp \
    ../precomputed_moves/non_sliding_moves/pawn.cpp \
    ../precomputed_moves/sliding_moves/masks_blockers.cpp \
    ../precomputed_moves/sliding_moves/rook_bishop.cpp

OBJS = $(SRCS:.cpp=.o)

test: $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	rm -f $(OBJS) test
