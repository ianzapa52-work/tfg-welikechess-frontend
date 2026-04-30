"use client";

import React, { useState, useEffect } from 'react';

interface GameEndModalProps {
  status: string;
  myColor: 'w' | 'b';
  eloChange: number | null;
  myElo: string;
  opponentElo: string;
  myName: string;
  opponentName: string;
  moveCount: number;
  timeMode: string;
  onNewGame: () => void;
  onAnalysis: () => void;
}

const OVERLAY_CONFIGS = {
  win:  { 
    glow: "rgba(212,175,55,0.4)",  
    ring: "#D4AF37", 
    label: "text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.8)]",       
    bg: "from-[#0a0800]/95 via-[#14100a]/95 to-[#0a0800]/95", 
    emoji: "👑" 
  },
  loss: { 
    glow: "rgba(239,68,68,0.3)",   
    ring: "#ef4444", 
    label: "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]",    
    bg: "from-[#0a0202]/95 via-[#120808]/95 to-[#0a0202]/95", 
    emoji: "💥" 
  },
  draw: { 
    glow: "rgba(148,163,184,0.25)",  
    ring: "#94a3b8", 
    label: "text-slate-300 drop-shadow-[0_0_20px_rgba(148,163,184,0.5)]",  
    bg: "from-[#040406]/95 via-[#0c0c10]/95 to-[#040406]/95", 
    emoji: "🤝" 
  },
} as const;

function parseResult(status: string, myColor: 'w' | 'b', eloChange: number | null) {
  const s = status.toUpperCase();
  if (s.includes("TABLAS")) return { outcome: "draw" as const, headline: "¡TABLAS!", sub: extractReason(status) };
  if (eloChange !== null) {
    if (eloChange > 0) return { outcome: "win" as const, headline: "¡VICTORIA!", sub: extractReason(status) };
    if (eloChange < 0) return { outcome: "loss" as const, headline: "DERROTA", sub: extractReason(status) };
  }
  if (s.includes("HAS GANADO") || s.includes("¡HAS GANADO")) 
    return { outcome: "win" as const, headline: "¡VICTORIA!", sub: extractReason(status) };
  return { outcome: "loss" as const, headline: "DERROTA", sub: extractReason(status) };
}

function extractReason(status: string) {
  const m = status.match(/\$([^)]+)\$/);
  return m ? m[1] : "";
}

function CelebrationParticles({ outcome }: { outcome: 'win' | 'loss' | 'draw' }) {
  // ✅ Valores estáticos para SSR
  const particles = Array.from({ length: 20 }, (_, i) => i);
  const colors = {
    win: '#D4AF37',
    loss: '#ef4444', 
    draw: '#94a3b8'
  } as const;

  return (
    <>
      {particles.map((i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full animate-celebrate"
          style={{
            // ✅ Solo en cliente, valores estáticos en SSR
            left: `${(i * 17.39) % 100}%`,
            top: `${(i * 23.61) % 100}%`,
            backgroundColor: colors[outcome],
            animationDelay: `${(i * 0.13) % 2}s`,
            animationDuration: `${2 + (i * 0.15)}s`
          }}
        />
      ))}
    </>
  );
}

export default function GameEndModal({ 
  status, 
  myColor, 
  eloChange, 
  myElo, 
  opponentElo, 
  myName, 
  opponentName, 
  moveCount,
  timeMode,
  onNewGame, 
  onAnalysis 
}: GameEndModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ Fix hydration
  
  const { outcome, headline, sub } = parseResult(status, myColor, eloChange);
  const cfg = OVERLAY_CONFIGS[outcome];

  // ✅ Solo en cliente, evita hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // ✅ Render condicional para SSR perfecto
  if (!isMounted) {
    return (
      <div 
        className="fixed inset-0 z-50"
        style={{ display: 'none' }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <>
      <style>{`
        @keyframes celebrate {
          0% {
            opacity: 0;
            transform: scale(0) translateY(0) rotate(0deg);
          }
          10% {
            opacity: 1;
            transform: scale(1.2) translateY(-20px) rotate(180deg);
          }
          90% {
            opacity: 1;
            transform: scale(0.8) translateY(-100px) rotate(720deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) translateY(-150px) rotate(1080deg);
          }
        }
        .animate-celebrate {
          animation: celebrate 5s ease-out infinite;
        }
      `}</style>
      
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-12' : 'opacity-0 pointer-events-none translate-y-0'
        }`}
        style={{ backdropFilter: 'blur(20px)' }}
        suppressHydrationWarning
      >
        {/* Fondo degradado */}
        <div className={`absolute inset-0 ${cfg.bg} opacity-95`} />
        
        {/* Partículas de celebración */}
        <CelebrationParticles outcome={outcome} />

        {/* Modal principal */}
        <div
          className={`relative w-full max-w-md mx-4 backdrop-blur-2xl rounded-3xl p-8 md:p-10 transition-all duration-1000 ${
            isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'
          }`}
          style={{
            border: `2px solid ${cfg.ring}40`,
            background: 'rgba(4,4,6,0.95)',
            boxShadow: `0 0 100px ${cfg.glow}, inset 0 0 0 1px ${cfg.ring}20`
          }}
          suppressHydrationWarning
        >
          {/* Icono principal */}
          <div
            className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-8 rounded-3xl flex items-center justify-center text-5xl md:text-6xl border-4 shadow-2xl"
            style={{
              borderColor: `${cfg.ring}50`,
              background: `${cfg.ring}15`,
              boxShadow: `0 0 60px ${cfg.glow}`
            }}
          >
            <span suppressHydrationWarning>{cfg.emoji}</span>
          </div>

          {/* Título principal */}
          <div className="text-center mb-6 space-y-2">
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase font-black text-white/40">
              Partida Finalizada
            </p>
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tightest ${cfg.label}`}
              style={{ textShadow: `0 0 50px ${cfg.glow}` }}
              suppressHydrationWarning
            >
              {headline}
            </h1>
            {sub && (
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-bold text-white/50">
                {sub}
              </p>
            )}
          </div>

          {/* Stats de la partida */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-black/40 border border-white/10 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-gold" suppressHydrationWarning>{myName}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Tú</div>
              <div className="text-lg md:text-xl font-black text-white mt-1">{myElo}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-black text-zinc-300" suppressHydrationWarning>{opponentName}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wide">Rival</div>
              <div className="text-lg md:text-xl font-black text-white mt-1">{opponentElo}</div>
            </div>
          </div>

          {/* Cambio de ELO destacado */}
          {eloChange !== null && (
            <div 
              className={`p-4 rounded-2xl mb-8 text-center border-2 font-black text-xl tracking-wide transition-all duration-700 ${
                eloChange >= 0 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                  : 'bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              }`}
              suppressHydrationWarning
            >
              {eloChange >= 0 ? `+${eloChange}` : eloChange} ELO
            </div>
          )}

          {/* Botones principales */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onAnalysis}
              className="group relative py-5 px-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-2 overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer"
              style={{
                background: `${cfg.ring}15`,
                borderColor: `${cfg.ring}50`,
                color: cfg.ring,
                boxShadow: `0 0 25px ${cfg.glow}`
              }}
              type="button"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                  <path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" />
                </svg>
                Análisis
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-white to-transparent" />
            </button>

            <button
              onClick={onNewGame}
              className="group py-5 px-6 bg-gradient-to-r from-white/90 to-zinc-100 text-black rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:from-white hover:to-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] transition-all duration-500 cursor-pointer relative overflow-hidden"
              type="button"
            >
              <span className="relative z-10">Nueva Partida</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </button>
          </div>

          {/* Stats secundarios */}
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-zinc-400 text-center tracking-wide space-y-1">
            <div>{moveCount} movimientos</div>
            <div className="text-white/60">{timeMode}</div>
          </div>
        </div>
      </div>
    </>
  );
}