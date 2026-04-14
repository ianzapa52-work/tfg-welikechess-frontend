"use client";

import { useState } from 'react';
import SettingsForm from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-7xl bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] overflow-hidden">
        
        <SettingsForm onClose={() => setIsOpen(false)} />
        
      </div>
    </main>
  );
}