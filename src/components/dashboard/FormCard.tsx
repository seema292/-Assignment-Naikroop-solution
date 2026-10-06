import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  Edit3,
  Eye,
  Copy,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
} from 'lucide-react';
import type { FormSchema } from '../../types/form.types';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

export interface FormCardProps {
  form: FormSchema;
  submissionCount: number;
  onDuplicate: (id: string) => void;
  onDelete: (form: FormSchema) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  submissionCount,
  onDuplicate,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
      data-testid={`form-card-${form.id}`}
    >
      {/* Top Banner Accent */}
      <div
        className={`h-1.5 w-full ${
          form.status === 'published' ? 'bg-indigo-600' : 'bg-amber-400'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header row: Status + Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge status={form.status} />

          {/* Action Menu button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open form actions menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-fade-in text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/edit/${form.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(`/preview/${form.id}`);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {t('common.preview')}
                  </button>
                  {form.status === 'published' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        window.open(`/forms/${form.id}`, '_blank');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      {t('common.open')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(form.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    {t('common.duplicate')}
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(form);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    {t('common.delete')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div
          className="cursor-pointer mb-4"
          onClick={() => navigate(`/edit/${form.id}`)}
        >
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
            {form.title || t('editor.untitled')}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 min-h-8">
            {form.description || 'No description provided.'}
          </p>
        </div>

        {/* Metadata info */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5" title="Last updated">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDateTime(form.updatedAt, i18n.language)}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/forms/${form.id}/submissions`);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium border border-slate-200/60"
            title="View submissions"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{submissionCount}</span>
          </button>
        </div>
      </div>

      {/* Card Quick Actions Footer */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(`/edit/${form.id}`)}
          className="text-xs font-medium text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 py-1 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {t('common.edit')}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/preview/${form.id}`)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-slate-200/60 transition-colors"
            title="Preview form"
          >
            <Eye className="w-3.5 h-3.5" />
            {t('common.preview')}
          </button>

          {form.status === 'published' && (
            <button
              type="button"
              onClick={() => navigate(`/forms/${form.id}`)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 py-1 px-2 rounded-md bg-indigo-50 hover:bg-indigo-100/70 transition-colors"
              title="Open public form"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t('common.open')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
