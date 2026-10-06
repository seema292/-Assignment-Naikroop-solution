import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Layers,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-md mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-slate-100">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group focus:outline-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                {t('brand.name')}
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('brand.tagline')}. Experience the simplicity of writing a document paired with the dynamic power of modern form engines.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Offline-First & Local Storage Active</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Product Features</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Document-Style Canvas</span>
              </li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5">
                <span>13+ Dynamic Field Blocks</span>
              </li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Real-Time Debounced Autosave</span>
              </li>
              <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1.5">
                <span>Responsive Viewport Emulator</span>
              </li>
            </ul>
          </div>

          {/* Architecture & Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Engineering Stack</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>React 19 & TypeScript</li>
              <li>Tailwind CSS & Lucide Icons</li>
              <li>React Hook Form & Zod Validations</li>
              <li>i18next (English & Hindi)</li>
              <li>Vitest & React Testing Library</li>
            </ul>
          </div>

          {/* Internationalization & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Localization</span>
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              FormCraft seamlessly supports bilingual localization in English and Hindi with localized Intl formatting.
            </p>
            <div className="pt-1">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {currentYear} FormCraft.</span>
            <span>Inspired by Tally.so.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-slate-600">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Naikroop Solutions Assessment
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-slate-600 transition-colors flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Client-Side Persistence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
