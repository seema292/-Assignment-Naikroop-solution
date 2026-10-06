import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storageService';
import { FormBlock } from '../types/form.types';

describe('storageService', () => {
  beforeEach(() => {
    storageService.clearAllData();
  });

  it('should initialize with seed forms when empty', () => {
    const forms = storageService.getAllForms();
    expect(forms.length).toBeGreaterThan(0);
    expect(forms[0]).toHaveProperty('id');
    expect(forms[0]).toHaveProperty('title');
    expect(forms[0]).toHaveProperty('blocks');
  });

  it('should create and retrieve a new form', () => {
    const created = storageService.createForm({
      title: 'Candidate Feedback',
      description: 'Interview feedback form',
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Candidate Feedback');
    expect(created.blocks.length).toBeGreaterThan(0);

    const retrieved = storageService.getFormById(created.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.title).toBe('Candidate Feedback');
  });

  it('should update an existing form without altering its ID or creation date', () => {
    const form = storageService.createForm({ title: 'Original Title' });
    const originalCreatedAt = form.createdAt;

    const updated = storageService.updateForm(form.id, {
      title: 'Updated Title',
      status: 'published',
    });

    expect(updated).not.toBeNull();
    expect(updated?.id).toBe(form.id);
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.status).toBe('published');
    expect(updated?.createdAt).toBe(originalCreatedAt);

    const reloaded = storageService.getFormById(form.id);
    expect(reloaded?.title).toBe('Updated Title');
  });

  it('should duplicate a form with unique block IDs', () => {
    const block: FormBlock = {
      id: 'block_test_1',
      type: 'shortText',
      label: 'Your Name',
      required: true,
    };
    const form = storageService.createForm({
      title: 'Source Form',
      blocks: [block],
    });

    const duplicated = storageService.duplicateForm(form.id);
    expect(duplicated).not.toBeNull();
    expect(duplicated?.id).not.toBe(form.id);
    expect(duplicated?.title).toContain('Source Form');
    expect(duplicated?.blocks.length).toBe(1);
    expect(duplicated?.blocks[0].id).not.toBe(block.id);
  });

  it('should delete a form and its associated submissions', () => {
    const form = storageService.createForm({ title: 'To Delete' });
    storageService.saveSubmission(form.id, { name: 'Alice' });
    storageService.saveSubmission(form.id, { name: 'Bob' });

    expect(storageService.getSubmissions(form.id).length).toBe(2);

    const deleteSuccess = storageService.deleteForm(form.id);
    expect(deleteSuccess).toBe(true);
    expect(storageService.getFormById(form.id)).toBeNull();
    expect(storageService.getSubmissions(form.id).length).toBe(0);
  });

  it('should save and retrieve form submissions', () => {
    const form = storageService.createForm({ title: 'Survey' });
    const submission = storageService.saveSubmission(form.id, {
      fullName: 'John Doe',
      rating: 5,
    });

    expect(submission.id).toBeDefined();
    expect(submission.formId).toBe(form.id);
    expect(submission.data.fullName).toBe('John Doe');
    expect(submission.data.rating).toBe(5);

    const submissions = storageService.getSubmissions(form.id);
    expect(submissions.length).toBe(1);
    expect(submissions[0].data.fullName).toBe('John Doe');
  });

  it('should handle corrupted or invalid JSON in localStorage gracefully without crashing', () => {
    window.localStorage.setItem('formcraft_forms_v1', 'INVALID_MALFORMED_JSON{{{');
    const forms = storageService.getAllForms();
    expect(Array.isArray(forms)).toBe(true);
    expect(forms.length).toBeGreaterThan(0);
  });
});
