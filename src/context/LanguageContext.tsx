'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationDict } from '../lib/translations';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  t: TranslationDict;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language preference from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('realityos_language') as Language;
      if ((storedLang === 'en' || storedLang === 'ur') && storedLang !== language) {
        React.startTransition(() => {
          setLanguageState(storedLang);
        });
      }
    }
  }, [language]);

  // Update layout direction dynamically when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      if (language === 'ur') {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('rtl-active');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('rtl-active');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('realityos_language', lang);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
