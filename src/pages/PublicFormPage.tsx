import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertCircle,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { FormSchema } from '../types/form.types';
import { storageService } from '../services/storageService';
import { DynamicFormRenderer } from '../components/preview/DynamicFormRenderer';
import { Button } from '../components/common/Button';
import { LanguageSelector } from '../components/common/LanguageSelector';

export const PublicFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const loaded = storageService.getFormById(id);
    setForm(loaded);
    setLoading(false);
  }, [id]);

  const handleSubmitResponse = async (data: Record<string, any>) => {
    if (!form) return;
    // Persist submission response
    storageService.saveSubmission(form.id, data);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf9] p-4 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Form Not Found</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          The requested form ID does not exist or may have been deleted.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/')}>
          {t('common.returnHome')}
        </Button>
      </div>
    );
  }

  // If form is in Draft status and not Published
  if (form.status === 'draft') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf9] p-4 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {t('public.inactiveTitle')}
        </h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          {t('public.inactiveMessage')}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            {t('common.returnHome')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/edit/${form.id}`)}
          >
            Edit in FormCraft
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-50 via-indigo-50/20 to-stone-50">
      {/* Discreet Header with FormCraft Brand + Language Bar */}
      <header className="max-w-3xl w-full mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
            {t('brand.name')}
          </span>
        </Link>
        <LanguageSelector compact />
      </header>

      {/* Main Form Content Canvas */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-6 sm:p-12 transition-all">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('public.successTitle')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                {form.settings?.successMessage || t('public.successMessage')}
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => setSubmitted(false)}
                >
                  {t('public.submitAnother')}
                </Button>
                <Link
                  to="/"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Return to FormCraft Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <DynamicFormRenderer
              form={form}
              onSubmit={handleSubmitResponse}
              isPreview={false}
            />
          )}
        </div>

        {/* Clean Footer Note */}
        <footer className="mt-8 text-center pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span>{t('public.poweredBy')}</span>
          </Link>
        </footer>
      </main>
    </div>
  );
};
