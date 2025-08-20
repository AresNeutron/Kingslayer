import asyncio
from typing import Optional, Dict
import time

PATH = './src/engine'

class GameManager:
    """
    Manages a UCI chess engine subprocess, sending commands and parsing responses.
    """
    def __init__(self, color: int):
        self.engine_path = PATH
        self.user_color = color
        self.proc: Optional[asyncio.subprocess.Process] = None
        self.last_activity = time.time()
        self.created_at = time.time()

    def update_activity(self) -> None:
        """Update last activity timestamp"""
        self.last_activity = time.time()

    async def start(self) -> None:
        """Launch the engine and initialize UCI protocol."""
        if self.proc and self.proc.returncode is None:
            return

        self.proc = await asyncio.create_subprocess_exec(
            self.engine_path,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        await self._send_line('uci')
        await self._read_until('uciok')

        await self._send_line('isready')
        await self._read_until('readyok')

        await self._send_line('ucinewgame')
        await self._read_until('readyok')

        self.update_activity()

    async def stop(self) -> None:
        """Shut down the engine subprocess."""
        if self.proc and self.proc.returncode is None:
            await self._send_line('quit')
            await self.proc.wait()
        self.proc = None
            

    async def _send_line(self, line: str) -> None:
        if not self.proc:
            await self.start()
        
        self.proc.stdin.write(f"{line}\n".encode())
        await self.proc.stdin.drain()


    async def _read_line(self) -> str:
        raw = await self.proc.stdout.readline()
        return raw.decode().strip()

    async def _read_until(self, keyword: str) -> None:
        """Read lines until a line equals keyword."""
        while True:
            line = await self._read_line()
            if line == keyword:
                break
    
    async def _parse_stream_response(self) -> Dict:
        """Parse the new streaming format from engine"""
        response = {}
        
        while True:
            line = await self._read_line()
            
            if line.startswith('move_data '):
                parts = line.split()[1:]  # Remove 'move_data'
                response['move_data'] = [int(x) for x in parts]
            
            elif line.startswith('promotion_pc '):
                response['promotion_pc'] = int(line.split()[1])
            
            elif line.startswith('event_data '):
                response['event_data'] = int(line.split()[1])
            
            elif line.startswith('event '):
                response['event'] = line.split()[1]
            
            elif line == 'nextturn':
                response['status'] = 'nextturn'
                break
            
            elif line == 'awaiting':
                response['status'] = 'awaiting'
                break
                
        return response

    async def user_moves(self, move_code) -> Dict:
        """Make a move via UCI makemove"""
        self.update_activity()
        await self._send_line(f'makemove {move_code}')
        return await self._parse_stream_response()
    
    async def resolve_promotion(self, promotion) -> Dict:
        """Resolves the promotion via UCI"""
        self.update_activity()
        await self._send_line(f'promote {promotion}')
        return await self._parse_stream_response()

    async def engine_moves(self) -> Dict:
        """Make a move via UCI enginego"""
        self.update_activity()
        await self._send_line('enginego')
        return await self._parse_stream_response()

    async def get_moves(self, square: int):
        """Retrieve legal moves from a square via custom getmoves command."""
        await self._send_line(f'getmoves {square}')
        moves = []
        while True:
            line = await self._read_line()
            if line == 'readyok':
                break
            moves.append(int(line))
        return moves
