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
  useEffect(() => setMounted(true), []);

  const selectAvatar = (img: string) => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userData = JSON.parse(stored);
      userData.avatar = `/avatars/${img}`;
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event('user-updated'));
      window.dispatchEvent(new Event('close-modals'));
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4">
      <div className="chess-title-group mb-12">
        <p>Protocolo Estético</p>
        <h2 className="!text-3xl">Identidad Visual</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {AVATARS.map((img) => (
          <button 
            key={img} 
            onClick={() => selectAvatar(img)} 
            className="group relative aspect-square transition-transform active:scale-95"
          >
            <div className="w-full h-full rounded-2xl border border-white/10 group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] overflow-hidden bg-black/40 transition-all">
              <img 
                src={`/avatars/${img}`} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" 
                alt="Avatar" 
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}