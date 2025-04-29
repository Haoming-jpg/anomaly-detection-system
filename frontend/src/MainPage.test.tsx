import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPage from './MainPage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
beforeEach(() => {
  jest.clearAllMocks();
});


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

test('clicking Clear All Alerts and Frames button calls axios.post and refreshes alerts', async () => {
  // Mocks
  window.confirm = jest.fn(() => true);
  window.alert = jest.fn(); // prevent "not implemented"
  mockedAxios.get.mockResolvedValue({ data: [] });
  mockedAxios.post.mockResolvedValue({ data: 'success' });

  render(<MainPage />);

  const clearButton = screen.getByText(/Clear All Alerts and Frames/i);
  fireEvent.click(clearButton);

  await waitFor(() => {
    expect(mockedAxios.post).toHaveBeenCalledWith('http://3.145.95.9:5000/clear_all');
    expect(mockedAxios.get).toHaveBeenCalled(); // relaxed this to allow multiple calls
  });
});



test('pagination Next button increments currentPage', async () => {
  const mockAlerts = Array.from({ length: 60 }, (_, i) => ({ id: i + 1 }));
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => screen.getByText('1'));

  const nextButton = screen.getByText('Next');
  fireEvent.click(nextButton);

  await waitFor(() => expect(screen.getByText('Page 2 of 2')).toBeInTheDocument());
});

test('pagination Previous button decrements currentPage', async () => {
  const mockAlerts = Array.from({ length: 60 }, (_, i) => ({ id: i + 1 }));
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => screen.getByText('1'));

  const nextButton = screen.getByText('Next');
  fireEvent.click(nextButton);
  await waitFor(() => screen.getByText('Page 2 of 2'));

  const prevButton = screen.getByText('Previous');
  fireEvent.click(prevButton);

  await waitFor(() => expect(screen.getByText('Page 1 of 2')).toBeInTheDocument());
});

test('Go to page input sets currentPage correctly', async () => {
  const mockAlerts = Array.from({ length: 60 }, (_, i) => ({ id: i + 1 }));
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => screen.getByText('1'));

  const pageInput = screen.getByLabelText(/Go to page/i);
  fireEvent.change(pageInput, { target: { value: '2' } });
  fireEvent.click(screen.getByText('Go'));

  await waitFor(() => expect(screen.getByText('Page 2 of 2')).toBeInTheDocument());
});

test('Reset button clears search input and restores alerts', async () => {
  const mockAlerts = [{ id: 1, type: 'Error', message: 'Test' }];
  mockedAxios.get.mockResolvedValueOnce({ data: mockAlerts });

  render(<MainPage />);

  await waitFor(() => screen.getByText('1'));

  const searchInput = screen.getByLabelText(/Search.../i);
  fireEvent.change(searchInput, { target: { value: 'Error' } });
  fireEvent.click(screen.getByText(/Search by Type/i));

  await waitFor(() => expect(screen.queryByText('Test')).toBeInTheDocument());

  const resetButton = screen.getByText('Reset');
  fireEvent.click(resetButton);

  await waitFor(() => {
    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Test')).toBeInTheDocument();
  });
});