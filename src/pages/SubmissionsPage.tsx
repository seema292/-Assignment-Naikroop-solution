import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Download,
  Trash2,
  Clock,
  ExternalLink,
  Copy,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { FormSchema, FormSubmission } from '../types/form.types';
import { storageService } from '../services/storageService';
import { formatDateTime } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const SubmissionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState<FormSchema | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = () => {
    if (!id) return;
    const loadedForm = storageService.getFormById(id);
    if (!loadedForm) {
      navigate('/');
      return;
    }
    setForm(loadedForm);
    const loadedSubs = storageService.getSubmissions(id);
    setSubmissions(loadedSubs);
  };

  useEffect(() => {
    loadData();
  }, [id, navigate]);

  const handleDeleteSubmission = (subId: string) => {
    if (window.confirm('Delete this response?')) {
      storageService.deleteSubmission(subId);
      loadData();
      if (selectedSubmission?.id === subId) {
        setSelectedSubmission(null);
      }
    }
  };

  // Export responses as JSON file
  const handleExportJson = () => {
    if (!form || submissions.length === 0) return;
    const blob = new Blob([JSON.stringify(submissions, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.title.replace(/\s+/g, '_')}_submissions.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Get question blocks (filter out layout blocks like heading, paragraph, submitButton)
  const questionBlocks = form.blocks.filter(
    (b) => b.type !== 'heading' && b.type !== 'paragraph' && b.type !== 'submitButton'
  );

  const publicUrl = `${window.location.origin}/forms/${form.id}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]/80">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Breadcrumbs & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link to="/" className="hover:text-indigo-600 font-medium transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to={`/edit/${form.id}`} className="hover:text-indigo-600 font-medium transition-colors">
                {form.title}
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Responses</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {form.title}
              </h1>
              <Badge status={form.status} />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('submissions.totalCount', { count: submissions.length })}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate(`/edit/${form.id}`)}
            >
              {t('submissions.backToForm')}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Copy className="w-4 h-4" />}
              onClick={copyUrl}
            >
              {copiedLink ? t('common.copied') : t('submissions.copyFormUrl')}
            </Button>

            {submissions.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportJson}
                className="shadow-md shadow-indigo-600/20"
              >
                {t('submissions.exportJson')}
              </Button>
            )}
          </div>
        </div>

        {/* Content: Empty State or Submissions Table */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-50 to-indigo-100/90 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t('submissions.emptyTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {t('submissions.emptySubtitle')}
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={copyUrl}
              >
                {t('submissions.copyFormUrl')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<ExternalLink className="w-3.5 h-3.5" />}
                onClick={() => window.open(`/forms/${form.id}`, '_blank')}
                className="shadow-md shadow-indigo-600/20"
              >
                Test Fill Form
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                    <th className="py-3.5 px-4 font-bold w-12 text-center">#</th>
                    <th className="py-3.5 px-4 font-bold w-48">
                      {t('submissions.submittedAt')}
                    </th>
                    {questionBlocks.map((block) => (
                      <th
                        key={block.id}
                        className="py-3.5 px-4 font-bold min-w-[160px] max-w-[240px] truncate"
                        title={block.label}
                      >
                        {block.label}
                      </th>
                    ))}
                    <th className="py-3.5 px-4 font-bold w-16 text-right">
                      {t('common.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub, index) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-indigo-50/20 transition-colors group"
                    >
                      <td className="py-3 px-4 text-slate-400 font-mono text-center">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateTime(sub.submittedAt, i18n.language)}</span>
                        </div>
                      </td>

                      {/* Values for each question */}
                      {questionBlocks.map((block) => {
                        const val = sub.data[block.id];
                        let displayVal = '—';
                        if (val !== undefined && val !== null && val !== '') {
                          if (Array.isArray(val)) {
                            displayVal = val.join(', ');
                          } else if (typeof val === 'boolean') {
                            displayVal = val ? 'Yes' : 'No';
                          } else {
                            displayVal = String(val);
                          }
                        }

                        return (
                          <td
                            key={block.id}
                            className="py-3 px-4 text-slate-800 max-w-[240px] truncate"
                            title={displayVal}
                          >
                            {displayVal}
                          </td>
                        );
                      })}

                      {/* Action: Delete response */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title={t('submissions.deleteSubmission')}
                          aria-label="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
