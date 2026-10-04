import type { Locale } from './config';

type ScaffoldMessages = {
  title: string;
  heading: string;
  description: string;
  localeNavigation: string;
  home: string;
  chooseLocale: string;
};

export const messages = {
  vi: {
    title: 'Khung landing | Signapse',
    heading: 'Khung landing đã sẵn sàng.',
    description: 'Nội dung landing sẽ được chuyển vào ở bước tiếp theo.',
    localeNavigation: 'Chọn ngôn ngữ',
    home: 'Về trang chọn ngôn ngữ',
    chooseLocale: 'Chọn ngôn ngữ để xem khung trang.',
  },
  en: {
    title: 'Landing scaffold | Signapse',
    heading: 'The landing scaffold is ready.',
    description: 'The landing content will be migrated in the next step.',
    localeNavigation: 'Choose a language',
    home: 'Back to language selection',
    chooseLocale: 'Choose a language to view the page scaffold.',
  },
} satisfies Record<Locale, ScaffoldMessages>;
