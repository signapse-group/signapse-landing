import { ChevronDownIcon, MenuIcon } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/messages';
import { withLocalePath } from '@/i18n/routing';
import styles from './landing-page.module.css';
import { LandingHeaderShell } from './landing-header-shell';
import { LandingLocaleLinks, LandingLocaleMenu } from './landing-locale-links';
import { LandingNavigationDisclosure } from './landing-navigation-disclosure';
import { Logo } from '@/components/logo';

type HeaderMenuItemModel = {
  description: string;
  href?: string;
  label: string;
  placeholder?: boolean;
};

type HeaderMenuGroupModel = {
  id: string;
  label: string;
  items: HeaderMenuItemModel[];
};

function HeaderMenuItem({
  item,
  comingSoonLabel,
  mobile = false,
}: {
  item: HeaderMenuItemModel;
  comingSoonLabel: string;
  mobile?: boolean;
}) {
  const content = (
    <>
      <span className={styles.megaMenuItemHeading}>
        <span>{item.label}</span>
        {item.placeholder ? (
          <span className={styles.megaMenuPlaceholder}>{comingSoonLabel}</span>
        ) : null}
      </span>
      <span className={styles.megaMenuItemDescription}>{item.description}</span>
    </>
  );

  if (!item.href || item.placeholder) {
    return (
      <div
        className={`${styles.megaMenuItem} ${mobile ? styles.mobileMegaMenuItem : ''}`}
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={item.href}
      className={`${styles.megaMenuItem} ${mobile ? styles.mobileMegaMenuItem : ''}`}
    >
      {content}
    </a>
  );
}

function DesktopMegaMenu({
  groups,
  label,
  comingSoonLabel,
}: {
  groups: HeaderMenuGroupModel[];
  label: string;
  comingSoonLabel: string;
}) {
  return (
    <LandingNavigationDisclosure
      className={styles.megaMenuDisclosure}
      name="landing-desktop-menu"
      openOnHover
    >
      <summary
        className={`${styles.headerNavItem} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}
      >
        {label}
        <ChevronDownIcon aria-hidden="true" className="size-4" />
      </summary>
      <div className={styles.megaMenuPanel}>
        {groups.map((group) => (
          <section key={group.id} className={styles.megaMenuGroup}>
            <p className={styles.megaMenuGroupLabel}>{group.label}</p>
            <ul className={styles.megaMenuList}>
              {group.items.map((item) => (
                <li key={item.label}>
                  <HeaderMenuItem
                    item={item}
                    comingSoonLabel={comingSoonLabel}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LandingNavigationDisclosure>
  );
}

function MobileMegaMenu({
  groups,
  label,
  comingSoonLabel,
}: {
  groups: HeaderMenuGroupModel[];
  label: string;
  comingSoonLabel: string;
}) {
  return (
    <LandingNavigationDisclosure
      className={styles.mobileMenuGroup}
      name="landing-mobile-menu-group"
    >
      <summary className={styles.mobileMenuGroupTrigger}>
        {label}
        <ChevronDownIcon aria-hidden="true" />
      </summary>
      <div className={styles.mobileMenuGroupContent}>
        {groups.map((group) => (
          <section key={group.id}>
            <p className={styles.mobileMenuGroupLabel}>{group.label}</p>
            <div className={styles.mobileMenuItems}>
              {group.items.map((item) => (
                <HeaderMenuItem
                  key={item.label}
                  item={item}
                  comingSoonLabel={comingSoonLabel}
                  mobile
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </LandingNavigationDisclosure>
  );
}

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
  const productGroups: HeaderMenuGroupModel[] = [
    {
      id: 'analysis',
      label: t.nav.analysisGroup,
      items: [
        {
          href: sectionHref('knowledge-graph'),
          label: t.nav.knowledgeGraph,
          description: t.nav.knowledgeGraphDescription,
        },
        {
          href: sectionHref('live-charts'),
          label: t.nav.liveCharts,
          description: t.nav.liveChartsDescription,
        },
      ],
    },
    {
      id: 'assistant',
      label: t.nav.assistantGroup,
      items: [
        {
          href: sectionHref('ai-assistant'),
          label: t.nav.aiAssistant,
          description: t.nav.aiAssistantDescription,
        },
        {
          href: sectionHref('strategy-coding'),
          label: t.nav.strategyBuilder,
          description: t.nav.strategyBuilderDescription,
        },
      ],
    },
    {
      id: 'automation',
      label: t.nav.automationGroup,
      items: [
        {
          href: sectionHref('telegram'),
          label: t.nav.telegram,
          description: t.nav.telegramDescription,
        },
      ],
    },
  ];
  const solutionGroups: HeaderMenuGroupModel[] = [
    {
      id: 'individuals',
      label: t.nav.solutions,
      items: [
        {
          href: sectionHref('audience-trader'),
          label: t.nav.trader,
          description: t.nav.traderDescription,
        },
        {
          href: sectionHref('audience-analyst'),
          label: t.nav.analyst,
          description: t.nav.analystDescription,
        },
      ],
    },
    {
      id: 'organizations',
      label: t.nav.solutions,
      items: [
        {
          href: sectionHref('audience-strategy-developer'),
          label: t.nav.strategyDeveloper,
          description: t.nav.strategyDeveloperDescription,
        },
        {
          href: sectionHref('audience-team-fund'),
          label: t.nav.teamsAndFunds,
          description: t.nav.teamsAndFundsDescription,
        },
      ],
    },
    {
      id: 'explore',
      label: t.nav.exploreGroup,
      items: [
        {
          href: sectionHref('showcase'),
          label: t.nav.exploreDemo,
          description: t.nav.exploreDemoDescription,
        },
        {
          href: sectionHref('access'),
          label: t.nav.discussNeeds,
          description: t.nav.discussNeedsDescription,
        },
        {
          label: t.nav.enterpriseSolutions,
          description: t.nav.enterpriseSolutionsDescription,
          placeholder: true,
        },
      ],
    },
  ];
  const resourceGroups: HeaderMenuGroupModel[] = [
    {
      id: 'getting-started',
      label: t.nav.gettingStartedGroup,
      items: [
        {
          label: t.nav.userGuide,
          description: t.nav.userGuideDescription,
          placeholder: true,
        },
        {
          label: t.nav.helpCenter,
          description: t.nav.helpCenterDescription,
          placeholder: true,
        },
      ],
    },
    {
      id: 'insights',
      label: t.nav.exploreGroup,
      items: [
        {
          href: withLocalePath('/blogs', locale),
          label: t.nav.blog,
          description: t.nav.blogDescription,
        },
        {
          label: t.nav.productUpdates,
          description: t.nav.productUpdatesDescription,
          placeholder: true,
        },
      ],
    },
    {
      id: 'connect',
      label: t.nav.connectGroup,
      items: [
        {
          label: t.nav.developers,
          description: t.nav.developersDescription,
          placeholder: true,
        },
        {
          label: t.nav.aboutSignapse,
          description: t.nav.aboutSignapseDescription,
          placeholder: true,
        },
      ],
    },
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
          <DesktopMegaMenu
            label={t.nav.product}
            groups={productGroups}
            comingSoonLabel={t.nav.comingSoon}
          />
          <DesktopMegaMenu
            label={t.nav.solutions}
            groups={solutionGroups}
            comingSoonLabel={t.nav.comingSoon}
          />
          <DesktopMegaMenu
            label={t.nav.resources}
            groups={resourceGroups}
            comingSoonLabel={t.nav.comingSoon}
          />
          <a href={sectionHref('access')} className={styles.headerNavItem}>
            {t.nav.contact}
          </a>
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
                <MobileMegaMenu
                  label={t.nav.product}
                  groups={productGroups}
                  comingSoonLabel={t.nav.comingSoon}
                />
                <MobileMegaMenu
                  label={t.nav.solutions}
                  groups={solutionGroups}
                  comingSoonLabel={t.nav.comingSoon}
                />
                <MobileMegaMenu
                  label={t.nav.resources}
                  groups={resourceGroups}
                  comingSoonLabel={t.nav.comingSoon}
                />
                <a
                  href={sectionHref('access')}
                  className={styles.headerMenuItem}
                >
                  {t.nav.contact}
                </a>
              </nav>
            </div>
          </LandingNavigationDisclosure>
        </div>
      </div>
    </LandingHeaderShell>
  );
}
