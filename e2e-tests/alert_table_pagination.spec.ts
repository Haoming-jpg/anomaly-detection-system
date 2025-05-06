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
    const searchInput = page.getByRole('textbox', { name: 'Search...' });

    await searchInput.fill('traffic light');
    await page.getByRole('button', { name: 'Search by Type' }).click();

    const typeCells = page.locator('tbody tr td:nth-child(3)');
    const typeCount = await typeCells.count();
    expect(typeCount).toBeGreaterThan(0);
    const typeTexts = await typeCells.allTextContents();
    for (const text of typeTexts) {
      expect(text.toLowerCase()).toContain('traffic light');
    }

    await searchInput.fill('98.9%');
    await page.getByRole('button', { name: 'Search by Message' }).click();

    const messageCells = page.locator('tbody tr td:nth-child(4)');
    const messageCount = await messageCells.count();
    expect(messageCount).toBeGreaterThan(0);
    const messageTexts = await messageCells.allTextContents();
    for (const text of messageTexts) {
      expect(text).toContain('98.9%');
    }

    await page.getByRole('button', { name: 'Reset' }).click();
    const totalRows = await page.locator('tbody tr').count();
    expect(totalRows).toBeGreaterThan(0);
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
