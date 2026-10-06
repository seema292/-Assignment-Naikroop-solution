import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Menu,
  X,
  LayoutTemplate,
  Layers,
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './Button';

export interface NavbarProps {
  onCreateForm?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateForm }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-hidden"
              aria-label="FormCraft Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/35 transition-all duration-200">
                <Layers className="w-5 h-5 transition-transform group-hover:rotate-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-900 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5 hidden sm:flex items-center gap-1">
                  <span>Document Form Builder</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-indigo-600 font-semibold">Tally-inspired</span>
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1.5 pl-4 border-l border-slate-200/80">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isDashboard
                    ? 'text-indigo-600 bg-indigo-50/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t('nav.forms')}
              </Link>
            </nav>
          </div>

          {/* Desktop Right Side Controls */}
          <div className="hidden md:flex items-center gap-3">
            <div className="mr-1">
              <LanguageSelector />
            </div>

            {onCreateForm && (
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={onCreateForm}
                id="navbar-create-form-btn"
                className="shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 font-medium"
              >
                {t('dashboard.createNew')}
              </Button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector compact />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-xl animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            {t('nav.forms')}
          </Link>
          {onCreateForm && (
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                className="w-full shadow-md shadow-indigo-600/20"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onCreateForm();
                }}
              >
                {t('dashboard.createNew')}
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
