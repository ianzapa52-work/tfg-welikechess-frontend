"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRecentActivity() {
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecent = async () => {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("username");
      setMyUsername(storedUser);
      
      try {
        const response = await fetch("http://localhost:8000/api/games/my-history/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          const formatted = data.slice(0, 3).map((g: any) => {
            const isLive = g.status === 'in_progress';
            let resType = 'draw';
            
            if (isLive) {
              resType = 'live';
            } else if (g.winner_username === storedUser) {
              resType = 'win';
            } else if (g.winner_username !== null) {
              resType = 'loss';
            }

            return {
              id: g.id,
              opponent: g.white_username === storedUser ? g.black_username : g.white_username,
              resultType: resType,
              mode: g.mode,
              status: g.status,
              resultText: g.result,
              created_at: g.created_at
            };
          });
          setRecentGames(formatted);
        }
      } catch (error) {
        console.error("Error Home Recent Activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleAction = (game: any) => {
    if (game.status === 'in_progress') {
      router.push(`/play-online?gameId=${game.id}`);
    } else {
      router.push(`/analysis/${game.id}`);
    }
  };

  if (loading) return <div className="text-center py-4 animate-pulse text-gold text-[10px]">SINCRONIZANDO...</div>;

  return (
    <div className="space-y-3">
      {recentGames.length > 0 ? (
        recentGames.map((game) => {
          const isLive = game.status === 'in_progress';
          
          return (
            <div 
              key={game.id} 
              className={`flex items-center justify-between py-3 px-3 -mx-1 rounded-xl transition-all duration-700 group/item border ${
                isLive 
                ? 'border-[#ff1744]/30 bg-[#ff1744]/5 opacity-90' 
                : 'border-transparent hover:bg-white/5 [.light_&]:hover:bg-black/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-[9px] font-black px-2 py-1 rounded border transition-opacity duration-1000 ${
                  isLive ? 'text-[#ff1744] border-[#ff1744]/40 bg-[#ff1744]/10 animate-[pulse_3s_infinite]' : 
                  game.resultType === 'win' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
                  game.resultType === 'loss' ? 'text-rose-500 border-rose-500/20 bg-rose-500/5' : 
                  'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'
                }`}>
                  {isLive ? 'EN CURSO' : 
                   game.resultType === 'win' ? 'VICTORIA' : 
                   game.resultType === 'loss' ? 'DERROTA' : 'TABLAS'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white [.light_&]:text-zinc-800 uppercase tracking-tight group-hover/item:text-[#d4af37] transition-colors">
                    vs. {game.opponent}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    {game.mode} • {isLive ? 'LIVE' : game.resultText}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleAction(game)}
                className={`px-4 py-1.5 rounded text-[10px] font-black transition-all transform active:scale-95 cursor-pointer uppercase tracking-widest border ${
                  isLive
                  ? 'bg-white [.light_&]:bg-zinc-800 text-black [.light_&]:text-white border-white [.light_&]:border-zinc-800 shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:bg-[#ff1744] hover:text-white hover:border-[#ff1744]'
                  : 'bg-black [.light_&]:bg-white border-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37] hover:text-black'
                }`}
              >
                {isLive ? 'VER PARTIDA' : 'ANALIZAR'}
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-center py-4 text-zinc-600 text-[10px] uppercase tracking-widest">No hay actividad reciente</p>
      )}
    </div>
  );
}