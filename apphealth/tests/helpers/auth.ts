import { Page, expect } from '@playwright/test';

export async function login(page: Page, cpf: string = '67842863083', senha: string = '67842') {
    console.log('🔐 Iniciando login...');

    await page.goto('/#/login', { waitUntil: 'networkidle' });

    console.log('📝 Preenchendo CPF:', cpf);
    await page.getByRole('textbox', { name: 'CPF' }).fill(cpf);

    console.log('🔑 Preenchendo Senha');
    await page.getByRole('textbox', { name: 'Senha' }).fill(senha);

    console.log('🔘 Clicando no botão de Login');
    await Promise.all([
        await page.getByRole('button', { name: 'Entrar' }).click(),
        await page.waitForNavigation({ waitUntil: 'networkidle' }), // Espera a navegação completar após o login
    ]);

    await expect(page.getByText('Dashboard')).toBeVisible();

    console.log('🔥 Login confirmado, dashboard carregado!');
    return true;
}

export async function logout(page: Page) {
    console.log('🚪 Efetuando logout...');
    const userMenu = page.getByRole('button').filter({ hasText: /avatar|user|menu|profile/i }).last();
    if (await userMenu.isVisible()) await userMenu.click();
    const logoutButton = page.getByRole('menuitem', { name: /logout|sair|exit/i });
    if (await logoutButton.isVisible()) await logoutButton.click();
    console.log('👋 Sessão encerrada!');
}