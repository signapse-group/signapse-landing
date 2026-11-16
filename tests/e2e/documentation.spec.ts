import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const articleIds = [
  'ug01',
  'ug02',
  'ug03',
  'ug04',
  'ug05',
  'ug06',
  'ug07',
  'ug08',
  'ug09',
  'ug10',
];

for (const locale of ['vi', 'en'] as const) {
  const copy =
    locale === 'vi'
      ? {
          title: 'Tài liệu hướng dẫn',

          groups: [
            'Bắt đầu',
            'Theo dõi thị trường',
            'Làm việc với AI',
            'Tra cứu và xử lý vấn đề',
          ],
          browse: 'Duyệt tài liệu',
          navigation: 'Điều hướng landing',
        }
      : {
          title: 'Documentation',

          groups: [
            'Getting started',
            'Following the market',
            'Working with AI',
            'Reference and troubleshooting',
          ],
          browse: 'Browse documents',
          navigation: 'Landing navigation',
        };

  test(`${locale} documentation index lists all ten approved guides`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/docs`);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(
      page.getByRole('heading', { level: 1, name: copy.title }),
    ).toBeVisible();
    const overviewHeadings = page.locator('[data-docs-overview-group] h2');
    await expect(overviewHeadings).toHaveCount(4);
    for (const group of copy.groups) {
      await expect(overviewHeadings.filter({ hasText: group })).toBeVisible();
    }
    const links = page.locator(
      '[data-docs-overview-group] a[href*="/docs/ug"]',
    );
    await expect(links).toHaveCount(articleIds.length);
    const actual = await links.evaluateAll((items) =>
      items.map((link) => link.getAttribute('href')).sort(),
    );
    expect(actual).toEqual(articleIds.map((id) => `/${locale}/docs/${id}`));
    await expect(
      page
        .locator('[data-landing-part="header"] a[aria-current="page"]')
        .first(),
    ).toHaveAttribute('href', `/${locale}/docs`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    );

    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    await page.locator('[data-locale-menu-trigger]').click();
    await page
      .locator('[data-landing-part="header"]')
      .locator(`[data-locale-link="${nextLocale}"]`)
      .first()
      .click();
    await expect(page).toHaveURL(`/${nextLocale}/docs`);
  });

  test(`${locale} documentation index adapts contents navigation and passes axe`, async ({
    page,
  }, testInfo) => {
    for (const width of [1440, 768, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/docs`);

      const desktopContents = page.locator('[data-desktop-docs-contents]');
      const mobileContents = page.locator('details[data-mobile-docs-contents]');
      if (width >= 768) {
        await expect(desktopContents).toBeVisible();
        await expect(mobileContents).toBeHidden();
      } else {
        await expect(desktopContents).toBeHidden();
        await expect(mobileContents).toBeVisible();
        await expect(mobileContents.locator('summary')).toHaveText(copy.browse);
        await mobileContents.locator('summary').click();
        await expect(mobileContents).toHaveAttribute('open', '');
        await expect(mobileContents.getByRole('link')).toHaveCount(
          articleIds.length + 1,
        );
      }

      if (
        (locale === 'vi' && width === 1440) ||
        (locale === 'en' && width === 375)
      ) {
        await page.screenshot({
          path: testInfo.outputPath(`documentation-${locale}-${width}.png`),
          fullPage: true,
        });
      }

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);

      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(accessibility.violations).toEqual([]);
    }
  });

  test(`${locale} Docs disclosure supports hover, keyboard and its Documentation link`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    const header = page.locator('[data-landing-part="header"]');
    const navigation = header.getByRole('navigation', {
      name: copy.navigation,
    });
    const docsLink = navigation.getByRole('link', {
      name: 'Docs',
      exact: true,
    });
    const docsRoot = header.locator('[data-docs-navigation]').first();
    const toggle = docsRoot.getByRole('button');
    const panel = docsRoot.locator('[data-docs-menu-panel]');

    await docsRoot.hover();
    await expect(panel).toBeVisible();
    const articleLinks = panel.locator('a[href*="/docs/ug"]');
    await expect(articleLinks).toHaveCount(articleIds.length);
    const actual = await articleLinks.evaluateAll((items) =>
      items.map((link) => link.getAttribute('href')).sort(),
    );
    expect(actual).toEqual(articleIds.map((id) => `/${locale}/docs/${id}`));
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const accessibility = await new AxeBuilder({ page })
      .include('[data-docs-navigation]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`docs-menu-${locale}.png`),
      fullPage: true,
    });
    await navigation.getByRole('link', { name: 'Blog', exact: true }).hover();
    await expect(panel).toBeHidden();

    await docsLink.focus();
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();

    await docsLink.click();
    await expect(page).toHaveURL(`/${locale}/docs`);
    await expect(
      page.getByRole('heading', { level: 1, name: copy.title }),
    ).toBeVisible();
  });
}

test.describe('Documentation disclosure on touch devices', () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 375, height: 812 },
  });

  for (const locale of ['vi', 'en'] as const) {
    test(`${locale} compact Docs disclosure opens by touch`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      const mobileMenu = page.locator('[data-mobile-menu]');
      await mobileMenu.locator('summary').click();
      const docs = mobileMenu.locator('[data-docs-navigation]');
      const toggle = docs.getByRole('button');

      await toggle.tap();
      await expect(docs.locator('[data-docs-menu-panel]')).toBeVisible();
      await expect(
        docs.locator('[data-docs-menu-panel] a[href*="/docs/ug"]'),
      ).toHaveCount(articleIds.length);
    });
  }
});

for (const locale of ['vi', 'en'] as const) {
  test(`${locale} approved guide URLs render with the current article in the table of contents`, async ({
    page,
  }) => {
    for (const id of articleIds) {
      const path = `/${locale}/docs/${id}`;
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('main article h2').first()).toBeVisible();
      await expect(
        page.locator('[data-desktop-docs-contents] a[aria-current="page"]'),
      ).toHaveAttribute('href', path);
    }
    expect((await page.request.get(`/${locale}/docs/ug11`)).status()).toBe(404);
  });
}
