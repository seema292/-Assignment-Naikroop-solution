import React from 'react';
import type { FormBlock } from '../../types/form.types';

export interface FieldWrapperProps {
  block: FormBlock;
  error?: string;
  children: React.ReactNode;
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  block,
  error,
  children,
}) => {
  return (
    <div
      className="space-y-1.5 transition-all duration-150"
      id={`field-container-${block.id}`}
    >
      {/* Label & Required Indicator */}
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={block.id}
          className="block text-sm font-medium text-slate-800"
        >
          {block.label || 'Untitled Field'}
          {block.required && (
            <span
              className="text-rose-500 ml-1 font-semibold select-none"
              title="Required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      </div>

      {/* Description / Subtext */}
      {block.description && (
        <p
          id={`${block.id}-desc`}
          className="text-xs text-slate-500 leading-relaxed"
        >
          {block.description}
        </p>
      )}

      {/* Input element slot */}
      <div className="pt-0.5">{children}</div>

      {/* Validation Error Message */}
      {error && (
        <p
          id={`${block.id}-error`}
          role="alert"
          className="text-xs font-medium text-rose-600 flex items-center gap-1 animate-fade-in"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};
