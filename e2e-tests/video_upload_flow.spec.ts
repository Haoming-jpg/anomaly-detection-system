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
  
  test('displays alert detail modal with frame image', async ({ page }) => {
    // Go to the main page
    await page.goto('http://localhost:3000');
  
    // Wait for alert table rows to load
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();
  
    // Click the first alert row to open the modal
    await firstRow.click();
  
    // Wait for the modal to appear
    const modalImage = page.locator('img');
    await expect(modalImage).toBeVisible();
  
    // Assert that the image src is not empty (indicating frame loaded)
    const src = await modalImage.getAttribute('src');
    expect(src).toBeTruthy(); // not null or empty
  });
  
});
