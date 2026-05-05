import { defineConfig } from 'vitest/config';
import { preview } from '@vitest/browser-preview';

export default defineConfig({
  optimizeDeps: {
    include: ['@angular/compiler']
  },
  test: {
    browser: {
      enabled: true,
      provider: preview(),
      instances: [{ browser: 'chromium' }]
    }
  }
});
