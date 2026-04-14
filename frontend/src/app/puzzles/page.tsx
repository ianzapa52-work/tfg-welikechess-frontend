"use client";

import React, { useState } from 'react';
import PuzzleBoard from '@/components/game/PuzzleBoard';
import AchievementToast from '@/components/ui/AchievementToast';

const PUZZLES_DATA = [
  { id: "p1", fen: "4kb1r/p2n1ppp/4q3/4p3/3P4/8/PP1P1PPP/RNB1KBNR w KQk - 0 1", solution: "d4e5", objective: "Blancas ganan material" },
  { id: "p2", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", solution: "f3e5", objective: "Ataque táctico" },
  { id: "p3", fen: "6k1/pp3p1p/6p1/8/8/1P6/P1P2PPP/3R2K1 w - - 0 1", solution: "d1d8", objective: "Mate en 1" }
];

export default function PuzzlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [feedback, setFeedback] = useState({ text: "TU TURNO", color: "#2ecc71" });

  const nextPuzzle = () => {
    setCurrentIndex((prev) => (prev + 1) % PUZZLES_DATA.length);
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-[1250px] w-full grid grid-cols-1 xl:grid-cols-[260px_1fr_260px] gap-8 items-center">
        
        {/* PANEL IZQUIERDO: OBJETIVO */}
        <aside className="flex flex-col gap-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4 font-cinzel text-emerald-400 text-sm">
              <span>🎯</span> OBJETIVO
            </div>
            <p className="text-white text-lg font-medium">
              {PUZZLES_DATA[currentIndex].objective}
            </p>
          </div>

          <div 
            className="p-4 rounded-lg border text-center font-black tracking-widest text-sm transition-colors duration-300"
            style={{ backgroundColor: 'rgba(10,31,22,0.8)', borderColor: feedback.color, color: feedback.color }}
          >
            {feedback.text}
          </div>

          <button 
            onClick={nextPuzzle}
            className="group relative bg-[#1a1a1a] border border-emerald-500 text-emerald-500 py-4 rounded-lg font-bold overflow-hidden transition-all hover:text-white"
          >
            <span className="relative z-10">SIGUIENTE PUZZLE</span>
            <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </aside>

        {/* CENTRO: EL TABLERO */}
        <section className="flex justify-center">
          <div className="bg-[#0a1f16]/80 p-4 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5">
             <div className="w-[85vw] h-[85vw] max-w-[600px] max-h-[600px]">
                <PuzzleBoard 
                  puzzle={PUZZLES_DATA[currentIndex]}
                  onSuccess={() => setSolvedCount(c => c + 1)}
                  onFeedback={(text, color) => setFeedback({ text, color })}
                />
             </div>
          </div>
        </section>

        {/* PANEL DERECHO: PROGRESO */}
        <aside className="flex flex-col gap-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-8 rounded-xl text-center">
            <div className="font-cinzel text-emerald-400 text-xs tracking-widest mb-6">PROGRESO</div>
            <span className="block text-6xl font-black text-yellow-500 drop-shadow-lg mb-2">
              {solvedCount}
            </span>
            <p className="text-emerald-500/60 text-[10px] uppercase font-bold">Puzzles Resueltos</p>
          </div>
          
          <AchievementToast />
        </aside>

      </div>
    </main>
  );
}