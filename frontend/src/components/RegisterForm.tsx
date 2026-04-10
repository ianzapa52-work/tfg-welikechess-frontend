import React, { useState } from 'react';

export default function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica de guardado basada en tu script original
    const user = {
      name: name.toUpperCase() || "NUEVO MAESTRO",
      email: email || "nuevo@chess.com",
      avatar: "/avatars/w_pawn_avatar.png" // Avatar de peón para nuevos registros
    };

    const stats = {
      rating: 1200, 
      totalGames: 0, 
      wins: 0, 
      losses: 0, 
      draws: 0, 
      puzzlesSolved: 0, 
      puzzlesFailed: 0
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("stats", JSON.stringify(stats));

    // Redirección inmediata
    window.location.assign("/profile");
  };

  return (
    <div className="w-full p-12 md:p-20 space-y-12 flex flex-col items-center">
      {/* CABECERA */}
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-white tracking-[0.3em] font-['Cinzel'] leading-none uppercase">
          Unirse
        </h2>
        <p className="text-[#d4af37] text-lg tracking-[0.4em] uppercase font-bold opacity-70">
          Comienza tu ascenso a Gran Maestro
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CAMPO: NOMBRE */}
          <div className="space-y-4">
            <label className="text-[#d4af37] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-2 bg-[#d4af37] rotate-45"></span> Nombre de Jugador
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="TU NOMBRE"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-xl focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all outline-none placeholder:opacity-10"
            />
          </div>

          {/* CAMPO: EMAIL */}
          <div className="space-y-4">
            <label className="text-[#d4af37] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-2 bg-[#d4af37] rotate-45"></span> Correo Electrónico
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CORREO@CHESS.COM"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-xl focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all outline-none placeholder:opacity-10"
            />
          </div>
        </div>

        {/* CAMPO: CONTRASEÑA (Ancho completo) */}
        <div className="space-y-4">
          <label className="text-[#d4af37] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <span className="w-2 h-2 bg-[#d4af37] rotate-45"></span> Establecer Contraseña
          </label>
          <input 
            type="password" 
            required
            placeholder="••••••••••••"
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-xl focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all outline-none placeholder:opacity-10 tracking-[0.5em]"
          />
        </div>

        {/* BOTÓN CON LÍNEAS DEGRADADAS */}
        <div className="flex items-center gap-8 w-full pt-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/40"></div>
          
          <button 
            type="submit"
            className="w-fit px-24 py-10 bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] text-black font-black uppercase text-xl tracking-[0.4em] rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_25px_50px_rgba(212,175,55,0.2)] cursor-pointer whitespace-nowrap"
          >
            Crear Cuenta
          </button>

          <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/40 to-transparent"></div>
        </div>
      </form>

      {/* NAVEGACIÓN HACIA LOGIN */}
      <div className="flex flex-col items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
        <span className="text-zinc-500 opacity-50 text-center">¿Ya eres miembro del club?</span>
        <button 
          onClick={onSwitchToLogin}
          className="text-[#d4af37] hover:text-white transition-colors cursor-pointer underline underline-offset-8 decoration-[#d4af37]/30"
        >
          Iniciar sesión ahora
        </button>
      </div>
    </div>
  );
}