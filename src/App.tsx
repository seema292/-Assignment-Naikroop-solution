import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { FormEditorPage } from './pages/FormEditorPage';
import { FormPreviewPage } from './pages/FormPreviewPage';
import { PublicFormPage } from './pages/PublicFormPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/edit/:id" element={<FormEditorPage />} />
        <Route path="/preview/:id" element={<FormPreviewPage />} />
        <Route path="/forms/:id" element={<PublicFormPage />} />
        <Route path="/forms/:id/submissions" element={<SubmissionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
