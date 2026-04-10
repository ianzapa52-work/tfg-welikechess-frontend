import React, { useState } from 'react';

export default function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación de coincidencia
    if (password !== confirmPassword) {
      setError('LAS CONTRASEÑAS NO COINCIDEN');
      return;
    }

    const user = {
      name: name.toUpperCase() || "NUEVO MAESTRO",
      email: email || "nuevo@chess.com",
      avatar: "/avatars/w_pawn_avatar.png"
    };
    
    const stats = { rating: 1200, wins: 0, losses: 0, draws: 0, puzzlesSolved: 0 };
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("stats", JSON.stringify(stats));
    window.location.assign("/profile");
  };

  return (
    <div className="w-fit mx-auto p-8 md:p-12 space-y-8 flex flex-col items-center bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] font-['Cinzel'] uppercase">
          Unirse
        </h2>
        <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase font-bold opacity-70">
          Comienza tu ascenso
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-80 md:w-96 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold p-3 rounded-lg text-center tracking-widest animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* NOMBRE */}
          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Nombre
            </label>
            <input 
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="TU NOMBRE"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-base focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Email
            </label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CORREO@CHESS.COM"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-base focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          {/* CONTRASEÑA */}
          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Contraseña
            </label>
            <input 
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white text-base focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          {/* REPETIR CONTRASEÑA */}
          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Repetir Contraseña
            </label>
            <input 
              type="password" required value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-white/[0.03] border ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white text-base focus:border-[#d4af37]/50 transition-all outline-none`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full pt-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/40"></div>
          <button 
            type="submit"
            className="w-fit px-12 py-4 bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] text-black font-black uppercase text-sm tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-[0_10px_20px_rgba(212,175,55,0.2)] cursor-pointer whitespace-nowrap"
          >
            Crear Cuenta
          </button>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/40 to-transparent"></div>
        </div>
      </form>

      <div className="flex flex-col items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em]">
        <span className="text-zinc-500 opacity-50">¿Ya eres miembro?</span>
        <button 
          onClick={onSwitchToLogin}
          className="text-[#d4af37] hover:text-white transition-colors cursor-pointer underline underline-offset-4"
        >
          Iniciar sesión ahora
        </button>
      </div>
    </div>
  );
}