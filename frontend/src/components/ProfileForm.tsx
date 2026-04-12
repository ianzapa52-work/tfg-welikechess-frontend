import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Flame, Puzzle, Camera, Activity, ShieldCheck, Zap, Star, Target, Crown, 
  BarChart3, Sword, Binary, Compass, History 
} from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  avatar: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  puzzlesSolved: number;
  streak: number;
  ranking: string | number;
}

export default function ProfileForm() {
  const [user, setUser] = useState<UserData | null>(null);

  const loadUser = () => {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "null") {
      setUser(JSON.parse(stored));
    } else {
      setUser({
        name: "FFAWF",
        email: "ffawf@faf.com",
        avatar: "/avatars/w_king_avatar.png",
        rating: 2350,
        wins: 145,
        losses: 82,
        draws: 12,
        puzzlesSolved: 1240,
        streak: 8,
        ranking: 20011
      });
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('user-updated', loadUser);
    return () => window.removeEventListener('user-updated', loadUser);
  }, []);

  const stats = useMemo(() => {
    if (!user) return { winRate: 0, lossRate: 0, puzzleProgress: 0 };
    const total = user.wins + user.losses + user.draws;
    const puzzleGoal = 2000;
    return {
      winRate: total > 0 ? Math.round((user.wins / total) * 100) : 0,
      lossRate: total > 0 ? Math.round((user.losses / total) * 100) : 0,
      puzzleProgress: ((user.puzzlesSolved % puzzleGoal) / puzzleGoal) * 100
    };
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] gap-8 w-full max-w-[1800px] mx-auto p-4 relative font-['Outfit'] text-base overflow-hidden">
      
      {/* IZQUIERDA: PERFIL */}
      <div className="hidden lg:flex flex-col w-80 gap-6 shrink-0 h-full overflow-hidden">
        <div className="bg-gradient-to-b from-[#d4af37]/20 to-black/40 border border-[#d4af37]/30 rounded-[32px] p-8 shrink-0 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[7px] text-emerald-400 font-black tracking-widest uppercase">Live</span>
          </div>

          <p className="text-[#d4af37] text-[10px] tracking-[0.4em] font-black mb-6 uppercase text-center font-sans">CUENTA PREMIUM</p>
          
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-[#d4af37] rounded-[38px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <img src={user.avatar} className="relative w-32 h-32 rounded-[32px] border-2 border-[#d4af37] shadow-lg object-cover" alt="Avatar" />
            <button 
              onClick={() => window.dispatchEvent(new Event('open-avatar'))} 
              className="absolute -bottom-2 -right-2 bg-[#d4af37] text-black p-2.5 rounded-xl hover:scale-110 transition-transform cursor-pointer z-10"
            >
              <Camera size={18} />
            </button>
          </div>

          <h2 className="text-white font-['Cinzel'] font-bold text-2xl tracking-widest uppercase mb-1">{user.name}</h2>
          <div className="flex gap-2 mb-4">
            <div title="Verificado" className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-[#d4af37]"><ShieldCheck size={12}/></div>
            <div title="Veterano" className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-[#d4af37]"><Crown size={12}/></div>
            <div title="Rápido" className="p-1.5 bg-white/5 rounded-lg border border-white/10 text-[#d4af37]"><Zap size={12}/></div>
          </div>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mb-6">{user.email}</p>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
              <p className="text-[#d4af37] text-[8px] font-black tracking-widest uppercase mb-1">RANK</p>
              <p className="text-white font-['Cinzel'] text-sm font-bold">#{user.ranking}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center">
              <p className="text-[#d4af37] text-[8px] font-black tracking-widest uppercase mb-1">ELO</p>
              <p className="text-white font-['Cinzel'] text-sm font-bold">{user.rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 rounded-[32px] p-6 flex-grow flex flex-col min-h-0 overflow-hidden backdrop-blur-md">
           <h4 className="text-[#d4af37] font-['Cinzel'] text-[10px] tracking-[0.4em] mb-4 uppercase shrink-0">Logros de Torneo</h4>
           <div className="overflow-y-auto custom-scrollbar space-y-4 pr-2">
              <MilestoneItem icon={<Trophy size={16}/>} title="CAMPEÓN ARENA BLITZ" time="2h" color="text-green-500" />
              <MilestoneItem icon={<Flame size={16}/>} title="STREAK INVICTO" time="4h" color="text-orange-500" />
              <MilestoneItem icon={<Puzzle size={16}/>} title="MAESTRO TÁCTICO" time="Ayer" color="text-blue-500" />
              <MilestoneItem icon={<Target size={16}/>} title="PRECISIÓN +95%" time="1d" color="text-purple-400" />
           </div>
        </div>
      </div>

      {/* CENTRAL: DASHBOARD CON SCROLL */}
      <div className="flex-grow flex flex-col gap-6 min-w-0 h-full overflow-hidden">
        <div className="flex-grow flex flex-col bg-white/[0.02] border border-white/10 rounded-[48px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-4xl font-black font-['Cinzel'] text-white tracking-[0.3em] uppercase italic">Análisis de Juego</h3>
              <p className="text-[10px] text-zinc-500 tracking-[0.5em] font-bold uppercase mt-1">Sincronizado con Engine Stockfish 16.1</p>
            </div>
            <Activity className="text-[#d4af37] opacity-50 animate-pulse" size={40} />
          </div>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar p-10 space-y-12">
            {/* Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BigMetric label="Partidas Totales" value={user.wins + user.losses + user.draws} color="text-emerald-400" bg="bg-emerald-400/5" />
              <BigMetric label="Precisión Media" value="84.2%" color="text-[#d4af37]" bg="bg-[#d4af37]/5" />
              <BigMetric label="Mejor Victoria" value="2410" color="text-blue-400" bg="bg-blue-400/5" />
            </div>

            {/* Win Rate Section */}
            <div className="relative flex flex-col items-center justify-center p-14 bg-black/60 border border-white/5 rounded-[40px] overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
               <p className="text-[#d4af37] font-['Cinzel'] text-7xl md:text-9xl font-black italic mb-2 drop-shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                {stats.winRate}%
               </p>
               <p className="text-zinc-500 tracking-[0.8em] text-[10px] font-black uppercase mb-10">Dominio de Tablero (Global)</p>
               <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-[#d4af37] shadow-[0_0_20px_#d4af37]" style={{ width: `${stats.winRate}%` }}></div>
                  <div className="h-full bg-red-900/40" style={{ width: `${stats.lossRate}%` }}></div>
               </div>
            </div>

            {/* SECCIÓN NUEVA: APERTURAS FAVORITAS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Compass className="text-[#d4af37]" size={20} />
                    <h4 className="text-white font-['Cinzel'] font-bold tracking-widest text-lg uppercase">Repertorio de Aperturas</h4>
                  </div>
                  <div className="space-y-4">
                    <OpeningProgress label="Defensa Siciliana" percent={72} games={45} />
                    <OpeningProgress label="Gambito de Dama" percent={64} games={38} />
                    <OpeningProgress label="Apertura Española" percent={51} games={22} />
                  </div>
               </div>

               <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Binary className="text-[#d4af37]" size={20} />
                    <h4 className="text-white font-['Cinzel'] font-bold tracking-widest text-lg uppercase">Rendimiento Técnico</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MiniStat label="MiddleGame" value="Superior" detail="+120 ELO" />
                    <MiniStat label="EndGame" value="Sólido" detail="78% Prec." />
                    <MiniStat label="Táctica" value="Agresivo" detail="Puzzle 2400" />
                    <MiniStat label="Tiempo" value="Eficiente" detail="-2s p/m" />
                  </div>
               </div>
            </div>

            {/* SECCIÓN NUEVA: HISTORIAL DE PROGRESO */}
            <div className="bg-black/40 border border-white/5 rounded-[40px] p-10">
               <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <History className="text-[#d4af37]" size={20} />
                    <h4 className="text-white font-['Cinzel'] font-bold tracking-widest text-lg uppercase">Curva de Rating (30d)</h4>
                  </div>
                  <span className="text-[#d4af37] text-xs font-black">+142 PTS ESTE MES</span>
               </div>
               <div className="flex items-end justify-between h-32 gap-2">
                 {[30, 45, 35, 60, 55, 80, 75, 90, 85, 100].map((h, i) => (
                   <div key={i} className="flex-grow group relative">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {2200 + (h * 2)}
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-[#d4af37]/10 to-[#d4af37]/40 rounded-t-lg transition-all duration-500 hover:to-[#d4af37] cursor-pointer" 
                        style={{ height: `${h}%` }}
                      ></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* DERECHA: PUZZLES */}
      <div className="hidden xl:flex flex-col w-96 gap-6 shrink-0 h-full overflow-hidden">
        <div className="bg-black/40 border border-white/5 rounded-[48px] p-10 flex-grow flex flex-col items-center justify-between backdrop-blur-md">
          <div className="text-center w-full">
            <h4 className="text-[#d4af37] font-['Cinzel'] text-xs tracking-[0.5em] mb-12 uppercase font-black italic">Puzzle Stats</h4>
            <div className="relative inline-block mb-10 group">
              <span className="text-[120px] font-black text-white font-['Cinzel'] leading-none italic drop-shadow-2xl group-hover:text-[#d4af37] transition-colors duration-500">
                {user.puzzlesSolved}
              </span>
              <span className="absolute -bottom-4 -right-6 text-[#d4af37] font-bold text-xl uppercase italic">PTS</span>
            </div>
            <p className="text-white font-['Cinzel'] text-xl font-bold tracking-[0.3em] uppercase mb-4">TACTICIAN III</p>
            <div className="w-full bg-black/60 rounded-full h-2.5 p-0.5 border border-white/5 mb-4">
              <div className="bg-[#d4af37] h-full rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{ width: `${stats.puzzleProgress}%` }}></div>
            </div>
            <p className="text-zinc-600 text-[9px] tracking-[0.2em] uppercase font-bold font-sans">Siguiente nivel en {2000 - user.puzzlesSolved} puntos</p>
          </div>

          <div className="w-full bg-[#d4af37] text-black rounded-[32px] p-8 flex items-center justify-between hover:bg-white transition-all duration-500 cursor-pointer shadow-xl group relative z-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">STREAK ACTUAL</p>
              <p className="text-4xl font-['Cinzel'] font-bold italic">{user.streak} WIN</p>
            </div>
            <Flame size={48} className="group-hover:scale-110 transition-transform fill-current" />
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

function OpeningProgress({ label, percent, games }: { label: string, percent: number, games: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-2">
        <span className="text-zinc-400">{label}</span>
        <span className="text-[#d4af37]">{percent}% WR <span className="text-zinc-600 ml-1">({games}p)</span></span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#d4af37]/60" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, detail }: { label: string, value: string, detail: string }) {
  return (
    <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
      <p className="text-zinc-500 text-[8px] font-black tracking-widest uppercase mb-1">{label}</p>
      <p className="text-white font-['Cinzel'] text-sm font-bold">{value}</p>
      <p className="text-[#d4af37] text-[9px] mt-1 font-bold italic">{detail}</p>
    </div>
  );
}

function BigMetric({ label, value, color, bg }: any) {
  return (
    <div className={`${bg} border border-white/5 rounded-[28px] p-8 text-center transition-all hover:border-[#d4af37]/30 group cursor-default`}>
      <span className={`${color} block font-black text-[9px] tracking-[0.4em] mb-3 uppercase font-sans`}>{label}</span>
      <span className="text-5xl font-bold text-white font-['Cinzel'] italic group-hover:scale-110 transition-transform block leading-none">{value}</span>
    </div>
  );
}

function MilestoneItem({ icon, title, time, color }: any) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-white/[0.03] rounded-2xl transition-all cursor-default border border-transparent hover:border-white/5">
      <div className={`${color} bg-white/5 p-2.5 rounded-xl`}>{icon}</div>
      <div className="flex-grow">
        <p className="text-white text-[10px] font-black tracking-widest uppercase font-sans">{title}</p>
        <p className="text-zinc-600 text-[9px] font-bold mt-0.5 uppercase font-sans">T - {time}</p>
      </div>
    </div>
  );
}