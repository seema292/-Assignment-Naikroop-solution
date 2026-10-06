import React, { useState } from 'react';
import type { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { FormBlock } from '../../types/form.types';
import { FieldWrapper } from './FieldWrapper';
import { Star, ChevronDown } from 'lucide-react';

interface BaseInputProps {
  block: FormBlock;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}

export const ShortTextInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;

  return (
    <FieldWrapper block={block} error={error}>
      <input
        id={block.id}
        type="text"
        disabled={disabled}
        placeholder={block.placeholder || 'Type your answer...'}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
        }
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all placeholder:text-slate-400 focus:outline-hidden ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
        {...register(block.id, {
          required: block.required ? 'This field is required' : false,
        })}
      />
    </FieldWrapper>
  );
};

export const LongTextInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;

  return (
    <FieldWrapper block={block} error={error}>
      <textarea
        id={block.id}
        rows={4}
        disabled={disabled}
        placeholder={block.placeholder || 'Type your detailed response...'}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
        }
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all placeholder:text-slate-400 focus:outline-hidden resize-y min-h-[90px] ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
        {...register(block.id, {
          required: block.required ? 'This field is required' : false,
        })}
      />
    </FieldWrapper>
  );
};

export const EmailInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;

  return (
    <FieldWrapper block={block} error={error}>
      <input
        id={block.id}
        type="email"
        disabled={disabled}
        placeholder={block.placeholder || 'name@example.com'}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
        }
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all placeholder:text-slate-400 focus:outline-hidden ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
        {...register(block.id, {
          required: block.required ? 'Email is required' : false,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address',
          },
        })}
      />
    </FieldWrapper>
  );
};

export const NumberInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;
  const min = block.config?.min;
  const max = block.config?.max;

  return (
    <FieldWrapper block={block} error={error}>
      <input
        id={block.id}
        type="number"
        min={min}
        max={max}
        step={block.config?.step || 'any'}
        disabled={disabled}
        placeholder={block.placeholder || '0'}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
        }
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all placeholder:text-slate-400 focus:outline-hidden ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
            : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
        {...register(block.id, {
          required: block.required ? 'This field is required' : false,
          valueAsNumber: true,
          validate: (val) => {
            if (val === undefined || isNaN(val) || val === null) {
              if (block.required) return 'This field is required';
              return true;
            }
            if (min !== undefined && val < min) return `Minimum value is ${min}`;
            if (max !== undefined && val > max) return `Maximum value is ${max}`;
            return true;
          },
        })}
      />
    </FieldWrapper>
  );
};

export const DateInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;

  return (
    <FieldWrapper block={block} error={error}>
      <input
        id={block.id}
        type="date"
        disabled={disabled}
        min={block.config?.minDate}
        max={block.config?.maxDate}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
        }
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-hidden ${
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
            : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
        } disabled:bg-slate-50 disabled:cursor-not-allowed`}
        {...register(block.id, {
          required: block.required ? 'Please select a date' : false,
        })}
      />
    </FieldWrapper>
  );
};

export const DropdownInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;
  const options = block.config?.options || [];

  return (
    <FieldWrapper block={block} error={error}>
      <div className="relative">
        <select
          id={block.id}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
          }
          className={`w-full appearance-none px-3.5 py-2.5 text-sm bg-white border rounded-lg transition-all focus:outline-hidden pr-10 ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
          } disabled:bg-slate-50 disabled:cursor-not-allowed cursor-pointer`}
          {...register(block.id, {
            required: block.required ? 'Please choose an option' : false,
          })}
        >
          <option value="">{block.placeholder || 'Select an option...'}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </FieldWrapper>
  );
};

export const MultipleChoiceInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;
  const options = block.config?.options || [];

  return (
    <FieldWrapper block={block} error={error}>
      <div className="space-y-2 mt-1" role="radiogroup" aria-labelledby={block.id}>
        {options.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer group select-none"
          >
            <input
              type="radio"
              value={opt.value}
              disabled={disabled}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
              {...register(block.id, {
                required: block.required ? 'Please select an option' : false,
              })}
            />
            <span className="text-sm text-slate-800 font-normal group-hover:text-slate-900">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
};

export const SingleCheckboxInput: React.FC<BaseInputProps> = ({
  block,
  register,
  errors,
  disabled,
}) => {
  const error = errors[block.id]?.message as string | undefined;

  return (
    <div className="pt-1 pb-1">
      <label
        htmlFor={block.id}
        className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center h-5">
          <input
            id={block.id}
            type="checkbox"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${block.id}-error` : block.description ? `${block.id}-desc` : undefined
            }
            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
            {...register(block.id, {
              required: block.required ? 'You must accept to continue' : false,
            })}
          />
        </div>
        <div className="flex-1 text-sm">
          <span className="font-medium text-slate-800">
            {block.label}
            {block.required && <span className="text-rose-500 ml-1 font-semibold">*</span>}
          </span>
          {block.description && (
            <p id={`${block.id}-desc`} className="text-xs text-slate-500 mt-0.5">
              {block.description}
            </p>
          )}
        </div>
      </label>
      {error && (
        <p
          id={`${block.id}-error`}
          role="alert"
          className="text-xs font-medium text-rose-600 mt-1.5 flex items-center gap-1"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
    </div>
  );
};

export const MultipleCheckboxesInput: React.FC<{
  block: FormBlock;
  control: Control<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}> = ({ block, control, errors, disabled }) => {
  const error = errors[block.id]?.message as string | undefined;
  const options = block.config?.options || [];

  return (
    <FieldWrapper block={block} error={error}>
      <Controller
        name={block.id}
        control={control}
        defaultValue={[]}
        rules={{
          validate: (value) => {
            if (block.required && (!Array.isArray(value) || value.length === 0)) {
              return 'Please select at least one option';
            }
            return true;
          },
        }}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];

          const toggleValue = (val: string) => {
            if (selectedValues.includes(val)) {
              field.onChange(selectedValues.filter((v) => v !== val));
            } else {
              field.onChange([...selectedValues, val]);
            }
          };

          return (
            <div className="space-y-2 mt-1" role="group" aria-labelledby={block.id}>
              {options.map((opt) => {
                const isChecked = selectedValues.includes(opt.value);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'border-indigo-400 bg-indigo-50/40 text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={disabled}
                      onChange={() => toggleValue(opt.value)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-sm font-normal">{opt.label}</span>
                  </label>
                );
              })}
            </div>
          );
        }}
      />
    </FieldWrapper>
  );
};

export const RatingInput: React.FC<{
  block: FormBlock;
  control: Control<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
}> = ({ block, control, errors, disabled }) => {
  const error = errors[block.id]?.message as string | undefined;
  const max = block.config?.ratingMax === 10 ? 10 : 5;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <FieldWrapper block={block} error={error}>
      <Controller
        name={block.id}
        control={control}
        defaultValue={0}
        rules={{
          validate: (val) => {
            if (block.required && (!val || val <= 0)) {
              return 'Please select a rating';
            }
            return true;
          },
        }}
        render={({ field }) => {
          const currentValue = Number(field.value) || 0;

          return (
            <div className="flex items-center gap-2 py-1">
              {Array.from({ length: max }, (_, i) => i + 1).map((starNumber) => {
                const isFilled =
                  hoveredIndex !== null
                    ? starNumber <= hoveredIndex
                    : starNumber <= currentValue;

                return (
                  <button
                    key={starNumber}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(starNumber)}
                    onMouseEnter={() => !disabled && setHoveredIndex(starNumber)}
                    onMouseLeave={() => !disabled && setHoveredIndex(null)}
                    aria-label={`Rate ${starNumber} of ${max}`}
                    className={`p-1.5 rounded-md transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                      disabled ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 active:scale-95'
                    }`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-2xs'
                          : 'text-slate-300 hover:text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
              {currentValue > 0 && (
                <span className="text-xs font-semibold text-slate-600 ml-2">
                  {currentValue} / {max}
                </span>
              )}
            </div>
          );
        }}
      />
    </FieldWrapper>
  );
};

export const SubmitButtonInput: React.FC<{
  block: FormBlock;
  isSubmitting?: boolean;
}> = ({ block, isSubmitting = false }) => {
  const buttonText = block.config?.buttonText || block.label || 'Submit';
  const alignment = block.config?.alignment || 'left';

  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    full: 'w-full',
  };

  return (
    <div className={`pt-4 pb-2 flex ${alignStyles[alignment]}`}>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`${
          alignment === 'full' ? 'w-full' : 'px-6'
        } py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-lg shadow-xs hover:shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer`}
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
          <span>{buttonText}</span>
        )}
      </button>
    </div>
  );
};
