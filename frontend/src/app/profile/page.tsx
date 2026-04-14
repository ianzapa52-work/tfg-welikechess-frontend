import ProfileForm from "@/components/profile/ProfileForm";

export const metadata = {
  title: "Perfil de Maestro | WELIKECHESS",
};

export default function ProfilePage() {
  return (
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] w-full flex flex-col justify-end pb-10 relative overflow-hidden bg-[#050505]">
      
      {/* LUCES DE FONDO AMBIENTALES - Consistentes con Amigos */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* HEADER TÉCNICO - Mismo estilo y z-index */}
      <div className="max-w-[1800px] mx-auto w-full px-14 py-4 flex justify-between items-center opacity-30 select-none pointer-events-none z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_#eab308]"></div>
            <span className="text-[9px] text-white tracking-[0.5em] font-bold uppercase">Estado: Gran Maestro</span>
          </div>
          <span className="text-white opacity-20 text-[9px]">|</span>
          <span className="text-[9px] text-white tracking-[0.5em] font-light uppercase italic">User_Analytics_v3.4</span>
        </div>
        
        <div className="flex items-center gap-8">
          <span className="text-[9px] text-white tracking-[0.5em] font-light uppercase italic italic">Chess_Main_Node</span>
          <span className="text-[9px] text-white tracking-[0.5em] font-bold uppercase italic">Secure_Link</span>
        </div>
      </div>

      {/* COMPONENTE INTERACTIVO */}
      <div className="relative z-20">
        <ProfileForm />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.2); border-radius: 10px; }
      `}} />
    </div>
  );
}