"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Square } from 'chess.js';

interface Piece { color: 'w' | 'b'; type: string; }
interface GameState { board: Array<Array<Piece | null>>; history: string[]; status: string; turn: 'w' | 'b'; }

interface PlayOnlineProps {
  onGameStateChange: (status: string) => void;
  onMoveUpdate: (history: string[]) => void;
  serverUrl: string; // "ws://localhost:3000"
}

const PIECE_MAP: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };

export default function PlayOnline({ onGameStateChange, onMoveUpdate, serverUrl }: PlayOnlineProps) {
  const [board, setBoard] = useState<Array<Array<Piece | null>>>([]);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const socket = useRef<WebSocket | null>(null);
  
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    moveSound.current = new Audio("/sounds/move_sound.mp3");
    captureSound.current = new Audio("/sounds/capture_sound.mp3");

    // Conectar al WebSocket
    socket.current = new WebSocket(serverUrl);

    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "state") {
        const state: GameState = msg.payload;
        setBoard(state.board);
        setTurn(state.turn);
        onGameStateChange(state.status);
        onMoveUpdate(state.history);
      }
      if (msg.type === "move_sound") {
        msg.captured ? captureSound.current?.play() : moveSound.current?.play();
      }
    };

    return () => socket.current?.close();
  }, [serverUrl]);

  const sendMove = (from: Square, to: Square) => {
    socket.current?.send(JSON.stringify({ 
      type: "move", 
      payload: { from, to, promotion: "q" } 
    }));
  };

  const getPieceImg = (color: string, type: string) => `/pieces/${color}_${PIECE_MAP[type]}.svg`;

  const handleSquareClick = (coord: Square, piece: Piece | null) => {
    if (!selectedSquare) {
      if (piece && piece.color === turn) setSelectedSquare(coord);
    } else {
      sendMove(selectedSquare, coord);
      setSelectedSquare(null);
    }
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-[#333] bg-[#1a1a1a]">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const isSelected = selectedSquare === coord;

          return (
            <div
              key={coord}
              onClick={() => handleSquareClick(coord, piece)}
              className={`relative flex items-center justify-center cursor-pointer
                ${isDark ? 'bg-[#779556]' : 'bg-[#ebecd0]'}
                ${isSelected ? 'ring-4 ring-inset ring-[#d4af37]/60' : ''}
              `}
            >
              {piece && (
                <img 
                  src={getPieceImg(piece.color, piece.type)} 
                  className="w-[90%] h-[90%] select-none drop-shadow-lg"
                  alt=""
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}