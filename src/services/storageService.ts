import type { FormBlock, FormSchema, FormSubmission } from '../types/form.types';
import { generateId } from '../utils/idGenerator';
import { createBlock } from '../utils/blockRegistry';

const STORAGE_KEYS = {
  FORMS: 'formcraft_forms_v1',
  SUBMISSIONS: 'formcraft_submissions_v1',
  SETTINGS: 'formcraft_settings_v1',
} as const;

/**
 * Creates seed demo forms when FormCraft runs for the first time.
 */
function createSeedForms(): FormSchema[] {
  const now = new Date().toISOString();

  const feedbackForm: FormSchema = {
    id: 'demo_feedback_form',
    title: 'Product Feedback & Experience',
    description: 'We would love to know how your recent experience was and how we can improve.',
    status: 'published',
    locale: 'en',
    createdAt: now,
    updatedAt: now,
    blocks: [
      {
        id: 'blk_fb_h1',
        type: 'heading',
        label: 'Share Your Experience',
        required: false,
        config: { headingLevel: 2 },
      },
      {
        id: 'blk_fb_name',
        type: 'shortText',
        label: 'What is your full name?',
        placeholder: 'e.g. Alex Morgan',
        required: true,
      },
      {
        id: 'blk_fb_email',
        type: 'email',
        label: 'Your work email',
        placeholder: 'alex@company.com',
        required: true,
      },
      {
        id: 'blk_fb_rating',
        type: 'rating',
        label: 'How satisfied are you with our product?',
        required: true,
        config: { ratingMax: 5, ratingIcon: 'star' },
      },
      {
        id: 'blk_fb_category',
        type: 'multipleChoice',
        label: 'Which feature do you use most frequently?',
        required: true,
        config: {
          options: [
            { id: 'opt_form_builder', label: 'Form Builder & Editor', value: 'builder' },
            { id: 'opt_analytics', label: 'Response Analytics', value: 'analytics' },
            { id: 'opt_integrations', label: 'Sharing & Embeds', value: 'integrations' },
          ],
        },
      },
      {
        id: 'blk_fb_features',
        type: 'multipleCheckboxes',
        label: 'What additional areas should we prioritize next?',
        required: false,
        config: {
          options: [
            { id: 'opt_workflow', label: 'Workflow Automations', value: 'automations' },
            { id: 'opt_themes', label: 'Custom Brand Styling', value: 'branding' },
            { id: 'opt_api', label: 'Developer Webhooks & API', value: 'api' },
          ],
        },
      },
      {
        id: 'blk_fb_thoughts',
        type: 'longText',
        label: 'Any additional suggestions or comments?',
        placeholder: 'Tell us how we can make your workflow smoother...',
        required: false,
      },
      {
        id: 'blk_fb_submit',
        type: 'submitButton',
        label: 'Send Feedback',
        required: false,
        config: { buttonText: 'Submit Feedback', alignment: 'left' },
      },
    ],
  };

  const contactForm: FormSchema = {
    id: 'demo_contact_form',
    title: 'Contact & Inquiry Request',
    description: 'Have questions or interested in working with us? Let us know below.',
    status: 'draft',
    locale: 'en',
    createdAt: now,
    updatedAt: now,
    blocks: [
      {
        id: 'blk_ct_name',
        type: 'shortText',
        label: 'Full Name',
        placeholder: 'Jane Doe',
        required: true,
      },
      {
        id: 'blk_ct_email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'jane@example.com',
        required: true,
      },
      {
        id: 'blk_ct_region',
        type: 'dropdown',
        label: 'Country / Region',
        placeholder: 'Choose country...',
        required: false,
        config: {
          options: [
            { id: 'opt_in', label: 'India', value: 'IN' },
            { id: 'opt_us', label: 'United States', value: 'US' },
            { id: 'opt_uk', label: 'United Kingdom', value: 'UK' },
            { id: 'opt_de', label: 'Germany', value: 'DE' },
          ],
        },
      },
      {
        id: 'blk_ct_message',
        type: 'longText',
        label: 'How can we help you?',
        placeholder: 'Provide project details or questions...',
        required: true,
      },
      {
        id: 'blk_ct_agree',
        type: 'singleCheckbox',
        label: 'I consent to receiving follow-up communications.',
        required: true,
      },
      {
        id: 'blk_ct_submit',
        type: 'submitButton',
        label: 'Submit Inquiry',
        required: false,
        config: { buttonText: 'Send Message', alignment: 'left' },
      },
    ],
  };

  return [feedbackForm, contactForm];
}

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private safeGetItem<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[storageService] Error parsing item "${key}":`, err);
      return defaultValue;
    }
  }

  private safeSetItem<T>(key: string, value: T): boolean {
    if (!this.isBrowser()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[storageService] Error setting item "${key}":`, err);
      return false;
    }
  }

  public getAllForms(): FormSchema[] {
    const stored = this.safeGetItem<FormSchema[] | null>(STORAGE_KEYS.FORMS, null);
    if (!stored) {
      const seeds = createSeedForms();
      this.safeSetItem(STORAGE_KEYS.FORMS, seeds);
      return seeds;
    }

    // Defensive check: ensure it's an array and validate structure
    if (!Array.isArray(stored)) {
      console.warn('[storageService] Form storage corrupted, re-initializing.');
      const seeds = createSeedForms();
      this.safeSetItem(STORAGE_KEYS.FORMS, seeds);
      return seeds;
    }

    return stored.map((form) => ({
      ...form,
      blocks: Array.isArray(form.blocks) ? form.blocks : [],
    }));
  }

  public getFormById(id: string): FormSchema | null {
    if (!id) return null;
    const forms = this.getAllForms();
    const found = forms.find((f) => f.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  public createForm(initialData?: Partial<FormSchema>): FormSchema {
    const forms = this.getAllForms();
    const now = new Date().toISOString();

    const newForm: FormSchema = {
      id: initialData?.id || generateId('form'),
      title: initialData?.title?.trim() || 'Untitled Form',
      description: initialData?.description ?? '',
      status: initialData?.status || 'draft',
      locale: initialData?.locale || 'en',
      createdAt: initialData?.createdAt || now,
      updatedAt: now,
      settings: initialData?.settings || {
        submitButtonText: 'Submit',
        successMessage: 'Thank you! Your response has been recorded.',
      },
      blocks:
        initialData?.blocks && initialData.blocks.length > 0
          ? JSON.parse(JSON.stringify(initialData.blocks))
          : [
              createBlock('heading'),
              createBlock('shortText'),
              createBlock('email'),
              createBlock('submitButton'),
            ],
    };

    forms.unshift(newForm);
    this.safeSetItem(STORAGE_KEYS.FORMS, forms);
    return JSON.parse(JSON.stringify(newForm));
  }

  public updateForm(id: string, changes: Partial<FormSchema>): FormSchema | null {
    const forms = this.getAllForms();
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return null;

    const existing = forms[index];
    const updated: FormSchema = {
      ...existing,
      ...changes,
      id: existing.id, // Never mutate form ID
      createdAt: existing.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString(),
      blocks: changes.blocks ? JSON.parse(JSON.stringify(changes.blocks)) : existing.blocks,
    };

    forms[index] = updated;
    this.safeSetItem(STORAGE_KEYS.FORMS, forms);
    return JSON.parse(JSON.stringify(updated));
  }

  public deleteForm(id: string): boolean {
    const forms = this.getAllForms();
    const filtered = forms.filter((f) => f.id !== id);
    if (filtered.length === forms.length) return false;

    this.safeSetItem(STORAGE_KEYS.FORMS, filtered);

    // Clean up all associated submissions for this form
    this.deleteAllSubmissionsForForm(id);
    return true;
  }

  public duplicateForm(id: string): FormSchema | null {
    const original = this.getFormById(id);
    if (!original) return null;

    const now = new Date().toISOString();
    // Deep clone blocks and assign fresh IDs to avoid shared reference or ID collision
    const clonedBlocks: FormBlock[] = original.blocks.map((b) => ({
      ...b,
      id: generateId('block'),
      config: b.config
        ? {
            ...b.config,
            options: b.config.options?.map((opt) => ({
              ...opt,
              id: generateId('opt'),
            })),
          }
        : undefined,
    }));

    const duplicated: FormSchema = {
      ...original,
      id: generateId('form'),
      title: `${original.title} (Copy)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      blocks: clonedBlocks,
    };

    const forms = this.getAllForms();
    forms.unshift(duplicated);
    this.safeSetItem(STORAGE_KEYS.FORMS, forms);
    return JSON.parse(JSON.stringify(duplicated));
  }

  // --- Submissions Handling ---

  public getAllSubmissions(): FormSubmission[] {
    const submissions = this.safeGetItem<FormSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    return Array.isArray(submissions) ? submissions : [];
  }

  public getSubmissions(formId: string): FormSubmission[] {
    const all = this.getAllSubmissions();
    return all.filter((s) => s.formId === formId);
  }

  public getSubmissionCount(formId: string): number {
    return this.getSubmissions(formId).length;
  }

  public saveSubmission(formId: string, data: Record<string, any>): FormSubmission {
    const all = this.getAllSubmissions();
    const newSubmission: FormSubmission = {
      id: generateId('sub'),
      formId,
      data: JSON.parse(JSON.stringify(data)),
      submittedAt: new Date().toISOString(),
    };

    all.unshift(newSubmission);
    this.safeSetItem(STORAGE_KEYS.SUBMISSIONS, all);
    return JSON.parse(JSON.stringify(newSubmission));
  }

  public deleteSubmission(submissionId: string): boolean {
    const all = this.getAllSubmissions();
    const filtered = all.filter((s) => s.id !== submissionId);
    if (filtered.length === all.length) return false;

    this.safeSetItem(STORAGE_KEYS.SUBMISSIONS, filtered);
    return true;
  }

  private deleteAllSubmissionsForForm(formId: string): void {
    const all = this.getAllSubmissions();
    const filtered = all.filter((s) => s.formId !== formId);
    this.safeSetItem(STORAGE_KEYS.SUBMISSIONS, filtered);
  }

  public clearAllData(): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.FORMS);
      window.localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
      window.localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error('[storageService] Failed to clear storage:', e);
    }
  }
}

export const storageService = new StorageService();
