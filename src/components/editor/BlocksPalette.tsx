import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heading,
  AlignLeft,
  Type,
  FileText,
  Mail,
  Hash,
  Calendar,
  Radio,
  ChevronDownCircle,
  CheckSquare,
  ListChecks,
  Star,
  SendHorizontal,
  Plus,
  Layers,
  ListTree,
} from 'lucide-react';
import type { BlockType, FormBlock } from '../../types/form.types';
import { BLOCK_METAS } from '../../utils/blockRegistry';

export interface BlocksPaletteProps {
  onAddBlock: (type: BlockType) => void;
  blocks: FormBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

export const BlocksPalette: React.FC<BlocksPaletteProps> = ({
  onAddBlock,
  blocks,
  selectedBlockId,
  onSelectBlock,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'blocks' | 'structure'>('blocks');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heading':
        return <Heading className="w-4 h-4 text-indigo-600" />;
      case 'AlignLeft':
        return <AlignLeft className="w-4 h-4 text-indigo-600" />;
      case 'Type':
        return <Type className="w-4 h-4 text-emerald-600" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'Mail':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'Hash':
        return <Hash className="w-4 h-4 text-emerald-600" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'Radio':
        return <Radio className="w-4 h-4 text-violet-600" />;
      case 'ChevronDownCircle':
        return <ChevronDownCircle className="w-4 h-4 text-violet-600" />;
      case 'CheckSquare':
        return <CheckSquare className="w-4 h-4 text-violet-600" />;
      case 'ListChecks':
        return <ListChecks className="w-4 h-4 text-violet-600" />;
      case 'Star':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'SendHorizontal':
        return <SendHorizontal className="w-4 h-4 text-blue-600" />;
      default:
        return <Plus className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredMetas = categoryFilter === 'all'
    ? BLOCK_METAS
    : BLOCK_METAS.filter((b) => b.category === categoryFilter);

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Tab Switcher: Palette vs Structure Outline */}
      <div className="flex items-center p-2 border-b border-slate-200 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'blocks'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('editor.blocksPalette')}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('structure')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'structure'
              ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>
            {t('editor.structure')} ({blocks.length})
          </span>
        </button>
      </div>

      {activeTab === 'blocks' ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {['all', 'text', 'inputs', 'choices', 'interactive'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2 py-1 rounded-md capitalize transition-colors font-medium shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Block Cards List */}
          <div className="space-y-1.5">
            {filteredMetas.map((meta) => (
              <button
                key={meta.type}
                type="button"
                onClick={() => onAddBlock(meta.type)}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group shadow-2xs cursor-pointer active:scale-[0.99]"
              >
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 group-hover:bg-white group-hover:shadow-2xs transition-all shrink-0">
                  {getIcon(meta.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {t(`blocks.${meta.type}`, meta.name)}
                    </p>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {t(`blocks.${meta.type}Desc`, meta.description)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Structure / Outline List */
        <div className="flex-1 overflow-y-auto p-3">
          {blocks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No blocks in form.
            </div>
          ) : (
            <div className="space-y-1.5">
              {blocks.map((b, idx) => {
                const isSelected = b.id === selectedBlockId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBlock(b.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left border ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] text-slate-400 font-mono w-4">
                        {idx + 1}.
                      </span>
                      <span className="truncate">{b.label || b.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 uppercase">
                      {b.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
