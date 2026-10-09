import { expect, test } from './fixtures';

for (const locale of ['vi', 'en'] as const) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale} footer and headline sizes follow the approved scale ${javaScriptEnabled ? 'with' : 'without'} JavaScript`, async ({
      browser,
      baseURL,
    }, testInfo) => {
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      try {
        for (const width of [375, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          await page.goto(`/${locale}`);
          if (javaScriptEnabled) {
            await expect(
              page.locator(
                'astro-island[component-export="LandingFeatureShowcase"]',
              ),
            ).not.toHaveAttribute('ssr');
          }
          await page.evaluate(() => document.fonts.ready);
          await expect(page.locator('h1')).toHaveCount(1);
          const hero = page.locator('#landing-hero-heading');
          const heroSize = width < 640 ? 32 : width < 1024 ? 48 : 56;
          await expect(hero).toHaveCSS('font-size', `${heroSize}px`);
          await expect(hero).toContainText(
            locale === 'vi' ? 'Hiểu nhanh hơn.' : 'Understand faster.',
          );
          for (const id of [
            'landing-audiences-heading',
            'landing-provider-heading',
            'landing-access-heading',
          ]) {
            await expect(page.locator(`#${id}`)).toHaveCSS(
              'font-size',
              width < 640 ? '30px' : '36px',
            );
            await expect(page.locator(`#${id}`)).toHaveCSS(
              'line-height',
              width < 640 ? '37.5px' : '45px',
            );
          }
          const titles = page.locator(
            '[data-audience-option] > span:nth-child(2)',
          );
          await expect(titles).toHaveCount(4);
          for (const title of await titles.all()) {
            await expect(title).toHaveCSS(
              'font-size',
              width < 640 ? '18px' : width < 1024 ? '20px' : '22px',
            );
          }
          for (const title of await page
            .locator('[data-story-copy] h2')
            .all()) {
            await expect(title).toHaveCSS(
              'font-size',
              javaScriptEnabled && width >= 1024 ? '20px' : '18px',
            );
          }
          const footer = page.locator('[data-landing-part="footer"]');
          await expect(footer.getByRole('link')).toHaveCount(9);
          await expect(
            footer.getByRole('link', {
              name:
                locale === 'vi' ? 'Signapse — Trang chủ' : 'Signapse — Home',
              exact: true,
            }),
          ).toHaveAttribute('href', `/${locale}`);
          await expect(footer).toContainText(
            locale === 'vi' ? 'Khám phá' : 'Explore',
          );
          await expect(footer).not.toContainText(/Đặt lịch demo|Book a demo/);
          if (width === 375) {
            for (const link of await footer.getByRole('link').all()) {
              expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(
                44,
              );
            }
          }
          for (const link of await footer.getByRole('link').all()) {
            await page.keyboard.press('Tab');
            await link.focus();
            await expect(link).toBeFocused();
            await expect(link).toHaveCSS('outline-style', 'solid');
            await expect(link).toHaveCSS('outline-width', '2px');
          }
          const explores = footer.getByRole('navigation').first();
          for (const id of ['capability-strip', 'showcase', 'audiences']) {
            await explores.locator(`a[href="#${id}"]`).press('Enter');
            await expect(page).toHaveURL(new RegExp(`#${id}$`));
            await expect(page.locator(`#${id}`)).toBeInViewport();
          }
          await footer
            .getByRole('link', {
              name: locale === 'vi' ? 'Gửi lời nhắn' : 'Send a message',
              exact: true,
            })
            .press('Enter');
          await expect(page).toHaveURL(/#access$/);
          await expect(
            page.locator('#landing-access-heading'),
          ).toBeInViewport();
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          ).toBe(true);
          if (javaScriptEnabled && (width === 375 || width === 1440)) {
            await footer.screenshot({
              path: testInfo.outputPath(`footer-${locale}-${width}.png`),
              animations: 'disabled',
            });
            await page.locator('#audiences').screenshot({
              path: testInfo.outputPath(`audience-${locale}-${width}.png`),
              animations: 'disabled',
            });
            await page.locator('#top').screenshot({
              path: testInfo.outputPath(`hero-${locale}-${width}.png`),
              animations: 'disabled',
            });
          }
        }
        const footer = page.locator('[data-landing-part="footer"]');
        await footer.getByRole('link', { name: 'Blog', exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/blogs$`));
        await expect(page.locator('main h1')).toBeVisible();
        await footer
          .getByRole('link', {
            name: locale === 'vi' ? 'Tính năng' : 'Features',
            exact: true,
          })
          .click();
        await expect(page).toHaveURL(
          new RegExp(`/${locale}#capability-strip$`),
        );
        await expect(page.locator('#capability-strip')).toBeInViewport();
      } finally {
        await context.close();
      }
    });
  }
}
