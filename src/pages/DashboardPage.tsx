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
} from 'lucide-react';
import type { FormSchema } from '../types/form.types';
import { storageService } from '../services/storageService';
import { Navbar } from '../components/common/Navbar';
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
      description: 'Tell your respondents what this form is about.',
      status: 'draft',
    });
    navigate(`/edit/${newForm.id}`);
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
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <Navbar onCreateForm={handleCreateForm} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateForm}
              id="dashboard-create-btn"
            >
              {t('dashboard.createNew')}
            </Button>
          </div>
        </div>

        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Forms</p>
              <p className="text-xl font-bold text-slate-900">{forms.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{t('dashboard.filterPublished')}</p>
              <p className="text-xl font-bold text-slate-900">{publishedCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Collected Responses</p>
              <p className="text-xl font-bold text-slate-900">{totalSubmissions}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              aria-label="Search forms"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('dashboard.filterAll')} ({forms.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t('dashboard.filterPublished')} ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'draft'
                  ? 'bg-amber-500 text-white shadow-2xs'
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
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};
