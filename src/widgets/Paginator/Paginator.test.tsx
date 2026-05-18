import { render, screen, fireEvent } from '@testing-library/react';
import { Paginator } from './Paginator';

describe('Paginator', () => {
  const mockOnChange = jest.fn();

  test('does not render when totalPages <= 1', () => {
    const { container } = render(<Paginator currentPage={1} totalPages={1} onChange={mockOnChange} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders page numbers and calls onChange on click', () => {
    render(<Paginator currentPage={1} totalPages={3} onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('2'));
    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  test('disables "Previous" button on first page', () => {
    render(<Paginator currentPage={1} totalPages={5} onChange={mockOnChange} />);
    expect(screen.getByText('← Назад')).toBeDisabled();
  });

  test('disables "Next" button on last page', () => {
    render(<Paginator currentPage={5} totalPages={5} onChange={mockOnChange} />);
    expect(screen.getByText('Вперед →')).toBeDisabled();
  });
});