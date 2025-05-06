import { test, expect } from '@playwright/test';
import * as path from 'path';

test('displays video processing complete alert', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const fileInput = page.locator('[data-testid="video-upload"]');
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');
  await fileInput.setInputFiles(videoPath);

  // Capture the alert message
  const alertMessage = await new Promise<string>((resolve) => {
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toBe('Video processing complete.');
      resolve(dialog.message());
    });
  });

  expect(alertMessage).toBe('Video processing complete.');
});