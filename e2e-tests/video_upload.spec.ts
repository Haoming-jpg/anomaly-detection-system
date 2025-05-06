import { test, expect } from '@playwright/test';
import path from 'path';

test('uploads video and displays preview', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const fileInput = page.locator('[data-testid="video-upload"]');
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');
  await fileInput.setInputFiles(videoPath);

  await expect(page.getByText('Video Preview')).toBeVisible();
});
