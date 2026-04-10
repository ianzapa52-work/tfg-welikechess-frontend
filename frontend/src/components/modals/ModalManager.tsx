import React, { useState, useEffect } from 'react';
import ModalFrame from './ModalFrame';
import SettingsForm from '../SettingsForm';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

export default function ModalManager() {
  const [activeModal, setActiveModal] = useState<'settings' | 'login' | 'register' | null>(null);

  useEffect(() => {
    const openSettings = () => setActiveModal('settings');
    const openLogin = () => setActiveModal('login');
    const openRegister = () => setActiveModal('register');
    const closeModals = () => setActiveModal(null);

    window.addEventListener('open-settings', openSettings);
    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);
    window.addEventListener('close-modals', closeModals);

    return () => {
      window.removeEventListener('open-settings', openSettings);
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
      window.removeEventListener('close-modals', closeModals);
    };
  }, []);

  return (
    <>
      <ModalFrame isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)}>
        <SettingsForm />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)}>
        <LoginForm 
          onSwitchToRegister={() => setActiveModal('register')} 
        />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)}>
        <RegisterForm 
          onSwitchToLogin={() => setActiveModal('login')} 
        />
      </ModalFrame>
    </>
  );
}