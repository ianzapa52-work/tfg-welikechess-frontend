import React, { useState, useEffect } from 'react';
import ModalFrame from './ModalFrame';
import SettingsForm from '../SettingsForm';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import EloWindow from '../EloWindow';
import HistoryForm from '../HistoryForm';

export default function ModalManager() {
  const [activeModal, setActiveModal] = useState<'settings' | 'login' | 'register' | 'elo-info' | 'history' | null>(null);

  useEffect(() => {
    // Definición de disparadores
    const openSettings = () => setActiveModal('settings');
    const openLogin = () => setActiveModal('login');
    const openRegister = () => setActiveModal('register');
    const openElo = () => setActiveModal('elo-info');
    const openHistory = () => setActiveModal('history');
    const closeModals = () => setActiveModal(null);

    // Escucha de eventos personalizados
    window.addEventListener('open-settings', openSettings);
    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);
    window.addEventListener('open-elo-info', openElo);
    window.addEventListener('open-history', openHistory);
    window.addEventListener('close-modals', closeModals);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('open-settings', openSettings);
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
      window.removeEventListener('open-elo-info', openElo);
      window.removeEventListener('open-history', openHistory);
      window.removeEventListener('close-modals', closeModals);
    };
  }, []);

  return (
    <>
      {/* 1. Modal de Ajustes (Panel de Control) */}
      <ModalFrame 
        isOpen={activeModal === 'settings'} 
        onClose={() => setActiveModal(null)} 
        size="max-w-[115rem]"
      >
        <SettingsForm />
      </ModalFrame>

      {/* 2. Modal de Login (Popup Compacto) */}
      <ModalFrame 
        isOpen={activeModal === 'login'} 
        onClose={() => setActiveModal(null)} 
        size="max-w-lg"
      >
        <LoginForm onSwitchToRegister={() => setActiveModal('register')} />
      </ModalFrame>

      {/* 3. Modal de Registro (Popup Compacto) */}
      <ModalFrame 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)} 
        size="max-w-lg"
      >
        <RegisterForm onSwitchToLogin={() => setActiveModal('login')} />
      </ModalFrame>

      {/* 4. Modal de ELO (Información de Rango) */}
      <ModalFrame 
        isOpen={activeModal === 'elo-info'} 
        onClose={() => setActiveModal(null)} 
        size="max-w-5xl"
      >
        <EloWindow />
      </ModalFrame>

      {/* 5. Modal de Historial (PopUp Estilo Crónicas) */}
      <ModalFrame 
        isOpen={activeModal === 'history'} 
        onClose={() => setActiveModal(null)} 
        size="max-w-4xl"
      >
        <HistoryForm />
      </ModalFrame>
    </>
  );
}