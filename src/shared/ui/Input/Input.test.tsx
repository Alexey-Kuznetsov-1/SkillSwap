import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders with value', () => {
    render(<Input value="test" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'hello' } });
    
    expect(handleChange).toHaveBeenCalledWith('hello');
  });

  it('displays placeholder', () => {
    render(<Input value="" onChange={() => {}} placeholder="Введите имя" />);
    expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
  });

  it('applies error class when error prop is true', () => {
    const { container } = render(<Input value="" onChange={() => {}} error />);
    expect(container.querySelector('.error')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders with left icon', () => {
    const { container } = render(
      <Input value="" onChange={() => {}} leftIcon={<span>🔍</span>} />
    );
    expect(container.querySelector('.leftIcon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const { container } = render(
      <Input value="" onChange={() => {}} rightIcon={<span>👁️</span>} />
    );
    expect(container.querySelector('.rightIcon')).toBeInTheDocument();
  });
});