import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'about:blank',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    isMobile: false,

    // 1) O site “enxerga” isso:
    viewport: null ,

    // 2) A janela do Chromium nasce nesse tamanho:
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

//
});
