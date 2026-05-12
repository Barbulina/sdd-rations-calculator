/**
 * SaveMenuForm Component Tests
 * Tests for menu save form with name, type, and save/cancel buttons
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SaveMenuForm } from '@/app/components/menu-builder/SaveMenuForm';
import { MenuType } from '@/src/domain/models/MenuType';

// Mock next/navigation
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

describe('SaveMenuForm', () => {
  let onSave: ReturnType<typeof vi.fn>;
  const mockError: string | null = null;

  beforeEach(() => {
    onSave = vi.fn();
    mockPush.mockClear();
    mockBack.mockClear();
  });

  describe('form rendering', () => {
    it('should render form with name and type inputs', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      expect(screen.getByLabelText(/name|nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/type|tipo/i)).toBeInTheDocument();
    });

    it('should render save button', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      expect(screen.getByRole('button', { name: /save|guardar/i })).toBeInTheDocument();
    });

    it('should render cancel button', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      expect(screen.getByRole('button', { name: /cancel|cancelar/i })).toBeInTheDocument();
    });
  });

  describe('name validation', () => {
    it('should show error when name is empty and form is submitted', async () => {
      const { container } = render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/name.*required|nombre.*requerido/i)).toBeInTheDocument();
      });

      expect(onSave).not.toHaveBeenCalled();
    });

    it('should show error when name exceeds 200 characters', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      const longName = 'a'.repeat(201);
      
      await userEvent.type(nameInput, longName);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(screen.getByText(/200.*character|200.*caracter/i)).toBeInTheDocument();
      });
    });

    it('should accept valid name (1-200 chars)', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      await userEvent.type(nameInput, 'Valid Menu Name');

      // Should not show error
      expect(screen.queryByText(/name.*required|nombre.*requerido/i)).not.toBeInTheDocument();
    });
  });

  describe('type validation', () => {
    it('should show error when type is not selected and form is submitted', async () => {
      const { container } = render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText(/type.*required|tipo.*requerido/i)).toBeInTheDocument();
      });
    });

    it('should display all MenuType options in select', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const typeSelect = screen.getByLabelText(/type|tipo/i) as HTMLSelectElement;
      const options = Array.from(typeSelect.options).map(opt => opt.value);

      // Should have empty option + all MenuType values
      expect(options).toContain('');
      expect(options).toContain(MenuType.BREAKFAST);
      expect(options).toContain(MenuType.LUNCH);
      expect(options).toContain(MenuType.DINNER);
      expect(options).toContain(MenuType.SNACK);
    });

    it('should accept valid type selection', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const typeSelect = screen.getByLabelText(/type|tipo/i);
      await userEvent.selectOptions(typeSelect, MenuType.BREAKFAST);

      // Should not show error
      expect(screen.queryByText(/type.*required|tipo.*requerido/i)).not.toBeInTheDocument();
    });
  });

  describe('save button disabled logic', () => {
    it('should disable save button when hasItems is false', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={false}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      expect(saveButton).toBeDisabled();
    });

    it('should disable save button when name is invalid', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      const longName = 'a'.repeat(201);
      await userEvent.type(nameInput, longName);

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when form is valid and has items', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      const typeSelect = screen.getByLabelText(/type|tipo/i);

      await userEvent.type(nameInput, 'Valid Menu');
      await userEvent.selectOptions(typeSelect, MenuType.LUNCH);

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      expect(saveButton).not.toBeDisabled();
    });
  });

  describe('save functionality', () => {
    it('should call onSave with correct data when form is valid', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      const typeSelect = screen.getByLabelText(/type|tipo/i);

      await userEvent.type(nameInput, 'Breakfast Menu');
      await userEvent.selectOptions(typeSelect, MenuType.BREAKFAST);

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('Breakfast Menu', MenuType.BREAKFAST);
      });
    });

    it('should not call onSave when name is empty', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const typeSelect = screen.getByLabelText(/type|tipo/i);
      await userEvent.selectOptions(typeSelect, MenuType.LUNCH);

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).not.toHaveBeenCalled();
      });
    });

    it('should not call onSave when type is empty', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      await userEvent.type(nameInput, 'Test Menu');

      const saveButton = screen.getByRole('button', { name: /save|guardar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSave).not.toHaveBeenCalled();
      });
    });
  });

  describe('loading state', () => {
    it('should disable save button when isLoading is true', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={true}
          error={null}
          hasItems={true}
        />
      );

      const saveButton = screen.getByRole('button', { name: /save|guardar|saving|guardando/i });
      expect(saveButton).toBeDisabled();
    });

    it('should show loading indicator when isLoading is true', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={true}
          error={null}
          hasItems={true}
        />
      );

      // Should show spinner or "Saving..." text
      expect(screen.getByText(/saving|guardando/i)).toBeInTheDocument();
    });

    it('should disable cancel button when isLoading is true', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={true}
          error={null}
          hasItems={true}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('error display', () => {
    it('should display error message when error prop is provided', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error="Failed to save menu"
          hasItems={true}
        />
      );

      expect(screen.getByText('Failed to save menu')).toBeInTheDocument();
    });

    it('should style error message with red text', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error="Error occurred"
          hasItems={true}
        />
      );

      const errorElement = screen.getByText('Error occurred');
      expect(errorElement).toHaveClass(/text-red|error/);
    });

    it('should not display error when error prop is null', () => {
      const { container } = render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      // Should not have error styling or error container
      expect(container.querySelector('.text-red-600')).not.toBeInTheDocument();
    });
  });

  describe('cancel functionality', () => {
    it('should call router.back() when cancel button is clicked', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('should not navigate when cancel is clicked during loading', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={true}
          error={null}
          hasItems={true}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      
      // Button should be disabled, click shouldn't work
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('ARIA attributes', () => {
    it('should have aria-label for name input', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      expect(nameInput).toHaveAttribute('aria-label');
    });

    it('should have aria-label for type select', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const typeSelect = screen.getByLabelText(/type|tipo/i);
      expect(typeSelect).toHaveAttribute('aria-label');
    });

    it('should have aria-describedby for error message', () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error="Test error"
          hasItems={true}
        />
      );

      // Form or error container should have role="alert"
      const errorElement = screen.getByText('Test error');
      expect(errorElement).toHaveAttribute('role', 'alert');
    });

    it('should have aria-invalid on name input when validation fails', async () => {
      render(
        <SaveMenuForm
          onSave={onSave}
          isLoading={false}
          error={null}
          hasItems={true}
        />
      );

      const nameInput = screen.getByLabelText(/name|nombre/i);
      const longName = 'a'.repeat(201);
      
      await userEvent.type(nameInput, longName);
      fireEvent.blur(nameInput);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });
});
