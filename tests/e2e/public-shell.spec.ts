import { expect, test } from './fixtures';

for (const locale of ['vi', 'en'] as const) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale} shared public shell ${javaScriptEnabled ? 'with JavaScript' : 'without JavaScript'} uses landing controls and hides dashboard access`, async ({
      browser,
      request,
      baseURL,
    }) => {
      const publishResponse = await request.get(
        `${process.env.PUBLIC_BLOG_API_ORIGIN}/__fixture/publish?value=true`,
      );
      expect(publishResponse.ok()).toBe(true);
      const context = await browser.newContext({
        baseURL,
        javaScriptEnabled,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const routes = [
        { path: `/${locale}/blogs`, status: 200 },
        { path: `/${locale}/blogs/fixture-post`, status: 200 },
        { path: `/${locale}/blogs/missing-post`, status: 404 },
        { path: `/${locale}/blogs/upstream-error`, status: 502 },
        { path: `/${locale}`, status: 200 },
        ...(locale === 'vi' ? [{ path: '/', status: 200 }] : []),
      ];
      try {
        for (const width of [1440, 1024, 375]) {
          await page.setViewportSize({ width, height: 900 });
          for (const route of routes) {
            const response = await page.goto(route.path);
            expect(response?.status()).toBe(route.status);
            const header = page.locator('[data-landing-part="header"]');
            await expect(header).toHaveCSS('height', '72px');
            if (width >= 1280) {
              const menuTrigger = header
                .locator('details[name="landing-desktop-menu"] > summary')
                .first();
              await expect(menuTrigger).toHaveCSS('height', '44px');
              await expect(menuTrigger).toHaveCSS('border-radius', '8px');
              const localeTrigger = header.locator(
                '[data-locale-menu-trigger]',
              );
              await expect(localeTrigger).toHaveCSS('height', '44px');
              await expect(localeTrigger).toHaveCSS('width', '44px');
              await expect(localeTrigger).toHaveCSS('border-radius', '8px');
              await localeTrigger.focus();
              await localeTrigger.press('Enter');
              await expect(
                localeTrigger.locator('..').locator('nav'),
              ).toBeVisible();
              await expect(
                localeTrigger.locator('..').locator('nav'),
              ).toHaveCSS('border-radius', '12px');
              await localeTrigger.press('Enter');
            } else {
              const menuTrigger = header.locator(
                '[data-mobile-menu] > summary',
              );
              await expect(menuTrigger).toHaveCSS('height', '44px');
              await expect(menuTrigger).toHaveCSS('width', '44px');
              await expect(menuTrigger).toHaveCSS('border-radius', '8px');
            }
            await expect(page.locator('a[href*="/dashboard"]')).toHaveCount(0);
            await expect(
              page.locator('footer a[href^="mailto:access@signapse.cloud"]'),
            ).toHaveCount(1);
            expect(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
            ).toBe(true);
          }
        }
      } finally {
        await context.close();
      }
    });
  }
}
