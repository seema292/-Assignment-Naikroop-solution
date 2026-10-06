import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Eye,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  FileText,
  Copy,
  Plus,
} from 'lucide-react';
import type { BlockType, FormBlock, FormSchema } from '../types/form.types';
import { storageService } from '../services/storageService';
import { createBlock } from '../utils/blockRegistry';
import { generateId } from '../utils/idGenerator';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { BlocksPalette } from '../components/editor/BlocksPalette';
import { BlockCanvasItem } from '../components/editor/BlockCanvasItem';
import { BlockPropertiesPanel } from '../components/editor/BlockPropertiesPanel';

export const FormEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState<FormSchema | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'canvas' | 'palette' | 'properties'>('canvas');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Debounce timer ref
  const saveTimeoutRef = useRef<number | null>(null);

  // Load existing form on mount
  useEffect(() => {
    if (!id) return;
    const loaded = storageService.getFormById(id);
    if (!loaded) {
      navigate('/');
      return;
    }
    setForm(loaded);
    if (loaded.blocks.length > 0) {
      setSelectedBlockId(loaded.blocks[0].id);
    }
    setLastSavedTime(new Date().toLocaleTimeString());
  }, [id, navigate]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback((updatedForm: FormSchema) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        const saved = storageService.updateForm(updatedForm.id, updatedForm);
        if (saved) {
          setSaveStatus('saved');
          setLastSavedTime(new Date().toLocaleTimeString());
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    }, 600);
  }, []);

  // Update form state and trigger autosave
  const updateFormState = (updater: (prev: FormSchema) => FormSchema) => {
    setForm((prev) => {
      if (!prev) return null;
      const updated = updater(prev);
      triggerAutoSave(updated);
      return updated;
    });
  };

  // Add a new block to canvas
  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlock(type);
    updateFormState((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
    setMobileTab('canvas');
  };

  // Update specific block
  const handleUpdateBlock = (blockId: string, changes: Partial<FormBlock>) => {
    updateFormState((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, ...changes } : b)),
    }));
  };

  // Delete a block
  const handleDeleteBlock = (blockId: string) => {
    updateFormState((prev) => {
      const filtered = prev.blocks.filter((b) => b.id !== blockId);
      return { ...prev, blocks: filtered };
    });
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  // Duplicate a block
  const handleDuplicateBlock = (blockId: string) => {
    if (!form) return;
    const index = form.blocks.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const original = form.blocks[index];
    const duplicated: FormBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateId('block'),
      label: `${original.label} (Copy)`,
    };

    const nextBlocks = [...form.blocks];
    nextBlocks.splice(index + 1, 0, duplicated);

    updateFormState((prev) => ({
      ...prev,
      blocks: nextBlocks,
    }));
    setSelectedBlockId(duplicated.id);
  };

  // Reorder blocks (Up)
  const handleMoveBlockUp = (index: number) => {
    if (index <= 0 || !form) return;
    const nextBlocks = [...form.blocks];
    const temp = nextBlocks[index - 1];
    nextBlocks[index - 1] = nextBlocks[index];
    nextBlocks[index] = temp;

    updateFormState((prev) => ({
      ...prev,
      blocks: nextBlocks,
    }));
  };

  // Reorder blocks (Down)
  const handleMoveBlockDown = (index: number) => {
    if (!form || index >= form.blocks.length - 1) return;
    const nextBlocks = [...form.blocks];
    const temp = nextBlocks[index + 1];
    nextBlocks[index + 1] = nextBlocks[index];
    nextBlocks[index] = temp;

    updateFormState((prev) => ({
      ...prev,
      blocks: nextBlocks,
    }));
  };

  // Toggle Publish Status
  const handleTogglePublish = () => {
    if (!form) return;
    const newStatus = form.status === 'published' ? 'draft' : 'published';
    const updated = storageService.updateForm(form.id, { status: newStatus });
    if (updated) {
      setForm(updated);
      if (newStatus === 'published') {
        setPublishModalOpen(true);
      }
    }
  };

  const selectedBlock =
    form?.blocks.find((b) => b.id === selectedBlockId) || null;

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

  const publicUrl = `${window.location.origin}/forms/${form.id}`;

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={t('nav.backToDashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                updateFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder={t('editor.formTitlePlaceholder')}
              className="text-sm sm:text-base font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden px-1 py-0.5 truncate max-w-xs sm:max-w-md"
            />
          </div>
          <Badge status={form.status} />
        </div>

        {/* Center: Save state status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-indigo-600 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {t('common.saving')}
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('editor.autosavedAt', { time: lastSavedTime })}
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('editor.saveError')}
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector compact />

          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/preview/${form.id}`)}
          >
            {t('common.preview')}
          </Button>

          <Button
            variant={form.status === 'published' ? 'secondary' : 'primary'}
            size="sm"
            icon={
              form.status === 'published' ? (
                <ExternalLink className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )
            }
            onClick={handleTogglePublish}
          >
            {form.status === 'published'
              ? t('common.published')
              : t('common.publish')}
          </Button>
        </div>
      </header>

      {/* Mobile / Tablet Tab Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-b border-slate-200 bg-white px-2 py-1 text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('palette')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium ${
            mobileTab === 'palette'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('editor.blocksPalette')}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('canvas')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium ${
            mobileTab === 'canvas'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Canvas ({form.blocks.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('properties')}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium ${
            mobileTab === 'properties'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('editor.properties')}</span>
        </button>
      </div>

      {/* 3-Column Editor Layout on Desktop, Tabbed on Small screens */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Blocks Palette */}
        <aside
          className={`w-72 shrink-0 h-[calc(100vh-57px)] ${
            mobileTab === 'palette' ? 'block w-full' : 'hidden lg:block'
          }`}
        >
          <BlocksPalette
            onAddBlock={handleAddBlock}
            blocks={form.blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={(bId) => {
              setSelectedBlockId(bId);
              setMobileTab('canvas');
            }}
          />
        </aside>

        {/* Center: Document-style Form Canvas */}
        <main
          className={`flex-1 overflow-y-auto h-[calc(100vh-57px)] px-4 sm:px-8 py-8 ${
            mobileTab === 'canvas' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-10 mb-12">
            {/* Form Title & Description Document Header */}
            <div className="mb-8 border-b border-slate-100 pb-6">
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  updateFormState((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder={t('editor.formTitlePlaceholder')}
                className="w-full text-2xl sm:text-3xl font-bold text-slate-900 border-none focus:outline-hidden placeholder:text-slate-300 transition-colors"
              />
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  updateFormState((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={t('editor.formDescPlaceholder')}
                className="w-full text-sm text-slate-600 mt-2 border-none focus:outline-hidden placeholder:text-slate-300 resize-none transition-colors"
              />
            </div>

            {/* Block List on Canvas */}
            {form.blocks.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl my-4">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 mb-1">
                  {t('editor.noBlocks')}
                </p>
                <p className="text-xs text-slate-400 mb-4">
                  Add questions, sections, or input controls.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => handleAddBlock('shortText')}
                >
                  Add Short Text Field
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {form.blocks.map((block, index) => (
                  <BlockCanvasItem
                    key={block.id}
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    index={index}
                    totalBlocks={form.blocks.length}
                    onSelect={() => {
                      setSelectedBlockId(block.id);
                      if (window.innerWidth < 1024) {
                        setMobileTab('properties');
                      }
                    }}
                    onUpdate={(updated) => handleUpdateBlock(block.id, updated)}
                    onMoveUp={() => handleMoveBlockUp(index)}
                    onMoveDown={() => handleMoveBlockDown(index)}
                    onDuplicate={() => handleDuplicateBlock(block.id)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Properties Panel */}
        <aside
          className={`w-80 shrink-0 h-[calc(100vh-57px)] ${
            mobileTab === 'properties' ? 'block w-full' : 'hidden lg:block'
          }`}
        >
          <BlockPropertiesPanel
            block={selectedBlock}
            onUpdate={(updated) => {
              if (selectedBlockId) {
                handleUpdateBlock(selectedBlockId, updated);
              }
            }}
            onDuplicate={() => {
              if (selectedBlockId) {
                handleDuplicateBlock(selectedBlockId);
              }
            }}
            onDelete={() => {
              if (selectedBlockId) {
                handleDeleteBlock(selectedBlockId);
              }
            }}
            onClose={() => setMobileTab('canvas')}
          />
        </aside>
      </div>

      {/* Publish Success & Sharing Modal */}
      <Modal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        title={t('editor.publishConfirm')}
        maxWidth="md"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setPublishModalOpen(false)}
          >
            {t('common.close')}
          </Button>
        }
      >
        <div className="space-y-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900">
              Form is Published!
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {t('editor.publishSuccess')}
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-700">
              {t('editor.shareLink')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={copyPublicLink}
              >
                {copiedLink ? t('common.copied') : t('common.copy')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
