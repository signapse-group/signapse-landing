import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './src/i18n/config.ts';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({ imageService: 'passthrough' }),
  session: false,
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
      PUBLIC_CONTACT_API_ORIGIN: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://dev-api.signapse.cloud',
      }),
      PUBLIC_APP_ORIGIN: envField.string({
        context: 'client',
        access: 'public',
        default: 'http://localhost:3000',
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
      SIGNAPSE_VERCEL_ANALYTICS: envField.boolean({
        context: 'server',
        access: 'public',
        default: false,
      }),
    },
  },
});
