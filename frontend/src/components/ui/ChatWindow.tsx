"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Shield, ChevronRight } from 'lucide-react';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFriend, setActiveFriend] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [allConversations, setAllConversations] = useState<any>({});
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('casino_chats_v2');
    if (saved) setAllConversations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleOpen = (e: any) => {
      const { name } = e.detail;
      setActiveFriend(name);
      setIsOpen(true);

      const friendsRaw = localStorage.getItem('chess_friends');
      if (friendsRaw) {
        const friendsList = JSON.parse(friendsRaw);
        const friendData = friendsList.find((f: any) => f.name === name);
        setIsOnline(friendData ? friendData.online : false);
      }
      
      setAllConversations((prev: any) => {
        if (prev[name]) return prev;
        return {
          ...prev,
          [name]: [{
            sender: 'friend',
            text: `¡Saludos Maestro! Soy ${name}. ¿Listo para una lección en el tablero?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      });
    };

    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, [mounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [allConversations, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeFriend) return;

    const newMessage = {
      sender: 'me',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = { ...allConversations, [activeFriend]: [...(allConversations[activeFriend] || []), newMessage] };
    setAllConversations(updated);
    localStorage.setItem('casino_chats_v2', JSON.stringify(updated));
    setInputValue('');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay con desenfoque cinematográfico */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[998] transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />

      <aside className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#050505] border-l border-gold/20 z-[999] shadow-[-20px_0_50px_rgba(0,0,0,0.9)] flex flex-col transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header Estilo "Grandmaster" */}
        <header className="p-6 border-b border-gold/10 bg-gradient-to-r from-zinc-900 via-black to-zinc-900 relative">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className={`absolute -inset-1 rounded-full blur-sm transition-opacity ${isOnline ? 'bg-green-500/30 opacity-100' : 'opacity-0'}`} />
                <div className="relative w-14 h-14 rounded-full bg-zinc-900 border-2 border-gold/40 flex items-center justify-center text-gold font-serif text-2xl font-bold shadow-2xl">
                  {activeFriend?.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${isOnline ? 'bg-green-500' : 'bg-zinc-600'}`} />
              </div>

              <div>
                <h3 className="text-white font-serif font-medium text-2xl tracking-tight leading-tight italic">
                  {activeFriend || 'Chat'}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Shield size={12} className={isOnline ? 'text-gold' : 'text-zinc-600'} />
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-zinc-400 uppercase">
                    {isOnline ? 'Canal Seguro' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)} 
              className="group p-2 hover:bg-white/5 rounded-full transition-all"
            >
              <X size={24} className="text-zinc-500 group-hover:text-gold group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>
        </header>

        {/* Área de Mensajes */}
        <div 
          className="flex-grow overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
          ref={scrollRef}
        >
          {(activeFriend ? allConversations[activeFriend] || [] : []).map((msg: any, i: number) => (
            <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] font-sans leading-relaxed shadow-lg
                ${msg.sender === 'me' 
                  ? 'bg-gold text-black rounded-tr-none font-medium' 
                  : 'bg-zinc-900 text-zinc-100 border border-white/5 rounded-tl-none'}`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] mt-2 font-bold tracking-tighter text-zinc-500 uppercase px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Input con estilo "Tactical" */}
        <footer className="p-6 bg-zinc-950 border-t border-gold/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <form 
            className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-5 rounded-full focus-within:border-gold/40 focus-within:bg-white/10 transition-all group"
            onSubmit={handleSend}
          >
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-transparent outline-none text-white text-sm font-sans placeholder:text-zinc-600"
              placeholder="Escribe un mensaje..."
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim()} 
              className="bg-gold hover:bg-white text-black p-3 rounded-full transition-all active:scale-95 disabled:opacity-10 disabled:grayscale"
            >
              <Send size={18} strokeWidth={2.5} />
            </button>
          </form>
          <div className="mt-4 flex justify-center">
            <p className="text-[8px] text-zinc-600 font-bold tracking-[0.3em] uppercase">Encriptación de extremo a extremo</p>
          </div>
        </footer>
      </aside>
    </>
  );
}