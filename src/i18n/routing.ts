import { PUBLIC_APP_ORIGIN } from 'astro:env/client';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './config';

export const SUPPORTED_LANDING_HASHES = new Set([
  'top',
  'capability-strip',
  'knowledge-graph',
  'live-charts',
  'ai-assistant',
  'telegram',
  'strategy-coding',
  'trust',
  'access',
]);

export function withLocalePath(
  pathname: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  return `/${locale}${pathname === '/' ? '' : pathname}`;
}

export function replacePathLocale(pathname: string, locale: Locale) {
  const segments = pathname.split('/').filter(Boolean);
  if (SUPPORTED_LOCALES.some((supported) => supported === segments[0])) {
    segments.shift();
  }
  return withLocalePath(
    segments.length ? `/${segments.join('/')}` : '/',
    locale,
  );
}

export function appHref(pathname: string, locale: Locale) {
  return new URL(withLocalePath(pathname, locale), PUBLIC_APP_ORIGIN).href;
}

export function buildLandingLocaleHref(
  pathname: string,
  query: string,
  hash: string,
  locale: Locale,
) {
  const name = hash.replace(/^#/, '');
  const supportedHash = SUPPORTED_LANDING_HASHES.has(name) ? `#${name}` : '';
  return `${replacePathLocale(pathname, locale)}${query ? `?${query.replace(/^\?/, '')}` : ''}${supportedHash}`;
}
