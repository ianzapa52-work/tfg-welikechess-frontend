"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos para las categorías de jugadas
const CATEGORIES = [
  { label: "Brillantes", val: 1, color: "bg-cyan-400", icon: "!!" },
  { label: "Grandes", val: 3, color: "bg-blue-500", icon: "!" },
  { label: "Mejores", val: 18, color: "bg-emerald-500", icon: "★" },
  { label: "Excelentes", val: 12, color: "bg-green-400", icon: "✔" },
  { label: "Inexactitudes", val: 2, color: "bg-yellow-500", icon: "?!" },
  { label: "Errores", val: 1, color: "bg-red-500", icon: "?" },
];

export default function AnalysisReview({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [accuracy, setAccuracy] = useState({ player: 0, opponent: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setAccuracy({ player: 91.5, opponent: 82.3 });
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 relative overflow-hidden font-sans selection:bg-white/20">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-zinc-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-white/10 pb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full">Reporte Final</span>
              <span className="text-zinc-600 text-[10px] font-bold tracking-widest uppercase">ID: {gameId}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Game <span className="text-zinc-700">Review</span>
            </h1>
          </div>
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-4 px-8 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
          >
            <span>Volver al análisis</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* PANEL IZQUIERDO: ACCURACY CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950/50 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
               
               <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-12 text-center">Precisión de la Partida</h2>
               
               <div className="flex justify-around items-center mb-16">
                  <div className="text-center group">
                    <p className="text-[9px] font-black text-zinc-400 uppercase mb-4 tracking-widest group-hover:text-white transition-colors">Tú</p>
                    <div className="relative">
                      <p className="text-7xl font-black italic text-white leading-none">{accuracy.player}</p>
                      <span className="absolute -top-2 -right-6 text-xl font-bold text-zinc-700">%</span>
                    </div>
                  </div>
                  
                  <div className="w-[1px] h-20 bg-white/10"></div>
                  
                  <div className="text-center">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-4 tracking-widest">Rival</p>
                    <div className="relative">
                      <p className="text-7xl font-black italic text-zinc-800 leading-none">{accuracy.opponent}</p>
                      <span className="absolute -top-2 -right-6 text-xl font-bold text-zinc-800">%</span>
                    </div>
                  </div>
               </div>
               
               {/* BARRA COMPARATIVA */}
               <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden flex border border-white/5 p-[2px]">
                  <div className="h-full bg-white rounded-l-full transition-all duration-1000" style={{ width: `${accuracy.player}%` }}></div>
                  <div className="h-full bg-zinc-800 rounded-r-full transition-all duration-1000" style={{ width: `${100 - accuracy.player}%` }}></div>
               </div>
            </div>

            <button className="w-full py-8 bg-zinc-100 text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:scale-[0.98] transition-all duration-500 shadow-xl shadow-white/5">
               Descargar PGN Analizado
            </button>
          </div>

          {/* PANEL DERECHO: DESGLOSE TÉCNICO */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-6 px-4">Clasificación de jugadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CATEGORIES.map((cat, idx) => (
                <div 
                  key={cat.label} 
                  className="bg-zinc-900/30 border border-white/[0.03] p-5 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default group"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center text-black font-black text-lg shadow-lg`}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">{cat.label}</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase">Jugador Blanco</p>
                    </div>
                  </div>
                  <span className="text-2xl font-mono font-black text-zinc-400 group-hover:text-white transition-colors">{cat.val}</span>
                </div>
              ))}
            </div>

            {/* MEJOR MOMENTO */}
            <div className="mt-8 p-8 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-[2.5rem] relative overflow-hidden">
               <div className="relative z-10">
                 <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-2 block">Movimiento Brillante</span>
                 <h4 className="text-2xl font-black italic mb-2">18... Nf3!!</h4>
                 <p className="text-xs text-zinc-400 leading-relaxed max-w-md italic">
                   "Una jugada que desafía la lógica posicional para forzar un mate en 12. Stockfish la califica como la única línea ganadora."
                 </p>
               </div>
               <div className="absolute right-[-20px] bottom-[-20px] text-9xl font-black text-cyan-500/5 select-none">!!</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}