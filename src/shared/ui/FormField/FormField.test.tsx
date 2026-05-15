import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders label and children', () => {
    render(
      <FormField label="Тестовое поле">
        <input />
      </FormField>
    );

    expect(screen.getByText('Тестовое поле')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required asterisk when required is true', () => {
    render(
      <FormField label="Обязательное поле" required>
        <input />
      </FormField>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormField label="Поле с ошибкой" error="Это поле обязательно">
        <input />
      </FormField>
    );

    expect(screen.getByText('Это поле обязательно')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('does not show error message when error is empty', () => {
    render(
      <FormField label="Поле без ошибки" error="">
        <input />
      </FormField>
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});