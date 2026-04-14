"use client";

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
      window.location.assign("/profile");
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8 md:p-12 space-y-10 flex flex-col items-center chess-card">
      <div className="chess-title-group">
        <h2>Acceso</h2>
        <p>Bienvenido de nuevo, Maestro</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {error && <div className="chess-error">{error}</div>}
        
        <div className="space-y-5">
          <div className="chess-form-group">
            <label className="chess-label">
              <span className="chess-label-dot"></span> Email
            </label>
            <input 
              type="email" 
              required 
              placeholder="tu@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="chess-input" 
            />
          </div>

          <div className="chess-form-group">
            <label className="chess-label">
              <span className="chess-label-dot"></span> Contraseña
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="chess-input" 
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? 'Validando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">¿Aún no tienes rango?</p>
        <button onClick={onSwitchToRegister} className="chess-link">
          Registrar nuevo gran maestro
        </button>
      </div>
    </div>
  );
}