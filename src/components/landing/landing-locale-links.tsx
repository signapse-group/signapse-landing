import { Globe2Icon } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';

import type { Locale } from '@/i18n/config';
import { buildLandingLocaleHref, withLocalePath } from '@/i18n/routing';
import { LandingNavigationDisclosure } from './landing-navigation-disclosure';
import styles from './landing-page.module.css';

export { buildLandingLocaleHref } from '@/i18n/routing';

type Props = {
  currentLocale: Locale;
  initialPathname?: string;
  initialQuery?: string;
  labels: { group: string; vi: string; en: string };
};

function useLocaleLinks(initialPathname = '/', initialQuery = '') {
  const [location, setLocation] = useState({
    pathname: initialPathname,
    query: initialQuery,
    hash: '',
  });
  useEffect(() => {
    const update = () =>
      setLocation({
        pathname: window.location.pathname,
        query: window.location.search.slice(1),
        hash: window.location.hash,
      });
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return (locale: Locale) =>
    buildLandingLocaleHref(
      location.pathname,
      location.query,
      location.hash,
      locale,
    );
}

function navigate(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
  // Compute at activation too, so links preserve URL state before effects run.
  event.currentTarget.href = buildLandingLocaleHref(
    window.location.pathname,
    window.location.search.slice(1),
    window.location.hash,
    locale,
  );
}

function LocaleLink({
  locale,
  currentLocale,
  label,
  href,
  className,
}: {
  locale: Locale;
  currentLocale: Locale;
  label: string;
  href: string;
  className: string;
}) {
  return (
    <a
      href={href || withLocalePath('/', locale)}
      lang={locale}
      hrefLang={locale}
      aria-current={currentLocale === locale ? 'page' : undefined}
      data-current-locale={currentLocale === locale ? 'true' : 'false'}
      data-locale-link={locale}
      onClick={(event) => navigate(event, locale)}
      className={className}
    >
      {label}
    </a>
  );
}

export function LandingLocaleLinks({
  currentLocale,
  initialPathname,
  initialQuery,
  labels,
}: Props) {
  const href = useLocaleLinks(initialPathname, initialQuery);
  return (
    <nav
      aria-label={labels.group}
      data-locale-links
      className="flex shrink-0 items-center gap-1 text-xs whitespace-nowrap text-muted-foreground"
    >
      <LocaleLink
        locale="vi"
        currentLocale={currentLocale}
        href={href('vi')}
        label={labels.vi}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 py-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      <span aria-hidden="true">/</span>
      <LocaleLink
        locale="en"
        currentLocale={currentLocale}
        href={href('en')}
        label={labels.en}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 py-1 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
    </nav>
  );
}

export function LandingLocaleMenu({
  currentLocale,
  initialPathname,
  initialQuery,
  labels,
}: Props) {
  const href = useLocaleLinks(initialPathname, initialQuery);
  return (
    <LandingNavigationDisclosure className={styles.localeMenu}>
      <summary
        data-locale-menu-trigger
        aria-label={labels.group}
        className={`${styles.localeMenuTrigger} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      >
        <Globe2Icon data-icon="inline-start" aria-hidden="true" />
      </summary>
      <nav aria-label={labels.group} className={styles.localeMenuPanel}>
        <LocaleLink
          locale="vi"
          currentLocale={currentLocale}
          href={href('vi')}
          label={labels.vi}
          className={styles.localeMenuItem}
        />
        <LocaleLink
          locale="en"
          currentLocale={currentLocale}
          href={href('en')}
          label={labels.en}
          className={styles.localeMenuItem}
        />
      </nav>
    </LandingNavigationDisclosure>
  );
}
