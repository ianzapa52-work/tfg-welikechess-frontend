"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Square } from 'chess.js';

interface Piece { color: 'w' | 'b'; type: string; }
interface GameState { board: Array<Array<Piece | null>>; history: string[]; status: string; turn: 'w' | 'b'; }

interface PlayOnlineProps {
  onGameStateChange: (status: string) => void;
  onMoveUpdate: (history: string[]) => void;
  serverUrl: string;
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
    socket.current = new WebSocket(serverUrl);

    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "state") {
        setBoard(msg.payload.board);
        setTurn(msg.payload.turn);
        onGameStateChange(msg.payload.status);
        onMoveUpdate(msg.payload.history);
      }
      if (msg.type === "move_sound") {
        msg.captured ? captureSound.current?.play().catch(() => null) : moveSound.current?.play().catch(() => null);
      }
    };

    return () => socket.current?.close();
  }, [serverUrl, onGameStateChange, onMoveUpdate]);

  const handleSquareClick = (coord: Square, piece: Piece | null) => {
    if (!selectedSquare) {
      if (piece?.color === turn) setSelectedSquare(coord);
    } else {
      socket.current?.send(JSON.stringify({ type: "move", payload: { from: selectedSquare, to: coord, promotion: "q" } }));
      setSelectedSquare(null);
    }
  };

  return (
    <div className="chess-board-grid font-cinzel">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
          const isDark = (rowIndex + colIndex) % 2 === 1;
          
          return (
            <div
              key={coord}
              onClick={() => handleSquareClick(coord, piece)}
              className={`chess-square 
                ${isDark ? 'chess-square-dark' : 'chess-square-light'} 
                ${selectedSquare === coord ? 'chess-square-selected' : ''}`}
            >
              {piece && (
                <img src={`/pieces/${piece.color}_${PIECE_MAP[piece.type]}.svg`} className="chess-piece" alt="" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}