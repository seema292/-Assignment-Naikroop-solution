import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { storageService } from '../services/storageService';
import { createBlock } from '../utils/blockRegistry';
import { DynamicFormRenderer } from '../components/preview/DynamicFormRenderer';

describe('End-to-End User Journey Simulation', () => {
  beforeEach(() => {
    storageService.clearAllData();
  });

  it('executes full flow: Create Form -> Add Blocks -> Configure -> Preview -> Save -> Reopen -> Publish -> Submit -> View Responses', async () => {
    // 1. Create Form
    const newForm = storageService.createForm({
      title: 'Senior Developer Survey',
      description: 'Engineering feedback on frontend architectures',
      status: 'draft',
      blocks: [
        createBlock('heading'),
        createBlock('shortText', 'blk_name'),
        createBlock('email', 'blk_email'),
      ],
    });
    expect(newForm.id).toBeDefined();
    expect(newForm.title).toBe('Senior Developer Survey');

    // 2. Add New Blocks (Rating and Multiple Choice)
    const ratingBlock = createBlock('rating', 'blk_rating');
    ratingBlock.label = 'Rate your developer velocity';
    ratingBlock.required = true;

    const choiceBlock = createBlock('multipleChoice', 'blk_choice');
    choiceBlock.label = 'Primary State Manager';
    choiceBlock.config = {
      options: [
        { id: 'opt_1', label: 'Zustand', value: 'zustand' },
        { id: 'opt_2', label: 'Redux Toolkit', value: 'redux' },
      ],
    };

    const updatedBlocks = [...newForm.blocks, ratingBlock, choiceBlock];

    // 3. Configure and Save Form (Simulating Editor auto-save)
    const savedForm = storageService.updateForm(newForm.id, {
      blocks: updatedBlocks,
    });
    expect(savedForm?.blocks.length).toBe(5);

    // 4. Reopen and verify persistence
    const reopened = storageService.getFormById(newForm.id);
    expect(reopened).not.toBeNull();
    expect(reopened?.blocks.length).toBe(5);
    expect(reopened?.blocks[3].type).toBe('rating');

    // 5. Render in DynamicFormRenderer (Preview / Public page)
    const onSubmit = (data: Record<string, any>) => {
      storageService.saveSubmission(reopened!.id, data);
    };

    render(<DynamicFormRenderer form={reopened!} onSubmit={onSubmit} />);

    expect(screen.getByText('Senior Developer Survey')).toBeInTheDocument();
    expect(screen.getByText('Engineering feedback on frontend architectures')).toBeInTheDocument();
    expect(screen.getByText('Rate your developer velocity')).toBeInTheDocument();
    expect(screen.getByText('Primary State Manager')).toBeInTheDocument();

    // 6. Publish Form
    const published = storageService.updateForm(newForm.id, {
      status: 'published',
    });
    expect(published?.status).toBe('published');

    // 7. Submit Response
    const submission = storageService.saveSubmission(published!.id, {
      blk_name: 'Sarah Connor',
      blk_email: 'sarah@sky.net',
      blk_rating: 5,
      blk_choice: 'zustand',
    });
    expect(submission.id).toBeDefined();

    // 8. View Submissions
    const submissions = storageService.getSubmissions(published!.id);
    expect(submissions.length).toBe(1);
    expect(submissions[0].data.blk_name).toBe('Sarah Connor');
    expect(submissions[0].data.blk_email).toBe('sarah@sky.net');
    expect(submissions[0].data.blk_rating).toBe(5);
    expect(submissions[0].data.blk_choice).toBe('zustand');
  });
});
