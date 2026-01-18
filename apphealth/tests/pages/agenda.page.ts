import { test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { login } from '../helpers/auth';

test.beforeEach(async ({ page }) => {
  await login(page);
});

export class AgendaPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly agendaTable: Locator;
  readonly profissionalSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('text=Horário de Atendimento');
    this.searchInput = page.getByPlaceholder(/Pesquisa por nome, CPF ou telefone/i);
    this.agendaTable = page.locator('table').first();
    this.profissionalSelect = page.locator('[id*="react-select"]').first();
  }

  async goto() {
    await this.page.goto('/#/atendimento');
    await this.page.waitForLoadState('networkidle');
  }

  async searchByName(name: string) {
    await this.searchInput.fill(name);
    await this.page.waitForTimeout(500);
  }

  async getAppointmentCount(): Promise<number> {
    const rows = await this.agendaTable.locator('tbody tr').count();
    return rows;
  }

  async isPageLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible({ timeout: 10000 });
  }
}
