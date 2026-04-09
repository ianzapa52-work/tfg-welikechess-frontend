import React, { useState, useEffect, useRef } from 'react';

interface Message {
  sender: 'me' | 'friend';
  text: string;
  time: string;
}

interface ChatStorage {
  [key: string]: Message[];
}

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFriend, setActiveFriend] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true); // Estado para controlar la conexión
  
  const [allConversations, setAllConversations] = useState<ChatStorage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('casino_chats');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // EFECTO: Cerrar con la tecla Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // EFECTO: Persistencia en LocalStorage
  useEffect(() => {
    localStorage.setItem('casino_chats', JSON.stringify(allConversations));
  }, [allConversations]);

  // EFECTO: Escuchar apertura de chat con estado de conexión
  useEffect(() => {
    const handleOpen = (e: any) => {
      const friendName = e.detail.name;
      const friendStatus = e.detail.status !== 'offline'; // Asume online si no se especifica 'offline'
      
      setActiveFriend(friendName);
      setIsOnline(friendStatus);
      setIsOpen(true);

      setAllConversations(prev => {
        if (prev[friendName]) return prev;
        return {
          ...prev,
          [friendName]: [{
            sender: 'friend',
            text: `La mesa está lista. ¿Una partida rápida, ${friendName}?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      });
    };

    window.addEventListener('open-chat', handleOpen);
    return () => window.removeEventListener('open-chat', handleOpen);
  }, []);

  // EFECTO: Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allConversations, isOpen, activeFriend]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeFriend) return;

    const newMessage: Message = {
      sender: 'me',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAllConversations(prev => ({
      ...prev,
      [activeFriend]: [...(prev[activeFriend] || []), newMessage]
    }));
    
    setInputValue('');
  };

  const currentMessages = activeFriend ? allConversations[activeFriend] || [] : [];

  return (
    <>
      <div className={`chat-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}></div>

      <aside className={`chat-drawer ${isOpen ? 'open' : ''}`}>
        <header className="chat-drawer-header">
          <div className="header-info">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
            <div className="header-text">
              <h3>{activeFriend || 'Mensajes'}</h3>
              <span className={`status-text ${isOnline ? '' : 'text-offline'}`}>
                {isOnline ? 'En línea ahora' : 'Desconectado'}
              </span>
            </div>
          </div>
          <button className="close-drawer-btn" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </header>

        <div className="chat-body custom-scrollbar" ref={scrollRef}>
          <div className="chat-timestamp">Hoy</div>
          {currentMessages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.sender}`}>
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <div className="chat-input-wrapper">
            <input 
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </form>
      </aside>

      <style>{`
        .chat-drawer-header {
          padding: 2rem 2.5rem;
          border-bottom: 2px solid var(--border-gold);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(212, 175, 55, 0.03);
        }
        .header-info { display: flex; align-items: center; gap: 18px; }
        
        .status-indicator {
          width: 14px; height: 14px;
          border-radius: 50%;
        }
        .status-indicator.online {
          background: #4ade80;
          box-shadow: 0 0 12px rgba(74, 222, 128, 0.6);
        }
        .status-indicator.offline {
          background: #6b7280;
          box-shadow: none;
        }

        .header-text h3 {
          margin: 0;
          font-family: 'Cinzel', serif;
          color: var(--gold-light);
          font-size: 1.5rem;
          letter-spacing: 1.5px;
        }
        .status-text {
          font-size: 0.9rem;
          color: #4ade80;
          font-family: 'Marcellus', serif;
          opacity: 0.9;
        }
        .status-text.text-offline {
          color: #9ca3af;
        }

        .close-drawer-btn {
          background: rgba(255,255,255,0.03);
          border: 1.5px solid var(--border-gold);
          color: var(--gold-primary);
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .close-drawer-btn:hover { transform: rotate(90deg); background: var(--gold-primary); color: black; }
        
        .chat-body {
          flex: 1;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow-y: auto;
        }
        .chat-timestamp {
          text-align: center;
          font-size: 0.85rem;
          color: var(--gold-primary);
          opacity: 0.5;
          text-transform: uppercase;
          letter-spacing: 3px;
          margin: 1.5rem 0;
        }
        .message-wrapper { display: flex; width: 100%; }
        .message-wrapper.me { justify-content: flex-end; }
        .message-wrapper.friend { justify-content: flex-start; }
        .message-bubble {
          max-width: 80%;
          padding: 15px 22px;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        .me .message-bubble {
          background: linear-gradient(135deg, var(--gold-dark), var(--gold-primary));
          color: black;
          border-bottom-right-radius: 4px;
        }
        .friend .message-bubble {
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid var(--border-gold);
          color: white;
          border-bottom-left-radius: 4px;
        }
        .message-text {
          margin: 0;
          font-family: 'Marcellus', serif;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .message-time {
          display: block;
          font-size: 0.8rem;
          margin-top: 8px;
          opacity: 0.7;
          text-align: right;
        }
        .chat-footer { padding: 2rem 2.5rem 2.5rem; background: rgba(0,0,0,0.2); }
        .chat-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid var(--border-gold);
          border-radius: 16px;
          padding: 8px 8px 8px 20px;
        }
        .chat-input-wrapper input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          padding: 12px 0;
          outline: none;
          font-family: 'Marcellus', serif;
          font-size: 1.2rem;
        }
        .chat-send-btn {
          background: var(--gold-primary);
          color: black;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}