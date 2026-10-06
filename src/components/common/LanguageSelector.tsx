import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 text-xs text-slate-600">
      <Globe className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          className={`px-2 py-1 rounded-md font-medium transition-colors ${
            i18n.language === 'en'
              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-label="Switch to English"
        >
          {compact ? 'EN' : 'English'}
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange('hi')}
          className={`px-2 py-1 rounded-md font-medium transition-colors ${
            i18n.language === 'hi'
              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-label="Switch to Hindi"
        >
          {compact ? 'HI' : 'हिंदी'}
        </button>
      </div>
    </div>
  );
};
