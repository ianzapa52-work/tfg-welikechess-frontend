import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Tu lógica de negocio actual
    const user = {
      name: email.split('@')[0].toUpperCase(),
      email: email,
      avatar: "/avatars/w_king_avatar.png"
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

    // Redirección profesional
    window.location.assign("/profile");
  };

  return (
    <div className="w-full max-w-[420px] p-8 rounded-xl border border-[#d4af37]/30 bg-[rgba(20,20,20,0.85)] backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
      
      <div className="flex justify-center mb-6">
        <img src="/pieces/w_king.svg" alt="Logo" className="w-16 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-white tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
        INICIAR SESIÓN
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div>
          <label className="block mb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4af37]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-zinc-800 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all placeholder:text-zinc-600"
            placeholder="maestro@chess.com"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#d4af37]">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-zinc-800 text-white focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/30 outline-none transition-all placeholder:text-zinc-600"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 mt-2 rounded-lg font-bold bg-gradient-to-br from-[#d4af37] to-[#996515] text-black hover:brightness-110 active:scale-[0.98] transition-all uppercase text-[11px] tracking-[0.2em]"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Entrar al Club
        </button>
      </form>

      <p className="text-center text-xs text-zinc-500 mt-6 tracking-wide">
        ¿Aún no tienes rango? 
        <a href="/register" className="ml-2 text-[#d4af37] hover:text-white transition-colors underline-offset-4 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}