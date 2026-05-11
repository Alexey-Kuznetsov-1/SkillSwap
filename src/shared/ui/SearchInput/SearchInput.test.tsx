import { render, screen, fireEvent, act } from '@testing-library/react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders correctly with placeholder', () => {
    render(
      <SearchInput value="" onChange={mockOnChange} placeholder="Поиск..." />
    );
    
    const input = screen.getByPlaceholderText('Поиск...');
    expect(input).toBeInTheDocument();
  });

  test('displays value correctly', () => {
    render(
      <SearchInput value="test" onChange={mockOnChange} />
    );
    
    const input = screen.getByDisplayValue('test');
    expect(input).toBeInTheDocument();
  });

  test('calls onChange with debounce after 300ms', () => {
    render(
      <SearchInput value="" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Сразу после ввода onChange не должен вызваться
    expect(mockOnChange).not.toHaveBeenCalled();

    // Проматываем время на 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Теперь onChange должен вызваться
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  test('clears timeout when user continues typing', () => {
    render(
      <SearchInput value="" onChange={mockOnChange} />
    );

    const input = screen.getByRole('textbox');
    
    // Первый символ
    fireEvent.change(input, { target: { value: 't' } });
    
    // Проматываем 200ms (еще не 300)
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Второй символ (до истечения 300ms)
    fireEvent.change(input, { target: { value: 'te' } });
    
    // Проматываем еще 200ms
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // onChange должен вызваться только один раз с последним значением
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('te');
  });

  test('applies custom className', () => {
    const { container } = render(
      <SearchInput 
        value="" 
        onChange={mockOnChange} 
        className="custom-class" 
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});