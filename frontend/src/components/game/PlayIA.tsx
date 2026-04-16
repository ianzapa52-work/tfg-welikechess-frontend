"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';

interface PlayIAProps {
  difficulty: number;
  onGameStateChange: (status: string) => void;
  onMove: (history: string[], capturedW: string[], capturedB: string[]) => void;
  resetSignal: number;
  orientation: 'w' | 'b';
}

const PIECE_MAP: Record<string, string> = { 
  p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" 
};

export default function PlayIA({ difficulty, onGameStateChange, onMove, resetSignal, orientation }: PlayIAProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<{from: string, to: string} | null>(null);
  const [capW, setCapW] = useState<string[]>([]);
  const [capB, setCapB] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setGame(new Chess());
    setLastMove(null);
    setSelectedSquare(null);
    setCapW([]);
    setCapB([]);
    onGameStateChange("TU TURNO");
  }, [resetSignal, onGameStateChange]);

  const executeMove = useCallback((moveData: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(moveData);

      if (result) {
        let newCapW = [...capW];
        let newCapB = [...capB];

        if (result.captured) {
          const pieceImg = `/pieces/${result.color === 'w' ? 'b' : 'w'}_${PIECE_MAP[result.captured]}.svg`;
          if (result.color === 'w') newCapB.push(pieceImg);
          else newCapW.push(pieceImg);
          setCapB(newCapB);
          setCapW(newCapW);
        }

        setGame(gameCopy);
        setLastMove({ from: result.from, to: result.to });
        onMove(gameCopy.history(), newCapW, newCapB);

        let status = gameCopy.turn() === orientation ? "TU TURNO" : "IA PENSANDO...";
        if (gameCopy.isCheckmate()) status = "¡JAQUE MATE!";
        else if (gameCopy.isDraw()) status = "TABLAS";
        onGameStateChange(status);
        return true;
      }
      return false;
    } catch (e) { return false; }
  }, [game, capW, capB, onMove, onGameStateChange, orientation]);

  useEffect(() => {
    const isIATurn = game.turn() !== orientation;
    if (isIATurn && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          executeMove(move);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [game, executeMove, orientation]);

  const board = game.board();
  const displayBoard = orientation === 'w' ? board : [...board].reverse().map(row => [...row].reverse());

  return (
    <div className="p-1 bg-zinc-950 rounded-[2rem] shadow-[0_60px_120px_rgba(0,0,0,0.95)] border border-white/10 backdrop-blur-sm">
      <div className={`grid grid-cols-8 grid-rows-8 w-[min(95vw,780px)] h-[min(95vw,780px)] bg-zinc-900 overflow-hidden rounded-xl border-[4px] border-black shadow-inner  ${isDragging ? 'cursor-grabbing' : ''}`}>
        {displayBoard.map((row, i) =>
          row.map((piece, j) => {
            const rowIdx = orientation === 'w' ? i : 7 - i;
            const colIdx = orientation === 'w' ? j : 7 - j;
            const coord = (String.fromCharCode(97 + colIdx) + (8 - rowIdx)) as Square;
            
            const isDark = (rowIdx + colIdx) % 2 === 1;
            const isSelected = selectedSquare === coord;
            const isLastMove = lastMove?.from === coord || lastMove?.to === coord;
            const isCheck = game.isCheck() && piece?.type === 'k' && piece?.color === game.turn();
            const isLegal = selectedSquare && game.moves({ square: selectedSquare, verbose: true }).some(m => m.to === coord);
            const isPieceMine = piece && piece.color === orientation;

            return (
              <div
                key={coord}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const fromSquare = e.dataTransfer.getData("fromSquare") as Square;
                  executeMove({ from: fromSquare, to: coord, promotion: 'q' });
                  setSelectedSquare(null);
                  setIsDragging(false);
                }}
                onClick={() => {
                  if (game.turn() !== orientation) return;
                  if (selectedSquare) {
                    executeMove({ from: selectedSquare, to: coord, promotion: 'q' });
                    setSelectedSquare(null);
                  } else if (isPieceMine) setSelectedSquare(coord);
                }}
                className={`relative flex items-center justify-center transition-colors duration-200
                  ${isDark ? 'bg-[#a0522d]' : 'bg-[#e9ca9c]'} 
                  ${isSelected ? 'bg-gold/50' : ''}
                  ${isCheck ? 'bg-red-500/60 animate-pulse' : ''}
                  ${isLastMove ? 'after:absolute after:inset-0 after:bg-gold/25 after:z-10' : ''}
                `}
              >
                {j === 0 && <span className={`absolute top-0.5 left-1 text-[11px] font-bold font-mono ${isDark ? 'text-[#e9ca9c] opacity-70' : 'text-[#3e2723] opacity-80'}`}>{8 - rowIdx}</span>}
                {i === 7 && <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold font-mono uppercase ${isDark ? 'text-[#e9ca9c] opacity-70' : 'text-[#3e2723] opacity-80'}`}>{String.fromCharCode(97 + colIdx)}</span>}
                
                {isLegal && <div className={`absolute z-30 rounded-full ${piece ? 'w-full h-full border-4 border-black/10' : 'w-5 h-5 bg-black/15'}`} />}
                
                {piece && (
                  <img 
                    src={`/pieces/${piece.color}_${PIECE_MAP[piece.type]}.svg`} 
                    // Siempre draggable para feedback de cursor
                    draggable={true}
                    onDragStart={(e) => {
                      // Solo permitimos mover si es nuestro turno y nuestra pieza
                      if(!isPieceMine || game.turn() !== orientation) return e.preventDefault();
                      e.dataTransfer.setData("fromSquare", coord);
                      setSelectedSquare(coord);
                      setIsDragging(true);
                    }}
                    onDragEnd={() => setIsDragging(false)}
                    className={`w-[92%] h-[92%] z-20 transition-transform drop-shadow-lg cursor-grab active:cursor-grabbing ${isSelected ? 'scale-105 -translate-y-1' : ''}`} 
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