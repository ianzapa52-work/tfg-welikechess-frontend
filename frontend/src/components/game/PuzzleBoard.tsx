"use client";

import React, { useState, useEffect, useRef } from 'react';
import PlayOnline from '@/components/game/PlayOnline';

const TIME_MODES = [
  { label: "Bullet", options: [{ n: "1+0", m: 60 }, { n: "1+1", m: 60 }, { n: "2+1", m: 120 }] },
  { label: "Blitz", options: [{ n: "3+0", m: 180 }, { n: "3+2", m: 180 }, { n: "5+3", m: 300 }] },
  { label: "Rápidas", options: [{ n: "10+0", m: 600 }, { n: "15+10", m: 900 }] },
];

function OpponentBox({ name, elo, isActive, seconds, visible }: any) {
  if (!visible) return <div className="h-[140px]" />;
  return (
    <div className={`p-5 rounded-[2rem] border transition-all duration-700 backdrop-blur-xl ${
      isActive ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'bg-zinc-900/40 border-white/5 opacity-60' 
    }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-500">
             <span className="text-xs">VS</span>
          </div>
          <div>
            <h4 className="text-white font-black text-[11px] uppercase tracking-widest">{name}</h4>
            <span className="text-[9px] text-zinc-500 font-bold italic">ELO {elo}</span>
          </div>
        </div>
        <div className="font-mono text-xl font-black text-white/80">
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}

function MyPlayerBox({ name, elo, isActive, seconds }: any) {
  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${
      isActive ? 'bg-zinc-950 border-gold shadow-[0_0_50px_rgba(212,175,55,0.15)] scale-[1.03]' : 'bg-zinc-950 border-white/10 shadow-2xl' 
    }`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] -z-10"></div>
      <div className="flex justify-between items-end relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-gold text-black text-[8px] font-black rounded-md uppercase tracking-tighter">Pro User</span>
            <h4 className="text-white font-black text-sm uppercase tracking-wider">{name}</h4>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Rating</span>
            <span className="text-2xl font-black text-gold tabular-nums tracking-tighter drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">{elo}</span>
          </div>
        </div>
        <div className={`px-5 py-3 rounded-2xl border-2 font-mono text-2xl font-black transition-all ${
          isActive ? 'bg-gold border-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-black/40 border-white/10 text-white/40'
        }`}>
          {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="w-full h-1 bg-white/5 mt-4 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${isActive ? 'bg-gold' : 'bg-zinc-700'}`} style={{ width: '100%' }}></div>
      </div>
    </div>
  );
}

export default function OnlinePremiumPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [gameJoined, setGameJoined] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("ESPERANDO JUGADOR");
  const [currentMode, setCurrentMode] = useState({ n: "10+0", m: 600 });
  const [timeW, setTimeW] = useState(600);
  const [timeB, setTimeB] = useState(600);
  const [myElo] = useState(2185);

  const startSearch = () => {
    setIsSearching(true);
    setTimeout(() => { setIsSearching(false); setGameJoined(true); }, 4000);
  };

  const rows = [];
  for (let i = 0; i < history.length; i += 2) {
    rows.push({ moveNum: Math.floor(i / 2) + 1, white: history[i], black: history[i + 1] || null });
  }

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-400 p-6 xl:p-10 font-sans selection:bg-gold/30 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#050508]"></div>
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gold/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-[1700px] mx-auto grid grid-cols-12 gap-8 items-stretch">
        <div className="col-span-12 xl:col-span-3 flex flex-col justify-between py-2">
          <OpponentBox name="Gran Maestro" elo="2450" isActive={gameJoined && status.includes("NEGRAS")} seconds={timeB} visible={gameJoined || isSearching} />
          <div className="bg-zinc-950/60 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl my-6">
            {!gameJoined ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <p className="text-[10px] font-black tracking-[0.3em] text-gold uppercase mb-6 text-center">Configurar Duelo</p>
                <div className="space-y-4">
                  {TIME_MODES.map((category) => (
                    <div key={category.label} className="space-y-2">
                      <span className="text-[9px] text-zinc-500 uppercase font-black ml-1">{category.label}</span>
                      <div className="grid grid-cols-3 gap-2">
                        {category.options.map((opt) => (
                          <button key={opt.n} disabled={isSearching} onClick={() => { setCurrentMode(opt); setTimeW(opt.m); setTimeB(opt.m); }}
                            className={`py-2 rounded-xl text-[10px] font-black transition-all border ${currentMode.n === opt.n ? 'bg-gold text-black border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}>
                            {opt.n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={startSearch} disabled={isSearching}
                  className={`w-full mt-8 py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-500 ${isSearching ? 'bg-zinc-800 text-gold border border-gold/50 cursor-wait' : 'bg-white text-black hover:bg-gold hover:scale-[1.02]'}`}>
                  {isSearching ? 'Buscando Rival...' : 'Buscar Partida'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 animate-in fade-in duration-700">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                    <div className="w-2 h-2 bg-gold rounded-full animate-ping"></div>
                </div>
                <h2 className="text-white font-black text-xs tracking-widest uppercase mb-2">Partida en curso</h2>
                <p className="text-gold text-[10px] font-bold tracking-widest uppercase">{status}</p>
              </div>
            )}
          </div>
          <MyPlayerBox name="Tu Perfil" elo={myElo} isActive={gameJoined && (status.includes("TU TURNO") || status.includes("BLANCAS"))} seconds={timeW} />
        </div>

        {/* PANEL CENTRAL: TABLERO CON DESPLAZAMIENTO A LA IZQUIERDA */}
        <div className="col-span-12 xl:col-span-6 flex items-center justify-center">
          <div className="w-full aspect-square max-w-[785px] relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/40 backdrop-blur-xl">
            {gameJoined ? (
              /* He añadido pr-12 (padding-right) para "empujar" el contenido hacia la izquierda */
              <div className="w-full h-full p-4 pr-16 relative transition-all duration-500">
                <PlayOnline serverUrl="ws://localhost:3000" onGameStateChange={setStatus} onMoveUpdate={(newHistory: string[]) => setHistory(newHistory)} />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className={`relative ${isSearching ? 'scale-125' : 'scale-100'} transition-transform duration-1000`}>
                    <div className={`w-64 h-64 rounded-full border-2 border-dashed border-gold/20 ${isSearching ? 'animate-spin-slow' : ''}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                           <span className="text-6xl mb-4 block">♟️</span>
                           <h3 className="text-white font-black tracking-[0.5em] uppercase text-l">WELIKECHESS</h3>
                        </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-3">
          <div className="bg-zinc-950/80 h-full flex flex-col border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <span className="text-gold/90 text-[10px] font-black tracking-[0.4em] uppercase">Historial de movimientos</span>
              <span className="text-[10px] font-mono text-zinc-600">LIVE_FEED</span>
            </div>
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar bg-black/20">
              {rows.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">Esperando inicio...</p></div>
              ) : (
                rows.map((row) => (
                  <div key={row.moveNum} className="grid grid-cols-[40px_1fr_1fr] gap-2 mb-2 p-1">
                    <span className="font-mono text-[10px] text-zinc-700 self-center">{row.moveNum}.</span>
                    <div className="bg-zinc-900 border border-white/5 py-2 px-3 rounded-lg text-white font-mono text-sm text-center">{row.white}</div>
                    {row.black && <div className="bg-zinc-800/40 border border-white/5 py-2 px-3 rounded-lg text-zinc-400 font-mono text-sm text-center">{row.black}</div>}
                  </div>
                ))
              )}
            </div>
            <div className="p-6 bg-black/40">
               <button onClick={() => window.location.reload()} className="w-full bg-red-500/5 hover:bg-red-500/20 border border-red-500/20 text-red-500/60 py-4 rounded-2xl font-black text-[9px] tracking-[0.3em] uppercase transition-all">Abandonar Desafío</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* --- ESTILO PARA EL DIFUMINADO DE RECONEXIÓN --- */
        div:has(> *:contains("RECONECTANDO")) {
          top: 0 !important;
          bottom: 0 !important;
          right: 0 !important;
          left: auto !important; /* Lo anclamos a la derecha */
          width: 40% !important; /* Ocupa el 40% derecho del tablero */
          height: 100% !important;
          background: rgba(0, 0, 0, 0.4) !important;
          backdrop-filter: blur(20px) !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          border-left: 1px solid rgba(212, 175, 55, 0.2) !important;
          z-index: 100 !important;
          animation: slideInRight 0.5s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        /* Ajuste del texto "Reconectando" para que quepa bien en el lateral */
        div:has(> *:contains("RECONECTANDO")) * {
          font-size: 10px !important;
          letter-spacing: 0.2em !important;
          color: #d4af37 !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          writing-mode: vertical-rl; /* Texto en vertical para estilo premium */
          text-orientation: mixed;
          margin: 0 !important;
        }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </main>
  );
}