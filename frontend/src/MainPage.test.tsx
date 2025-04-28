import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPage from './MainPage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  (axios.get as jest.Mock).mockResolvedValue({ data: [] });
});


test('renders Search Criteria heading', async () => {
  render(<MainPage />);
  const headingElement = await screen.findByText(/Search Criteria/i);
  expect(headingElement).toBeInTheDocument();
});
