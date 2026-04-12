import React, { useState } from 'react';

export default function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('LAS CONTRASEÑAS NO COINCIDEN');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          username: name,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = "ERROR EN EL REGISTRO";
        if (data.email) errorMsg = "EL EMAIL YA ESTÁ REGISTRADO";
        else if (data.username) errorMsg = "EL NOMBRE DE USUARIO YA EXISTE";
        throw new Error(errorMsg);
      }

      alert("¡REGISTRO EXITOSO, GRAN MAESTRO!");
      onSwitchToLogin();

    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-fit mx-auto p-8 md:p-12 space-y-8 flex flex-col items-center bg-black/20 rounded-3xl border border-white/5 backdrop-blur-sm">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-[0.2em] font-['Cinzel'] uppercase">Unirse</h2>
        <p className="text-[#d4af37] text-xs tracking-[0.3em] uppercase font-bold opacity-70">Comienza tu ascenso</p>
      </div>

      <form onSubmit={handleSubmit} className="w-80 md:w-96 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold p-3 rounded-lg text-center tracking-widest animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Nombre
            </label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="TU NOMBRE DE USUARIO"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Email
            </label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="CORREO@CHESS.COM"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Contraseña
            </label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white focus:border-[#d4af37]/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rotate-45"></span> Repetir Contraseña
            </label>
            <input 
              type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full bg-white/[0.03] border ${confirmPassword && password !== confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-xl p-4 text-white focus:border-[#d4af37]/50 transition-all outline-none`}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-[#d4af37] text-black font-black uppercase text-sm tracking-[0.2em] rounded-full hover:scale-105 transition-all disabled:opacity-50">
          {loading ? 'Procesando...' : 'Crear Cuenta'}
        </button>
      </form>

      <button onClick={onSwitchToLogin} className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.1em] underline underline-offset-4">
        Iniciar sesión ahora
      </button>
    </div>
  );
}