import { en } from './en';
import { zhTW } from './zh-TW';
import { zhCN } from './zh-CN';
import { Language } from '../contexts/LanguageContext';

// Export all translations
export const translations = {
  'en': en,
  'zh-TW': zhTW,
  'zh-CN': zhCN
};

// Helper function to get translations based on current language
export const getTranslation = (language: Language) => {
  return translations[language];
};

// Helper function to get a specific translation key
export const t = (language: Language, key: string): string => {
  const translationObj = translations[language];
  return translationObj[key as keyof typeof translationObj] || key;
};
