import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './src/i18n/config.ts';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: [...SUPPORTED_LOCALES],
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  env: {
    schema: {
      PUBLIC_APP_ORIGIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      SIGNAPSE_PUBLIC_ORIGIN: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      SIGNAPSE_LANDING_INDEXABLE: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
});
