"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';

interface PlayLocalProps {
  onGameStateChange: (status: string) => void;
  onMove: (history: string[], capturedW: string[], capturedB: string[]) => void;
  resetSignal: number;
}

const PIECE_MAP: Record<string, string> = { p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" };

export default function PlayLocal({ onGameStateChange, onMove, resetSignal }: PlayLocalProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [capturedW, setCapturedW] = useState<string[]>([]);
  const [capturedB, setCapturedB] = useState<string[]>([]);
  
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const captureSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    moveSound.current = new Audio("/sounds/move_sound.mp3");
    captureSound.current = new Audio("/sounds/capture_sound.mp3");
  }, []);

  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setCapturedW([]);
    setCapturedB([]);
    setSelectedSquare(null);
    onMove([], [], []);
    onGameStateChange("TURNO BLANCAS");
  }, [resetSignal]);

  const getPieceImg = (color: string, type: string) => `/pieces/${color}_${PIECE_MAP[type]}.svg`;

  const executeMove = useCallback((moveData: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(moveData);

      if (result) {
        if (result.captured) captureSound.current?.play().catch(() => null);
        else moveSound.current?.play().catch(() => null);

        let newCapturedW = [...capturedW];
        let newCapturedB = [...capturedB];

        if (result.captured) {
          const img = getPieceImg(result.color === 'w' ? 'b' : 'w', result.captured);
          if (result.color === 'w') {
            newCapturedB.push(img);
            setCapturedB(newCapturedB);
          } else {
            newCapturedW.push(img);
            setCapturedW(newCapturedW);
          }
        }

        setGame(gameCopy);
        onMove(gameCopy.history(), newCapturedW, newCapturedB);

        let status = gameCopy.turn() === 'w' ? "TURNO BLANCAS" : "TURNO NEGRAS";
        if (gameCopy.isCheckmate()) status = "¡JAQUE MATE!";
        else if (gameCopy.isCheck()) status += " (¡JAQUE!)";
        else if (gameCopy.isDraw()) status = "TABLAS";
        onGameStateChange(status);
      }
      return result;
    } catch (e) { return null; }
  }, [game, capturedW, capturedB, onMove, onGameStateChange]);

  const handleSquareClick = (square: Square) => {
    const piece = game.get(square);
    if (selectedSquare) {
      const move = executeMove({ from: selectedSquare, to: square, promotion: 'q' });
      if (!move && piece && piece.color === game.turn()) setSelectedSquare(square);
      else setSelectedSquare(null);
    } else if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
    }
  };

  return (
    <div className="chess-board-grid">
      {game.board().map((row, i) =>
        row.map((piece, j) => {
          const coord = (String.fromCharCode(97 + j) + (8 - i)) as Square;
          const isDark = (i + j) % 2 === 1;
          const isSelected = selectedSquare === coord;
          const isLegal = selectedSquare && game.moves({ square: selectedSquare, verbose: true }).some(m => m.to === coord);

          return (
            <div
              key={coord}
              onClick={() => handleSquareClick(coord)}
              className={`chess-square ${isDark ? 'bg-[#6085a1]' : 'bg-[#dee3e6]'} ${isSelected ? 'bg-gold/40' : ''}`}
            >
              {isLegal && <div className="absolute w-3 h-3 bg-black/10 rounded-full z-20" />}
              {piece && (
                <img src={getPieceImg(piece.color, piece.type)} className="chess-piece" alt="" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}