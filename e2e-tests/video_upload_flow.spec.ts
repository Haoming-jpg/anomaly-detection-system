import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Video Upload and Processing Flow', () => {
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');

  test('uploads video and displays preview', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const fileInput = page.locator('[data-testid="video-upload"]');
    await fileInput.setInputFiles(videoPath);

    await expect(page.getByText('Video Preview')).toBeVisible();
  });

  test('displays video processing complete alert', async ({ page }) => {
    page.on('pageerror', (err) => {
      console.log('[PAGE ERROR]', err);
    });
  
    const videoPath = path.resolve(__dirname, '../tests/assets/test-fresh.mp4');
  
    page.on('console', (msg) => {
      console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`);
    });
  
    await page.goto('http://localhost:3000');
  
    const fileInput = page.locator('[data-testid="video-upload"]');
    await fileInput.setInputFiles(videoPath);
  
    // 🔑 Ensure the message appears in the DOM before asserting its text
    await page.waitForSelector('[data-testid="status-message"]');
  
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
  });
  
  
});
