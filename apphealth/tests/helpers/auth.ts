import { Page } from '@playwright/test';

export async function login(page: Page) {
    await page.goto('/#/login');

    // Tenta preencher campos de email
    const usernameInputs = page.locator('input');
    if ((await usernameInputs.count()) > 0) {
        await usernameInputs.nth(0).fill('67842863083');
    }

    // Tenta preencher senha
    const passwordInputs = page.locator('input[type="password"]');
    if ((await passwordInputs.count()) > 0) {
        await passwordInputs.nth(0).fill('67842');
    }

    // Clica qualquer botão principal
    await page.getByRole('button').first().click();

    // Aguarda redirecionamento
    await page.waitForURL('**/#/**');
}
