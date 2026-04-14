"use client";

import React, { useState } from 'react';
import PlayIA from '@/components/game/PlayIA';

export default function PlayIAPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("TU TURNO");
  const [capturedW, setCapturedW] = useState<string[]>([]);
  const [capturedB, setCapturedB] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState(5);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-[1250px] grid grid-cols-1 xl:grid-cols-[240px_680px_240px] gap-10 items-start">
        
        {/* PANEL IZQUIERDO: IA */}
        <aside className="space-y-4">
          <div className="bg-black/80 border border-[#d4af37]/30 p-4 rounded shadow-2xl">
            <h3 className="font-cinzel text-[#d4af37] text-[10px] tracking-[0.3em] text-center border-b border-[#d4af37]/10 pb-2 mb-4">
              🤖 EINSTEIN (IA)
            </h3>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full bg-[#111] border border-[#d4af37]/40 text-[#d4af37] font-cinzel text-[10px] p-2 outline-none cursor-pointer"
            >
              <option value="1">NIVEL: APRENDIZ</option>
              <option value="5">NIVEL: MAESTRO</option>
              <option value="15">NIVEL: DEMONIO</option>
            </select>
            <div className="flex flex-wrap gap-1 mt-4 min-h-[28px]">
              {capturedW.map((img, i) => <img key={i} src={img} className="w-6 h-6 opacity-70" alt="piece" />)}
            </div>
          </div>
          <div className="bg-black border border-[#d4af37] text-[#d4af37] font-cinzel font-bold text-center py-3 text-xs tracking-widest shadow-[0_0_20px_rgba(211,175,55,0.1)]">
            {status}
          </div>
        </aside>

        {/* CENTRO: TABLERO */}
        <section className="flex flex-col items-center">
          <div className="bg-[#1a2a3a] p-4 rounded-lg shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/5">
             {/* Coordenadas... */}
             <div className="w-[85vw] h-[85vw] max-w-[600px] max-h-[600px]">
                <PlayIA 
                  difficulty={difficulty}
                  resetSignal={resetKey}
                  onGameStateChange={setStatus}
                  onMove={(h, cw, cb) => {
                    setHistory(h);
                    setCapturedW(cw);
                    setCapturedB(cb);
                  }}
                />
             </div>
          </div>
        </section>

        {/* PANEL DERECHO: USUARIO E HISTORIAL */}
        <aside className="space-y-4">
          <div className="bg-black/80 border border-white/10 p-4 rounded shadow-2xl">
            <h3 className="font-cinzel text-white text-[10px] tracking-[0.3em] text-center border-b border-white/5 pb-2 mb-4">
              ♔ TÚ (BLANCAS)
            </h3>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {capturedB.map((img, i) => <img key={i} src={img} className="w-6 h-6 opacity-70" alt="piece" />)}
            </div>
          </div>

          <div className="bg-black/80 border border-white/5 p-4 rounded h-[350px] flex flex-col">
            <h3 className="font-cinzel text-zinc-500 text-[10px] tracking-[0.3em] mb-4">HISTORIAL</h3>
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              <table className="w-full text-xs">
                <tbody>
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 text-zinc-600 w-8">{i + 1}.</td>
                      <td className="py-2 text-[#d4af37] font-bold">{history[i * 2]}</td>
                      <td className="py-2 text-zinc-400">{history[i * 2 + 1] || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button 
            onClick={() => setResetKey(prev => prev + 1)}
            className="w-full bg-transparent border border-[#d4af37] text-[#d4af37] font-cinzel font-bold text-[10px] tracking-[0.2em] py-4 hover:bg-[#d4af37] hover:text-black transition-all active:scale-95"
          >
            REINICIAR PARTIDA
          </button>
        </aside>

      </div>
    </div>
  );
}