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
  const chessRef = useRef(new Chess());
  const [board, setBoard] = useState<BoardMatrix>([]);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
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
    
    const history = chess.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      setLastMove({ from: last.from, to: last.to });
    }

    setBoard(matrix);
    setTurn(chess.turn());
    onMoveUpdate(chess.history());
    
    if (chess.isGameOver()) {
        onGameStateChange("PARTIDA FINALIZADA");
    } else {
        onGameStateChange(chess.turn() === 'w' ? "TURNO BLANCAS" : "TURNO NEGRAS");
    }
  }, [onMoveUpdate, onGameStateChange]);

  const connect = useCallback(() => {
    const token = localStorage.getItem("access");
    if (!token) return console.error("No se encontró token");

    const baseUrl = serverUrl.split('?')[0];
    const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    socket.current = new WebSocket(`${finalBaseUrl}?token=${token}`);

    socket.current.onopen = () => {
        setIsConnected(true);
        console.log("🎮 Conectado al GameConsumer");
    };

    socket.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "game_state" || msg.type === "game_update") {
        if (msg.fen) {
            chessRef.current.load(msg.fen);
            updateBoardFromChess();
        }
        if (msg.status === "completed") {
            onGameStateChange(`FINALIZADA: ${msg.result}`);
        }
      }
      if (msg.type === "error") {
        console.error("❌ Error de juego:", msg.message);
        updateBoardFromChess();
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
    const chess = chessRef.current;
    try {
        const moveAttempt = chess.move({ from, to, promotion: 'q' });
        if (moveAttempt) {
            socket.current?.send(JSON.stringify({
                action: "make_move",
                move: from + to
            }));
            chess.undo();
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
          Reconectando al servidor...
        </div>
      )}
      
      <div className={`grid grid-cols-8 grid-rows-8 w-full max-w-[700px] aspect-square bg-zinc-900 overflow-hidden rounded-xl border-[4px] border-black shadow-inner ${isDragging ? 'cursor-grabbing' : ''}`}>
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const coord = (String.fromCharCode(97 + colIndex) + (8 - rowIndex)) as Square;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = selectedSquare === coord;
            const isLastMove = lastMove?.from === coord || lastMove?.to === coord;
            const isCheck = chessRef.current.isCheck() && piece?.type === 'k' && piece?.color === chessRef.current.turn();
            const isLegal = selectedSquare && chessRef.current.moves({ square: selectedSquare, verbose: true }).some(m => m.to === coord);

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
                  ${isDark ? 'bg-[#b8860b]' : 'bg-[#f0e68c]'} 
                  ${isSelected ? 'bg-white/40' : ''}
                  ${isCheck ? 'bg-red-500/60 animate-pulse' : ''}
                  ${isLastMove ? 'after:absolute after:inset-0 after:bg-black/20 after:z-10' : ''}
                `}
              >
                {/* Coordenadas con colores adaptados al dorado */}
                {colIndex === 0 && <span className={`absolute top-0.5 left-1 text-[11px] font-bold font-mono ${isDark ? 'text-white/40' : 'text-black/30'} z-0`}>{8 - rowIndex}</span>}
                {rowIndex === 7 && <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold font-mono uppercase ${isDark ? 'text-white/40' : 'text-black/30'} z-0`}>{String.fromCharCode(97 + colIndex)}</span>}

                {isLegal && <div className={`absolute z-30 rounded-full ${piece ? 'w-full h-full border-4 border-black/20' : 'w-5 h-5 bg-black/20'}`} />}

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
                    className={`w-[92%] h-[92%] z-20 cursor-grab active:cursor-grabbing transition-transform drop-shadow-xl ${isSelected ? 'scale-105 -translate-y-1' : ''}`} 
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