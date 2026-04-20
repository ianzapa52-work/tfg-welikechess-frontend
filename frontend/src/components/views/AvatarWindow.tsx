"use client";
import React, { useState, useEffect } from 'react';

const AVATARS = [
  "b_king_avatar.png", "b_queen_avatar.png", "b_bishop_avatar.png", 
  "b_horse_avatar.png", "b_rook_avatar.png", "b_pawn_avatar.png",
  "w_king_avatar.png", "w_queen_avatar.png", "w_bishop_avatar.png", 
  "w_horse_avatar.png", "w_rook_avatar.png", "w_pawn_avatar.png"
];

export default function AvatarWindow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Opcional: Forzar precarga en caché del navegador
    AVATARS.forEach((src) => {
      const img = new Image();
      img.src = `/avatars/${src}`;
    });
  }, []);

  const selectAvatar = (img: string) => {
    const stored = localStorage.getItem("user");
    let userData = stored ? JSON.parse(stored) : {};
    userData.avatar = `/avatars/${img}`;
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event('user-updated'));
    window.dispatchEvent(new Event('close-modals'));
  };

  return (
    // Añadimos min-h-[600px] para que el modal tenga cuerpo desde el segundo 1
    // La opacidad depende de mounted para un fade-in suave
    <div className={`p-8 md:p-12 w-full max-w-7xl mx-auto transition-opacity duration-500 min-h-[60vh] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <div className="chess-title-group mb-16 text-center">
        <p className="text-gold/50 text-[10px] tracking-[0.8em] font-black uppercase mb-3 font-sans">Protocolo Estético</p>
        <h2 className="text-white font-cinzel text-4xl font-black uppercase tracking-widest">Identidad Visual</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {AVATARS.map((img) => (
          <button 
            key={img} 
            onClick={() => selectAvatar(img)} 
            className="group relative aspect-square transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <div className="w-full h-full rounded-[2rem] border border-white/10 bg-white/[0.03] group-hover:bg-gold/10 group-hover:border-gold/50 group-hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] overflow-hidden flex items-center justify-center p-5">
              {/* Usamos loading="eager" para que no espere a hacer scroll */}
              <img 
                src={`/avatars/${img}`} 
                loading="eager"
                className="w-full h-full object-contain transition-all duration-500 ease-out scale-100 group-hover:scale-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]" 
                alt="Avatar" 
              />
            </div>
            
            <div className="absolute inset-x-0 -bottom-5 text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-gold text-[8px] font-black uppercase tracking-[0.2em] font-sans">Seleccionar</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="h-10" />
    </div>
  );
}