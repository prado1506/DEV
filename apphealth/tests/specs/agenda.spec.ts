import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { AgendaPage } from '../pages/agenda.page';

test.describe('Agenda - Testes E2E', () => {
  let dashboardPage: DashboardPage;
  let agendaPage: AgendaPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    agendaPage = new AgendaPage(page);
    
    await dashboardPage.goto();
    await expect(dashboardPage.totalEntradasCard).toBeVisible();
  });

  test('deve navegar para agenda corretamente', async ({ page }) => {
    await dashboardPage.navigateToAgenda();
    
    expect(page.url()).toContain('atendimento');
    await expect(agendaPage.pageTitle).toBeVisible();
  });

  test('deve exibir agenda com dados', async ({ page }) => {
    await dashboardPage.navigateToAgenda();
    await agendaPage.goto();
    
    const count = await agendaPage.getAppointmentCount();
    expect(count).toBeGreaterThan(0);
  });

  test('deve buscar paciente pela agenda', async ({ page }) => {
    await agendaPage.goto();
    
    await agendaPage.searchByName('Eliana');
    
    await expect(page.locator('text=Eliana')).toBeVisible();
  });

  test('deve selecionar profissional', async ({ page }) => {
    await agendaPage.goto();
    
    // Verificar se seletor está visível
    await expect(agendaPage.profissionalSelect).toBeVisible();
  });
});
