import { captureFrameAsBlob } from './frameCapture';

describe('captureFrameAsBlob', () => {
  it('resolves with a blob when canvas.toBlob is called', async () => {
    // Mock canvas and toBlob behavior
    const mockBlob = new Blob(['test content'], { type: 'image/png' });

    const mockCanvas = document.createElement('canvas');
    Object.defineProperty(mockCanvas, 'toBlob', {
      value: (cb: (blob: Blob | null) => void) => cb(mockBlob),
    });

    const result = await captureFrameAsBlob(mockCanvas);
    expect(result).toBe(mockBlob);
  });
});

it('rejects when canvas.toBlob returns null', async () => {
  const mockCanvas = document.createElement('canvas');
  Object.defineProperty(mockCanvas, 'toBlob', {
    value: (cb: (blob: Blob | null) => void) => cb(null), // 👈 simulate failure
  });

  await expect(captureFrameAsBlob(mockCanvas)).rejects.toThrow('Canvas conversion to blob failed.');
});
