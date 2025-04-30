import axios from 'axios';
import { createAlertFromDetection } from './createAlert';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

it('sends POST request with correct payload', async () => {
  const mockDetection = {
    classId: 1,
    score: 0.95,
    bbox: [0, 0, 100, 100] as [number, number, number, number], // 👈 tuple type!
  };  
  const frameUrl = '/frames/frame-123.png';

  mockedAxios.post.mockResolvedValue({ data: { success: true } });

  await createAlertFromDetection(mockDetection, frameUrl);

  expect(mockedAxios.post).toHaveBeenCalledWith(
    'http://3.145.95.9:5000/alerts',
    expect.objectContaining({
      type: 'bicycle',
      message: expect.stringContaining('95'),
      frame_url: frameUrl,
      timestamp: expect.any(String),
    })
  );
  
});

it('falls back to "object" type when classId is invalid', async () => {
  const mockDetection = {
    classId: 999, // invalid index
    score: 0.88,
    bbox: [0, 0, 100, 100] as [number, number, number, number],
  };
  const frameUrl = '/frames/frame-999.png';

  mockedAxios.post.mockResolvedValue({ data: { success: true } });

  await createAlertFromDetection(mockDetection, frameUrl);

  expect(mockedAxios.post).toHaveBeenCalledWith(
    'http://3.145.95.9:5000/alerts',
    expect.objectContaining({
      type: 'object', // fallback
      message: expect.stringContaining('88.0% confidence'),
      frame_url: frameUrl,
      timestamp: expect.any(String),
    })
  );
});
