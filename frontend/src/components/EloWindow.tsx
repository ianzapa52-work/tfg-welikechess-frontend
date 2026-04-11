import React from 'react';

export default function EloWindow() {
  return (
    <div className="flex flex-col h-full bg-[#050505]">

      {/* CUERPO SUPERIOR - Un poco más de aire y fuentes más grandes */}
      <div className="px-12 pt-12 pb-8 shrink-0">
        <header className="mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black font-['Cinzel'] tracking-[0.2em] text-white leading-tight">
            ESCALAFÓN <span className="text-[#d4af37]">OFICIAL</span>
          </h2>
          <p className="text-zinc-500 text-[11px] tracking-[0.5em] uppercase mt-4 font-semibold">Estándares Internacionales 2026</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-4">
          <div className="space-y-3">
            <h4 className="text-[#d4af37] font-bold font-['Cinzel'] tracking-[0.2em] border-b border-[#d4af37]/20 pb-2 text-[12px]">SISTEMA DE TÍTULOS</h4>
            <p className="text-zinc-400 leading-relaxed text-[14px] italic">
              Los títulos son vitalicios. El ELO fluctúa según el factor K: los nuevos jugadores tienen mayor volatilidad que los veteranos.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[#d4af37] font-bold font-['Cinzel'] tracking-[0.2em] border-b border-[#d4af37]/20 pb-2 text-[12px]">NORMATIVA DE ÉLITE</h4>
            <p className="text-zinc-400 leading-relaxed text-[14px] italic">
              Superar los 2500 puntos otorga el estatus de Gran Maestro. La consistencia es clave para mantener el rango profesional.
            </p>
          </div>
        </div>
      </div>

      {/* ÁREA DE TABLA - Incrementada la zona de scroll y el padding de celdas */}
      <div className="px-12 pb-12 flex-grow overflow-hidden flex flex-col min-h-0">
        <div className="bg-black/40 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/[0.05] text-[#d4af37] font-['Cinzel'] text-[12px] tracking-[0.3em]">
              <tr>
                <th className="px-10 py-5">TÍTULO OFICIAL</th>
                <th className="px-10 py-5">RATING ELO</th>
                <th className="px-10 py-5 hidden sm:table-cell">ESTADO</th>
              </tr>
            </thead>
          </table>
          
          {/* Scroll ampliado a 400px para una mejor visualización */}
          <div className="overflow-y-auto custom-scrollbar max-h-[400px]">
            <table className="w-full text-left">
              <tbody className="text-[14px] font-medium">
                <RankRow tier="Gran Maestro (GM)" range="2500+" status="Nivel Máximo" highlight />
                <RankRow tier="Maestro Internacional (IM)" range="2400 - 2499" status="Internacional" />
                <RankRow tier="Maestro FIDE (FM)" range="2300 - 2399" status="Avanzado" />
                <RankRow tier="Candidato a Maestro (CM)" range="2200 - 2299" status="Experto" />
                <RankRow tier="Maestro Nacional (NM)" range="2000 - 2199" status="Nacional" />
                <RankRow tier="Jugador de Club A" range="1800 - 1999" status="Fuerte" />
                <RankRow tier="Jugador de Club B" range="1600 - 1799" status="Competidor" />
                <RankRow tier="Aficionado" range="1200 - 1599" status="Intermedio" />
                <RankRow tier="Principiante" range="0 - 1199" status="Iniciación" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function RankRow({ tier, range, status, highlight = false }: { tier: string, range: string, status: string, highlight?: boolean }) {
  return (
    <tr className={`border-b border-white/5 transition-all duration-300 ${highlight ? 'bg-[#d4af37]/10' : 'hover:bg-white/[0.02]'}`}>
      <td className={`px-10 py-6 font-['Cinzel'] tracking-[0.1em] uppercase ${highlight ? 'text-[#d4af37] font-bold' : 'text-white'}`}>{tier}</td>
      <td className={`px-10 py-6 font-mono ${highlight ? 'text-white font-bold' : 'text-zinc-400'}`}>{range}</td>
      <td className={`px-10 py-6 text-[10px] tracking-[0.2em] hidden sm:table-cell ${highlight ? 'text-[#d4af37]' : 'text-zinc-600'} uppercase`}>{status}</td>
    </tr>
  );
}