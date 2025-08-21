#!/bin/bash

# This script automates a sequence of commands for your chess engine.

# Redirect the command sequence to the engine's standard input.
# The output from the engine will be displayed in the terminal.

echo "Starting automated engine test..."

./engine << EOF
ucinewgame
isready
getmoves 15
makemove 991
getmoves 48
makemove 3112
getmoves 31
makemove 2023
getmoves 54
makemove 3494
getmoves 39
makemove 14830
getmoves 62
makemove 4015
getmoves 46
makemove 2998
getmoves 47
makemove 3038
getmoves 54
makemove 19902
promote 4
quit
EOF

echo "Test finished."