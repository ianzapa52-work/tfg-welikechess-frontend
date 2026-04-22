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
  const [board, setBoard] = useState<BoardMatrix>(Array(8).fill(null).map(() => Array(8).fill(null)));
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string, to: string } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const socket = useRef<WebSocket | null>(null);
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    moveSound.current = new Audio("/sounds/move_sound.mp3");
    captureSound.current = new Audio("/sounds/capture_sound.mp3");
  }, []);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access");
    if (!token) return console.error("No se encontró token");

    // 1. Limpieza de URL
    let cleanUrl = serverUrl.replace(":3000", ":8000");
    if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
    }

    const socketUrl = `${cleanUrl}/?token=${token}`;
    
    console.log("🔗 Intentando conexión a:", socketUrl);
    socket.current = new WebSocket(socketUrl);

    socket.current.onopen = () => {
      setIsConnected(true);
      console.log("✅ WebSocket Conectado y Abierto. Estado:", socket.current?.readyState);
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
    };

    socket.current.onclose = (e) => {
      setIsConnected(false);
      console.log("🔌 Conexión cerrada:", e.reason || "Cierre de socket");
      // Solo intentamos reconectar si no ha sido un cierre manual por cleanup
      if (e.code !== 1000) {
        reconnectTimeout.current = setTimeout(connect, 3000);
      }
    };

    socket.current.onerror = (err) => {
      // Diagnóstico mejorado: Solo error real si el socket no está abierto
      if (socket.current?.readyState !== WebSocket.OPEN) {
        console.error("❌ Error WebSocket real detectado");
      } else {
        console.warn("⚠️ WebSocket lanzó un evento de error pero la conexión sigue OPEN (residuo de reconexión).");
      }
    };
  }, [serverUrl, onGameStateChange, onMoveUpdate]);

  useEffect(() => {
    connect();
    return () => {
      console.log("🧹 Limpiando socket antes de reconectar...");
      if (socket.current) {
        // Desactivamos los listeners antes de cerrar para evitar bucles de reconexión
        socket.current.onclose = null; 
        socket.current.onerror = null;
        socket.current.onopen = null;
        socket.current.onmessage = null;
        socket.current.close(1000); // Cierre normal
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  const handleMove = (from: Square, to: Square) => {
    if (!isConnected || turn === null || from === to) return;
    socket.current?.send(JSON.stringify({
        type: "move",
        payload: { from: from.toLowerCase(), to: to.toLowerCase(), promotion: "q" }
    }));
  };

  const handleSquareClick = (coord: Square, piece: Piece | null) => {
    if (!selectedSquare) {
      if (piece?.color === turn) setSelectedSquare(coord);
    } else {
      if (selectedSquare !== coord) handleMove(selectedSquare, coord);
      setSelectedSquare(null);
    }
  };

  return (
    <div className="p-1 bg-zinc-950 rounded-[2rem] shadow-2xl border border-white/10 relative h-full w-full flex items-center justify-center">
      {!isConnected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-[2rem] backdrop-blur-md text-gold font-black tracking-widest animate-pulse">
          CONECTANDO AL TABLERO...
        </div>
      )}
      
      <div className={`grid grid-cols-8 grid-rows-8 w-full max-w-[700px] aspect-square bg-zinc-900 overflow-hidden rounded-xl border-[4px] border-black shadow-inner ${isDragging ? 'cursor-grabbing' : ''}`}>
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
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const fromSquare = e.dataTransfer.getData("fromSquare") as Square;
                  handleMove(fromSquare, coord);
                  setIsDragging(false);
                }}
                className={`relative flex items-center justify-center transition-colors duration-200
                  ${isDark ? 'bg-[#a0522d]' : 'bg-[#e9ca9c]'} 
                  ${isSelected ? 'bg-gold/50' : ''}
                  ${isLastMove && !isSelected ? 'after:absolute after:inset-0 after:bg-gold/25' : ''}
                `}
              >
                {colIndex === 0 && <span className="absolute top-0.5 left-1 text-[8px] opacity-30">{8 - rowIndex}</span>}
                {rowIndex === 7 && <span className="absolute bottom-0.5 right-1 text-[8px] opacity-30 uppercase">{String.fromCharCode(97 + colIndex)}</span>}

                {piece && (
                  <img 
                    src={`/pieces/${piece.color}_${PIECE_MAP[piece.type]}.svg`} 
                    draggable={true}
                    onDragStart={(e) => {
                      if (piece.color !== turn || !isConnected) return e.preventDefault();
                      e.dataTransfer.setData("fromSquare", coord);
                      setSelectedSquare(coord);
                      setIsDragging(true);
                    }}
                    onDragEnd={() => setIsDragging(false)}
                    className="w-[90%] h-[90%] z-20 cursor-grab active:cursor-grabbing" 
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