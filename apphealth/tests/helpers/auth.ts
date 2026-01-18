// helpers/auth.ts
import { expect, test, APIRequestContext, Page } from '@playwright/test';

export async function loginViaAPI(
    request: APIRequestContext,
    username = '67842863083',
    password = '67842'
): Promise<string> {
    const response = await request.post(
        'https://sistema.homologacao.apphealth.com.br/oauth/token',
        {
            // muitas APIs de oauth esperam form-url-encoded:
            form: {
                grant_type: 'password',
                username,
                password,
                client_id: 'APPHEALTH_WEB',
            },
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
    );

    expect(response.status(), 'Login API deve retornar 200').toBe(200); // falha clara no próprio teste
    const data = (await response.json()) as { access_token?: string };
    expect(data.access_token, 'Token deve estar presente na resposta').toBeTruthy();
    return data.access_token!;
}

export async function injectAuthToken(page: Page, token: string) {
    await page.goto('https://sistema.homologacao.apphealth.com.br/#/'); // URL absoluta
    await page.evaluate((tok) => {
        localStorage.setItem('access_token', tok);
        localStorage.setItem('token', tok);
    }, token);

    await page.context().addCookies([
        {
            name: 'access_token',
            value: token,
            url: 'https://sistema.homologacao.apphealth.com.br',
        },
    ]);

    await page.reload();
    await page.waitForLoadState('networkidle');
}

export async function login(page: Page, request: APIRequestContext) {
    const token = await loginViaAPI(request);
    await injectAuthToken(page, token);
}
