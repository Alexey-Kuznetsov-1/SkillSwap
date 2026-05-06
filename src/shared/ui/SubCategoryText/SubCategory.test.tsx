import { render, screen } from '@testing-library/react';
import { SubCategoryList } from './SubCategoryList';

describe('SubCategoryList', () => {
  test('renders all items when 2 or less', () => {
    render(<SubCategoryList SubCategoryArray={['Figma', 'UI']} />);
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });

  test('shows remaining count when more than 2 items', () => {
    render(<SubCategoryList SubCategoryArray={['Figma', 'UI', 'UX', 'Code']} />);
    expect(screen.getByText('Figma')).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  test('renders empty state', () => {
    render(<SubCategoryList SubCategoryArray={[]} />);
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
  });
});