import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DynamicFormRenderer } from '../components/preview/DynamicFormRenderer';
import { FormSchema } from '../types/form.types';

describe('DynamicFormRenderer', () => {
  const sampleForm: FormSchema = {
    id: 'test_form',
    title: 'Test Form',
    description: 'A test form for unit testing',
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blocks: [
      {
        id: 'heading_1',
        type: 'heading',
        label: 'Section One',
        config: { headingLevel: 2 },
      },
      {
        id: 'name_input',
        type: 'shortText',
        label: 'Full Name',
        placeholder: 'Enter your name',
        required: true,
      },
      {
        id: 'email_input',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
      },
      {
        id: 'choice_input',
        type: 'multipleChoice',
        label: 'Favorite Framework',
        required: false,
        config: {
          options: [
            { id: 'opt_react', label: 'React', value: 'react' },
            { id: 'opt_vue', label: 'Vue', value: 'vue' },
          ],
        },
      },
      {
        id: 'submit_btn',
        type: 'submitButton',
        label: 'Send Application',
        config: { buttonText: 'Submit Application', alignment: 'left' },
      },
    ],
  };

  it('should render form title, description, and blocks accurately', () => {
    render(<DynamicFormRenderer form={sampleForm} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('A test form for unit testing')).toBeInTheDocument();
    expect(screen.getByText('Section One')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Submit Application')).toBeInTheDocument();
  });

  it('should enforce required field validation and show accessible error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DynamicFormRenderer form={sampleForm} onSubmit={onSubmit} />);

    // Click submit without entering required inputs
    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should validate email format and reject invalid emails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DynamicFormRenderer form={sampleForm} onSubmit={onSubmit} />);

    // Fill valid name but invalid email
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });

    await user.type(nameInput, 'Alex Morgan');
    await user.type(emailInput, 'not-an-email');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should successfully submit form when all required fields are valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DynamicFormRenderer form={sampleForm} onSubmit={onSubmit} />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitBtn = screen.getByRole('button', { name: /Submit Application/i });

    await user.type(nameInput, 'Alex Morgan');
    await user.type(emailInput, 'alex@example.com');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name_input: 'Alex Morgan',
        email_input: 'alex@example.com',
      })
    );
  });
});
