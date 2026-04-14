"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementToast() {
  const [notification, setNotification] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleAchievement = useCallback((e: any) => {
    setNotification(null);
    requestAnimationFrame(() => {
      setNotification(e.detail);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('puzzle-solved', handleAchievement);
    return () => window.removeEventListener('puzzle-solved', handleAchievement);
  }, [handleAchievement]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {notification && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
            className="relative text-center z-10"
          >
            <h2 className="text-[#f1c40f] font-black text-6xl md:text-8xl italic mb-2 tracking-tighter">
              ¡EXCELENTE!
            </h2>
            <p className="text-white text-xl font-medium tracking-widest uppercase">
              {notification}
            </p>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-6xl mt-8"
            >
              🏆
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}