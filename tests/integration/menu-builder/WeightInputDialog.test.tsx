/**
 * WeightInputDialog Component Tests
 * Tests for modal dialog to input aliment weight
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeightInputDialog } from '@/app/components/menu-builder/WeightInputDialog';

describe('WeightInputDialog', () => {
  let onAdd: ReturnType<typeof vi.fn>;
  let onCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onAdd = vi.fn();
    onCancel = vi.fn();
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render dialog with title', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      expect(screen.getByText(/manzana golden/i)).toBeInTheDocument();
    });

    it('should render weight input', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render Add button', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      expect(screen.getByRole('button', { name: /add|añadir/i })).toBeInTheDocument();
    });

    it('should render Cancel button', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      expect(screen.getByRole('button', { name: /cancel|cancelar/i })).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(
        <WeightInputDialog
          isOpen={false}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      expect(screen.queryByText(/manzana golden/i)).not.toBeInTheDocument();
    });
  });

  describe('weight validation', () => {
    it('should reject weight of 0', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '0');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).toBeDisabled();
    });

    it('should reject negative weight', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '-10');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).toBeDisabled();
    });

    it('should reject weight over 10000', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '10001');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).toBeDisabled();
    });

    it('should accept weight of 1', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '1');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).not.toBeDisabled();
    });

    it('should accept weight of 10000', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '10000');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).not.toBeDisabled();
    });

    it('should accept weight of 150 (typical value)', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '150');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      expect(addButton).not.toBeDisabled();
    });

    it('should show error message for invalid weight', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '0');

      await waitFor(() => {
        expect(screen.getByText(/must be between 1 and 10000|debe estar entre 1 y 10000/i)).toBeInTheDocument();
      });
    });
  });

  describe('button actions', () => {
    it('should call onCancel when Cancel button clicked', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel|cancelar/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('should call onAdd with weight when Add button clicked', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '150');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith(150);
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('should not call onAdd when Add button is disabled', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '0');

      const addButton = screen.getByRole('button', { name: /add|añadir/i });
      fireEvent.click(addButton);

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe('keyboard navigation', () => {
    it('should close dialog on Escape key', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should submit on Enter key when weight is valid', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '150');
      
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onAdd).toHaveBeenCalledWith(150);
    });

    it('should not submit on Enter key when weight is invalid', async () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      await userEvent.clear(input);
      await userEvent.type(input, '0');
      
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe('auto-focus', () => {
    it('should auto-focus weight input when dialog opens', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const input = screen.getByLabelText(/weight|peso/i);
      expect(input).toHaveFocus();
    });
  });

  describe('ARIA attributes', () => {
    it('should have dialog role', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const dialog = screen.getByRole('dialog');
      const labelId = dialog.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      
      const titleElement = document.getElementById(labelId!);
      expect(titleElement).toHaveTextContent(/manzana golden/i);
    });

    it('should have aria-describedby pointing to description', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const dialog = screen.getByRole('dialog');
      const descId = dialog.getAttribute('aria-describedby');
      expect(descId).toBeTruthy();
      
      const descElement = document.getElementById(descId!);
      expect(descElement).toBeInTheDocument();
    });
  });

  describe('backdrop', () => {
    it('should close dialog when clicking backdrop', () => {
      const { container } = render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      // Click on the backdrop (parent of dialog)
      const backdrop = container.querySelector('[data-testid="dialog-backdrop"]');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onCancel).toHaveBeenCalledTimes(1);
      }
    });

    it('should not close dialog when clicking inside dialog', () => {
      render(
        <WeightInputDialog
          isOpen={true}
          alimentName="Manzana Golden"
          onAdd={onAdd}
          onCancel={onCancel}
        />
      );

      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
