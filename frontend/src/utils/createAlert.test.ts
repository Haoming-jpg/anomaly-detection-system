import axios from 'axios';
import { createAlertFromDetection } from './createAlert';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;



describe('createAlertFromDetection', () => {
it('sends POST request with correct payload', async () => {
  const mockDetection = {
    classId: 'object',
    score: 0.95,
    bbox: [0, 0, 100, 100],
  };
  const frameUrl = '/frames/frame-123.png';

  mockedAxios.post.mockResolvedValue({ data: { success: true } });

  await createAlertFromDetection(mockDetection, frameUrl);

  expect(mockedAxios.post).toHaveBeenCalledWith(
    'http://3.145.95.9:5000/alerts',
    expect.objectContaining({
      type: 'object',
      message: expect.stringContaining('95'),
      frame_url: frameUrl,
      timestamp: expect.any(String), // 👈 we allow the function to generate timestamp
    })
  );
});

});
