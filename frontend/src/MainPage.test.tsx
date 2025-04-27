import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPage from './MainPage';

test('renders Search Criteria heading', () => {
  render(<MainPage />);
  const headingElement = screen.getByText(/Search Criteria/i);
  expect(headingElement).toBeInTheDocument();
});
