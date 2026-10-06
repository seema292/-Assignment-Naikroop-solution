export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'shortText'
  | 'longText'
  | 'email'
  | 'number'
  | 'multipleChoice'
  | 'dropdown'
  | 'singleCheckbox'
  | 'multipleCheckboxes'
  | 'date'
  | 'rating'
  | 'submitButton';

export interface ChoiceOption {
  id: string;
  label: string;
  value: string;
}

export interface BlockConfig {
  headingLevel?: 1 | 2 | 3;
  options?: ChoiceOption[];
  min?: number;
  max?: number;
  step?: number;
  ratingMax?: number; // e.g., 5 or 10
  ratingIcon?: 'star' | 'heart' | 'thumb';
  buttonText?: string;
  alignment?: 'left' | 'center' | 'right' | 'full';
  maxLength?: number;
  minLength?: number;
  minDate?: string;
  maxDate?: string;
}

export interface FormBlock {
  id: string;
  type: BlockType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number | boolean | string[];
  config?: BlockConfig;
}

export type FormStatus = 'draft' | 'published';

export interface FormSettings {
  submitButtonText?: string;
  successMessage?: string;
  accentColor?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  status: FormStatus;
  locale?: string;
  blocks: FormBlock[];
  settings?: FormSettings;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}

export interface BlockCategory {
  id: string;
  titleKey: string;
  types: BlockType[];
}

export interface BlockDefinition {
  type: BlockType;
  labelKey: string;
  descKey: string;
  iconName: string;
  defaultBlock: (customId?: string) => FormBlock;
}
