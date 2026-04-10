import React, { useState, useEffect } from 'react';

export default function SettingsForm() {
  const [theme, setTheme] = useState('dark');
  const [animations, setAnimations] = useState(true);
  const [volume, setVolume] = useState(80);
  const [status, setStatus] = useState('online');
  const [pieceStyle, setPieceStyle] = useState('clasico');

  useEffect(() => {
    const saved = localStorage.getItem("user_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnimations(parsed.animations ?? true);
      setVolume(parsed.volume ?? 80);
      setPieceStyle(parsed.pieceStyle ?? 'clasico');
    }
    setTheme(document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="flex flex-col p-12 md:p-16 space-y-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
      {/* CABECERA */}
      <div className="text-center space-y-4">
        <h2 className="text-7xl font-black text-white tracking-[0.3em] font-['Cinzel'] leading-none uppercase">
          Ajustes
        </h2>
        <p className="text-[#d4af37] text-lg tracking-[0.4em] uppercase font-bold opacity-70">Personaliza tu experiencia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA 1: DISEÑO */}
        <div className="space-y-10">
          <SectionHeader title="Apariencia" />
          <div className="space-y-6">
            <ToggleItem 
              label="Modo Oscuro" 
              desc="Descansa la vista durante la noche" 
              active={theme === 'dark'} 
              onToggle={toggleTheme} 
            />
            <ToggleItem 
              label="Animaciones" 
              desc="Efectos y transiciones suaves" 
              active={animations} 
              onToggle={() => {
                setAnimations(!animations);
                document.documentElement.classList.toggle('no-animations');
              }} 
            />
            
            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] space-y-6">
              <p className="text-xs font-black text-[#d4af37] tracking-widest uppercase text-center">Tipo de piezas</p>
              <div className="flex gap-3">
                {[
                  { id: 'clasico', label: 'Clásico' },
                  { id: 'moderno', label: 'Moderno' },
                  { id: 'minimal', label: 'Minimal' }
                ].map((opt) => (
                  <button 
                    key={opt.id} 
                    onClick={() => setPieceStyle(opt.id)}
                    className={`flex-1 py-4 text-xs font-bold rounded-xl transition-all border-2 ${pieceStyle === opt.id ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/20'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: PRIVACIDAD */}
        <div className="space-y-10">
          <SectionHeader title="Privacidad" />
          <div className="space-y-6">
            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] space-y-6">
              <p className="text-xs font-black text-[#d4af37] tracking-widest uppercase text-center">Estado de conexión</p>
              <div className="space-y-3">
                <StatusBtn label="En línea" active={status === 'online'} color="bg-green-500" onClick={() => setStatus('online')} />
                <StatusBtn label="Invisible" active={status === 'invisible'} color="bg-zinc-500" onClick={() => setStatus('invisible')} />
                <StatusBtn label="Ausente" active={status === 'away'} color="bg-orange-500" onClick={() => setStatus('away')} />
              </div>
            </div>
            <ToggleItem 
              label="Mostrar mi Elo" 
              desc="Tu puntuación será pública" 
              active={true} 
              onToggle={() => {}} 
            />
          </div>
        </div>

        {/* COLUMNA 3: SONIDO Y CUENTA */}
        <div className="space-y-10">
          <SectionHeader title="Sonido y Cuenta" />
          <div className="space-y-6">
            <div className="p-10 bg-black/40 border border-[#d4af37]/20 rounded-[2rem] space-y-8">
              <div className="flex justify-between items-end">
                <p className="text-xs font-black text-[#d4af37] tracking-widest uppercase">Volumen</p>
                <span className="text-4xl font-black text-white leading-none">{volume}%</span>
              </div>
              <input 
                type="range" 
                value={volume} 
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 accent-[#d4af37] appearance-none rounded-full cursor-pointer" 
              />
            </div>
            
            <button className="w-full p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.06] transition-all">
              <div className="text-left">
                <p className="text-xl font-bold text-white tracking-tight">Seguridad</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Contraseña y cuenta</p>
              </div>
              <span className="text-[#d4af37] text-3xl group-hover:translate-x-2 transition-transform">→</span>
            </button>

            <button className="w-full p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-center hover:bg-red-500/10 transition-all group">
              <span className="text-sm font-black text-red-500/60 group-hover:text-red-500 uppercase tracking-[0.2em] transition-colors">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: BOTÓN ENMARCADO POR LÍNEAS DEGRADADAS */}
      <div className="flex items-center gap-8 w-full">
        {/* Línea decorativa izquierda (se desvanece hacia la izquierda) */}
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/40"></div>
        
        {/* BOTÓN (Mantenido w-fit y mx-auto para centrado relativo) */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('close-modals'))}
          className="w-fit mx-auto px-24 py-10 bg-gradient-to-r from-[#8a6d1d] via-[#d4af37] to-[#8a6d1d] text-black font-black uppercase text-xl tracking-[0.4em] rounded-[2rem] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_25px_50px_rgba(212,175,55,0.2)] whitespace-nowrap"
        >
          Guardar cambios
        </button>

        {/* Línea decorativa derecha (se desvanece hacia la derecha) */}
        <div className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/40 to-transparent"></div>
      </div>
    </div>
  );
}

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-[#d4af37] text-sm font-black uppercase tracking-[0.2em] flex items-center gap-4">
    <span className="w-2.5 h-2.5 bg-[#d4af37] rotate-45"></span> {title}
  </h3>
);

const ToggleItem = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] hover:border-[#d4af37]/30 transition-all group">
    <div>
      <p className="text-2xl font-bold text-white tracking-tight group-hover:text-[#d4af37] transition-colors">{label}</p>
      <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{desc}</p>
    </div>
    <button onClick={onToggle} className={`w-16 h-8 rounded-full relative transition-all duration-500 ${active ? 'bg-[#d4af37]' : 'bg-zinc-800'}`}>
      <div className={`absolute top-1 w-6 h-6 bg-black rounded-full transition-all duration-500 ${active ? 'left-9' : 'left-1'}`} />
    </button>
  </div>
);

const StatusBtn = ({ label, active, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${active ? 'bg-[#d4af37]/10 border-[#d4af37]/40' : 'bg-transparent border-white/5 opacity-50 hover:opacity-100'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></div>
      <span className="text-xs font-black uppercase tracking-widest text-white">{label}</span>
    </div>
    {active && <span className="text-[#d4af37] text-sm">●</span>}
  </button>
);