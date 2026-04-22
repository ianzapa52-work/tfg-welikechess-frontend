"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Square, Chess } from 'chess.js';

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
  // Usamos una referencia para el objeto Chess para evitar problemas de re-renderizado
  // pero mantenemos un estado para forzar la actualización visual
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState<BoardMatrix>([]);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const socket = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const updateBoardFromChess = useCallback(() => {
    const chess = chessRef.current;
    const matrix: BoardMatrix = [];
    const boardData = chess.board();
    
    for (let i = 0; i < 8; i++) {
      matrix[i] = boardData[i].map(s => s ? { color: s.color, type: s.type } : null);
    }
    
    setBoard(matrix);
    setTurn(chess.turn());
    onMoveUpdate(chess.history());
  }, [onMoveUpdate]);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access");
    if (!token) return console.error("No se encontró token");

    console.log("🔗 Conectando a partida:", serverUrl);
    socket.current = new WebSocket(`${serverUrl}?token=${token}`);

    socket.current.onopen = () => {
        setIsConnected(true);
        updateBoardFromChess();
    };

    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      
      if (msg.type === "game_move" && msg.move) {
        try {
            const chess = chessRef.current;
            // CORRECCIÓN AQUÍ: Si el movimiento es "c2c4", lo parseamos como objeto
            if (typeof msg.move === 'string' && msg.move.length >= 4) {
                const from = msg.move.substring(0, 2) as Square;
                const to = msg.move.substring(2, 4) as Square;
                const promotion = msg.move.length === 5 ? msg.move[4] : 'q';
                
                chess.move({ from, to, promotion });
            } else {
                chess.move(msg.move);
            }
            updateBoardFromChess();
        } catch (e) {
            console.error("Movimiento inválido según chess.js:", msg.move);
        }
      }
      
      if (msg.type === "system_message") {
        console.log("🖥️ Sistema:", msg.message);
      }
    };

    socket.current.onclose = (e) => {
      setIsConnected(false);
      if (e.code !== 1000) {
          reconnectTimeout.current = setTimeout(connect, 3000);
      }
    };
  }, [serverUrl, updateBoardFromChess]);

  useEffect(() => {
    connect();
    return () => {
      if (socket.current) {
        socket.current.onclose = null;
        socket.current.close(1000);
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [connect]);

  const handleMove = (from: Square, to: Square) => {
    if (!isConnected || from === to) return;
    
    try {
        const chess = chessRef.current;
        // Validar localmente
        const moveAttempt = chess.move({ from, to, promotion: 'q' });
        
        if (moveAttempt) {
            // Enviamos el movimiento en formato LAN (c2c4) que tu backend retransmite
            socket.current?.send(JSON.stringify({
                move: from + to
            }));
            updateBoardFromChess();
        }
    } catch (e) {
        console.log("Movimiento ilegal");
    }
  };

  const handleSquareClick = (coord: Square, piece: Piece | null) => {
    if (!selectedSquare) {
      if (piece?.color === turn) setSelectedSquare(coord);
    } else {
      if (selectedSquare !== coord) handleMove(selectedSquare, coord);
      setSelectedSquare(null);
    }
  };

  if (board.length === 0) return <div className="text-gold uppercase text-[10px] tracking-widest font-black">Cargando tablero...</div>;

  return (
    <div className="p-1 bg-zinc-950 rounded-[2rem] shadow-2xl border border-white/10 relative h-full w-full flex items-center justify-center">
      {!isConnected && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-[2rem] backdrop-blur-md text-gold font-black tracking-widest animate-pulse text-[10px] uppercase">
          Reconectando al tablero...
        </div>
      )}
      
      <div className={`grid grid-cols-8 grid-rows-8 w-full max-w-[700px] aspect-square bg-zinc-900 overflow-hidden rounded-xl border-[4px] border-black shadow-inner ${isDragging ? 'cursor-grabbing' : ''}`}>
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === coord;

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
                  ${isDark ? 'bg-[#3b2a1a]' : 'bg-[#7a634e]'} 
                  ${isSelected ? 'after:absolute after:inset-0 after:bg-gold/40' : ''}
                `}
              >
                {colIndex === 0 && <span className="absolute top-0.5 left-1 text-[8px] font-black opacity-30 text-white">{8 - rowIndex}</span>}
                {rowIndex === 7 && <span className="absolute bottom-0.5 right-1 text-[8px] font-black opacity-30 text-white uppercase">{String.fromCharCode(97 + colIndex)}</span>}

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
                    className={`w-[90%] h-[90%] z-20 cursor-grab active:cursor-grabbing transition-transform ${isSelected ? 'scale-110' : ''}`} 
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