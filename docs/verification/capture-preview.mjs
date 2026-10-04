import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

// Run against this repository's production preview after pnpm build.
const origin = new URL(process.argv[2] ?? 'http://127.0.0.1:4321').origin;
const output = join(dirname(fileURLToPath(import.meta.url)), 'preview');
const features = [
  'knowledge-graph',
  'market-chart',
  'ai-conversation',
  'scheduled-telegram',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 800 },
  { name: 'short', width: 1440, height: 620 },
];
const report = {
  repository: 'signapse-landing',
  origin,
  capturedAt: new Date().toISOString(),
  captures: [],
  failures: [],
};
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
report.browser = browser.version();

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

async function ready(page, locale) {
  await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('h1')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('[data-context-stage]').getAttribute('data-renderer-state'),
    )
    .not.toBe('loading');
}

async function save(page, name, extra = {}) {
  await page.screenshot({
    path: join(output, `${name}.png`),
    animations: 'disabled',
    ...extra,
  });
  const state = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    viewport: { width: innerWidth, height: innerHeight },
    overflow: document.documentElement.scrollWidth > innerWidth,
    showcase: document.querySelector('[data-feature-showcase]')?.dataset
      .scrollEnhanced,
    context: { ...document.querySelector('[data-context-stage]')?.dataset },
    activeDemo: document.querySelector(
      '[data-feature-stage][data-active="true"]',
    )?.dataset.featureStage,
  }));
  assert.equal(state.overflow, false);
  report.captures.push({ file: `${name}.png`, ...state });
}

try {
  for (const locale of ['vi', 'en']) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        locale: locale === 'vi' ? 'vi-VN' : 'en-US',
        timezoneId: 'Asia/Ho_Chi_Minh',
        reducedMotion: 'reduce',
        hasTouch: viewport.name === 'mobile',
        isMobile: viewport.name === 'mobile',
      });
      const page = await context.newPage();
      const errors = collectErrors(page);
      try {
        await ready(page, locale);
        const prefix = `${locale}-${viewport.name}`;
        await save(page, `${prefix}-hero`);
        await save(page, `${prefix}-full`, { fullPage: true });
        if (viewport.name === 'desktop') {
          for (const feature of features) {
            await page.locator(`[data-feature-selector="${feature}"]`).click();
            await expect(
              page.locator(`[data-feature-stage="${feature}"]`),
            ).toHaveAttribute('data-active', 'true');
            await expect(
              page.locator(`[data-feature-stage="${feature}"]`),
            ).toBeVisible();
            await save(page, `${prefix}-${feature}`);
          }
        }
        await page.evaluate(() => scrollTo(0, 0));
        if (viewport.name === 'desktop') {
          await page.locator('#ai-assistant').focus();
          await page.locator('#ai-assistant').press('Enter');
          await expect(page.getByRole('dialog')).toBeVisible();
          await save(page, `${prefix}-capability-keyboard`);
          await page.keyboard.press('Escape');
        }
        if (viewport.name === 'mobile') {
          await page.locator('[data-mobile-menu] > summary').press('Enter');
          await save(page, `${prefix}-navigation`);
        }
        assert.deepEqual(errors, []);
      } catch (error) {
        report.failures.push({
          locale,
          viewport,
          message: error.message,
          errors,
        });
      } finally {
        await context.close();
      }
      console.log(`Captured ${locale}/${viewport.name}`);
    }

    const noJS = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await noJS.newPage();
    const errors = collectErrors(page);
    try {
      await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toBeVisible();
      await save(page, `${locale}-nojs-full`, { fullPage: true });
      assert.deepEqual(errors, []);
    } catch (error) {
      report.failures.push({
        locale,
        mode: 'nojs',
        message: error.message,
        errors,
      });
    } finally {
      await noJS.close();
    }
  }
} finally {
  await browser.close();
  await writeFile(
    join(output, 'results.json'),
    JSON.stringify(report, null, 2) + '\n',
  );
}
assert.deepEqual(report.failures, []);
