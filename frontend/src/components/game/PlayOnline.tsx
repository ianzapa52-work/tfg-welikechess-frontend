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

const PIECE_MAP: Record<string, string> = { 
  p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" 
};

export default function PlayOnline({ onGameStateChange, onMoveUpdate, serverUrl }: PlayOnlineProps) {
  // --- Estado ---
  const [board, setBoard] = useState<BoardMatrix>(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  // --- Lógica de Conexión ---
  const connect = useCallback(() => {
    socket.current = new WebSocket(serverUrl);

    socket.current.onopen = () => {
      setIsConnected(true);
      console.log("Conectado al coliseo online");
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
    if (!isConnected || turn === null) return;

    const fromRow = 8 - parseInt(from[1]);
    const fromCol = from.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(to[1]);
    const toCol = to.charCodeAt(0) - 97;

    const newBoard = [...board.map(row => [...row])];
    const movingPiece = newBoard[fromRow][fromCol];
    
    // Movimiento optimista (se revierte si el server no lo valida al recibir el nuevo estado)
    if (movingPiece) {
      newBoard[toRow][toCol] = movingPiece;
      newBoard[fromRow][fromCol] = null;
      setBoard(newBoard); 
    }

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
    <div className="p-1 bg-zinc-950 rounded-[2rem] shadow-[0_60px_120px_rgba(0,0,0,0.95)] border border-white/10 backdrop-blur-sm relative">
      {!isConnected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-[2rem] backdrop-blur-md text-gold font-black tracking-widest animate-pulse">
          RECONECTANDO AL SERVIDOR...
        </div>
      )}
      
      <div className={`grid grid-cols-8 grid-rows-8 w-[min(92vw,750px)] h-[min(92vw,750px)] bg-zinc-900 overflow-hidden rounded-xl border-[4px] border-black shadow-inner 
        ${isDragging ? 'cursor-grabbing' : ''}`}>
        
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === coord;
            const isLastMove = lastMove?.from === coord || lastMove?.to === coord;
            const isPieceMine = piece?.color === turn;

            return (
              <div
                key={coord}
                onClick={() => handleSquareClick(coord, piece)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const fromSquare = e.dataTransfer.getData("fromSquare") as Square;
                  handleMove(fromSquare, coord);
                  setSelectedSquare(null);
                  setIsDragging(false);
                }}
                className={`relative flex items-center justify-center transition-colors duration-200
                  ${isDark ? 'bg-[#a0522d]' : 'bg-[#e9ca9c]'} 
                  ${isSelected ? 'bg-gold/50' : ''}
                  ${isLastMove && !isSelected ? 'after:absolute after:inset-0 after:bg-gold/25 after:z-10' : ''}
                `}
              >
                {/* Coordenadas */}
                {colIndex === 0 && (
                  <span className={`absolute top-0.5 left-1 text-[10px] font-bold font-mono ${isDark ? 'text-[#e9ca9c] opacity-40' : 'text-[#3e2723] opacity-50'}`}>
                    {8 - rowIndex}
                  </span>
                )}
                {rowIndex === 7 && (
                  <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold font-mono uppercase ${isDark ? 'text-[#e9ca9c] opacity-40' : 'text-[#3e2723] opacity-50'}`}>
                    {String.fromCharCode(97 + colIndex)}
                  </span>
                )}

                {piece && (
                  <img 
                    src={`/pieces/${piece.color}_${PIECE_MAP[piece.type]}.svg`} 
                    draggable={true}
                    onDragStart={(e) => {
                      // Permitimos arrastrar solo si es nuestra pieza y estamos conectados
                      if (!isPieceMine || !isConnected) return e.preventDefault();
                      e.dataTransfer.setData("fromSquare", coord);
                      setSelectedSquare(coord);
                      setIsDragging(true);
                    }}
                    onDragEnd={() => setIsDragging(false)}
                    className={`w-[92%] h-[92%] z-20 transition-transform drop-shadow-lg 
                      cursor-grab active:cursor-grabbing
                      ${isSelected ? 'scale-105 -translate-y-1' : ''}`} 
                    alt=""
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