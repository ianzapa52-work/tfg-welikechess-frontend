"use client";

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
        body: JSON.stringify({ email, username: name, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMsg = data.email ? "EMAIL YA REGISTRADO" : data.username ? "NOMBRE YA EXISTE" : "ERROR EN EL REGISTRO";
        throw new Error(errorMsg);
      }

      onSwitchToLogin();
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8 md:p-12 space-y-10 flex flex-col items-center chess-card">
      <div className="chess-title-group">
        <h2>Unirse</h2>
        <p>Comienza tu legado hoy</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {error && <div className="chess-error">{error}</div>}

        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {[
            { label: 'Usuario', val: name, set: setName, type: 'text', placeholder: 'magnus_carlsen' },
            { label: 'Email', val: email, set: setEmail, type: 'email', placeholder: 'gm_chess@example.com' },
            { label: 'Contraseña', val: password, set: setPassword, type: 'password', placeholder: '••••••••' },
            { label: 'Confirmar Clave', val: confirmPassword, set: setConfirmPassword, type: 'password', placeholder: '••••••••' }
          ].map((field) => (
            <div key={field.label} className="chess-form-group">
              <label className="chess-label">
                <span className="chess-label-dot"></span> {field.label}
              </label>
              <input 
                type={field.type} 
                required 
                value={field.val} 
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.placeholder}
                className="chess-input"
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="btn-gold">
          {loading ? 'Creando G.M...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-4">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">¿Ya eres parte de la élite?</p>
        <button onClick={onSwitchToLogin} className="chess-link">
          Iniciar sesión ahora
        </button>
      </div>
    </div>
  );
}