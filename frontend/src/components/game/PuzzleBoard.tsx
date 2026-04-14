"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, type Square } from 'chess.js';

interface Puzzle { id: string; fen: string; solution: string; objective: string; }

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onSuccess: () => void;
  onFeedback: (msg: string, color: string) => void;
}

const PIECE_MAP: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };

export default function PuzzleBoard({ puzzle, onSuccess, onFeedback }: PuzzleBoardProps) {
  const [game, setGame] = useState(new Chess(puzzle.fen));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [flash, setFlash] = useState<{ coord: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setGame(new Chess(puzzle.fen));
    setSelectedSquare(null);
    setFlash(null);
  }, [puzzle]);

  const executeMove = useCallback((from: Square, to: Square) => {
    try {
      const moveStr = from + to;
      const gameCopy = new Chess(game.fen());
      const moveResult = gameCopy.move({ from, to, promotion: 'q' });

      if (!moveResult) return;

      if (moveStr === puzzle.solution) {
        setGame(gameCopy);
        setFlash({ coord: to, type: 'success' });
        onFeedback("¡CORRECTO!", "#2ecc71");
        onSuccess();
      } else {
        setGame(gameCopy);
        setFlash({ coord: to, type: 'error' });
        onFeedback("INTÉNTALO DE NUEVO", "#ec2914");
        setTimeout(() => {
          setGame(new Chess(puzzle.fen));
          setFlash(null);
          onFeedback("TU TURNO", "#ffffff");
        }, 1000);
      }
    } catch (e) { console.error(e); }
  }, [game, puzzle, onSuccess, onFeedback]);

  return (
    <div className="chess-board-grid !border-4 font-cinzel">
      {game.board().map((row, i) =>
        row.map((piece, j) => {
          const coord = (String.fromCharCode(97 + j) + (8 - i)) as Square;
          const isDark = (i + j) % 2 === 1;

          return (
            <div
              key={coord}
              onClick={() => {
                const p = game.get(coord);
                if (selectedSquare) {
                  if (selectedSquare === coord) setSelectedSquare(null);
                  else if (p && p.color === game.turn()) setSelectedSquare(coord);
                  else { executeMove(selectedSquare, coord); setSelectedSquare(null); }
                } else if (p && p.color === game.turn()) setSelectedSquare(coord);
              }}
              className={`chess-square transition-all
                ${isDark ? 'chess-square-dark' : 'chess-square-light'}
                ${selectedSquare === coord ? 'chess-square-selected' : ''}
                ${flash?.coord === coord && flash.type === 'success' ? 'square-puzzle-success' : ''}
                ${flash?.coord === coord && flash.type === 'error' ? 'square-puzzle-error' : ''}
              `}
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