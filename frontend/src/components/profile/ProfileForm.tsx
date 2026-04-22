"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Activity, Globe, Zap, Timer, Target, Trophy, Skull } from 'lucide-react';

export default function ProfileForm() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [presence, setPresence] = useState('online');

  const fetchUserData = async () => {
    const token = localStorage.getItem("access");
    if (!token) { window.location.assign("/auth"); return; }

    const settings = JSON.parse(localStorage.getItem("user_settings") || "{}");
    setPresence(settings.status || 'online');

    try {
      const response = await fetch('http://localhost:8000/api/users/me/', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const dbData = await response.json();
        localStorage.setItem("user", JSON.stringify(dbData));

        setUser({
          ...dbData,
          name: (dbData.username || "MAESTRO").toUpperCase(),
          avatar: dbData.avatar,
          rating: dbData.elo_rapid || 1200,
          wins: dbData.wins || 0,
          losses: dbData.losses || 0,
          ranking: dbData.rank || 'N/A'
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    const handlePresenceUpdate = () => {
      const settings = JSON.parse(localStorage.getItem("user_settings") || "{}");
      if (settings.status) {
        setPresence(settings.status);
      }
    };

    const handleDataRefresh = () => {
      const settings = JSON.parse(localStorage.getItem("user_settings") || "{}");
      if (settings.status !== 'away') {
        fetchUserData();
      }
    };

    window.addEventListener('user-updated', handlePresenceUpdate);
    window.addEventListener('user-updated', handleDataRefresh);
    
    return () => {
      window.removeEventListener('user-updated', handlePresenceUpdate);
      window.removeEventListener('user-updated', handleDataRefresh);
    };
  }, []);

  const getStatusStyle = () => {
    switch(presence) {
      case 'online': return { color: 'bg-emerald-500 shadow-[0_0_10px_#10b981]', text: 'En Línea' };
      case 'away': return { color: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]', text: 'Meditando' };
      default: return { color: 'bg-zinc-500', text: 'Incógnito' };
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-gold animate-pulse uppercase tracking-[0.5em] font-black">Sincronizando_Core...</div>;
  if (!user) return null;

  const totalGames = (user.wins || 0) + (user.losses || 0);
  const winRate = totalGames > 0 ? Math.round((user.wins / totalGames) * 100) : 0;
  const statusInfo = getStatusStyle();

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] gap-8 w-full max-w-[1800px] mx-auto p-4 relative overflow-hidden">
      <div className="hidden lg:flex flex-col w-80 gap-6 shrink-0 h-full">
        <div className="chess-panel-gold !p-8 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
             <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.color} transition-all duration-500 animate-pulse`}></div>
             <span className="text-[7px] text-white/70 font-black uppercase tracking-widest">{statusInfo.text}</span>
          </div>
          
          <div className="relative w-28 h-28 mx-auto mb-6 group">
             <img src={user.avatar} className="w-full h-full rounded-[32px] border-2 border-gold object-cover shadow-[0_0_20px_rgba(212,175,55,0.2)]" alt="Avatar" />
             <button onClick={() => window.dispatchEvent(new Event('open-avatar'))} className="absolute -bottom-2 -right-2 bg-gold text-black p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer">
                <Camera size={18} strokeWidth={3} />
             </button>
          </div>
          <h3 className="text-white font-cinzel font-bold text-xl tracking-[0.2em] uppercase truncate mb-4 text-center">{user.name}</h3>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/5 rounded-2xl p-2 border border-white/10">
                <p className="text-gold text-[8px] font-black uppercase mb-1">Elo Rapid</p>
                <p className="text-white font-cinzel font-bold text-sm">{user.rating}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-2 border border-white/10">
                <p className="text-gold text-[8px] font-black uppercase mb-1">Rango</p>
                <p className="text-white font-cinzel font-bold text-sm">#{user.ranking}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-8 min-w-0 h-full">
        <div className="flex-grow flex flex-col bg-white/[0.02] border border-white/10 rounded-[56px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <Activity className="text-gold" size={28} />
               <h2 className="text-3xl font-black font-cinzel text-white tracking-[0.4em] uppercase">ESTADÍSTICAS DE BATALLA</h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gold/5 border border-gold/20 rounded-full">
               <Globe size={14} className="text-gold" />
               <span className="text-white text-[9px] font-black uppercase tracking-widest">my_stats</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-10 py-10 space-y-12 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EloCard label="Bullet" elo={user.elo_bullet} icon={<Target size={18}/>} color="text-red-500" />
                <EloCard label="Blitz" elo={user.elo_blitz} icon={<Zap size={18}/>} color="text-yellow-400" />
                <EloCard label="Rapid" elo={user.elo_rapid} icon={<Timer size={18}/>} color="text-emerald-400" />
            </div>

            <div className="space-y-8">
                <div className="flex justify-between items-end px-2">
                    <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">Análisis de Rendimiento</h4>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{totalGames} Combates Totales</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatBox label="Victorias" value={user.wins} icon={<Trophy size={20}/>} color="text-emerald-500" bg="hover:bg-emerald-500/[0.05]" />
                    <StatBox label="Derrotas" value={user.losses} icon={<Skull size={20}/>} color="text-red-500" bg="hover:bg-red-500/[0.05]" />
                    <StatBox label="Efectividad" value={`${winRate}%`} icon={<Activity size={20}/>} color="text-blue-500" bg="hover:bg-blue-500/[0.05]" />
                </div>

                <div className="px-2">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 via-gold to-emerald-500 transition-all duration-1000" style={{ width: `${winRate}%` }} />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EloCard({ label, elo, icon, color }: any) {
  return (
    <div className="bg-black/40 border border-white/5 p-6 rounded-[2.5rem] hover:border-gold/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">{icon}</div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${color} opacity-70 group-hover:scale-110 transition-transform`}>{icon}</div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-gold transition-colors">{label}</p>
      </div>
      <p className="text-3xl font-black font-cinzel text-white">{elo || 1200}</p>
    </div>
  );
}

function StatBox({ label, value, icon, color, bg }: any) {
    return (
        <div className={`bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 flex items-center justify-between group ${bg} transition-all`}>
            <div className={`${color} bg-white/5 p-3 rounded-2xl`}>{icon}</div>
            <div className="text-right">
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">{label}</p>
                <p className="text-2xl text-white font-cinzel font-black tracking-tighter">{value}</p>
            </div>
        </div>
    );
}