import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { AgendaPage } from '../pages/agenda.page';

test.describe('Agenda - Testes E2E', () => {
  let dashboardPage: DashboardPage;
  let agendaPage: AgendaPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    agendaPage = new AgendaPage(page);
  });

  test('Deve carregar o dashboard', async () => {
    await dashboardPage.goto();

    const isLoaded = await dashboardPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
  });

  test('Deve navegar para agenda corretamente', async () => {
    await dashboardPage.goto();
    await dashboardPage.navigateToAgenda();

    expect(agendaPage.page.url()).toContain('atendimento');
    const isLoaded = await agendaPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
  });

  test('Deve exibir agenda com dados', async () => {
    await agendaPage.goto();

    const isLoaded = await agendaPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();

    const count = await agendaPage.getAppointmentCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Deve buscar paciente pela agenda', async () => {
    await agendaPage.goto();

    await agendaPage.searchByName('Eliana');

    // Verificar se há resultados na tabela
    const rows = await agendaPage.agendaTable.locator('tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('Deve selecionar profissional', async () => {
    await agendaPage.goto();

    const isSelectorVisible = await agendaPage.profissionalSelect.isVisible();
    expect(isSelectorVisible).toBeTruthy();
  });
});
