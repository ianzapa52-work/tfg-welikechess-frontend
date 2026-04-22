import Link from "next/link";
import HomeFriendsSidebar from "@/components/ui/HomeFriendsSidebar";
import HomeRecentActivity from "@/components/ui/HomeRecentActivity";
import HomeRankingSidebar from "@/components/ui/HomeRankingSidebar";
import PingCounter from "@/components/ui/PingCounter";

const quotes = [
  { text: "El Ajedrez es algo más que un juego; es una diversión intelectual.", author: "J.R. Capablanca" },
  { text: "En el ajedrez, como en la vida, la mejor jugada es la que se realiza.", author: "S. Tarrasch" },
  { text: "El Ajedrez es la piedra de toque del intelecto.", author: "Goethe" },
  { text: "Ayudad a vuestras piezas, y ellas os ayudarán a vosotros.", author: "Paul Morphy" },
  { text: "El ajedrez es una tortura mental.", author: "Garry Kasparov" },
  { text: "Una mala jugada anula cuarenta buenas.", author: "Bernhard Horwitz" },
  { text: "El ajedrez, como el amor y la música, tiene el poder de hacer felices a los hombres.", author: "S. Tarrasch" }
];

export default function HomePage() {
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const quote = quotes[daysSinceEpoch % quotes.length];

  return (
    <div className="flex flex-col bg-[#070707] [.light_&]:bg-[#f4f4f5] text-zinc-300 [.light_&]:text-zinc-800 font-sans h-[calc(100vh-80px)] md:h-[calc(100vh-96px)] overflow-hidden transition-colors duration-500">
      <div className="flex-grow grid grid-cols-12 overflow-hidden">
        
        <aside className="col-span-2 hidden xl:flex border-r border-[#d4af37]/10 bg-[#0a0a0a] [.light_&]:bg-white flex-col overflow-hidden">
          <HomeFriendsSidebar />
        </aside>

        <main className="col-span-12 xl:col-span-8 flex flex-col overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#050505_100%)] [.light_&]:bg-[radial-gradient(circle_at_top,#ffffff_0%,#f4f4f5_100%)]">
          <section className="p-8 md:p-12 max-w-[1400px] mx-auto w-full pt-8 pb-16"> 
            
            <div className="mb-12 border-l-4 border-[#d4af37] pl-8 py-2 bg-gradient-to-r from-[#d4af37]/5 to-transparent rounded-r-xl">
              <p className="text-[11px] font-black uppercase text-[#d4af37]/70 tracking-[0.5em] mb-1">Nuestro Ajedrez</p>
              <h2 className="text-6xl font-light text-white [.light_&]:text-black italic tracking-tight leading-none font-['Cinzel']">
                ¿Cuál será<span className="text-[#d4af37] font-normal"> tu próximo movimiento?</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <GameCard href="/play-online" title="Jugar Online" subtitle="Arena Multiplayer" desc="Compite contra el mundo en tiempo real." stats="3,210 Jugadores activos" img="/pieces/w_queen.svg" online />
              <GameCard href="/play-ia" title="Desafiar IA" subtitle="Entrenamiento IA" desc="Stockfish v16 listo para ponerte a prueba." stats="Niveles 1-20 adaptativos" img="/pieces/w_king.svg" />
              <GameCard href="/play-local" title="Duelo Local" subtitle="En Persona" desc="Tablero virtual perfecto para jugar cara a cara." stats="Incluye reloj de torneo" img="/pieces/w_rook.svg" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <SectionBox title="Actividad Reciente">
                <HomeRecentActivity />
              </SectionBox>

              <SectionBox title="Desafío Táctico">
                <div className="flex gap-6 items-center flex-grow bg-[#d4af37]/5 [.light_&]:bg-[#d4af37]/10 rounded-2xl p-6 border border-[#d4af37]/10">
                  <div className="w-24 h-24 rounded-lg bg-black/40 [.light_&]:bg-white/50 border border-[#d4af37]/20 flex items-center justify-center text-5xl">🧩</div>
                  <div className="flex-grow">
                    <p className="text-[11px] text-[#d4af37]/70 font-black uppercase tracking-widest">Dificultad Media</p>
                    <h4 className="text-xl font-bold text-white [.light_&]:text-black uppercase tracking-tight mt-1 font-['Cinzel']">Ganan Blancas</h4>
                    <p className="text-xs text-zinc-400 [.light_&]:text-zinc-600 mt-1">Encuentra la secuencia de mate forzado.</p>
                  </div>
                  <Link href="/puzzles" className="px-6 py-3 bg-[#d4af37] text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white [.light_&]:hover:bg-black [.light_&]:hover:text-white transition-colors shadow-lg active:scale-95">
                    Resolver
                  </Link>
                </div>
              </SectionBox>
            </div>
          </section>
        </main>

        <aside className="hidden xl:flex col-span-2 bg-[#0a0a0a] [.light_&]:bg-white border-l border-[#d4af37]/10 flex-col overflow-hidden relative">
          <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4af37]/20 to-transparent"></div>
          <div className="px-2.5 py-6 flex flex-col h-full overflow-hidden pb-10">
            
            <div className="mb-8">
              <HomeRankingSidebar />
            </div>

            <div className="bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl p-5 border border-[#d4af37]/10 relative overflow-hidden mb-8 min-h-[140px]">
              <p className="text-[10px] font-black uppercase text-[#d4af37] tracking-[0.3em] mb-3 opacity-70">Cita del maestro</p>
              <p className="text-[13px] italic text-zinc-300 [.light_&]:text-zinc-800 leading-relaxed font-serif">"{quote.text}"</p>
              <p className="text-[10px] font-bold text-zinc-500 [.light_&]:text-zinc-400 uppercase tracking-widest mt-4">— {quote.author}</p>
            </div>

            <div className="flex flex-col gap-4">
               <div className="px-2">
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Tu Sesión Hoy</p>
                  <div className="grid grid-cols-2 gap-3">
                    <StatBox label="Partidas" value="12" />
                    <StatBox label="Win Rate" value="64%" accent />
                  </div>
               </div>
               <div className="px-2 mt-2">
                  <ActivityBars />
                  <p className="text-[9px] text-zinc-600 uppercase font-bold text-center mt-2 tracking-widest">Actividad de la Comunidad</p>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 [.light_&]:border-black/5">
              <div className="px-2 flex items-center justify-between">
                 <PingCounter />
                 <LiveBadge />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function GameCard({ href, title, subtitle, desc, stats, img, online = false }: any) {
  return (
    <Link href={href} className="group relative h-64 rounded-3xl border border-[#d4af37]/20 bg-black/40 [.light_&]:bg-white p-8 overflow-hidden flex flex-col justify-between hover:border-[#d4af37] hover:shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:-translate-y-2 transition-all duration-500 shadow-xl">
      <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
        <img src={img} className="w-48" alt="" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          {online && <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>}
          <span className="text-[#d4af37] text-xs font-black uppercase tracking-[0.4em]">{subtitle}</span>
        </div>
        <h3 className="text-3xl font-bold text-white [.light_&]:text-black uppercase tracking-tighter leading-tight group-hover:text-[#d4af37] transition-colors font-['Cinzel']">{title}</h3>
      </div>
      <div className="relative z-10 bg-black/50 [.light_&]:bg-zinc-100 backdrop-blur-sm p-4 rounded-xl border border-white/5 [.light_&]:border-black/5 mt-auto">
        <p className="text-sm text-zinc-300 [.light_&]:text-zinc-700">{desc}</p>
        <span className="text-[10px] text-zinc-500 [.light_&]:text-zinc-400 uppercase font-bold mt-2 block tracking-widest">{stats}</span>
      </div>
    </Link>
  );
}

function SectionBox({ title, children }: any) {
  return (
    <div className="bg-black/50 [.light_&]:bg-white border border-[#d4af37]/15 rounded-3xl p-8 relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#d4af37]/40 group">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 [.light_&]:border-black/5">
            <h3 className="text-sm font-black uppercase text-[#d4af37] tracking-[0.3em] flex items-center gap-3">
              <span className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></span> {title}
            </h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatBox({ label, value, accent = false }: any) {
  return (
    <div className="bg-white/5 [.light_&]:bg-black/5 rounded-xl p-3 border border-white/5 [.light_&]:border-black/5">
      <span className="block text-[10px] text-zinc-500 [.light_&]:text-zinc-500 uppercase font-bold tracking-tighter">{label}</span>
      <span className={`text-xl font-light italic leading-none ${accent ? 'text-[#d4af37]' : 'text-white [.light_&]:text-black'} font-['Cinzel']`}>{value}</span>
    </div>
  );
}

function ActivityBars() {
  return (
    <div className="h-24 w-full bg-black/40 [.light_&]:bg-white rounded-xl border border-white/5 [.light_&]:border-black/10 p-4 flex items-end gap-1 group/bars">
      {[40, 70, 30, 90, 50].map((h, i) => (
        <div key={i} className="flex-grow bg-[#d4af37]/40 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
      ))}
    </div>
  );
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-2 bg-green-500/5 px-3 py-1 rounded-full border border-green-500/20">
      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
      <span className="text-[9px] font-black text-green-500 uppercase">Live</span>
    </div>
  );
}