import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "@/styles/global.css";
import ModalManager from "@/components/modals/ModalManager";
import HeaderActions from "@/components/layout/HeaderActions";
import ChatWindow from "@/components/ui/ChatWindow";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

export const metadata: Metadata = {
  title: "WELIKECHESS",
  description: "Plataforma de ajedrez definitiva",
  icons: { icon: "/w_king.svg" },
};

// Clase unificada: cursor-pointer garantizado y sin selección de texto
const navBtnClass = "px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 rounded-xl transition-all duration-300 hover:text-gold hover:bg-white/5 flex items-center justify-center font-sans cursor-pointer select-none";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`scroll-smooth ${inter.variable} ${cinzel.variable}`}>
      <body className="bg-[#050505] text-white antialiased selection:bg-gold selection:text-black">
        
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1a1a1a_0%,#000000_100%)] opacity-70 pointer-events-none"></div>

        <header className="fixed top-0 left-0 w-full h-20 md:h-24 bg-black/60 grid grid-cols-3 items-center px-4 md:px-10 z-[60] backdrop-blur-xl border-b border-white/5">
          
          {/* LOGO */}
          <div className="flex justify-start">
            <Link href="/" className="relative group block cursor-pointer">
              <h1 className="text-xl md:text-2xl font-light tracking-[0.3em] text-white transition-colors duration-300 font-serif">
                WELIKE<span className="font-black text-gold group-hover:brightness-125 transition-all">CHESS</span>
              </h1>
              <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
            </Link>
          </div>

          {/* NAVEGACIÓN CENTRAL */}
          <div className="flex justify-center">
            <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              {/* BLOQUE PLAY */}
              <div className="flex items-center gap-0.5">
                <Link href="/play-online" className={navBtnClass}>Online</Link>
                <Link href="/play-ia" className={navBtnClass}>IA</Link>
                <Link href="/play-local" className={navBtnClass}>Local</Link>
                <Link href="/puzzles" className={navBtnClass}>Puzzles</Link>
              </div>

              <div className="w-[1px] h-5 bg-white/10 mx-2"></div>

              {/* BLOQUE SOCIAL Y MODALES */}
              <div className="flex items-center gap-0.5">
                <Link href="/ranking" className={navBtnClass}>Ranking</Link>
                <Link href="/friends" className={navBtnClass}>Amigos</Link>
                {/* Historial al final del bloque central */}
                <HeaderActions variant="nav" />
              </div>
            </nav>
          </div>

          <div className="flex justify-end">
             <HeaderActions variant="user" />
          </div>
        </header>

        <main className="relative min-h-screen pt-20 md:pt-24 font-sans">
          {children}
        </main>

        <ModalManager />
        <ChatWindow />
      </body>
    </html>
  );
}