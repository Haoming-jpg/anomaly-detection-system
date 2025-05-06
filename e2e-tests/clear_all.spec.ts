import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Clear All Alerts and Frames', () => {
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');

  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => console.log('Page error:', err.message));
    await page.goto('http://localhost:3000');
    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
  });

  test('successfully clears alerts and shows success message', async ({ page }) => {
    const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');
  
    // ✅ Inject confirm override BEFORE page load
    await page.addInitScript(() => {
      window.confirm = () => true;
    });
  
    // ✅ Mock POST /clear_all to simulate success
    await page.route('**/clear_all', (route) => {
      route.fulfill({ status: 200 });
    });
  
    // ✅ Mock GET /alerts to simulate an empty table after clearing
    await page.route('**/alerts', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      });
    });
  
    // Visit app and upload video
    await page.goto('http://localhost:3000');
    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
  
    // Click the clear button
    await page.getByTestId('clear-all-button').click();
  
    //Assert success status and empty table
    await expect(page.getByTestId('clear-status')).toHaveText('All alerts and frames cleared!');
    await expect(page.locator('tbody tr')).toHaveCount(0);
  });
  
  

  // test('handles failed clear and shows error message', async ({ page }) => {
  //   // Repopulate alerts by re-uploading
  //   await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
  //   await page.waitForSelector('[data-testid="status-message"]');

  //   // Mock failed clear response
  //   await page.route('**/clear_all', (route) => {
  //     route.fulfill({ status: 500 });
  //   });

  //   // Confirm the action
  //   page.addInitScript(() => {
  //     window.confirm = () => true;
  //   });

  //   // Attempt clear
  //   await page.getByTestId('clear-all-button').click();

  //   // Verify failure
  //   await expect(page.getByTestId('clear-status')).toHaveText('Failed to clear alerts and frames.');
  //   const rowCount = await page.locator('tbody tr').count();
  //   expect(rowCount).toBeGreaterThan(0);
  // });
});
