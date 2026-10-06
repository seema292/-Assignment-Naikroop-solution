import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Layers,
  FileCheck2,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Zap,
  ClipboardList,
  UserCheck,
  CalendarDays,
  Send,
} from 'lucide-react';
import type { FormSchema } from '../types/form.types';
import { storageService } from '../services/storageService';
import { createBlock } from '../utils/blockRegistry';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { FormCard } from '../components/dashboard/FormCard';
import { FormEmptyState } from '../components/dashboard/FormEmptyState';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [forms, setForms] = useState<FormSchema[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [formToDelete, setFormToDelete] = useState<FormSchema | null>(null);

  // Load forms on mount
  const refreshForms = () => {
    const loaded = storageService.getAllForms();
    setForms(loaded);
  };

  useEffect(() => {
    refreshForms();
  }, []);

  const handleCreateForm = () => {
    const newForm = storageService.createForm({
      title: 'Untitled Form',
      description: 'Write a description or instructions for your respondents...',
      status: 'draft',
    });
    navigate(`/edit/${newForm.id}`);
  };

  // Quick Template generator
  const handleCreateFromTemplate = (templateType: 'feedback' | 'job' | 'event' | 'contact') => {
    let title = 'New Form';
    let description = '';
    let blocks = [];

    if (templateType === 'feedback') {
      title = 'Customer Experience & NPS Survey';
      description = 'Help us improve our service by providing 2 minutes of feedback.';
      blocks = [
        createBlock('heading'),
        createBlock('rating'),
        createBlock('shortText'),
        createBlock('multipleChoice'),
        createBlock('longText'),
        createBlock('submitButton'),
      ];
    } else if (templateType === 'job') {
      title = 'Software Engineer Application';
      description = 'We are excited to learn more about your engineering background.';
      blocks = [
        createBlock('heading'),
        createBlock('shortText'),
        createBlock('email'),
        createBlock('dropdown'),
        createBlock('longText'),
        createBlock('singleCheckbox'),
        createBlock('submitButton'),
      ];
    } else if (templateType === 'event') {
      title = 'Annual Tech Summit 2026 RSVP';
      description = 'Reserve your in-person or virtual ticket for our upcoming keynote.';
      blocks = [
        createBlock('heading'),
        createBlock('shortText'),
        createBlock('email'),
        createBlock('date'),
        createBlock('multipleCheckboxes'),
        createBlock('submitButton'),
      ];
    } else {
      title = 'General Inquiry & Support Form';
      description = 'Have a question? Our team typically responds within 24 hours.';
      blocks = [
        createBlock('heading'),
        createBlock('shortText'),
        createBlock('email'),
        createBlock('longText'),
        createBlock('singleCheckbox'),
        createBlock('submitButton'),
      ];
    }

    const created = storageService.createForm({
      title,
      description,
      status: 'draft',
      blocks,
    });
    navigate(`/edit/${created.id}`);
  };

  const handleDuplicate = (id: string) => {
    const dup = storageService.duplicateForm(id);
    if (dup) {
      refreshForms();
    }
  };

  const handleDeleteConfirm = () => {
    if (formToDelete) {
      storageService.deleteForm(formToDelete.id);
      setFormToDelete(null);
      refreshForms();
    }
  };

  // Submission count map for fast lookup
  const submissionCounts = useMemo(() => {
    const map: Record<string, number> = {};
    forms.forEach((f) => {
      map[f.id] = storageService.getSubmissionCount(f.id);
    });
    return map;
  }, [forms]);

  // Filtered forms
  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchesSearch =
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        form.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : form.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [forms, searchQuery, statusFilter]);

  // Overall statistics
  const totalSubmissions = useMemo(() => {
    return Object.values(submissionCounts).reduce((a, b) => a + b, 0);
  }, [submissionCounts]);

  const publishedCount = useMemo(() => {
    return forms.filter((f) => f.status === 'published').length;
  }, [forms]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]/80 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onCreateForm={handleCreateForm} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl">
          {/* Subtle Decorative Background Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-medium backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Next-Gen Document Form Builder</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Create beautiful forms as easily as writing a doc.
              </h1>
              <p className="text-sm sm:text-base text-indigo-100/80 leading-relaxed font-light">
                {t('dashboard.subtitle')} Powered by dynamic schemas, multi-device previews, and client-side persistence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                variant="primary"
                size="lg"
                icon={<Plus className="w-4 h-4" />}
                onClick={handleCreateForm}
                id="dashboard-create-btn"
                className="bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25 border-none font-semibold"
              >
                {t('dashboard.createNew')}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Start Templates Shelf */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Quick-Start From Templates</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <button
              type="button"
              onClick={() => handleCreateFromTemplate('feedback')}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-md transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ClipboardList className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Feedback & NPS
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Rating score, choices & notes
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleCreateFromTemplate('job')}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-violet-400 shadow-2xs hover:shadow-md transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                Job Application
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Candidate details & dropdowns
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleCreateFromTemplate('event')}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <CalendarDays className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Event RSVP
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Dates, checkboxes & guests
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleCreateFromTemplate('contact')}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-md transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                Contact & Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                Clean email & questions
              </p>
            </button>
          </div>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Forms</p>
              <p className="text-2xl font-extrabold text-slate-900">{forms.length}</p>
              <span className="text-[11px] text-slate-500">Stored in localStorage</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-indigo-100/80 text-indigo-600 flex items-center justify-center shadow-xs">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('dashboard.filterPublished')}</p>
              <p className="text-2xl font-extrabold text-slate-900">{publishedCount}</p>
              <span className="text-[11px] text-emerald-600 font-medium">Accepting live responses</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-50 to-emerald-100/80 text-emerald-600 flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Responses</p>
              <p className="text-2xl font-extrabold text-slate-900">{totalSubmissions}</p>
              <span className="text-[11px] text-indigo-600 font-medium">Ready for analytics export</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-50 to-amber-100/80 text-amber-600 flex items-center justify-center shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              aria-label="Search forms"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded-md hover:bg-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('dashboard.filterAll')} ({forms.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('dashboard.filterPublished')} ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('dashboard.filterDrafts')} ({forms.length - publishedCount})
            </button>
          </div>
        </div>

        {/* Forms Grid or Empty State */}
        {filteredForms.length === 0 ? (
          <FormEmptyState
            onCreate={handleCreateForm}
            isSearchFiltered={Boolean(searchQuery || statusFilter !== 'all')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                submissionCount={submissionCounts[form.id] || 0}
                onDuplicate={handleDuplicate}
                onDelete={(f) => setFormToDelete(f)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Form Confirmation Modal */}
      <Modal
        isOpen={Boolean(formToDelete)}
        onClose={() => setFormToDelete(null)}
        title={t('dashboard.confirmDeleteTitle')}
        maxWidth="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFormToDelete(null)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-700">
              {t('dashboard.confirmDeleteMessage', {
                title: formToDelete?.title || 'this form',
              })}
            </p>
            <p className="text-xs text-rose-600 mt-2 font-medium">
              This action cannot be undone. All responses associated with this form will also be deleted.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modern SaaS Footer */}
      <Footer />
    </div>
  );
};
