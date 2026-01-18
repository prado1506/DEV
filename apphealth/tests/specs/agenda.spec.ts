import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth';
import { DashboardPage } from '../pages/dashboard.page';
import { AgendaPage } from '../pages/agenda.page';
import { TEST_CREDENTIALS, TEST_DATA } from '../fixtures/test-data';

test.describe('App Health - Testes E2E', () => {
  test.beforeEach(async ({ page }) => {
    console.log('\n🔄 ========== NOVO TESTE ==========');
    // Login antes de cada teste
    await login(page, TEST_CREDENTIALS.cpf, TEST_CREDENTIALS.senha);
  });

  test('✅ TC001 - Deve carregar o dashboard após login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    const isLoaded = await dashboardPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Dashboard carregou com sucesso');
  });

  test('✅ TC002 - Deve navegar para Agenda', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const agendaPage = new AgendaPage(page);

    await dashboardPage.goto();
    await dashboardPage.navigateToAgenda();

    expect(page.url()).toContain('atendimento');
    const isLoaded = await agendaPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();
    console.log('✅ Navegação para Agenda funcionou');
  });

  test('✅ TC003 - Deve exibir grid de agenda com dados', async ({ page }) => {
    const agendaPage = new AgendaPage(page);
    await agendaPage.goto();

    const isLoaded = await agendaPage.isPageLoaded();
    expect(isLoaded).toBeTruthy();

    const count = await agendaPage.getAppointmentCount();
    console.log(`✅ Agenda contém ${count} agendamentos`);
  });

  test('✅ TC004 - Deve buscar paciente por nome', async ({ page }) => {
    const agendaPage = new AgendaPage(page);
    await agendaPage.goto();

    await agendaPage.searchByName(TEST_DATA.pacientes.eliana);

    const found = await agendaPage.getAppointmentByName(TEST_DATA.pacientes.eliana);
    expect(found).toBeTruthy();
    console.log(`✅ Paciente ${TEST_DATA.pacientes.eliana} encontrado`);
  });

  test('✅ TC005 - Deve exibir seletor de profissional', async ({ page }) => {
    const agendaPage = new AgendaPage(page);
    await agendaPage.goto();

    const isVisible = await agendaPage.profissionalSelect.isVisible();
    expect(isVisible).toBeTruthy();
    console.log('✅ Seletor de profissional está visível');
  });

  test('✅ TC006 - Deve navegar para Pacientes', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await dashboardPage.navigateToPacientes();

    expect(page.url()).toContain('sujeitos-de-atencao');
    console.log('✅ Navegação para Pacientes funcionou');
  });

  test('✅ TC007 - Deve navegar para Relatórios', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    await dashboardPage.navigateToRelatorios();

    expect(page.url()).toContain('relatorios');
    console.log('✅ Navegação para Relatórios funcionou');
  });
});
