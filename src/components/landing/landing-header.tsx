import { MenuIcon } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/messages';
import { withLocalePath } from '@/i18n/routing';
import styles from './landing-page.module.css';
import { LandingHeaderShell } from './landing-header-shell';
import { LandingLocaleLinks, LandingLocaleMenu } from './landing-locale-links';
import { LandingNavigationDisclosure } from './landing-navigation-disclosure';
import { Logo } from '@/components/logo';

export function LandingHeader({
  dictionary,
  locale,
  isLandingPage = true,
  currentPath,
  currentQuery = '',
  initialSurface = 'dark',
}: {
  dictionary: Dictionary;
  locale: Locale;
  isLandingPage?: boolean;
  currentPath?: string;
  currentQuery?: string;
  initialSurface?: 'dark' | 'light';
}) {
  const t = dictionary.landing;
  const sectionHref = (id: string) =>
    isLandingPage ? `#${id}` : `${withLocalePath('/', locale)}#${id}`;
  const links = [
    { href: sectionHref('capability-strip'), label: t.nav.features },
    { href: sectionHref('showcase'), label: t.nav.demos },
    { href: sectionHref('audiences'), label: t.nav.audiences },
    { href: withLocalePath('/blogs', locale), label: t.nav.blog },
    { href: sectionHref('access'), label: t.nav.contact },
  ];

  return (
    <LandingHeaderShell
      data-landing-part="header"
      data-landing-surface="dark"
      initialSurface={initialSurface}
      className={`${styles.darkSurface} ${styles.header}`}
    >
      <div
        className={`${styles.headerInner} mx-auto w-full max-w-[120rem] px-4 sm:px-6 lg:px-8`}
      >
        <a
          href={withLocalePath('/', locale)}
          aria-label={dictionary.common.appName}
          className="flex shrink-0 items-center gap-3 rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span aria-hidden="true" className="size-8 shrink-0">
            <span className={styles.headerLogoDark}>
              <Logo width={32} height={32} colorScheme="dark" />
            </span>
            <span className={styles.headerLogoLight}>
              <Logo width={32} height={32} colorScheme="light" />
            </span>
          </span>
          <span className="hidden truncate sm:inline">
            {dictionary.common.appName}
          </span>
        </a>

        <nav
          aria-label={t.accessibility.headerNavigation}
          className="hidden items-center justify-center gap-2 text-sm text-muted-foreground xl:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.headerNavItem}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="hidden xl:block">
            <LandingLocaleMenu
              currentLocale={locale}
              initialPathname={currentPath}
              initialQuery={currentQuery}
              labels={{
                group: t.localeControl.label,
                vi: t.localeControl.vietnamese,
                en: t.localeControl.english,
              }}
            />
          </div>
          <LandingNavigationDisclosure
            className="relative xl:hidden"
            data-mobile-menu
          >
            <summary
              className={`${styles.headerMenuTrigger} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
            >
              <span className="sr-only">{t.nav.openMenu}</span>
              <MenuIcon aria-hidden="true" className="size-5" />
            </summary>
            <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 flex max-h-[calc(100dvh-6rem)] w-[min(19rem,calc(100vw-2rem))] flex-col gap-3 overflow-y-auto border border-border bg-background p-3 shadow-lg">
              <div className="border-b border-border pb-3">
                <LandingLocaleLinks
                  currentLocale={locale}
                  initialPathname={currentPath}
                  initialQuery={currentQuery}
                  labels={{
                    group: t.localeControl.label,
                    vi: t.localeControl.vietnamese,
                    en: t.localeControl.english,
                  }}
                />
              </div>
              <nav
                aria-label={t.accessibility.headerNavigation}
                className="flex flex-col gap-1"
              >
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={styles.headerMenuItem}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </LandingNavigationDisclosure>
        </div>
      </div>
    </LandingHeaderShell>
  );
}
