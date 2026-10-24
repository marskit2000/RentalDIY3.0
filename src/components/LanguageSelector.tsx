import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { t } from '../translations';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="language-selector">
      <select value={language} onChange={handleLanguageChange}>
        <option value="en">{t(language, 'english')}</option>
        <option value="zh-TW">{t(language, 'traditionalChinese')}</option>
        <option value="zh-CN">{t(language, 'simplifiedChinese')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
