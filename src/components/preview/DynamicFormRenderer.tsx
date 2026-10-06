import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { FormBlock, FormSchema } from '../../types/form.types';
import { HeadingField, ParagraphField } from '../fields/HeadingField';
import {
  ShortTextInput,
  LongTextInput,
  EmailInput,
  NumberInput,
  DateInput,
  DropdownInput,
  MultipleChoiceInput,
  SingleCheckboxInput,
  MultipleCheckboxesInput,
  RatingInput,
  SubmitButtonInput,
} from '../fields/FormInputs';
import { AlertCircle, HelpCircle } from 'lucide-react';

export interface DynamicFormRendererProps {
  form: FormSchema;
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  isPreview?: boolean;
  disabled?: boolean;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
  form,
  onSubmit,
  isPreview = false,
  disabled = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Record<string, any>>({
    mode: 'onTouched',
  });

  // Safe blocks extraction
  const blocks: FormBlock[] = Array.isArray(form?.blocks) ? form.blocks : [];

  // Check if form contains an explicit submit button block
  const hasSubmitBlock = blocks.some((b) => b.type === 'submitButton');

  const onFormSubmit = async (data: Record<string, any>) => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (err: any) {
      console.error('[DynamicFormRenderer] Submission failed:', err);
      setSubmissionError(err?.message || 'Failed to submit the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render block based on type
  const renderBlock = (block: FormBlock) => {
    if (!block || !block.type) return null;

    switch (block.type) {
      case 'heading':
        return <HeadingField key={block.id} block={block} />;

      case 'paragraph':
        return <ParagraphField key={block.id} block={block} />;

      case 'shortText':
        return (
          <ShortTextInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'longText':
        return (
          <LongTextInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'email':
        return (
          <EmailInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <NumberInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'date':
        return (
          <DateInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'dropdown':
        return (
          <DropdownInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'multipleChoice':
        return (
          <MultipleChoiceInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'singleCheckbox':
        return (
          <SingleCheckboxInput
            key={block.id}
            block={block}
            register={register}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'multipleCheckboxes':
        return (
          <MultipleCheckboxesInput
            key={block.id}
            block={block}
            control={control}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'rating':
        return (
          <RatingInput
            key={block.id}
            block={block}
            control={control}
            errors={errors}
            disabled={disabled}
          />
        );

      case 'submitButton':
        return (
          <SubmitButtonInput
            key={block.id}
            block={block}
            isSubmitting={isSubmitting}
          />
        );

      default:
        // Gracefully handle unsupported or future block types
        return (
          <div
            key={block.id}
            className="p-3 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-xs flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>
              Unsupported or legacy block type: <strong>{(block as any).type}</strong>
            </span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      {/* Form Header Canvas */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          {form?.title || 'Untitled Form'}
        </h1>
        {form?.description && (
          <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
            {form.description}
          </p>
        )}
      </div>

      {/* Submission general error notice */}
      {submissionError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm flex items-center gap-3 animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{submissionError}</span>
        </div>
      )}

      {/* Dynamic Blocks Form */}
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        noValidate
        className="space-y-6"
      >
        {blocks.map((block) => renderBlock(block))}

        {/* Fallback submit button if form designer didn't add one */}
        {!hasSubmitBlock && (
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || disabled}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-lg shadow-xs hover:shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>
                  {isPreview
                    ? 'Submit (Preview Mode)'
                    : form?.settings?.submitButtonText || 'Submit'}
                </span>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
