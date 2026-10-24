import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'zh-TW' | 'zh-CN';

// Define context type
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with stored language or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    console.log('Initial language from localStorage:', savedLanguage);
    
    // Validate the saved language
    if (savedLanguage === 'en' || savedLanguage === 'zh-TW' || savedLanguage === 'zh-CN') {
      return savedLanguage as Language;
    }
    return 'en';
  });

  // Store language in localStorage when it changes
  useEffect(() => {
    console.log('Language changed in context to:', language);
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
