import { expect, test } from './fixtures';

for (const locale of ['vi', 'en']) {
  test(`${locale} repeated audience anchors restore the selected content`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}#audience-trader`);
      await expect(page.locator('#audience-trader')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(
        page.locator('astro-island[component-export="LandingAudienceSection"]'),
      ).not.toHaveAttribute('ssr');
      await page.locator('#audience-analyst').click();
      await expect(page.locator('#audience-analyst')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await page.evaluate(() => {
        const link = document.createElement('a');
        link.href = '#audience-trader';
        link.textContent = 'Return to trader';
        document.querySelector('main')!.append(link);
      });
      await page.getByRole('link', { name: 'Return to trader' }).click();
      await expect(page.locator('#audience-trader')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.locator('#audience-analyst')).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      await expect(page).toHaveURL(new RegExp(`/${locale}#audience-trader$`));
      await page
        .getByRole('link', { name: 'Return to trader' })
        .evaluate((link) => link.remove());
    }
  });
}
