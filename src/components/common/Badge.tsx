import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FormStatus } from '../../types/form.types';

export interface BadgeProps {
  status: FormStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const { t } = useTranslation();
  const isPublished = status === 'published';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isPublished
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          : 'bg-amber-50 text-amber-700 border-amber-200/80'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
        }`}
        aria-hidden="true"
      />
      {isPublished ? t('common.published') : t('common.draft')}
    </span>
  );
};
