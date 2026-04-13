import React, { useState } from 'react';
import { Link as LinkIcon, Check, MoreHorizontal } from 'lucide-react';

export default function InviteWindow() {
  const [copySuccess, setCopySuccess] = useState(false);
  const inviteLink = "https://welikechess.com/invite/user_elite_77"; //de prueba ahora

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Función para compartir (API nativa en caso de estar disponible)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'We Like Chess', url: inviteLink });
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] rounded-3xl border border-white/5 shadow-2xl max-w-md mx-auto">
      {/* Cabecera */}
      <div className="mb-10 text-center">
        <h2 className="text-[#d4af37] font-['Cinzel'] text-3xl font-black tracking-[0.2em] uppercase">
          Invitar Amigos
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-[1px] w-8 bg-[#d4af37]/30"></div>
          <p className="text-zinc-500 text-[10px] font-sans tracking-[0.3em] uppercase italic">
            Protocolo de Reclutamiento
          </p>
          <div className="h-[1px] w-8 bg-[#d4af37]/30"></div>
        </div>
      </div>

      <div className="space-y-10">
        {/* Sección del Enlace */}
        <div className="space-y-3">
          <label className="text-[10px] text-[#d4af37] font-black tracking-[0.3em] uppercase ml-1 opacity-60">
            Link de Afiliado
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-[#d4af37]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex gap-2">
              <div className="flex-grow bg-black/40 border border-white/10 backdrop-blur-md rounded-2xl px-5 py-4 text-zinc-300 text-sm font-mono flex items-center overflow-hidden">
                <span className="truncate opacity-80">{inviteLink}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`px-6 rounded-2xl transition-all duration-300 flex items-center justify-center border shadow-xl active:scale-95 cursor-pointer ${
                  copySuccess 
                  ? 'bg-green-500/10 border-green-500 text-green-500' 
                  : 'bg-[#d4af37] border-[#d4af37]/50 text-black hover:bg-[#f3cc5a] font-bold'
                }`}
              >
                {copySuccess ? <Check size={20} /> : <LinkIcon size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
          {copySuccess && (
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest text-center animate-pulse">
              ¡Enlace copiado al portapapeles!
            </p>
          )}
        </div>

        {/* Sección de Redes */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-center text-[9px] text-zinc-500 font-bold tracking-[0.5em] uppercase mb-8">
            Desplegar en Redes
          </p>
          
          <div className="grid grid-cols-4 gap-y-8 gap-x-4">
            <SocialBtn 
              label="WhatsApp" 
              color="hover:bg-[#25D366]" 
              icon={<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 7.454c-1.679 0-3.325-.453-4.764-1.309l-.341-.202-3.542.928.945-3.455-.222-.353c-.933-1.485-1.426-3.197-1.426-4.953 0-5.144 4.186-9.33 9.33-9.33 2.49 0 4.83.97 6.591 2.731 1.761 1.761 2.731 4.101 2.731 6.591 0 5.146-4.188 9.332-9.333 9.332" />} 
            />
            <SocialBtn 
              label="Telegram" 
              color="hover:bg-[#26A5E4]" 
              icon={<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.303.48-.429-.012-1.253-.245-1.865-.444-.753-.245-1.351-.374-1.299-.79.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />} 
            />
            <SocialBtn 
              label="X / Twitter" 
              color="hover:bg-white hover:text-black" 
              icon={<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />} 
            />
            <SocialBtn 
              label="Facebook" 
              color="hover:bg-[#1877F2]" 
              icon={<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />} 
            />
            <SocialBtn 
              label="Reddit" 
              color="hover:bg-[#FF4500]" 
              icon={<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.423.06.637 0 2.506-3.497 4.548-7.81 4.548-4.314 0-7.811-2.042-7.811-4.548 0-.213.021-.426.06-.637a1.75 1.75 0 0 1-1.056-1.597c0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.465 1.209-.846 2.84-1.398 4.638-1.482l.893-4.203a.215.215 0 0 1 .17-.168l2.82-.592c.033-.01.066-.015.1-.015zm-8.233 7.87c-.793 0-1.43.638-1.43 1.429 0 .793.637 1.43 1.43 1.43.792 0 1.428-.637 1.428-1.43 0-.791-.636-1.429-1.428-1.429zm6.446 0c-.793 0-1.43.638-1.43 1.429 0 .793.637 1.43 1.43 1.43.793 0 1.43-.637 1.43-1.43 0-.791-.637-1.429-1.43-1.429zm-6.49 3.733c-.093 0-.174.054-.208.135-.1.256-.133.473-.103.662.06.39.39.613.95.773a4.95 4.95 0 0 0 1.39.19c.46 0 .902-.073 1.314-.21.54-.18.831-.417.87-.797.02-.193-.026-.408-.124-.662a.217.217 0 0 0-.202-.133h-3.892z" />} 
            />
            <SocialBtn 
              label="Messenger" 
              color="hover:bg-[#00B2FF]" 
              icon={<path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.74 6.62 4.47 8.65V24l4.08-2.24c1.09.3 2.24.46 3.45.46 6.63 0 12-4.97 12-11.11C24 4.97 18.63 0 12 0zm1.29 14.99l-3.07-3.28-5.99 3.28 6.59-7 3.07 3.28 5.99-3.28-6.59 7z" />} 
            />
            <SocialBtn 
              label="LinkedIn" 
              color="hover:bg-[#0A66C2]" 
              icon={<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />} 
            />
            <div onClick={handleShare}>
                <SocialBtn 
                label="Más" 
                color="hover:bg-zinc-700" 
                icon={<MoreHorizontal size={24} />} 
                isLucide 
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, color, label, isLucide = false }: { icon: React.ReactNode; color: string; label: string; isLucide?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
      <div className={`
        w-12 h-12 flex items-center justify-center rounded-2xl 
        bg-zinc-900/50 border border-white/5 text-zinc-500
        transition-all duration-300 transform 
        group-hover:scale-110 group-hover:-translate-y-1 group-hover:text-white
        ${color} group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]
      `}>
        {isLucide ? icon : (
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-5 h-5 transition-colors"
          >
            {icon}
          </svg>
        )}
      </div>
      <span className="text-[7px] text-zinc-600 font-black uppercase tracking-[0.2em] group-hover:text-[#d4af37] transition-colors text-center leading-tight">
        {label}
      </span>
    </div>
  );
}