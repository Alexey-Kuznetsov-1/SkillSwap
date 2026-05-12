import { render, screen } from '@testing-library/react';
import { OfferDone } from './OfferDone';

describe('OfferDone Widget', () => {
  test('renders default title and text', () => {
    render(<OfferDone />);
    
    expect(screen.getByText('Ваше предложение создано')).toBeInTheDocument();
    expect(screen.getByText(/теперь другие пользователи/)).toBeInTheDocument();
  });

  test('renders custom props', () => {
    render(
      <OfferDone 
        title="Кастомный заголовок"
        text="Кастомный текст"
      />
    );
    
    expect(screen.getByText('Кастомный заголовок')).toBeInTheDocument();
    expect(screen.getByText('Кастомный текст')).toBeInTheDocument();
  });
});