import type { Page, Locator } from '@playwright/test';

export class AgendaPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly filtrosButton: Locator;
  readonly profissionalSelect: Locator;
  readonly agendaGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('text=Horário de Atendimento');
    this.searchInput = page.getByPlaceholder('Pesquisa por nome, CPF ou telefone');
    this.filtrosButton = page.getByRole('button', { name: 'FILTROS' });
    this.profissionalSelect = page.locator('#react-select-5-input');
    this.agendaGrid = page.locator('table');
  }

  async goto() {
    await this.page.goto('/#/atendimento');
    await this.page.waitForLoadState('networkidle');
  }

  async searchByName(name: string) {
    await this.searchInput.fill(name);
    await this.page.waitForTimeout(500); // Aguardar filtro
  }

  async selectProfissional(profissional: string) {
    await this.profissionalSelect.click();
    await this.page.getByRole('option', { name: profissional }).click();
  }

  async getAppointmentCount(): Promise<number> {
    const rows = await this.agendaGrid.locator('tbody tr').count();
    return rows;
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }
}
