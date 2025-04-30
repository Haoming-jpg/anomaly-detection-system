import axios from 'axios';
import { uploadFrame } from './uploadFrame';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('uploadFrame', () => {
  it('sends POST request with frame blob and returns frameUrl', async () => {
    const fakeBlob = new Blob(['dummy content'], { type: 'image/png' });
    const fakeFilename = 'frame-1.png';
    const fakeFrameUrl = '/frames/frame-1.png';

    mockedAxios.post.mockResolvedValue({
      data: { frameUrl: fakeFrameUrl },
    });

    const result = await uploadFrame(fakeBlob, fakeFilename);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://3.145.95.9:5000/upload_frame',
      expect.any(FormData)
    );
    expect(result).toBe(fakeFrameUrl);
  });
});
