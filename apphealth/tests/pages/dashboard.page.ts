import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly agendaLink: Locator;
  readonly pacientesLink: Locator;
  readonly relatoriosLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1, h2').first();
    this.agendaLink = page.getByRole('link', { name: /Agenda/i });
    this.pacientesLink = page.getByRole('link', { name: /Pacientes/i });
    this.relatoriosLink = page.getByRole('link', { name: /Relatórios/i });
  }

  async goto() {
    await this.page.goto('/#/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToAgenda() {
    await this.agendaLink.click();
    await this.page.waitForURL('**/#/atendimento');
  }

  async navigateToPacientes() {
    await this.pacientesLink.click();
    await this.page.waitForURL('**/#/sujeitos-de-atencao');
  }

  async navigateToRelatorios() {
    await this.relatoriosLink.click();
    await this.page.waitForURL('**/#/relatorios**');
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      return await this.page.locator('main, [role="main"]').isVisible({ timeout: 5000 });
    } catch {
      return false;
    }
  }
}
