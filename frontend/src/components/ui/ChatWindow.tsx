"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Shield } from 'lucide-react';

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFriend, setActiveFriend] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
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
      const { name, status } = e.detail;
      setActiveFriend(name);
      setIsOnline(status === 'online');
      setIsOpen(true);
      
      setAllConversations((prev: any) => {
        if (prev[name]) return prev;
        return {
          ...prev,
          [name]: [{
            sender: 'friend',
            text: `¡Saludos Maestro! Soy ${name}. ¿Listo para mover piezas?`,
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
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[999] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />

      <aside className={`chat-sidebar ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="p-8 border-b border-gold/20 flex justify-between items-center bg-gradient-to-b from-zinc-900 to-black relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gold/50" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`status-dot !static absolute -top-1 -right-1 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-600'}`} />
              <div className="w-12 h-12 rounded-xl bg-black border border-gold/30 flex items-center justify-center text-gold font-cinzel text-xl font-bold">
                {activeFriend?.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="text-white font-cinzel font-bold text-xl tracking-widest uppercase">{activeFriend || 'Chat'}</h3>
              <div className="chess-label !text-[8px] opacity-70">
                <Shield size={10} /> {isOnline ? 'Seguro' : 'Offline'}
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-gold transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar" ref={scrollRef}>
          {(activeFriend ? allConversations[activeFriend] || [] : []).map((msg: any, i: number) => (
            <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={msg.sender === 'me' ? 'chat-bubble-me' : 'chat-bubble-friend'}>
                <p className="select-text">{msg.text}</p>
                <span className={`text-[8px] mt-2 block font-black opacity-50 ${msg.sender === 'me' ? 'text-black' : 'text-gold'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <footer className="p-6 bg-black border-t border-gold/10">
          <form className="flex gap-2 bg-zinc-900/50 p-2 rounded-2xl border border-white/10 focus-within:border-gold/50" onSubmit={handleSend}>
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-transparent outline-none px-4 text-white text-sm placeholder:text-zinc-600"
              placeholder="ENVIAR MENSAJE..."
            />
            <button type="submit" disabled={!inputValue.trim()} className="bg-gold p-3 rounded-xl text-black transition-transform active:scale-90 disabled:opacity-20">
              <Send size={18} strokeWidth={2.5} />
            </button>
          </form>
        </footer>
      </aside>
    </>
  );
}