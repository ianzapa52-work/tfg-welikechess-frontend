import React from 'react';

const AVATARS = [
  "b_king_avatar.png", "b_queen_avatar.png", "b_bishop_avatar.png", 
  "b_horse_avatar.png", "b_rook_avatar.png", "b_pawn_avatar.png",
  "w_king_avatar.png", "w_queen_avatar.png", "w_bishop_avatar.png", 
  "w_horse_avatar.png", "w_rook_avatar.png", "w_pawn_avatar.png"
];

export default function AvatarWindow() {
  const selectAvatar = (img: string) => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userData = JSON.parse(stored);
      userData.avatar = `/avatars/${img}`;
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Notificamos cambios y cerramos
      window.dispatchEvent(new Event('user-updated'));
      window.dispatchEvent(new Event('close-modals'));
    }
  };

  return (
    <div className="p-8 md:p-14">
      <div className="text-center mb-12">
        <h3 className="text-[#d4af37] font-['Cinzel'] text-4xl tracking-[0.2em] font-bold uppercase italic mb-4">
          Identidad Visual
        </h3>
        <p className="text-zinc-500 text-[10px] tracking-[0.5em] uppercase font-black">
          Selecciona tu avatar para el campo de batalla
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {AVATARS.map((img) => (
          <div key={img} onClick={() => selectAvatar(img)} className="group relative aspect-square cursor-pointer">
            <div className="absolute -inset-2 bg-[#d4af37] rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
            <div className="relative w-full h-full rounded-[2rem] border-2 border-white/5 group-hover:border-[#d4af37] transition-all duration-300 overflow-hidden bg-zinc-900/50 shadow-2xl">
              <img 
                src={`/avatars/${img}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt="Avatar" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}