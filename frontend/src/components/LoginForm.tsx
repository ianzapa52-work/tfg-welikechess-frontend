import React, { useState } from 'react';

export default function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValue = email || "user@chess.com";
    const user = {
      name: emailValue.split('@')[0].toUpperCase(),
      email: emailValue,
      avatar: "/avatars/w_king_avatar.png"
    };
    localStorage.setItem("user", JSON.stringify(user));
    window.location.assign("/profile");
  };

  return (
    <div className="w-full p-12 md:p-20 space-y-12 flex flex-col items-center">
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-white tracking-[0.3em] font-['Cinzel'] leading-none uppercase">
          Acceso
        </h2>
        <p className="text-[#d4af37] text-lg tracking-[0.4em] uppercase font-bold opacity-70">
          Identifícate, Gran Maestro
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-10">
        <div className="space-y-6">
          <input 
            type="email" 
            placeholder="EMAIL@CHESS.COM"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-xl focus:border-[#d4af37]/50 transition-all outline-none"
          />
          <input 
            type="password" 
            placeholder="CONTRASEÑA"
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-white text-xl focus:border-[#d4af37]/50 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-8 w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/40"></div>
          <button 
            type="submit"
            className="w-fit px-20 py-8 bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] text-black font-black uppercase text-xl tracking-[0.4em] rounded-[2rem] hover:scale-105 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.2)] cursor-pointer"
          >
            Entrar
          </button>
          <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/40 to-transparent"></div>
        </div>
      </form>

      {/* ENLACE PARA CAMBIAR AL MODAL DE REGISTRO */}
      <div className="flex flex-col items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
        <span className="text-zinc-500 opacity-50">¿Aún no tienes cuenta?</span>
        <button 
          onClick={onSwitchToRegister}
          className="text-[#d4af37] hover:text-white transition-colors cursor-pointer underline underline-offset-8 decoration-[#d4af37]/30"
        >
          Registrar nuevo gran maestro
        </button>
      </div>
    </div>
  );
}