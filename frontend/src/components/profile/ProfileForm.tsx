"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Activity } from 'lucide-react';

export default function ProfileForm() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = localStorage.getItem("access");
    if (!token) { window.location.assign("/auth"); return; }

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
          avatar: dbData.avatar, // Ruta directa de la DB (/avatars/...)
          rating: dbData.elo_rapid || 1200, // Ajustado a tus campos de Django
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
    window.addEventListener('user-updated', fetchUserData);
    return () => window.removeEventListener('user-updated', fetchUserData);
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-gold animate-pulse uppercase tracking-[0.5em] font-black">Sincronizando_Core...</div>;
  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] gap-8 w-full max-w-[1800px] mx-auto p-4 relative overflow-hidden">
      {/* PANEL IZQUIERDO */}
      <div className="hidden lg:flex flex-col w-80 gap-6 shrink-0 h-full">
        <div className="chess-panel-gold !p-8">
          <p className="text-gold text-[10px] tracking-[0.5em] font-black mb-6 uppercase opacity-70">Identity_Core</p>
          <div className="relative w-28 h-28 mx-auto mb-6 group">
             <img src={user.avatar} className="w-full h-full rounded-[32px] border-2 border-gold object-cover shadow-[0_0_20px_rgba(212,175,55,0.2)]" alt="Avatar" />
             <button 
                onClick={() => window.dispatchEvent(new Event('open-avatar'))}
                className="absolute -bottom-2 -right-2 bg-gold text-black p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl cursor-pointer"
             >
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

      {/* PANEL CENTRAL */}
      <div className="flex-grow flex flex-col gap-8 min-w-0 h-full">
        <div className="flex-grow flex flex-col bg-white/[0.02] border border-white/10 rounded-[56px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <Activity className="text-gold" size={28} />
               <h2 className="text-3xl font-black font-cinzel text-white tracking-[0.4em] uppercase">Estadísticas</h2>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Partidas</p>
                    <p className="text-4xl text-white font-black font-cinzel">{(user.wins || 0) + (user.losses || 0)}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-gold">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Victorias</p>
                    <p className="text-4xl font-black font-cinzel">{user.wins || 0}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8">
                    <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Derrotas</p>
                    <p className="text-4xl text-white font-black font-cinzel">{user.losses || 0}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}