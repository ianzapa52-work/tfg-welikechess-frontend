"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomeRankingSidebar() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('chess_ranking');
    if (saved) setPlayers(JSON.parse(saved).sort((a: any, b: any) => b.elo - a.elo).slice(0, 3));
  }, []);

  if (players.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="chess-label">Top Maestros</h3>
        <div className="chess-label-dot animate-pulse" />
      </div>
      
      <div className="space-y-3">
        {players.map((p, i) => (
          <Link key={i} href="/ranking" className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-gold/40 transition-all group">
            <div className="flex items-center gap-4">
              <span className={`font-cinzel text-xs ${i === 0 ? 'text-gold' : 'text-zinc-600'}`}>0{i + 1}</span>
              <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{p.name}</span>
            </div>
            <span className="text-[11px] font-black text-gold bg-black/60 px-3 py-1.5 rounded-lg">
              {p.elo}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}