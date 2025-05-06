import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Direct Page Navigation', () => {
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');

  test('navigates to valid page using Go to page input', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');

    //Wait for the input to exist before accessing it
    await page.waitForSelector('[data-testid="page-input"]');
    const input = page.getByTestId('page-input');
    const goButton = page.getByRole('button', { name: 'Go' });

    const initialFirstRow = await page.locator('tbody tr:first-child td:first-child').textContent();

    await input.fill('2');
    await goButton.click();

    await expect(page.getByText(/Page 2 of/i)).toBeVisible();

    const newFirstRow = await page.locator('tbody tr:first-child td:first-child').textContent();
    expect(newFirstRow).not.toEqual(initialFirstRow);
  });

  test('shows inline error for invalid page number', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');

    await page.waitForSelector('[data-testid="page-input"]');
    const input = page.getByTestId('page-input');
    const goButton = page.getByRole('button', { name: 'Go' });

    await input.fill('0');
    await goButton.click();

    const errorText = page.getByTestId('pagination-error');
    await expect(errorText).toHaveText('Invalid page number');
  });
});
