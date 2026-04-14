"use client";

import React, { useState } from 'react';
import PlayLocal from '@/components/game/PlayLocal';

export default function LocalPremiumPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("TURNO BLANCAS");
  const [capturedW, setCapturedW] = useState<string[]>([]);
  const [capturedB, setCapturedB] = useState<string[]>([]);
  const [resetKey, setResetKey] = useState(0);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-[1250px] grid grid-cols-1 xl:grid-cols-[220px_1fr_240px] gap-8 items-center">
        
        {/* PANEL JUGADORES (IZQUIERDA) */}
        <aside className="flex flex-col gap-4">
          <div className="bg-black/80 border border-[#d4af37]/40 p-4 rounded shadow-xl">
            <h3 className="font-cinzel text-[#d4af37] text-[10px] tracking-widest text-center border-b border-[#d4af37]/20 pb-2 mb-3">
              ♔ BLANCAS
            </h3>
            <div className="flex flex-wrap gap-1 min-h-[24px]">
              {capturedB.map((img, i) => <img key={i} src={img} className="w-5 h-5 opacity-80" alt="cap" />)}
            </div>
          </div>

          <div className="bg-black border border-[#d4af37] text-[#d4af37] font-cinzel text-xs text-center py-3 px-2 shadow-lg">
            {status}
          </div>

          <div className="bg-black/80 border border-[#d4af37]/40 p-4 rounded shadow-xl">
            <h3 className="font-cinzel text-white text-[10px] tracking-widest text-center border-b border-white/10 pb-2 mb-3">
              ♚ NEGRAS
            </h3>
            <div className="flex flex-wrap gap-1 min-h-[24px]">
              {capturedW.map((img, i) => <img key={i} src={img} className="w-5 h-5 opacity-80" alt="cap" />)}
            </div>
          </div>
        </aside>

        {/* TABLERO (CENTRO) */}
        <section className="flex flex-col items-center">
          <div className="bg-black/40 p-3 md:p-5 rounded-xl border border-[#d4af37]/20 shadow-2xl">
            {/* Letras A-H */}
            <div className="flex justify-around ml-6 mb-1 text-[#d4af37] text-[10px] opacity-60 font-bold">
              {['A','B','C','D','E','F','G','H'].map(l => <span key={l}>{l}</span>)}
            </div>
            
            <div className="flex">
              {/* Números 1-8 */}
              <div className="flex flex-col justify-around mr-2 text-[#d4af37] text-[10px] opacity-60 font-bold">
                {[8,7,6,5,4,3,2,1].map(n => <span key={n}>{n}</span>)}
              </div>

              <div className="w-[88vw] h-[88vw] max-w-[640px] max-h-[640px]">
                <PlayLocal 
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
          </div>
        </section>

        {/* HISTORIAL (DERECHA) */}
        <aside className="flex flex-col gap-4">
          <div className="bg-black/80 border border-[#d4af37]/30 p-4 rounded h-[450px] flex flex-col">
            <h3 className="font-cinzel text-[#d4af37] text-[10px] tracking-widest mb-4 text-center">HISTORIAL</h3>
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              <table className="w-full text-[11px]">
                <tbody>
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2 text-zinc-600 w-8">{i + 1}.</td>
                      <td className="py-2 text-[#d4af37] font-bold">{history[i * 2]}</td>
                      <td className="py-2 text-zinc-300">{history[i * 2 + 1] || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button 
            onClick={() => setResetKey(prev => prev + 1)}
            className="w-full bg-transparent border border-[#d4af37] text-[#d4af37] font-cinzel py-3 text-xs tracking-widest hover:bg-[#d4af37] hover:text-black transition-all duration-300"
          >
            REINICIAR PARTIDA
          </button>
        </aside>

      </div>
    </main>
  );
}