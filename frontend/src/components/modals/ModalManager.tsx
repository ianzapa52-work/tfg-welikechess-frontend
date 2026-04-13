import React, { useState, useEffect } from 'react';
import ModalFrame from './ModalFrame';
import SettingsForm from '../SettingsForm';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import EloWindow from '../EloWindow';
import HistoryForm from '../HistoryForm';
import AvatarWindow from '../AvatarWindow';
import InviteWindow from '../InviteWindow';

export default function ModalManager() {
  const [activeModal, setActiveModal] = useState<'settings' | 'login' | 'register' | 'elo-info' | 'history' | 'avatar' | 'invite' | null>(null);

  useEffect(() => {
    const openSettings = () => setActiveModal('settings');
    const openLogin = () => setActiveModal('login');
    const openRegister = () => setActiveModal('register');
    const openElo = () => setActiveModal('elo-info');
    const openHistory = () => setActiveModal('history');
    const openAvatar = () => setActiveModal('avatar');
    const openInvite = () => setActiveModal('invite');
    const closeModals = () => setActiveModal(null);

    window.addEventListener('open-settings', openSettings);
    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);
    window.addEventListener('open-elo-info', openElo);
    window.addEventListener('open-history', openHistory);
    window.addEventListener('open-avatar', openAvatar);
    window.addEventListener('open-invite', openInvite);
    window.addEventListener('close-modals', closeModals);

    return () => {
      window.removeEventListener('open-settings', openSettings);
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
      window.removeEventListener('open-elo-info', openElo);
      window.removeEventListener('open-history', openHistory);
      window.removeEventListener('open-avatar', openAvatar);
      window.removeEventListener('open-invite', openInvite);
      window.removeEventListener('close-modals', closeModals);
    };
  }, []);

  return (
    <>
      <ModalFrame isOpen={activeModal === 'settings'} onClose={() => setActiveModal(null)} size="max-w-6xl">
        <SettingsForm />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'login'} onClose={() => setActiveModal(null)} size="max-w-lg">
        <LoginForm onSwitchToRegister={() => setActiveModal('register')} />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'register'} onClose={() => setActiveModal(null)} size="max-w-lg">
        <RegisterForm onSwitchToLogin={() => setActiveModal('login')} />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'elo-info'} onClose={() => setActiveModal(null)} size="max-w-5xl">
        <EloWindow />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'history'} onClose={() => setActiveModal(null)} size="max-w-4xl">
        <HistoryForm />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'avatar'} onClose={() => setActiveModal(null)} size="max-w-5xl">
        <AvatarWindow />
      </ModalFrame>

      <ModalFrame isOpen={activeModal === 'invite'} onClose={() => setActiveModal(null)} size="max-w-lg">
        <InviteWindow />
      </ModalFrame>
    </>
  );
}