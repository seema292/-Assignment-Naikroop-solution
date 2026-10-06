import React from 'react';
import type { FormBlock } from '../../types/form.types';

export const HeadingField: React.FC<{ block: FormBlock }> = ({ block }) => {
  const level = block.config?.headingLevel || 2;
  const label = block.label || 'Heading';

  if (level === 1) {
    return (
      <div className="pt-2 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {label}
        </h1>
        {block.description && (
          <p className="text-sm text-slate-500 mt-1">{block.description}</p>
        )}
      </div>
    );
  }

  if (level === 3) {
    return (
      <div className="pt-1.5 pb-0.5">
        <h3 className="text-lg font-semibold text-slate-800 tracking-tight">
          {label}
        </h3>
        {block.description && (
          <p className="text-xs text-slate-500 mt-0.5">{block.description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="pt-2 pb-1">
      <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
        {label}
      </h2>
      {block.description && (
        <p className="text-sm text-slate-500 mt-1">{block.description}</p>
      )}
    </div>
  );
};

export const ParagraphField: React.FC<{ block: FormBlock }> = ({ block }) => {
  return (
    <div className="py-1">
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
        {block.label || 'Paragraph text'}
      </p>
    </div>
  );
};
