export const REQUEST_ACCESS_EMAIL = 'access@signapse.cloud';
export const REQUEST_ACCESS_HREF = `mailto:${REQUEST_ACCESS_EMAIL}?subject=Signapse%20access%20request`;
export const ACCESS_SECTION_HREF = '#access';
export const CONTACT_PHONE_NUMBER = '0933.80.99.36';
export const CONTACT_PHONE_HREF = 'tel:+84933809936';

export type LandingAccessAction = {
  href: string;
  label: string;
  ariaLabel: string;
};
