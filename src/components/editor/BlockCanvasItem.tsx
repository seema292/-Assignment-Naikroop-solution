import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  GripVertical,
  Star,
  ChevronDown as DropdownIcon,
} from 'lucide-react';
import type { FormBlock } from '../../types/form.types';

export interface BlockCanvasItemProps {
  block: FormBlock;
  isSelected: boolean;
  index: number;
  totalBlocks: number;
  onSelect: () => void;
  onUpdate: (updated: Partial<FormBlock>) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const BlockCanvasItem: React.FC<BlockCanvasItemProps> = ({
  block,
  isSelected,
  index,
  totalBlocks,
  onSelect,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border transition-all duration-150 p-4 cursor-pointer bg-white ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
      data-testid={`block-item-${block.id}`}
    >
      {/* Floating Action Bar (visible when selected or hovered) */}
      <div
        className={`absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-sm px-1 py-0.5 text-xs transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <button
          type="button"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          title={t('editor.reorderUp')}
          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 rounded-md hover:bg-slate-100"
          aria-label="Move block up"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={index === totalBlocks - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          title={t('editor.reorderDown')}
          className="p-1 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-500 rounded-md hover:bg-slate-100"
          aria-label="Move block down"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3 bg-slate-200 mx-0.5" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title={t('editor.duplicateBlock')}
          className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
          aria-label="Duplicate block"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title={t('editor.deleteBlock')}
          className="p-1 text-rose-500 hover:text-rose-700 rounded-md hover:bg-rose-50"
          aria-label="Delete block"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grip & Type badge indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-400">
          <GripVertical className="w-4 h-4 cursor-grab" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
            {block.type}
          </span>
        </div>
        {block.required && (
          <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
            {t('common.required')}
          </span>
        )}
      </div>

      {/* Inline Editable Question / Label */}
      <div className="mb-2">
        {block.type === 'heading' ? (
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Heading text..."
            className="w-full text-lg sm:text-xl font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden bg-transparent pb-0.5 transition-colors"
          />
        ) : block.type === 'paragraph' ? (
          <textarea
            rows={2}
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Type instructions or descriptive text..."
            className="w-full text-sm text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden bg-transparent pb-0.5 transition-colors resize-none"
          />
        ) : (
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Question or label..."
            className="w-full text-sm font-semibold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-hidden bg-transparent pb-0.5 transition-colors"
          />
        )}
      </div>

      {/* Description / Subtext (inline editable) */}
      {block.type !== 'paragraph' && (
        <div className="mb-3">
          <input
            type="text"
            value={block.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add subtext or instructions (optional)..."
            className="w-full text-xs text-slate-500 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 focus:outline-hidden bg-transparent pb-0.5 transition-colors"
          />
        </div>
      )}

      {/* Visual Canvas Representation of the input control */}
      <div className="pointer-events-none opacity-85 select-none pt-1">
        {block.type === 'shortText' && (
          <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs text-slate-400">
            {block.placeholder || 'Short answer text'}
          </div>
        )}

        {block.type === 'longText' && (
          <div className="h-16 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
            {block.placeholder || 'Long answer text'}
          </div>
        )}

        {block.type === 'email' && (
          <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs text-slate-400">
            {block.placeholder || 'name@example.com'}
          </div>
        )}

        {block.type === 'number' && (
          <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs text-slate-400">
            {block.placeholder || '0'}
          </div>
        )}

        {block.type === 'date' && (
          <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center text-xs text-slate-400">
            YYYY-MM-DD
          </div>
        )}

        {block.type === 'dropdown' && (
          <div className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-400">
            <span>{block.placeholder || 'Select an option...'}</span>
            <DropdownIcon className="w-3.5 h-3.5" />
          </div>
        )}

        {block.type === 'multipleChoice' && (
          <div className="space-y-1.5">
            {(block.config?.options || []).map((opt) => (
              <div
                key={opt.id}
                className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700"
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}

        {block.type === 'singleCheckbox' && (
          <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
            <div className="w-3.5 h-3.5 rounded-sm border border-slate-300" />
            <span>I accept and confirm</span>
          </div>
        )}

        {block.type === 'multipleCheckboxes' && (
          <div className="space-y-1.5">
            {(block.config?.options || []).map((opt) => (
              <div
                key={opt.id}
                className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700"
              >
                <div className="w-3.5 h-3.5 rounded-sm border border-slate-300" />
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}

        {block.type === 'rating' && (
          <div className="flex items-center gap-1.5 py-1">
            {Array.from({ length: block.config?.ratingMax || 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
        )}

        {block.type === 'submitButton' && (
          <div
            className={`flex ${
              block.config?.alignment === 'center'
                ? 'justify-center'
                : block.config?.alignment === 'right'
                ? 'justify-end'
                : block.config?.alignment === 'full'
                ? 'w-full'
                : 'justify-start'
            }`}
          >
            <div className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium">
              {block.config?.buttonText || 'Submit'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
