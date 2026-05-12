import { render, screen } from '@testing-library/react';
import { WelcomeBack } from './WelcomeBack';

describe('WelcomeBack Widget', () => {
  test('renders title and text', () => {
    render(
      <WelcomeBack
        image="/test.svg"
        title="Заголовок"
        text="Описание"
      />
    );
    
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
  });
});