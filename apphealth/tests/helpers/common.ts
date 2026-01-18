import type { Page } from '@playwright/test';

export class CommonHelpers {
  static async waitForElement(page: Page, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
  }

  static async fillFormField(page: Page, label: string, value: string) {
    const input = page.locator(`label:has-text("${label}") + input`);
    await input.fill(value);
  }

  static async clickButton(page: Page, buttonText: string) {
    await page.getByRole('button', { name: buttonText }).click();
  }

  static async getToastMessage(page: Page): Promise<string> {
    const toast = page.locator('[class*="toast"], [role="alert"]');
    return await toast.textContent() || '';
  }
}
