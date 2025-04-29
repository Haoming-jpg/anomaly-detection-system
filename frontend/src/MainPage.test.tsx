import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPage from './MainPage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockedAxios.get.mockResolvedValue({ data: [] });
});

test('renders Search Criteria heading', async () => {
  render(<MainPage />);
  const headingElement = await screen.findByText(/Search Criteria/i);
  expect(headingElement).toBeInTheDocument();
});

test('fetches alerts and renders table rows', async () => {
  const mockAlerts = [
    { id: 1, timestamp: '2023-01-01T00:00:00', type: 'Error', message: 'Test alert', frame_url: 'test.jpg' },
    { id: 2, timestamp: '2023-01-02T00:00:00', type: 'Warning', message: 'Another alert', frame_url: 'test2.jpg' },
  ];
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3)); // Header + 2 rows
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('Error')).toBeInTheDocument();
  expect(screen.getByText('Test alert')).toBeInTheDocument();
});

test('searches by type and filters table', async () => {
  const mockAlerts = [
    { id: 1, type: 'Error', message: 'Critical error' },
    { id: 2, type: 'Warning', message: 'System warning' },
  ];
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(3));

  const searchInput = screen.getByLabelText(/Search.../i);
  fireEvent.change(searchInput, { target: { value: 'Error' } });
  const searchButton = screen.getByText(/Search by Type/i);
  fireEvent.click(searchButton);

  await waitFor(() => {
    expect(screen.queryByText('System warning')).not.toBeInTheDocument();
    expect(screen.getByText('Critical error')).toBeInTheDocument();
  });
});

test('clicking table row opens dialog', async () => {
  const mockAlerts = [{ id: 1, timestamp: '2023-01-01T00:00:00', type: 'Error', message: 'Test', frame_url: 'test.jpg' }];
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => screen.getByText('1'));

  const row = screen.getByRole('row', { name: /1/i });
  fireEvent.click(row);

  await waitFor(() => {
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Test');
    expect(dialog).toHaveTextContent('Error');
  });
});
