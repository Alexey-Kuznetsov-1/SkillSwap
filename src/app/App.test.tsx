import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders heading and increments counter', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /get started/i }),
    ).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /count is 0/i });
    await user.click(button);
    expect(
      screen.getByRole('button', { name: /count is 1/i }),
    ).toBeInTheDocument();
  });
});
