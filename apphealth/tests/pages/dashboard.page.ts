import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly agendaLink: Locator;
  readonly pacientesLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Usar heading em vez de procurar por texto específico
    this.heading = page.locator('h1, h2').first();
    this.agendaLink = page.getByRole('link', { name: /Agenda/i });
    this.pacientesLink = page.getByRole('link', { name: /Pacientes/i });
  }

  async goto() {
    await this.page.goto('/#/');
    // Aguardar a página carregar
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAgenda() {
    await this.agendaLink.click();
    await this.page.waitForURL('**/#/atendimento');
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.page.locator('main, [role="main"]').isVisible();
  }
}
