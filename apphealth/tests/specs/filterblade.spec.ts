import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.filterblade.xyz/?game=Poe2');

  await page.getByRole('button', { name: 'CUSTOMIZE' }).click();
  await page.getByText('General CurrencyRESET0changes').click();
  await expect(page.locator('#VisualText5title')).toMatchAriaSnapshot(`
    - text: General Currency
  `);
  await page.getByText('Basics').click();
  await page.getByText('Basics').click();
  await page.getByText('General Currency').click();
  await page.getByRole('button', { name: 'OVERVIEW' }).click();
  await expect(page.locator('#SelectionButton0')).toMatchAriaSnapshot(`
    - button "OVERVIEW"
  `);
  await expect(page.getByRole('button', { name: 'OVERVIEW' })).toBeVisible();
  await page.getByRole('button', { name: 'OVERVIEW' }).click();
  await expect(page.getByRole('button', { name: 'OVERVIEW' })).toBeVisible();
  await expect(page.locator('#SelectionButton0')).toContainText('OVERVIEW');
  await expect(page.locator('#SelectionButton0')).toMatchAriaSnapshot(`
    - button "OVERVIEW"
  `);
  
});