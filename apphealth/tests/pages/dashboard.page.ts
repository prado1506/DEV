import type { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly totalEntradasCard: Locator;
  readonly totalSaidasCard: Locator;
  readonly agendaButton: Locator;
  readonly pacientesButton: Locator;
  readonly relatoriosButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalEntradasCard = page.locator('text=Total de entradas');
    this.totalSaidasCard = page.getByText(/Total de sa[ií]das/i);
    this.agendaButton = page.getByRole('link', { name: 'Agenda' });
    this.pacientesButton = page.getByRole('link', { name: 'Pacientes' });
    this.relatoriosButton = page.getByRole('link', { name: 'Relatórios' });
  }

  async goto() {
    await this.page.goto('/#/');
  }

  async navigateToAgenda() {
    await this.agendaButton.click();
  }

  async navigateToPacientes() {
    await this.pacientesButton.click();
  }

  async navigateToRelatorios() {
    await this.relatoriosButton.click();
  }

  async getTotalEntradas(): Promise<string> {
    return await this.totalEntradasCard.textContent() || '';
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.totalEntradasCard.isVisible();
  }
}
