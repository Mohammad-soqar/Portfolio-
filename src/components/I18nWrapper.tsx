"use client";
import React, { useEffect, useState } from 'react';
import '@/lib/i18n';
import i18n from '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export default function I18nWrapper({ children }: { children: React.ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    i18nInstance.on('languageChanged', handleLanguageChange);
    
    // Initial set
    handleLanguageChange(i18nInstance.language);

    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  // Avoid hydration mismatch by not rendering until mounted if needed, 
  // but for a simple wrap it's usually fine to just render.
  return <>{children}</>;
}
