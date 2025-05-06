import { test, expect } from '@playwright/test';
import path from 'path';

test.describe.serial('Alert Table Pagination', () => {
  const videoPath = path.resolve(__dirname, '../tests/assets/test.mp4');

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
    await page.waitForSelector('[data-testid="status-message"]');
    await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
  });

  test('displays alerts and navigates pages', async ({ page }) => {
    const headers = page.locator('thead th');
    await expect(headers).toHaveCount(4);
    await expect(headers.nth(0)).toHaveText('ID');
    await expect(headers.nth(1)).toHaveText('Time');
    await expect(headers.nth(2)).toHaveText('Type');
    await expect(headers.nth(3)).toHaveText('Message');

    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);

    const firstRowIdBefore = await page.locator('tbody tr:first-child td:first-child').textContent();

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1000);

    const firstRowIdAfter = await page.locator('tbody tr:first-child td:first-child').textContent();
    expect(firstRowIdAfter).not.toEqual(firstRowIdBefore);

    const pageLabel = page.getByText(/^Page \d+ of \d+$/);
    await expect(pageLabel).toBeVisible();
  });

  test('filters alerts by type and message', async ({ page }) => {
    const initialCount = await page.locator('tbody tr').count();
    expect(initialCount).toBeGreaterThan(0);

    const searchInput = page.getByRole('textbox', { name: 'Search...' });

    // Filter by type
    await searchInput.fill('a'); // use substring to improve match likelihood
    await page.getByRole('button', { name: 'Search by Type' }).click();

    const filteredCountByType = await page.locator('tbody tr').count();
    expect(filteredCountByType).toBeLessThanOrEqual(initialCount);
    expect(filteredCountByType).toBeGreaterThan(0);

    // Filter by message
    await searchInput.fill('confidence');
    await page.getByRole('button', { name: 'Search by Message' }).click();

    const filteredCountByMessage = await page.locator('tbody tr').count();
    expect(filteredCountByMessage).toBeLessThanOrEqual(initialCount);
    expect(filteredCountByMessage).toBeGreaterThan(0);

    // Reset
    await page.getByRole('button', { name: 'Reset' }).click();
    const resetCount = await page.locator('tbody tr').count();
    expect(resetCount).toBeGreaterThanOrEqual(filteredCountByMessage);
    expect(resetCount).toBeGreaterThan(0);
  });

  test('displays alert details in modal', async ({ page }) => {
    const firstRow = page.locator('tbody tr:first-child');
    await firstRow.click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const modalText = modal.locator('p, td, div');

    expect(await modalText.filter({ hasText: 'ID' }).count()).toBeGreaterThan(0);
    expect(await modalText.filter({ hasText: 'Type' }).count()).toBeGreaterThan(0);
    expect(await modalText.filter({ hasText: 'Message' }).count()).toBeGreaterThan(0);
    expect(await modalText.filter({ hasText: 'Time' }).count()).toBeGreaterThan(0);

    const image = modal.locator('img');
    await expect(image).toBeVisible();
    const src = await image.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('closes alert detail modal', async ({ page }) => {
    await page.locator('tbody tr:first-child').click();

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    const closeButton = modal.getByRole('button', { name: /close/i });
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });
});
