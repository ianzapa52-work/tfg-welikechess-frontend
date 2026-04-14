import RankingForm from "@/components/ranking/RankingForm";

export default function RankingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        html, body { 
          height: 100%;
          overflow: hidden !important; 
          margin: 0;
          padding: 0;
          background: #050505;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
      `}} />

      <main className="h-screen w-full flex flex-col relative overflow-hidden bg-[#050505] text-white">
        
        {/* LUCES DE FONDO AMBIENTALES */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d4af37]/5 rounded-full blur-[160px] pointer-events-none"></div>

        {/* HEADER TÉCNICO */}
        <header className="max-w-[1800px] mx-auto w-full px-14 py-6 flex justify-between items-center opacity-30 select-none pointer-events-none shrink-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-[9px] tracking-[0.5em] font-bold uppercase">Servidor: Online</span>
            </div>
            <span className="text-white opacity-20 text-[9px]">|</span>
            <span className="text-[9px] tracking-[0.5em] font-light uppercase italic">Protocolo ELO_SYNC_v4.2</span>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="text-[9px] tracking-[0.5em] font-light uppercase">Latencia: 12ms</span>
            <span className="text-[9px] tracking-[0.5em] font-bold uppercase">Región: UE-Central</span>
          </div>
        </header>

        {/* CONTENIDO INTERACTIVO */}
        <div className="flex-grow min-h-0">
          <RankingForm />
        </div>

        {/* FOOTER ESPACIADOR */}
        <footer className="h-8 shrink-0"></footer>
      </main>
    </>
  );
}