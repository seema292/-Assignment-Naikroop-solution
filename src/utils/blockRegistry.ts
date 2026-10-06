import type { BlockType, FormBlock } from '../types/form.types';
import { generateId } from './idGenerator';

export interface BlockMeta {
  type: BlockType;
  name: string;
  category: 'text' | 'inputs' | 'choices' | 'interactive';
  icon: string;
  description: string;
  createDefault: (id?: string) => FormBlock;
}

export const BLOCK_METAS: BlockMeta[] = [
  // Text / Layout
  {
    type: 'heading',
    name: 'Heading',
    category: 'text',
    icon: 'Heading',
    description: 'Section heading or title (H1, H2, H3)',
    createDefault: (id) => ({
      id: id || generateId('block_h'),
      type: 'heading',
      label: 'Section Heading',
      required: false,
      config: { headingLevel: 2 },
    }),
  },
  {
    type: 'paragraph',
    name: 'Paragraph',
    category: 'text',
    icon: 'AlignLeft',
    description: 'Instructions, notes, or descriptive text',
    createDefault: (id) => ({
      id: id || generateId('block_p'),
      type: 'paragraph',
      label: 'Provide additional instructions or details here for your form respondents.',
      required: false,
    }),
  },

  // Standard inputs
  {
    type: 'shortText',
    name: 'Short Text',
    category: 'inputs',
    icon: 'Type',
    description: 'Single-line text for names, titles, etc.',
    createDefault: (id) => ({
      id: id || generateId('block_st'),
      type: 'shortText',
      label: 'What is your full name?',
      placeholder: 'Type your answer here...',
      required: true,
    }),
  },
  {
    type: 'longText',
    name: 'Long Text',
    category: 'inputs',
    icon: 'FileText',
    description: 'Multi-line text area for feedback, messages',
    createDefault: (id) => ({
      id: id || generateId('block_lt'),
      type: 'longText',
      label: 'Your message or feedback',
      placeholder: 'Share your thoughts in detail...',
      required: false,
    }),
  },
  {
    type: 'email',
    name: 'Email',
    category: 'inputs',
    icon: 'Mail',
    description: 'Validated email address input',
    createDefault: (id) => ({
      id: id || generateId('block_em'),
      type: 'email',
      label: 'Email address',
      placeholder: 'name@example.com',
      required: true,
    }),
  },
  {
    type: 'number',
    name: 'Number',
    category: 'inputs',
    icon: 'Hash',
    description: 'Numerical value with optional min/max',
    createDefault: (id) => ({
      id: id || generateId('block_num'),
      type: 'number',
      label: 'Your age or count',
      placeholder: '0',
      required: false,
      config: { min: 0, max: 1000 },
    }),
  },
  {
    type: 'date',
    name: 'Date',
    category: 'inputs',
    icon: 'Calendar',
    description: 'Date picker input',
    createDefault: (id) => ({
      id: id || generateId('block_date'),
      type: 'date',
      label: 'Select date',
      required: false,
    }),
  },

  // Choice inputs
  {
    type: 'multipleChoice',
    name: 'Multiple Choice',
    category: 'choices',
    icon: 'Radio',
    description: 'Select one option from a list (Radio)',
    createDefault: (id) => ({
      id: id || generateId('block_mc'),
      type: 'multipleChoice',
      label: 'Which option best describes you?',
      required: true,
      config: {
        options: [
          { id: generateId('opt'), label: 'Option 1', value: 'opt_1' },
          { id: generateId('opt'), label: 'Option 2', value: 'opt_2' },
          { id: generateId('opt'), label: 'Option 3', value: 'opt_3' },
        ],
      },
    }),
  },
  {
    type: 'dropdown',
    name: 'Dropdown',
    category: 'choices',
    icon: 'ChevronDownCircle',
    description: 'Select one item from a drop-down menu',
    createDefault: (id) => ({
      id: id || generateId('block_dd'),
      type: 'dropdown',
      label: 'Select your country / region',
      placeholder: 'Choose an option...',
      required: false,
      config: {
        options: [
          { id: generateId('opt'), label: 'United States', value: 'US' },
          { id: generateId('opt'), label: 'India', value: 'IN' },
          { id: generateId('opt'), label: 'United Kingdom', value: 'UK' },
          { id: generateId('opt'), label: 'Canada', value: 'CA' },
        ],
      },
    }),
  },
  {
    type: 'singleCheckbox',
    name: 'Single Checkbox',
    category: 'choices',
    icon: 'CheckSquare',
    description: 'Consent, agreement, or toggle checkbox',
    createDefault: (id) => ({
      id: id || generateId('block_sc'),
      type: 'singleCheckbox',
      label: 'I accept the terms and conditions',
      description: 'You must agree before proceeding',
      required: true,
    }),
  },
  {
    type: 'multipleCheckboxes',
    name: 'Multiple Checkboxes',
    category: 'choices',
    icon: 'ListChecks',
    description: 'Select several choices from a list',
    createDefault: (id) => ({
      id: id || generateId('block_mcb'),
      type: 'multipleCheckboxes',
      label: 'What topics are you interested in?',
      required: false,
      config: {
        options: [
          { id: generateId('opt'), label: 'Design & UI/UX', value: 'design' },
          { id: generateId('opt'), label: 'Frontend Development', value: 'frontend' },
          { id: generateId('opt'), label: 'Product Strategy', value: 'product' },
        ],
      },
    }),
  },

  // Interactive / Functional
  {
    type: 'rating',
    name: 'Rating',
    category: 'interactive',
    icon: 'Star',
    description: 'Interactive star rating (1 to 5 or 10)',
    createDefault: (id) => ({
      id: id || generateId('block_rate'),
      type: 'rating',
      label: 'How would you rate your experience?',
      required: true,
      config: { ratingMax: 5, ratingIcon: 'star' },
    }),
  },
  {
    type: 'submitButton',
    name: 'Submit Button',
    category: 'interactive',
    icon: 'SendHorizontal',
    description: 'Submit button with configurable text and align',
    createDefault: (id) => ({
      id: id || generateId('block_btn'),
      type: 'submitButton',
      label: 'Submit Response',
      required: false,
      config: {
        buttonText: 'Submit',
        alignment: 'left',
      },
    }),
  },
];

export function createBlock(type: BlockType, customId?: string): FormBlock {
  const meta = BLOCK_METAS.find((b) => b.type === type);
  if (meta) {
    return meta.createDefault(customId);
  }
  // Fallback for unknown type
  return {
    id: customId || generateId('block'),
    type,
    label: 'Custom Block',
    required: false,
  };
}

export function getBlockMeta(type: BlockType): BlockMeta | undefined {
  return BLOCK_METAS.find((b) => b.type === type);
}
