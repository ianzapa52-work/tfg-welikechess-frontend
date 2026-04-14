import FriendsForm from "@/components/friends/FriendsForm";

export const metadata = {
  title: "Red de Amigos | WELIKECHESS",
};

export default function FriendsPage() {
  return (
    // Añadimos h-screen y overflow-hidden para que no aparezca el scroll lateral feo
    <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] w-full flex flex-col justify-end pb-10 relative overflow-hidden bg-[#050505]">
      
      {/* LUCES DE FONDO AMBIENTALES - Restauradas */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>

      {/* HEADER TÉCNICO */}
      <div className="max-w-[1800px] mx-auto w-full px-14 py-4 flex justify-between items-center opacity-30 select-none pointer-events-none z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-[9px] text-white tracking-[0.5em] font-bold uppercase">Red: Estable</span>
          </div>
          <span className="text-white opacity-20 text-[9px]">|</span>
          <span className="text-[9px] text-white tracking-[0.5em] font-light uppercase italic">Social_Protocol_v2.0</span>
        </div>
        
        <div className="flex items-center gap-8">
          <span className="text-[9px] text-white tracking-[0.5em] font-light uppercase">Usuarios: 3,120</span>
          <span className="text-[9px] text-white tracking-[0.5em] font-bold uppercase">Región: UE-Central</span>
        </div>
      </div>

      {/* COMPONENTE INTERACTIVO */}
      <div className="relative z-20">
        <FriendsForm />
      </div>

    </div>
  );
}