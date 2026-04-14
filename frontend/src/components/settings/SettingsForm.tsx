"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

interface SettingsFormProps {
  onClose?: () => void;
}

export default function SettingsForm({ onClose }: SettingsFormProps) {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [animations, setAnimations] = useState(true);
  const [volume, setVolume] = useState(80);
  const [status, setStatus] = useState('online');
  const [pieceStyle, setPieceStyle] = useState('clasico');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnimations(parsed.animations ?? true);
        setVolume(parsed.volume ?? 80);
        setPieceStyle(parsed.pieceStyle ?? 'clasico');
        setStatus(parsed.status ?? 'online');
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem("user_settings", JSON.stringify({ animations, volume, pieceStyle, status }));
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => onClose?.(), 1000);
  };

  return (
    <div className="flex flex-col p-8 md:p-12 space-y-10 max-h-[95vh] overflow-y-auto custom-scrollbar font-sans">
      
      <div className="chess-title-group">
        <h2 className="text-white font-cinzel text-4xl uppercase tracking-widest">Ajustes</h2>
        <p className="text-zinc-500 uppercase text-xs tracking-[0.3em]">Configuración del Sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLUMNA 1: APARIENCIA */}
        <div className="space-y-6">
          <SectionHeader title="Apariencia" />
          <div className="space-y-4">
            <ToggleItem label="Modo Oscuro" desc="Interfaz nocturna" active={theme === 'dark'} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            <ToggleItem label="Animaciones" desc="Transiciones de piezas" active={animations} onToggle={() => setAnimations(!animations)} />
            
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-5">
              {/* CORRECCIÓN: div en lugar de p */}
              <div className="chess-label !justify-center flex items-center gap-2">
                <span className="chess-label-dot" /> Estilo de Tablero
              </div>
              <div className="flex gap-2">
                {['clasico', 'moderno', 'minimal'].map((id) => (
                  <button 
                    key={id} 
                    onClick={() => setPieceStyle(id)}
                    className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all border ${pieceStyle === id ? 'bg-gold text-black border-gold' : 'bg-transparent text-zinc-500 border-white/10'}`}
                  >
                    {id.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: PRIVACIDAD */}
        <div className="space-y-6">
          <SectionHeader title="Privacidad" />
          <div className="space-y-4">
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] space-y-4">
              {/* CORRECCIÓN: div en lugar de p */}
              <div className="chess-label !justify-center flex items-center gap-2">
                <span className="chess-label-dot" /> Estado del Perfil
              </div>
              <div className="space-y-2">
                <StatusBtn label="En línea" active={status === 'online'} color="bg-emerald-500" onClick={() => setStatus('online')} />
                <StatusBtn label="Invisible" active={status === 'invisible'} color="bg-zinc-500" onClick={() => setStatus('invisible')} />
              </div>
            </div>
            <ToggleItem label="Elo Público" desc="Visible para todos" active={true} onToggle={() => {}} />
          </div>
        </div>

        {/* COLUMNA 3: SISTEMA */}
        <div className="space-y-6">
          <SectionHeader title="Sistema" />
          <div className="space-y-4">
            <div className="p-7 bg-black/60 border border-gold/20 rounded-[2rem] space-y-5">
              <div className="flex justify-between items-end">
                <div className="chess-label flex items-center gap-2">
                  <span className="chess-label-dot" /> Volumen FX
                </div>
                <span className="text-3xl font-black text-white font-cinzel">{volume}%</span>
              </div>
              <input type="range" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-full h-1.5 accent-gold appearance-none rounded-full cursor-pointer bg-zinc-800" />
            </div>
            
            <button className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-gold/20 transition-all">
              <div className="text-left">
                <p className="text-xl font-bold text-white font-cinzel">Seguridad</p>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Cambiar contraseña</p>
              </div>
              <span className="text-gold text-xl group-hover:translate-x-2 transition-transform">→</span>
            </button>

            <button onClick={() => window.location.assign("/auth")} className="w-full py-5 bg-red-500/5 border border-red-500/10 rounded-[2rem] text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-[0.2em] transition-all">
              Finalizar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full pt-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`min-w-[280px] btn-gold ${isSaved ? '!bg-emerald-500 !text-white' : ''} flex items-center justify-center gap-2`}
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : isSaved ? <Check size={20} strokeWidth={4} /> : "Guardar Cambios"}
        </button>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES CON CORRECCIONES SEMÁNTICAS

const SectionHeader = ({ title }: { title: string }) => (
  // CORRECCIÓN: div en lugar de h3 si contiene divs internos, o usar span para el dot
  <div className="chess-label !text-gold !text-xs flex items-center gap-2 uppercase font-bold tracking-widest">
    <span className="chess-label-dot w-1.5 h-1.5 bg-gold rotate-45 inline-block" /> {title}
  </div>
);

const ToggleItem = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-gold/20 transition-all group">
    <div>
      <p className="text-xl font-bold text-white font-cinzel group-hover:text-gold transition-colors">{label}</p>
      <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-2">{desc}</p>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-gold' : 'bg-zinc-800'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all duration-300 ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const StatusBtn = ({ label, active, color, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${active ? 'bg-gold/10 border-gold/30' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_10px_currentColor]`}></div>
      <span className="text-[10px] font-black uppercase tracking-widest text-white">{label}</span>
    </div>
    {active && <span className="w-1 h-1 bg-gold rounded-full"></span>}
  </button>
);