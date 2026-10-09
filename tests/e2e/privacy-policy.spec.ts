import { expect, test } from './fixtures';

const publicOrigin = process.env.SIGNAPSE_PUBLIC_ORIGIN;
const indexable = process.env.SIGNAPSE_LANDING_INDEXABLE === 'true';
const sectionIds = [
  'data-we-process',
  'why-we-use-data',
  'ai-and-external-services',
  'data-retention',
  'your-rights-and-requests',
  'privacy-contact',
  'policy-updates',
];
const headings = {
  vi: [
    'Dữ liệu liên quan đến việc sử dụng Signapse',
    'Mục đích sử dụng',
    'AI và các dịch vụ bên ngoài',
    'Thời gian lưu dữ liệu',
    'Quyền và yêu cầu của bạn',
    'Liên hệ về quyền riêng tư',
    'Cập nhật chính sách',
  ],
  en: [
    'Data related to your use of Signapse',
    'Why we use data',
    'AI and external services',
    'How long data is kept',
    'Your rights and requests',
    'Privacy contact',
    'Policy updates',
  ],
};
const metadata = {
  vi: {
    title: 'Chính sách quyền riêng tư — Signapse',
    description:
      'Tìm hiểu cách Signapse xử lý dữ liệu khi bạn truy cập website hoặc sử dụng ứng dụng, cùng quyền riêng tư và thông tin liên hệ.',
    homeLink: 'Về trang chủ Signapse',
    contentsHeading: 'Trên trang này',
    footerLabel: 'Chính sách quyền riêng tư',
  },
  en: {
    title: 'Privacy Policy — Signapse',
    description:
      'Learn how Signapse processes data when you visit our website or use the application, including privacy rights and contact information.',
    homeLink: 'Back to Signapse',
    contentsHeading: 'On this page',
    footerLabel: 'Privacy Policy',
  },
};

for (const locale of ['vi', 'en'] as const) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale} Privacy Policy renders, navigates and reflows ${javaScriptEnabled ? 'with' : 'without'} JavaScript`, async ({
      browser,
      baseURL,
      request,
    }, testInfo) => {
      const fixtureOrigin = process.env.PUBLIC_BLOG_API_ORIGIN;
      const publishResponse = await request.get(
        `${fixtureOrigin}/__fixture/publish?value=true`,
      );
      expect(publishResponse.ok()).toBe(true);

      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const route = `/${locale}/privacy-policy`;
      const copy = metadata[locale];

      try {
        for (const width of [375, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          const response = await page.goto(route);
          expect(response?.status()).toBe(200);
          await expect(page.locator('html')).toHaveAttribute('lang', locale);
          await expect(page).toHaveTitle(copy.title);
          await expect(
            page.locator('meta[name="description"]'),
          ).toHaveAttribute('content', copy.description);
          await expect(
            page.locator('meta[property="og:image:alt"]'),
          ).toHaveAttribute('content', copy.title);
          await expect(
            page.locator('meta[name="twitter:image:alt"]'),
          ).toHaveAttribute('content', copy.title);
          await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
            'content',
            indexable ? 'index, follow' : 'noindex, follow',
          );
          await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            locale === 'vi' ? 'Chính sách quyền riêng tư' : 'Privacy Policy',
          );
          await expect(
            page.getByRole('link', { name: copy.homeLink, exact: true }),
          ).toHaveAttribute('href', `/${locale}`);
          await expect(page.locator('#main-content')).toHaveAttribute(
            'tabindex',
            '-1',
          );

          if (publicOrigin) {
            const origin = new URL(publicOrigin).origin;
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
              'href',
              `${origin}${route}`,
            );
            for (const targetLocale of ['vi', 'en']) {
              await expect(
                page.locator(
                  `link[rel="alternate"][hreflang="${targetLocale}"]`,
                ),
              ).toHaveAttribute(
                'href',
                `${origin}/${targetLocale}/privacy-policy`,
              );
            }
          } else {
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
            await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
          }

          const contents = page.getByRole('navigation', {
            name: copy.contentsHeading,
          });
          await expect(contents.getByRole('link')).toHaveCount(7);
          await expect(page.locator('[data-privacy-section]')).toHaveCount(7);
          const dataItems = page.locator('#data-we-process li');
          await expect(dataItems).toHaveCount(5);
          for (let index = 0; index < 5; index += 1) {
            await expect(dataItems.locator('strong').nth(index)).toHaveCSS(
              'display',
              'block',
            );
          }
          for (let index = 0; index < sectionIds.length; index += 1) {
            const sectionId = sectionIds[index];
            await expect(contents.getByRole('link').nth(index)).toHaveAttribute(
              'href',
              `#${sectionId}`,
            );
            await expect(page.locator(`#${sectionId}-heading`)).toHaveText(
              headings[locale][index],
            );
          }

          const privacyContact = page.locator('#privacy-contact');
          await expect(
            privacyContact.locator(
              'a[href="mailto:Afinance.verify@gmail.com"]',
            ),
          ).toBeVisible();
          await expect(
            privacyContact.locator('a[href="tel:+84967743713"]'),
          ).toBeVisible();
          const footer = page.locator('[data-landing-part="footer"]');
          const explore = footer.getByRole('navigation').first();
          await expect(explore.getByRole('link')).toHaveCount(5);
          await expect(
            explore.getByRole('link', { name: copy.footerLabel, exact: true }),
          ).toHaveAttribute('href', route);
          await expect(
            footer.locator('a[href^="mailto:access@signapse.cloud"]'),
          ).toHaveCount(1);
          await expect(footer.locator('a[href="tel:+84933809936"]')).toHaveText(
            '0933.80.99.36',
          );
          await expect(
            footer.locator('a[href="tel:+84967743713"]'),
          ).toHaveCount(0);

          const gridColumns = await page
            .locator('[data-privacy-content]')
            .evaluate(
              (element) =>
                getComputedStyle(element)
                  .gridTemplateColumns.trim()
                  .split(/\s+/).length,
            );
          expect(gridColumns).toBe(width > 1024 ? 2 : 1);
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);

          if (width === 375) {
            const contentsBox = await page
              .locator('[data-privacy-contents]')
              .boundingBox();
            const articleBox = await page
              .locator('[data-privacy-article]')
              .boundingBox();
            expect(contentsBox?.y).toBeLessThan(articleBox?.y ?? 0);
          }
          if (width === 1440 && javaScriptEnabled) {
            await page.screenshot({
              path: testInfo.outputPath(`privacy-policy-${locale}-1440.png`),
              fullPage: true,
              animations: 'disabled',
            });
          }
        }

        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(route);
        const firstLink = page.locator(
          `[data-privacy-contents] a[href="#${sectionIds[0]}"]`,
        );
        for (
          let tabs = 0;
          tabs < 20 &&
          !(await firstLink.evaluate(
            (element) => element === document.activeElement,
          ));
          tabs += 1
        ) {
          await page.keyboard.press('Tab');
        }
        await expect(firstLink).toBeFocused();
        await expect(firstLink).toHaveCSS('outline-style', 'solid');
        await page.keyboard.press('Enter');
        for (const sectionId of sectionIds) {
          if (sectionId !== sectionIds[0]) {
            await page
              .locator(`[data-privacy-contents] a[href="#${sectionId}"]`)
              .click();
          }
          await expect(page).toHaveURL(new RegExp(`#${sectionId}$`));
          const heading = page.locator(`#${sectionId}-heading`);
          await expect(heading).toBeInViewport();
          expect((await heading.boundingBox())?.y).toBeGreaterThanOrEqual(72);
        }

        await page.setViewportSize({ width: 720, height: 900 });
        await page.evaluate(() => {
          document.documentElement.style.zoom = '2';
        });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);

        const targetLocale = locale === 'vi' ? 'en' : 'vi';
        await page.setViewportSize({
          width: javaScriptEnabled ? 1440 : 375,
          height: 900,
        });
        await page.goto(route);
        const header = page.locator('[data-landing-part="header"]');
        const localeContainer = javaScriptEnabled
          ? header
              .locator('[data-locale-menu-trigger]')
              .locator('..')
              .getByRole('navigation')
          : header.locator('[data-mobile-menu] [data-locale-links]');
        if (javaScriptEnabled) {
          const localeTrigger = header.locator('[data-locale-menu-trigger]');
          await localeTrigger.press('Enter');
        } else {
          const mobileMenu = header.locator('[data-mobile-menu]');
          await mobileMenu.locator('summary').press('Enter');
        }
        const localeLink = localeContainer.locator(
          `[data-locale-link="${targetLocale}"]`,
        );
        await expect(localeLink).toBeVisible();
        await expect(localeLink).toHaveAttribute(
          'href',
          `/${targetLocale}/privacy-policy`,
        );
        await localeLink.press('Enter');
        await expect(page).toHaveURL(`/${targetLocale}/privacy-policy`);

        for (const source of [`/${locale}`, `/${locale}/blogs`]) {
          await page.goto(source);
          const footerLink = page
            .locator('[data-landing-part="footer"]')
            .getByRole('link', { name: copy.footerLabel, exact: true });
          await footerLink.click();
          await expect(page).toHaveURL(route);
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(
            locale === 'vi' ? 'Chính sách quyền riêng tư' : 'Privacy Policy',
          );
        }
      } finally {
        await context.close();
      }
    });
  }
}
