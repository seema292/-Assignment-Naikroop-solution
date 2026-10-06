import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Trash2,
  Copy,
  Plus,
  Sliders,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import type { ChoiceOption, FormBlock } from '../../types/form.types';
import { generateId } from '../../utils/idGenerator';
import { Button } from '../common/Button';

export interface BlockPropertiesPanelProps {
  block: FormBlock | null;
  onUpdate: (updated: Partial<FormBlock>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onClose?: () => void;
}

export const BlockPropertiesPanel: React.FC<BlockPropertiesPanelProps> = ({
  block,
  onUpdate,
  onDuplicate,
  onDelete,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!block) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white border-l border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          {t('editor.properties')}
        </h4>
        <p className="text-xs text-slate-500 max-w-xs">
          {t('editor.selectBlockToEdit')}
        </p>
      </div>
    );
  }

  const isChoiceField =
    block.type === 'multipleChoice' ||
    block.type === 'dropdown' ||
    block.type === 'multipleCheckboxes';

  const isTextField =
    block.type === 'shortText' ||
    block.type === 'longText' ||
    block.type === 'email' ||
    block.type === 'number';

  // Option handlers for choice fields
  const handleAddOption = () => {
    const existingOptions: ChoiceOption[] = block.config?.options || [];
    const nextNum = existingOptions.length + 1;
    const newOption: ChoiceOption = {
      id: generateId('opt'),
      label: `Option ${nextNum}`,
      value: `option_${nextNum}`,
    };
    onUpdate({
      config: {
        ...block.config,
        options: [...existingOptions, newOption],
      },
    });
  };

  const handleUpdateOption = (optId: string, label: string) => {
    const existingOptions: ChoiceOption[] = block.config?.options || [];
    const updated = existingOptions.map((opt) =>
      opt.id === optId
        ? {
            ...opt,
            label,
            value: label.toLowerCase().replace(/\s+/g, '_') || opt.value,
          }
        : opt
    );
    onUpdate({
      config: {
        ...block.config,
        options: updated,
      },
    });
  };

  const handleRemoveOption = (optId: string) => {
    const existingOptions: ChoiceOption[] = block.config?.options || [];
    if (existingOptions.length <= 1) return; // Keep at least one option
    const updated = existingOptions.filter((opt) => opt.id !== optId);
    onUpdate({
      config: {
        ...block.config,
        options: updated,
      },
    });
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            {t('editor.properties')}
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded-sm">
            {block.type}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close properties"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Settings Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Question Label */}
        <div className="space-y-1.5">
          <label className="font-medium text-slate-700">
            {t('editor.blockLabel')}
          </label>
          <input
            type="text"
            value={block.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>

        {/* Subtext / Help text */}
        {block.type !== 'heading' && (
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">
              {t('editor.blockDescription')}
            </label>
            <textarea
              rows={2}
              value={block.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
            />
          </div>
        )}

        {/* Placeholder (for text, email, number, dropdown) */}
        {(isTextField || block.type === 'dropdown') && (
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">
              {t('editor.placeholder')}
            </label>
            <input
              type="text"
              value={block.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>
        )}

        {/* Heading Level Switcher */}
        {block.type === 'heading' && (
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">
              {t('editor.headingLevel')}
            </label>
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      config: { ...block.config, headingLevel: lvl as 1 | 2 | 3 },
                    })
                  }
                  className={`flex-1 py-1 rounded-md font-medium transition-all ${
                    (block.config?.headingLevel || 2) === lvl
                      ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  H{lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Required Field Toggle */}
        {block.type !== 'heading' &&
          block.type !== 'paragraph' &&
          block.type !== 'submitButton' && (
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50">
              <div>
                <p className="font-medium text-slate-800">{t('editor.isRequired')}</p>
                <p className="text-[11px] text-slate-500">
                  Respondent must answer this question
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(block.required)}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          )}

        {/* Choice Field Options Manager */}
        {isChoiceField && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-700">
                {t('editor.options')}
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('editor.addOption')}</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {(block.config?.options || []).map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-400 w-4">
                    {i + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-indigo-600"
                  />
                  {(block.config?.options || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(opt.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100"
                      title="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating Options */}
        {block.type === 'rating' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="font-medium text-slate-700">
              {t('editor.ratingMax')}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onUpdate({ config: { ...block.config, ratingMax: 5 } })
                }
                className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  (block.config?.ratingMax || 5) === 5
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                5 Stars
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdate({ config: { ...block.config, ratingMax: 10 } })
                }
                className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  block.config?.ratingMax === 10
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                10 Stars
              </button>
            </div>
          </div>
        )}

        {/* Number constraints */}
        {block.type === 'number' && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-medium text-slate-700">
              {t('editor.minMax')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500">Min</span>
                <input
                  type="number"
                  value={block.config?.min ?? ''}
                  onChange={(e) =>
                    onUpdate({
                      config: {
                        ...block.config,
                        min: e.target.value === '' ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Max</span>
                <input
                  type="number"
                  value={block.config?.max ?? ''}
                  onChange={(e) =>
                    onUpdate({
                      config: {
                        ...block.config,
                        max: e.target.value === '' ? undefined : Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit button settings */}
        {block.type === 'submitButton' && (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="font-medium text-slate-700">
                {t('editor.buttonText')}
              </label>
              <input
                type="text"
                value={block.config?.buttonText || block.label || 'Submit'}
                onChange={(e) =>
                  onUpdate({
                    label: e.target.value,
                    config: { ...block.config, buttonText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-700">
                {t('editor.buttonAlignment')}
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['left', 'center', 'right', 'full'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() =>
                      onUpdate({
                        config: { ...block.config, alignment: align },
                      })
                    }
                    className={`py-1.5 text-xs rounded-md border capitalize font-medium transition-colors ${
                      (block.config?.alignment || 'left') === align
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions section */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            icon={<Copy className="w-3.5 h-3.5" />}
            onClick={onDuplicate}
          >
            {t('editor.duplicateBlock')}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={onDelete}
          >
            {t('editor.deleteBlock')}
          </Button>
        </div>
      </div>
    </div>
  );
};
