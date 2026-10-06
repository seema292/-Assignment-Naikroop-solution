import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Info,
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
    <div className="min-h-screen flex flex-col bg-stone-100/70">
      {/* Top Banner Toolbar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/edit/${form.id}`)}
          >
            {t('preview.exitPreview')}
          </Button>
          <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">{t('preview.banner')}</span>
          </div>
        </div>

        {/* Center: Device Switcher */}
        <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceView === 'desktop'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop view (100%)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceView === 'tablet'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-md transition-colors ${
              deviceView === 'mobile'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile view (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto">
        <div
          className={`w-full ${deviceWidthClasses[deviceView]} transition-all duration-300`}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-12 min-h-[600px] my-4">
            {submittedData ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {t('public.successTitle')}
                </h2>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  {form.settings?.successMessage || t('public.successMessage')}
                </p>
                <p className="text-xs text-indigo-600 font-medium">
                  (Test submission saved to responses)
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
