import { runYoloDetection, extractFramesFromVideo } from './yoloDetection';

beforeAll(() => {
  (global as any).URL.createObjectURL = jest.fn(() => 'blob:http://localhost/video');
  (global as any).URL.revokeObjectURL = jest.fn();
});

afterAll(() => {
  (global as any).URL.createObjectURL = undefined;
});

jest.mock('onnxruntime-web', () => {
  return {
    InferenceSession: {
      create: jest.fn(() => Promise.resolve({
        inputNames: ['input'], //mock input name
        run: jest.fn(() => Promise.resolve({
          output: {
            data: new Float32Array([
              1, 0.95, 10, 20, 30, 40,
              2, 0.3,  15, 25, 35, 45
            ]),
            dims: [2, 6]
          }
        }))
      }))
    },
    Tensor: jest.fn().mockImplementation((type, data, dims) => ({
      type,
      data,
      dims
    }))
  };
});



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
(global as any).createImageBitmap = jest.fn(() =>
  Promise.resolve({
    width: 640,
    height: 640,
    close: jest.fn(),
  } as unknown as ImageBitmap)
);

describe('runYoloDetection', () => {
  it('filters out low-confidence detections and maps output', async () => {
    const mockImageData = new (global as any).ImageData(640, 640);

    const result = await runYoloDetection(mockImageData);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);

    expect(result[0]).toEqual(
      expect.objectContaining({
        classId: expect.any(Number),
        score: expect.any(Number),
        bbox: expect.arrayContaining([
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number)
        ])
      })
    );    
  });
});
it('rejects if canvas.getContext returns null', async () => {
  // Mock getContext to return null
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => null
  });

  const mockFile = new File(['dummy'], 'video.mp4', { type: 'video/mp4' });

  await expect(extractFramesFromVideo(mockFile, 1000)).rejects.toThrow('Failed to get canvas context');
});

it('extracts one frame after loadedmetadata and seeked events', async () => {
  const mockFile = new File(['dummy'], 'test.mp4', { type: 'video/mp4' });

  // Stub ImageData and getContext
  (global as any).ImageData = class {
    width = 640;
    height = 640;
    data = new Uint8ClampedArray(640 * 640 * 4);
  };

  const mockCtx = {
    drawImage: jest.fn(),
    getImageData: jest.fn(() => new (global as any).ImageData(640, 640)),
  };

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => mockCtx,
  });

  // Intercept <video> so we can control event simulation
  const originalCreateElement = document.createElement;
  jest.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'video') {
      const video: any = originalCreateElement.call(document, 'video');
      video.addEventListener = jest.fn((event, cb) => {
        if (event === 'loadedmetadata') setTimeout(cb, 0);
        if (event === 'seeked') setTimeout(cb, 1);
      });
      Object.defineProperty(video, 'duration', {
        get: () => 0.5
      });      
      return video;
    }
    return originalCreateElement.call(document, tag);
  });

  const frames = await extractFramesFromVideo(mockFile, 1000);
  expect(Array.isArray(frames)).toBe(true);
  expect(frames.length).toBe(1);
});
