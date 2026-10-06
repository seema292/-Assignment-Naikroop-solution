import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileQuestion, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export interface FormEmptyStateProps {
  onCreate: () => void;
  isSearchFiltered?: boolean;
}

export const FormEmptyState: React.FC<FormEmptyStateProps> = ({
  onCreate,
  isSearchFiltered = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
        <FileQuestion className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        {isSearchFiltered ? t('dashboard.noSearchResults') : t('dashboard.emptyTitle')}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
        {isSearchFiltered
          ? 'Try adjusting your search terms or filter criteria.'
          : t('dashboard.emptySubtitle')}
      </p>
      {!isSearchFiltered && (
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={onCreate}
        >
          {t('dashboard.emptyCta')}
        </Button>
      )}
    </div>
  );
};
