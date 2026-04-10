import React, { useState, useEffect } from 'react';
import ModalFrame from './ModalFrame';
import LoginForm from '../LoginForm';
import SettingsForm from '../SettingsForm';

export default function ModalManager() {
  const [activeModal, setActiveModal] = useState<null | 'auth' | 'settings'>(null);

  useEffect(() => {
    const openAuth = () => setActiveModal('auth');
    const openSettings = () => setActiveModal('settings');
    const closeAll = () => setActiveModal(null);

    window.addEventListener('open-auth', openAuth);
    window.addEventListener('open-settings', openSettings);
    window.addEventListener('close-modals', closeAll);

    return () => {
      window.removeEventListener('open-auth', openAuth);
      window.removeEventListener('open-settings', openSettings);
      window.removeEventListener('close-modals', closeAll);
    };
  }, []);

  const close = () => setActiveModal(null);

  return (
    <>
      <ModalFrame isOpen={activeModal === 'auth'} onClose={close}>
        <div className="p-8"><LoginForm /></div>
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'settings'} onClose={close}>
        <div className="p-8"><SettingsForm /></div>
      </ModalFrame>
    </>
  );
}