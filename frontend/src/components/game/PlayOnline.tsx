"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Square } from 'chess.js';

interface Piece { color: 'w' | 'b'; type: string; }
type BoardMatrix = Array<Array<Piece | null>>;

interface PlayOnlineProps {
  onGameStateChange: (status: string) => void;
  onMoveUpdate: (history: string[]) => void;
  serverUrl: string;
}

const PIECE_MAP: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };

export default function PlayOnline({ onGameStateChange, onMoveUpdate, serverUrl }: PlayOnlineProps) {
  // --- Estado ---
  const [board, setBoard] = useState<BoardMatrix>(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // --- Refs para persistencia ---
  const socket = useRef<WebSocket | null>(null);
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Inicialización de Sonidos ---
  useEffect(() => {
    moveSound.current = new Audio("/sounds/move_sound.mp3");
    captureSound.current = new Audio("/sounds/capture_sound.mp3");
  }, []);

  // --- Lógica de Conexión (con Auto-reconnect) ---
  const connect = useCallback(() => {
    socket.current = new WebSocket(serverUrl);

    socket.current.onopen = () => {
      setIsConnected(true);
      console.log("Conectado al servidor de ajedrez");
    };

    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.type === "state") {
        setBoard(msg.payload.board);
        setTurn(msg.payload.turn);
        onGameStateChange(msg.payload.status);
        onMoveUpdate(msg.payload.history);
        if (msg.payload.lastMove) setLastMove(msg.payload.lastMove);
      }

      if (msg.type === "move_sound") {
        const audio = msg.captured ? captureSound.current : moveSound.current;
        audio?.play().catch(() => null);
      }
    };

    socket.current.onclose = () => {
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, [serverUrl, onGameStateChange, onMoveUpdate]);

  useEffect(() => {
    connect();
    return () => {
      socket.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  // --- Manejo de Movimientos ---
  const handleMove = (from: Square, to: Square) => {
    if (!isConnected) return;

    // 1. Movimiento Optimista
    const newBoard = [...board.map(row => [...row])];
    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 97;

    const movingPiece = newBoard[fromRow][fromCol];
    if (movingPiece) {
      newBoard[toRow][toCol] = movingPiece;
      newBoard[fromRow][fromCol] = null;
      setBoard(newBoard); // UI se actualiza al instante
    }

    // 2. Enviar al servidor
    socket.current?.send(JSON.stringify({
      type: "move",
      payload: { from, to, promotion: "q" }
    }));
  };

  const handleSquareClick = (coord: Square, piece: Piece | null) => {
    if (!selectedSquare) {
      if (piece?.color === turn) setSelectedSquare(coord);
    } else {
      if (selectedSquare !== coord) {
        handleMove(selectedSquare, coord);
      }
      setSelectedSquare(null);
    }
  };

  return (
    <div className={`chess-board-wrapper p-2 ${!isConnected ? 'opacity-50 grayscale' : ''}`}>
      {!isConnected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 text-white font-bold">
          Reconectando...
        </div>
      )}
      
      <div className="chess-board-grid w-[min(85vw,750px)] h-[min(85vw,750px)] relative">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === coord;
            const isLastMove = lastMove?.from === coord || lastMove?.to === coord;

            return (
              <div
                key={coord}
                onClick={() => handleSquareClick(coord, piece)}
                className={`chess-square 
                  ${isDark ? 'chess-square-dark' : 'chess-square-light'} 
                  ${isSelected ? 'chess-square-selected' : ''}
                  ${isLastMove ? 'before:absolute before:inset-0 before:bg-gold/10' : ''}
                  relative cursor-pointer select-none`}
              >
                {/* Etiquetas de coordenadas */}
                {colIndex === 0 && (
                  <span className={`absolute top-0.5 left-0.5 opacity-40 font-bold text-[10px] ${isDark ? 'text-[#dee3e6]' : 'text-[#6085a1]'}`}>
                    {8 - rowIndex}
                  </span>
                )}
                {rowIndex === 7 && (
                  <span className={`absolute bottom-0.5 right-0.5 opacity-40 font-bold uppercase text-[10px] ${isDark ? 'text-[#dee3e6]' : 'text-[#6085a1]'}`}>
                    {String.fromCharCode(97 + colIndex)}
                  </span>
                )}

                {piece && (
                  <img 
                    src={`/pieces/${piece.color}_${PIECE_MAP[piece.type]}.svg`} 
                    className={`chess-piece piece-animate w-full h-full transition-transform ${isSelected ? 'scale-110 -translate-y-1' : ''}`} 
                    alt=""
                    draggable={false}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}