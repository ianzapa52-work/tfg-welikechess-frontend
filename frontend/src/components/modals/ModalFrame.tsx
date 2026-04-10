import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: string; // Nueva prop para controlar el ancho
}

export default function ModalFrame({ isOpen, onClose, children, size = "max-w-[115rem]" }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* FONDO OSCURO */}
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 cursor-pointer"
          />
          
          {/* TARJETA PRINCIPAL - El ancho ahora es dinámico con {size} */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className={`relative w-full ${size} bg-[#050505] border border-[#d4af37]/30 rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,1)] overflow-hidden z-10`}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-zinc-600 hover:text-[#d4af37] transition-all z-20 hover:rotate-90 scale-125 md:scale-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}