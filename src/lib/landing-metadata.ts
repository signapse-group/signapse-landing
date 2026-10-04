import {
  SIGNAPSE_LANDING_INDEXABLE,
  SIGNAPSE_PUBLIC_ORIGIN,
} from 'astro:env/server';
import { PUBLIC_APP_ORIGIN } from 'astro:env/client';

import { SUPPORTED_LOCALES, type Locale } from '@/i18n/config';
import { withLocalePath } from '@/i18n/routing';

function parseOrigin(value: string | undefined, allowLocal = false) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      (url.protocol !== 'https:' &&
        !(allowLocal && url.protocol === 'http:')) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/'
    )
      return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function landingMetadata(locale: Locale, root = false) {
  if (!parseOrigin(PUBLIC_APP_ORIGIN, true)) {
    throw new Error(
      'PUBLIC_APP_ORIGIN must be an absolute HTTP(S) origin without path, query or credentials.',
    );
  }
  const origin = parseOrigin(SIGNAPSE_PUBLIC_ORIGIN);
  if (SIGNAPSE_LANDING_INDEXABLE && !origin) {
    throw new Error(
      'An indexable landing requires an explicit valid HTTPS SIGNAPSE_PUBLIC_ORIGIN.',
    );
  }
  return {
    robots:
      SIGNAPSE_LANDING_INDEXABLE && !root ? 'index, follow' : 'noindex, follow',
    canonical: origin
      ? new URL(withLocalePath('/', locale), origin).href
      : undefined,
    alternates: origin
      ? [
          ...SUPPORTED_LOCALES.map((language) => ({
            language,
            href: new URL(withLocalePath('/', language), origin).href,
          })),
          { language: 'x-default', href: `${origin}/` },
        ]
      : [],
    socialImage: origin
      ? new URL(`/social/${locale}.png`, origin).href
      : `/social/${locale}.png`,
  };
}
