import React, { useState } from 'react';

export default function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error('CREDENCIALES INVÁLIDAS');
      
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      
      // Forzamos al perfil a que pida datos nuevos al backend
      localStorage.removeItem("user");

      window.location.assign("/profile");
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full p-8 md:p-20 flex flex-col items-center justify-center space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] font-['Cinzel'] uppercase">Acceso</h2>
        <p className="text-[#d4af37] text-sm tracking-[0.4em] uppercase font-bold opacity-70">Identifícate, Gran Maestro</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold p-3 rounded-lg text-center animate-pulse">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <input type="email" required placeholder="EMAIL@CHESS.COM" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#d4af37]/50" />
          <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-[#d4af37]/50" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-[#d4af37] text-black font-black uppercase rounded-full hover:scale-105 transition-all disabled:opacity-50">
          {loading ? 'ENTRANDO...' : 'Entrar'}
        </button>
      </form>

      <button onClick={onSwitchToRegister} className="text-[#d4af37] text-xs font-black uppercase underline underline-offset-8">
        Registrar nuevo gran maestro
      </button>
    </div>
  );
}