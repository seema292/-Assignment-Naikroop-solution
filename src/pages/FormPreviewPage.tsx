import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { FormSchema } from '../types/form.types';
import { storageService } from '../services/storageService';
import { DynamicFormRenderer } from '../components/preview/DynamicFormRenderer';
import { Button } from '../components/common/Button';
import { LanguageSelector } from '../components/common/LanguageSelector';

export const FormPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState<FormSchema | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!id) return;
    const loaded = storageService.getFormById(id);
    if (!loaded) {
      navigate('/');
      return;
    }
    setForm(loaded);
  }, [id, navigate]);

  const handleTestSubmit = (data: Record<string, any>) => {
    if (!form) return;
    // Persist as test preview submission
    storageService.saveSubmission(form.id, data);
    setSubmittedData(data);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const deviceWidthClasses = {
    desktop: 'max-w-3xl',
    tablet: 'max-w-lg',
    mobile: 'max-w-sm',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900/95 text-slate-100">
      {/* Top Banner Toolbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/edit/${form.id}`)}
          >
            {t('preview.exitPreview')}
          </Button>
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{t('preview.banner')}</span>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              deviceView === 'desktop'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop view (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              deviceView === 'tablet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
              deviceView === 'mobile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile view (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 flex justify-center p-4 sm:p-10 overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        <div
          className={`w-full ${deviceWidthClasses[deviceView]} transition-all duration-300 my-auto`}
        >
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-12 min-h-[550px] my-4">
            {submittedData ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {t('public.successTitle')}
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {form.settings?.successMessage || t('public.successMessage')}
                </p>
                <p className="text-xs text-indigo-600 font-semibold bg-indigo-50 py-1 px-3 rounded-full inline-block">
                  (Test submission successfully saved)
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmittedData(null)}
                  >
                    {t('public.submitAnother')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/forms/${form.id}/submissions`)}
                  >
                    View Responses
                  </Button>
                </div>
              </div>
            ) : (
              <DynamicFormRenderer
                form={form}
                onSubmit={handleTestSubmit}
                isPreview={true}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
