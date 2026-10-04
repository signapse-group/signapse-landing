import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/messages';
import { appHref } from '@/i18n/routing';

export const REQUEST_ACCESS_EMAIL = 'access@signapse.cloud';
export const REQUEST_ACCESS_HREF = `mailto:${REQUEST_ACCESS_EMAIL}?subject=Signapse%20access%20request`;
export const ACCESS_SECTION_HREF = '#access';

export type LandingAccessAction = {
  href: string;
  label: string;
  ariaLabel: string;
};

export function createLandingAccessModel(
  locale: Locale,
  copy: Pick<Dictionary['landing'], 'cta'>,
) {
  const dashboard: LandingAccessAction = {
    href: appHref('/dashboard', locale),
    label: copy.cta.openDashboard,
    ariaLabel: copy.cta.openDashboardAria,
  };
  const contact: LandingAccessAction = {
    href: ACCESS_SECTION_HREF,
    label: copy.cta.contact,
    ariaLabel: copy.cta.contactAria,
  };
  return {
    headerPrimary: dashboard,
    heroPrimary: contact,
    finalCta: dashboard,
    footerAppEntry: dashboard,
  };
}

export type LandingAccessModel = ReturnType<typeof createLandingAccessModel>;
