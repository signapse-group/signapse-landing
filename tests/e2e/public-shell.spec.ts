import { expect, test } from './fixtures';

for (const locale of ['vi', 'en'] as const) {
  for (const javaScriptEnabled of [true, false]) {
    test(`${locale} shared public shell ${javaScriptEnabled ? 'with JavaScript' : 'without JavaScript'} uses landing controls and hides dashboard access`, async ({
      browser,
      request,
      baseURL,
    }, testInfo) => {
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
            const landingPath =
              route.path === '/' || route.path === `/${locale}`
                ? ''
                : `/${locale}`;
            const navigation = header.getByRole('navigation', {
              name:
                locale === 'vi' ? 'Điều hướng landing' : 'Landing navigation',
            });
            const expectedLinks = [
              [
                `${landingPath}#capability-strip`,
                locale === 'vi' ? 'Tính năng' : 'Features',
              ],
              [
                `${landingPath}#showcase`,
                locale === 'vi' ? 'Xem demo' : 'View demos',
              ],
              [
                `${landingPath}#audiences`,
                locale === 'vi' ? 'Dành cho ai' : 'Who it’s for',
              ],
              [`/${locale}/blogs`, 'Blog'],
              [
                `${landingPath}#access`,
                locale === 'vi' ? 'Liên hệ' : 'Contact',
              ],
            ];
            const activeNavigation =
              width >= 1280 ? navigation.first() : navigation.last();
            if (width < 1280)
              await header.locator('[data-mobile-menu] > summary').click();
            await expect(activeNavigation.getByRole('link')).toHaveCount(5);
            for (const [href, label] of expectedLinks) {
              await expect(
                activeNavigation.getByRole('link', {
                  name: label,
                  exact: true,
                }),
              ).toHaveAttribute('href', href);
            }
            await expect(header.locator('[aria-disabled="true"]')).toHaveCount(
              0,
            );
            const contact = header.getByRole('link', {
              name: locale === 'vi' ? 'Liên hệ' : 'Contact',
              exact: true,
            });
            await expect(contact).toBeVisible();
            await expect(contact).toHaveAttribute(
              'href',
              `${landingPath}#access`,
            );
            await expect(contact).toHaveCSS('height', '44px');
            await expect(contact).not.toHaveClass(/group\/button/);
            if (width < 1280)
              await header.locator('[data-mobile-menu] > summary').click();
            if (width >= 1280) {
              const menuTrigger = header.locator('nav a').first();
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
            await expect(
              page.locator('footer a[href="tel:+84933809936"]'),
            ).toHaveText('0933.80.99.36');
            const footer = page.locator('[data-landing-part="footer"]');
            const exploreNavigation = footer.getByRole('navigation').first();
            await expect(exploreNavigation.getByRole('link')).toHaveCount(5);
            for (const [href, label] of expectedLinks.slice(0, 4)) {
              await expect(
                exploreNavigation.getByRole('link', {
                  name: label,
                  exact: true,
                }),
              ).toHaveAttribute('href', href);
            }
            await expect(
              exploreNavigation.getByRole('link', {
                name:
                  locale === 'vi'
                    ? 'Chính sách quyền riêng tư'
                    : 'Privacy Policy',
                exact: true,
              }),
            ).toHaveAttribute('href', `/${locale}/privacy-policy`);
            await expect(
              footer.getByRole('link', {
                name: locale === 'vi' ? 'Gửi lời nhắn' : 'Send a message',
                exact: true,
              }),
            ).toHaveAttribute('href', `${landingPath}#access`);
            await expect(
              footer.getByRole('link', {
                name:
                  locale === 'vi' ? 'Signapse — Trang chủ' : 'Signapse — Home',
                exact: true,
              }),
            ).toHaveAttribute('href', `/${locale}`);
            if (!landingPath) {
              await expect(
                page.locator('#access a[href="tel:+84933809936"]'),
              ).toHaveText('0933.80.99.36');
            }
            if (
              javaScriptEnabled &&
              route.path === `/${locale}` &&
              (width === 1440 || width === 375)
            ) {
              await page.evaluate(() => document.fonts.ready);
              await page.screenshot({
                path: testInfo.outputPath(`header-${locale}-${width}.png`),
                clip: { x: 0, y: 0, width, height: 72 },
              });
              await expect(page.locator('#contact-request-form')).toBeVisible();
              await page.locator('#access').screenshot({
                path: testInfo.outputPath(`contact-${locale}-${width}.png`),
              });
              await page.locator('[data-landing-part="footer"]').screenshot({
                path: testInfo.outputPath(`footer-${locale}-${width}.png`),
              });
              const footerLinks = await page
                .locator('[data-landing-part="footer"] a')
                .evaluateAll((links) =>
                  links.map((link) => {
                    const box = link.getBoundingClientRect();
                    return {
                      label: link.textContent?.trim(),
                      accessibleLabel: link.getAttribute('aria-label'),
                      href: link.getAttribute('href'),
                      width: box.width,
                      height: box.height,
                    };
                  }),
                );
              await testInfo.attach(`footer-links-${locale}-${width}`, {
                body: JSON.stringify(footerLinks, null, 2),
                contentType: 'application/json',
              });
            }
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
