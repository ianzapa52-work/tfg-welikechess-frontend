"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';

interface PlayIAProps {
  difficulty: number;
  onGameStateChange: (status: string) => void;
  onMove: (history: string[], capturedW: string[], capturedB: string[]) => void;
  resetSignal: number;
}

const PIECE_MAP: Record<string, string> = { 
  p: "pawn", r: "rook", n: "horse", b: "bishop", q: "queen", k: "king" 
};

export default function PlayIA({ difficulty, onGameStateChange, onMove, resetSignal }: PlayIAProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<string[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<string[]>([]);

  // Función auxiliar para obtener la imagen de la pieza
  const getPieceImg = (color: string, type: string) => `/pieces/${color}_${PIECE_MAP[type]}.svg`;

  /**
   * REINICIO DEL JUEGO
   * Solo se dispara cuando resetSignal cambia.
   */
  useEffect(() => {
    const newGame = new Chess();
    setGame(newGame);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setSelectedSquare(null);
    
    // Notificamos al padre el estado inicial
    onMove([], [], []);
    onGameStateChange("TU TURNO");
    
    // Importante: No ponemos onMove ni onGameStateChange aquí para evitar el bucle 
    // si el padre no las tiene envueltas en useCallback.
  }, [resetSignal]);

  /**
   * EJECUCIÓN DE MOVIMIENTOS
   */
  const executeMove = useCallback((moveData: any) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(moveData);

      if (result) {
        let newCapturedW = [...capturedWhite];
        let newCapturedB = [...capturedBlack];

        if (result.captured) {
          const img = getPieceImg(result.color === 'w' ? 'b' : 'w', result.captured);
          if (result.color === 'w') {
            newCapturedB.push(img);
            setCapturedBlack(newCapturedB);
          } else {
            newCapturedW.push(img);
            setCapturedWhite(newCapturedW);
          }
        }

        setGame(gameCopy);
        
        // Notificar al padre con los datos actualizados
        onMove(gameCopy.history(), newCapturedW, newCapturedB);
        
        // Actualizar el estado del texto
        if (gameCopy.isCheckmate()) onGameStateChange("¡JAQUE MATE!");
        else if (gameCopy.isCheck()) onGameStateChange("¡JAQUE!");
        else onGameStateChange(gameCopy.turn() === 'w' ? "TU TURNO" : "IA PENSANDO...");
      }
      return result;
    } catch (e) {
      return null;
    }
  }, [game, capturedWhite, capturedBlack, onMove, onGameStateChange]);

  /**
   * LÓGICA DE LA IA
   */
  useEffect(() => {
    if (game.turn() === 'b' && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
          const move = moves[Math.floor(Math.random() * moves.length)];
          executeMove(move);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [game, executeMove]);

  const handleSquareClick = (square: Square) => {
    if (game.turn() !== 'w') return;

    if (selectedSquare) {
      const move = executeMove({ 
        from: selectedSquare, 
        to: square, 
        promotion: 'q' 
      });
      setSelectedSquare(null);
      if (move) return;
    }

    const piece = game.get(square);
    if (piece && piece.color === 'w') {
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
          const isLegal = selectedSquare && 
            game.moves({ square: selectedSquare, verbose: true }).some(m => m.to === coord);

          return (
            <div
              key={coord}
              onClick={() => handleSquareClick(coord)}
              className={`chess-square
                ${isDark ? 'bg-[#6085a1]' : 'bg-[#dee3e6]'}
                ${isSelected ? 'bg-gold/40' : ''}
              `}
            >
              {isLegal && (
                <div className="absolute w-3 h-3 bg-black/10 rounded-full z-20" />
              )}
              {piece && (
                <img 
                  src={getPieceImg(piece.color, piece.type)} 
                  className="chess-piece"
                  alt={`${piece.color} ${piece.type}`}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}