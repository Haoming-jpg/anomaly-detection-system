import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Alert Table Pagination', () => {
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');

  test('displays alerts and navigates pages', async ({ page }) => {
    // Setup console + error logging for debugging
    page.on('console', msg => console.log(`[PAGE LOG] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', error => console.error('[PAGE ERROR]', error));

    // Upload video and wait for processing
    await page.goto('http://localhost:3000');
    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');

    // Validate table headers
    const headers = page.locator('thead th');
    await expect(headers).toHaveCount(4);
    await expect(headers.nth(0)).toHaveText('ID');
    await expect(headers.nth(1)).toHaveText('Time'); // 🛠 Fixed from 'Timestamp' to 'Time'
    await expect(headers.nth(2)).toHaveText('Type');
    await expect(headers.nth(3)).toHaveText('Message');

    // Verify at least one row exists
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    // Capture first row ID on page 1
    const firstRowIdBefore = await page.locator('tbody tr:first-child td:first-child').textContent();

    // Click "Next" button
    const nextPageButton = page.getByRole('button', { name: 'Next' });
    await nextPageButton.click();

    // Wait for table to update
    await page.waitForTimeout(1000);

    // Expect different first row after pagination
    const firstRowIdAfter = await page.locator('tbody tr:first-child td:first-child').textContent();
    expect(firstRowIdAfter).not.toEqual(firstRowIdBefore);

    // Optional: check that current page number incremented
    const pageLabel = page.getByText(/^Page \d+ of \d+$/);
    await expect(pageLabel).toBeVisible();
  });
  test('filters alerts by type and message', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('tbody tr');
  
    const searchInput = page.getByRole('textbox', { name: 'Search...' });
  
    // Filter by type: "traffic light"
    await searchInput.fill('traffic light');
    await page.getByRole('button', { name: 'Search by Type' }).click();
  
    const typeCells = page.locator('tbody tr td:nth-child(3)');
    const typeCount = await typeCells.count();
    expect(typeCount).toBeGreaterThan(0);    
    const typeTexts = await typeCells.allTextContents();
    for (const text of typeTexts) {
      expect(text.toLowerCase()).toContain('traffic light');
    }
  
    // Filter by message: "98.9%"
    await searchInput.fill('98.9%');
    await page.getByRole('button', { name: 'Search by Message' }).click();
  
    const messageCells = page.locator('tbody tr td:nth-child(4)');
    const messageCount = await messageCells.count();
    expect(messageCount).toBeGreaterThan(0);
    const messageTexts = await messageCells.allTextContents();
    for (const text of messageTexts) {
      expect(text).toContain('98.9%');
    }
  
    // Reset
    await page.getByRole('button', { name: 'Reset' }).click();
    const totalRows = await page.locator('tbody tr').count();
    await expect(totalRows).toBeGreaterThan(0);
  });
  
});
