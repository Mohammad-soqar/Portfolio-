"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider"
      title={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={14} />
      <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
    </button>
  );
}
