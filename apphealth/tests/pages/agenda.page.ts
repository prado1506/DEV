import { Page, Locator } from '@playwright/test';

export class AgendaPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly agendaTable: Locator;
  readonly profissionalSelect: Locator;
  readonly filtrosButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('text=Horário de Atendimento');
    this.searchInput = page.getByPlaceholder(/Pesquisa por nome, CPF ou telefone/i);
    this.agendaTable = page.locator('table').first();
    this.profissionalSelect = page.locator('[id*="react-select"]').first();
    this.filtrosButton = page.getByRole('button', { name: /Filtros/i });
  }

  async goto() {
    await this.page.goto('/#/atendimento');
    await this.page.waitForLoadState('networkidle');
  }

  async searchByName(name: string) {
    console.log(`🔍 Pesquisando por: ${name}`);
    await this.searchInput.fill(name);
    await this.page.waitForTimeout(1000);
  }

  async getAppointmentCount(): Promise<number> {
    const rows = await this.agendaTable.locator('tbody tr').count();
    console.log(`📊 Total de agendamentos encontrados: ${rows}`);
    return rows;
  }

  async isPageLoaded(): Promise<boolean> {
    try {
      return await this.pageTitle.isVisible({ timeout: 10000 });
    } catch {
      return false;
    }
  }

  async getAppointmentByName(name: string): Promise<boolean> {
    try {
      return await this.page.locator(`text=${name}`).isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }
}
