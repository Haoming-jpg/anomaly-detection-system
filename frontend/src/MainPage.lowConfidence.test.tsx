import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

(global as any).ImageData = class {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
};

global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-url');

// Mock getContext for canvas
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    drawImage: jest.fn(),
    putImageData: jest.fn(),
    getImageData: jest.fn(() => new (global as any).ImageData(640, 640)),
  }),
});

jest.mock('./utils/yoloDetection', () => ({
  extractFramesFromVideo: jest.fn(() => Promise.resolve([new ImageData(640, 640)])),
  runYoloDetection: jest.fn(() =>
    Promise.resolve([{ classId: 99, score: 0.2, bbox: [0, 0, 100, 100] }])
  ),
}));

jest.mock('./utils/frameCapture', () => ({
  captureFrameAsBlob: jest.fn(),
}));
jest.mock('./utils/uploadFrame', () => ({
  uploadFrame: jest.fn(),
}));
jest.mock('./utils/createAlert', () => ({
  createAlertFromDetection: jest.fn(),
}));
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

test('logs when no high-confidence detections are found in a frame', async () => {
  console.log = jest.fn(); // Spy on logs
  const MainPage = (await import('./MainPage')).default;

  render(<MainPage />);

  const file = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });
  const input = screen.getByTestId('video-upload');

  await act(async () => {
    fireEvent.change(input, { target: { files: [file] } });
  });

  // Now check logs
  const found = (console.log as jest.Mock).mock.calls.some(call =>
    call.some((msg: string) => typeof msg === 'string' && msg.includes('No high-confidence detections'))
  );

  expect(found).toBe(true);
});
