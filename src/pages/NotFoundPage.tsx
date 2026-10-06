import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">404 - {t('common.notFound')}</h1>
        <p className="text-xs text-slate-500 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button
          variant="primary"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          {t('common.returnHome')}
        </Button>
      </div>
    </div>
  );
};
