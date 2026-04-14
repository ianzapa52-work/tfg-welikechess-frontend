"use client";

import React, { useState, useEffect } from 'react';

export default function HomeRecentActivity() {
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadRecent = () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('chess_history');
    if (saved) {
      setRecentGames(JSON.parse(saved).slice(0, 3));
    }
  };

  useEffect(() => {
    setMounted(true);
    loadRecent();
    window.addEventListener('history-updated', loadRecent);
    return () => window.removeEventListener('history-updated', loadRecent);
  }, []);

  const handleAnalyze = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-history'));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-3">
      {recentGames.length > 0 ? (
        recentGames.map((game) => (
          <div key={game.id} className="flex items-center justify-between py-3 border-b border-[#d4af37]/10 last:border-0 hover:bg-[#d4af37]/5 px-3 -mx-1 rounded-xl transition-all group/item">
            <div className="flex items-center gap-4">
              <div className={`text-[9px] font-black px-2 py-1 rounded border ${
                game.result === 'win' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 
                game.result === 'loss' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 
                'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'
              } group-hover/item:scale-105 transition-transform`}>
                {game.result === 'win' ? 'VICTORIA' : game.result === 'loss' ? 'DERROTA' : 'TABLAS'}
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-tight group-hover/item:text-[#d4af37] transition-colors">
                  vs. {game.opponent}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {game.mode} {game.timeControl} • {game.eloChange || '0'} ELO
                </p>
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              className="px-4 py-1.5 bg-black border border-[#d4af37]/20 text-[10px] font-bold text-[#d4af37] rounded hover:bg-[#d4af37] hover:text-black transition-all transform active:scale-95 cursor-pointer"
            >
              ANALIZAR
            </button>
          </div>
        ))
      ) : (
        <p className="text-center py-4 text-zinc-600 text-[10px] uppercase tracking-widest">No hay partidas recientes</p>
      )}
    </div>
  );
}