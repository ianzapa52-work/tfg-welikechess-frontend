"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Modality = 'bullet' | 'blitz' | 'rapid';

export default function HomeRankingSidebar() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modality, setModality] = useState<Modality>('blitz');

  useEffect(() => {
    const fetchTop = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/users/global_ranking/?type=${modality}`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error Home Ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, [modality]);

  return (
    <div className="space-y-6">
      {/* Header con Selector de Modalidad */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.3em]">Top Maestros</h3>
          <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-pulse" />
        </div>

        {/* Mini Tabs Selector - Bullet (izq), Blitz (centro), Rapid (der) */}
        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          {(['bullet', 'blitz', 'rapid'] as Modality[]).map((m) => (
            <button
              key={m}
              onClick={() => setModality(m)}
              className={`flex-1 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                modality === m 
                ? 'bg-[#d4af37] text-black shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 min-h-[220px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-zinc-700 animate-pulse text-[9px] uppercase tracking-[0.2em] pt-10">
            Sincronizando...
          </div>
        ) : players.length > 0 ? (
          players.map((p, i) => (
            <Link key={p.id || i} href="/ranking" className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-[#d4af37]/40 transition-all group">
              <div className="flex items-center gap-4">
                <span className={`font-serif italic text-xs ${i === 0 ? 'text-[#d4af37]' : 'text-zinc-600'}`}>
                  {i + 1}
                </span>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-tighter">
                    {p.username || p.name}
                  </span>
                  <span className="text-[8px] text-zinc-600 font-black tracking-widest">
                    {p.tier || 'MAESTRO'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black text-[#d4af37] bg-black/60 px-3 py-1.5 rounded-lg shadow-inner border border-[#d4af37]/5">
                {p.elo}
              </span>
            </Link>
          ))
        ) : (
          <div className="text-center pt-10 text-zinc-600 text-[9px] uppercase">Sin datos</div>
        )}
      </div>
    </div>
  );
}