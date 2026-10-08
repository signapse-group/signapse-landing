import AxeBuilder from '@axe-core/playwright';
import type { Page, Route } from '@playwright/test';

import { expect, test } from './fixtures';

const features = [
  'knowledge-graph',
  'market-chart',
  'ai-conversation',
  'scheduled-telegram',
] as const;
const capabilityIds = [
  'knowledge-graph',
  'live-charts',
  'ai-assistant',
  'telegram',
  'strategy-coding',
] as const;
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 800 },
  { name: 'short', width: 1440, height: 620 },
];
const indexable = process.env.SIGNAPSE_LANDING_INDEXABLE === 'true';
const publicOrigin = process.env.SIGNAPSE_PUBLIC_ORIGIN;
const contactApiOrigin = new URL(
  process.env.PUBLIC_CONTACT_API_ORIGIN ?? 'https://dev-api.signapse.cloud',
).origin;
const contactRequestUrl = new URL('/contact-requests', contactApiOrigin).href;

const contactCopy = {
  vi: {
    title: 'Gửi lời nhắn',
    name: 'Tên (không bắt buộc)',
    namePlaceholder: 'Tên của bạn',
    email: 'Email *',
    emailPlaceholder: 'ban@example.com',
    message: 'Lời nhắn *',
    messagePlaceholder: 'Chia sẻ nhu cầu hoặc câu hỏi của bạn',
    required: 'Email và lời nhắn là bắt buộc.',
    emptyMessage: 'Vui lòng nhập lời nhắn.',
    invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ.',
    tooLong: 'Nội dung vượt giới hạn độ dài. Vui lòng rút gọn và thử lại.',
    success:
      'Lời nhắn của bạn đã được lưu. Cảm ơn bạn đã liên hệ với Signapse.',
    requestTooLarge: 'Yêu cầu quá lớn. Vui lòng rút gọn nội dung và thử lại.',
    rateLimit: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
    fallback: 'Vui lòng kiểm tra thông tin đã nhập.',
    submissionError:
      'Chưa xác nhận được yêu cầu của bạn. Thông tin đã nhập được giữ lại để bạn thử lại.',
    noJavaScript:
      'Bật JavaScript để gửi form hoặc liên hệ qua email access@signapse.cloud.',
  },
  en: {
    title: 'Send a message',
    name: 'Name (optional)',
    namePlaceholder: 'Your name',
    email: 'Email *',
    emailPlaceholder: 'you@example.com',
    message: 'Message *',
    messagePlaceholder: 'Share your needs or questions',
    required: 'Email and message are required.',
    emptyMessage: 'Please enter a message.',
    invalidEmail: 'Please enter a valid email address.',
    tooLong:
      'Your input exceeds the allowed length. Please shorten it and try again.',
    success: 'Your message has been saved. Thank you for contacting Signapse.',
    requestTooLarge:
      'Your request is too large. Please shorten it and try again.',
    rateLimit: 'You have sent too many requests. Please try again later.',
    fallback: 'Please check the information you entered.',
    submissionError:
      'We could not confirm your request. Your input has been kept so you can try again.',
    noJavaScript:
      'Enable JavaScript to submit the form, or email access@signapse.cloud.',
  },
} as const;

async function openContactForm(page: Page, locale: 'vi' | 'en') {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/${locale}#access`);
  await expect(page.locator('#contact-request-form')).toBeVisible();
}

async function interceptContactApi(
  page: Page,
  handler: (route: Route) => Promise<void>,
) {
  await page.route('**/contact-requests', async (route) => {
    expect(new URL(route.request().url()).href).toBe(contactRequestUrl);
    await handler(route);
  });
}

async function fillContact(
  page: Page,
  locale: 'vi' | 'en',
  fields: { email?: string; message?: string; name?: string } = {},
) {
  await page
    .getByLabel(contactCopy[locale].email)
    .fill(fields.email ?? 'visitor@example.test');
  if (fields.name !== undefined) {
    await page.getByLabel(contactCopy[locale].name).fill(fields.name);
  }
  await page
    .getByLabel(contactCopy[locale].message)
    .fill(fields.message ?? 'Please contact me about a demo.');
}

async function ready(page: Page, locale: 'vi' | 'en' = 'vi', suffix = '') {
  await page.goto(`/${locale}${suffix}`);
  await expect(page.locator('h1')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page.locator('[data-context-stage]').getAttribute('data-renderer-state'),
    )
    .not.toBe('loading');
}

async function selectFeature(page: Page, feature: (typeof features)[number]) {
  await page.locator(`[data-feature-selector="${feature}"]`).click();
  await expect(
    page.locator(`[data-feature-selector="${feature}"]`),
  ).toHaveAttribute('aria-current', 'step');
  await expect(
    page.locator(`[data-feature-stage="${feature}"]`),
  ).toHaveAttribute('data-active', 'true');
}

async function assertNoOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
}

function progress(page: Page, feature: (typeof features)[number]) {
  return page.locator(`[data-demo-progress="${feature}"] rect`).last();
}

async function progressValue(page: Page, feature: (typeof features)[number]) {
  return progress(page, feature).evaluate((element) =>
    Number.parseFloat(
      (element as SVGRectElement).style.strokeDashoffset || '0',
    ),
  );
}

for (const locale of ['vi', 'en'] as const) {
  test(`${locale} public shell, localized metadata and Blog navigation`, async ({
    page,
  }) => {
    await ready(page, locale);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page).toHaveTitle('Signapse | Market Intelligence Platform');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText(
      locale === 'vi' ? 'Hiểu nhanh hơn.' : 'Understand faster.',
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      indexable ? 'index, follow' : 'noindex, follow',
    );
    if (publicOrigin) {
      const origin = new URL(publicOrigin).origin;
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `${origin}/${locale}`,
      );
      for (const language of ['vi', 'en']) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${language}"]`),
        ).toHaveAttribute('href', `${origin}/${language}`);
      }
      await expect(
        page.locator('link[rel="alternate"][hreflang="x-default"]'),
      ).toHaveAttribute('href', `${origin}/`);
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
    }
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      locale === 'vi'
        ? /Signapse kết nối giá, sự kiện/
        : /Signapse connects price, events/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      new RegExp(`/social/${locale}\\.png$`),
    );
    const blogHref = `/${locale}/blogs`;
    await expect(page.locator('a[href*="/dashboard"]')).toHaveCount(0);
    expect(
      await page
        .locator('[data-landing-part="header"]')
        .locator(`a[href="${blogHref}"]`)
        .count(),
    ).toBeGreaterThan(0);
    await expect(
      page.locator('[data-landing-part="header"]'),
    ).not.toContainText(/Sign in|Đăng nhập/);
    await expect(page.locator('a[href*="/sign-in"]')).toHaveCount(0);
    await expect(
      page.locator(
        '[data-landing-section="hero-product-proof"] a[href="#access"]',
      ),
    ).toBeVisible();
    await expect(page.locator('[data-landing-part="footer"]')).toContainText(
      'access@signapse.cloud',
    );
    const blogLink = page
      .locator('[data-landing-part="header"] nav')
      .first()
      .locator(`a[href="${blogHref}"]`);
    await expect(blogLink).toBeVisible();
    await blogLink.click();
    await expect(page).toHaveURL(new URL(blogHref, page.url()).href);
  });

  for (const viewport of viewports) {
    test(`${locale} ${viewport.name} keeps all four demos in readable responsive layout`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await ready(page, locale);
      await assertNoOverflow(page);
      for (const feature of features) {
        await selectFeature(page, feature);
        const copy = page.locator(`[data-story-copy="${feature}"]`);
        const stage = page.locator(`[data-feature-stage="${feature}"]`);
        const copyBox = (await copy.boundingBox())!;
        const stageBox = (await stage.boundingBox())!;
        expect(copyBox).not.toBeNull();
        expect(stageBox).not.toBeNull();
        if (viewport.width >= 1024) {
          await expect(stage).toHaveCSS('position', 'sticky');
          expect(stageBox.x).toBeGreaterThanOrEqual(
            copyBox.x + copyBox.width - 1,
          );
          expect(stageBox.y).toBeGreaterThanOrEqual(71);
          expect(stageBox.y + stageBox.height).toBeLessThanOrEqual(
            viewport.height + 1,
          );
        } else {
          await expect(stage).toHaveCSS('position', 'relative');
          expect(stageBox.y).toBeGreaterThanOrEqual(
            copyBox.y + copyBox.height - 1,
          );
          expect(stageBox.x).toBeGreaterThanOrEqual(0);
          expect(stageBox.x + stageBox.width).toBeLessThanOrEqual(
            viewport.width + 1,
          );
        }
        await expect(copy.locator('[data-demo-progress]')).toBeVisible();
        await stage.scrollIntoViewIfNeeded();
        await expect(stage).toBeVisible();
      }
      const telegramBrowser = page.locator('[data-telegram-browser]');
      const panels = telegramBrowser.locator(
        '[data-telegram-canvas] > section',
      );
      await expect(panels).toHaveCount(2);
      const browserBox = (await telegramBrowser.boundingBox())!;
      for (const panel of await panels.all()) {
        const box = (await panel.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(browserBox.x);
        expect(box.x + box.width).toBeLessThanOrEqual(
          browserBox.x + browserBox.width + 1,
        );
        expect(box.y + box.height).toBeLessThanOrEqual(
          browserBox.y + browserBox.height + 1,
        );
        expect(
          await panel.evaluate(
            (element) => element.scrollHeight <= element.clientHeight,
          ),
        ).toBe(true);
      }
      const bubble = telegramBrowser.locator('[data-slot="bubble-content"]');
      expect(
        await bubble.evaluate(
          (element) => element.scrollHeight <= element.clientHeight,
        ),
      ).toBe(true);
      await assertNoOverflow(page);
      await testInfo.attach(`${locale}-${viewport.name}.png`, {
        body: await page.screenshot({ animations: 'disabled' }),
        contentType: 'image/png',
      });
    });
  }

  test(`${locale} locale switch keeps supported query/hash and clears retired anchors`, async ({
    page,
  }) => {
    const next = locale === 'vi' ? 'en' : 'vi';
    const label = next === 'en' ? 'English' : 'Tiếng Việt';
    for (const hash of [
      'knowledge-graph',
      'strategy-coding',
      'capability-strip',
      'trust',
      'access',
    ]) {
      await ready(page, locale, `?source=browser&filter=a%20b#${hash}`);
      await page.locator('[data-locale-menu-trigger]').click();
      const link = page.getByRole('link', { name: label, exact: true }).first();
      await expect(link).toHaveAttribute('lang', next);
      await expect(link).toHaveAttribute('hreflang', next);
      await link.click();
      await expect(page).toHaveURL(
        new RegExp(`/${next}\\?source=browser&filter=a(?:%20|\\+)b#${hash}$`),
      );
      await expect(page.locator('html')).toHaveAttribute('lang', next);
      if (hash === 'strategy-coding' || hash === 'knowledge-graph') {
        await expect(page.getByRole('dialog')).toBeVisible();
      }
    }
    for (const hash of [
      'workspace-ai',
      'product',
      'how-it-works',
      'unsupported',
    ]) {
      await ready(page, locale, `?source=footer#${hash}`);
      await page.locator('[data-locale-menu-trigger]').click();
      await page
        .getByRole('link', { name: label, exact: true })
        .first()
        .click();
      await expect(page).toHaveURL(new RegExp(`/${next}\\?source=footer$`));
    }
    expect(await page.context().cookies()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'signapse_locale' }),
      ]),
    );
  });
}

test('desktop direct navigation reaches landing sections and locale disclosure supports Escape and outside clicks', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, 'en');
  const menu = page.locator('[data-locale-menu-trigger]').locator('..');
  const summary = menu.locator('summary');
  await summary.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link').first().focus();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await summary.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await page.mouse.click(12, 890);
  await expect(menu).not.toHaveAttribute('open');
  const navigation = page.locator('[data-landing-part="header"] nav').first();
  for (const id of ['capability-strip', 'showcase', 'audiences']) {
    await navigation.locator(`a[href="#${id}"]`).press('Enter');
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    expect(
      await page
        .locator(`#${id}`)
        .evaluate((section) => section.getBoundingClientRect().top),
    ).toBeGreaterThanOrEqual(72);
  }
});

test('mobile native navigation works by keyboard and capability details work by touch', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 375, height: 800 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await ready(page);
    const summary = page.locator('[data-mobile-menu] > summary');
    await summary.focus();
    await summary.press('Enter');
    await expect(page.locator('[data-mobile-menu]')).toHaveAttribute(
      'open',
      '',
    );
    await page.locator('[data-mobile-menu] a[href="#capability-strip"]').tap();
    await expect(page).toHaveURL(/#capability-strip$/);
    await expect(page.locator('[data-mobile-menu]')).not.toHaveAttribute(
      'open',
    );
    await page.locator('#telegram').tap();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await page.locator('#ai-assistant').tap();
    await expect(page.getByRole('dialog')).toBeVisible();
    const box = (await page.getByRole('dialog').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    await page.locator('#ai-assistant').tap();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await assertNoOverflow(page);
  } finally {
    await context.close();
  }
});

test('five capability popovers open from keyboard, direct links and repeated footer anchors', async ({
  page,
}) => {
  await ready(page);
  for (const id of capabilityIds) {
    const trigger = page.locator(`#${id}`);
    await trigger.focus();
    await trigger.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(
      page.locator(`[data-capability-detail="${id}"]`),
    ).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.press('Space');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  for (const id of capabilityIds) {
    await ready(page, 'en', `#${id}`);
    await expect(
      page.locator(`[data-capability-detail="${id}"]`),
    ).toBeVisible();
    await page.keyboard.press('Escape');
  }
  for (let repeat = 0; repeat < 2; repeat += 1) {
    await page.locator('footer a[href="#telegram"]').click();
    await expect(
      page.locator('[data-capability-detail="telegram"]'),
    ).toBeVisible();
    await page.keyboard.press('Escape');
  }
});

test('story scroll and keyboard controls select all four steps without stealing focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, 'en');
  const graph = page.locator('[data-feature-selector="knowledge-graph"]');
  await graph.click();
  await graph.press('ArrowDown');
  const market = page.locator('[data-feature-selector="market-chart"]');
  await expect(market).toBeFocused();
  await expect(market).toHaveAttribute('aria-current', 'step');
  await market.press('End');
  await expect(
    page.locator('[data-feature-selector="scheduled-telegram"]'),
  ).toBeFocused();
  await page.keyboard.press('Home');
  await expect(graph).toBeFocused();
  for (const feature of [...features, ...[...features].reverse()]) {
    await page
      .locator(`[data-story-copy="${feature}"]`)
      .evaluate((element) =>
        element.scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
    await expect(
      page.locator(`[data-feature-selector="${feature}"]`),
    ).toHaveAttribute('aria-current', 'step');
    await expect(
      page.locator(`[data-feature-stage="${feature}"]`),
    ).toHaveAttribute('data-active', 'true');
    await expect(graph).toBeFocused();
  }
});

test('all demo progress follows playback and pauses for hidden pages and offscreen stages', async ({
  page,
}) => {
  await ready(page);
  for (const feature of features) {
    await selectFeature(page, feature);
    const demo = page
      .locator(`[data-feature-stage="${feature}"] [data-demo-running]`)
      .first();
    await expect(demo).toHaveAttribute('data-demo-running', 'true');
    await expect.poll(() => progressValue(page, feature)).toBeGreaterThan(0);
    const before = await progressValue(page, feature);
    await expect.poll(() => progressValue(page, feature)).not.toBe(before);
    // Synthetic visibilitychange isolates the application's browser event
    // response; native background-tab GPU throttling is a separate manual check.
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      });
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(demo).toHaveAttribute('data-demo-running', 'false');
    const hidden = await progressValue(page, feature);
    await page.waitForTimeout(350);
    expect(await progressValue(page, feature)).toBe(hidden);
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'visible',
      });
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        value: false,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await expect(demo).toHaveAttribute('data-demo-running', 'true');
    await expect.poll(() => progressValue(page, feature)).not.toBe(hidden);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(demo).toHaveAttribute('data-demo-running', 'false');
    const offscreen = await progressValue(page, feature);
    await page.waitForTimeout(350);
    expect(await progressValue(page, feature)).toBe(offscreen);
  }
});

test('demo selection restarts Graph and Telegram at the first frame', async ({
  page,
}) => {
  await ready(page);
  await selectFeature(page, 'knowledge-graph');
  await expect(page.locator('[data-graph-demo-state]')).toHaveAttribute(
    'data-graph-demo-state',
    'incoming',
    { timeout: 8000 },
  );
  await selectFeature(page, 'market-chart');
  await selectFeature(page, 'knowledge-graph');
  await expect(page.locator('[data-graph-demo-state]')).toHaveAttribute(
    'data-graph-demo-state',
    'start',
  );
  await selectFeature(page, 'scheduled-telegram');
  await expect(page.locator('[data-telegram-demo-state]')).toHaveAttribute(
    'data-telegram-demo-state',
    'delivered',
    { timeout: 20_000 },
  );
  await selectFeature(page, 'knowledge-graph');
  await selectFeature(page, 'scheduled-telegram');
  await expect(page.locator('[data-telegram-demo-state]')).toHaveAttribute(
    'data-telegram-demo-state',
    'start',
  );
});

test('AI playback keeps both question rounds, streaming responses and looped composer visible', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-04T03:00:00Z') });
  await ready(page, 'en');
  await selectFeature(page, 'knowledge-graph');
  const demo = page.locator('[data-ai-conversation-demo]');
  await expect(demo).toBeAttached();
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 250),
  );
  await selectFeature(page, 'ai-conversation');
  await page.clock.runFor(7400);
  await expect(demo).toHaveAttribute(
    'data-ai-conversation-state',
    'crossCheck',
  );
  await expect(demo.locator('[data-ai-thinking]')).toHaveAttribute(
    'data-visible',
    'true',
  );
  await page.clock.runFor(2800);
  await expect(demo.locator('[data-ai-response]')).toHaveAttribute(
    'data-streaming',
    'true',
  );
  await expect(demo.locator('[data-ai-thinking]')).toHaveAttribute(
    'data-visible',
    'false',
  );
  await page.clock.runFor(6500);
  await expect(demo.locator('[data-ai-follow-up-user]')).toHaveAttribute(
    'data-visible',
    'true',
  );
  await expect(demo.locator('[data-ai-follow-up-thinking]')).toHaveAttribute(
    'data-visible',
    'true',
  );
  await page.clock.runFor(2600);
  await expect(demo.locator('[data-ai-follow-up-response]')).toHaveAttribute(
    'data-streaming',
    'true',
  );
  await page.clock.runFor(5700);
  await expect(demo).toHaveAttribute('data-ai-conversation-state', 'complete');
  await page.clock.runFor(2600);
  await expect(demo).toHaveAttribute('data-ai-conversation-state', 'welcome');
  await page.clock.runFor(4300);
  await expect(demo.locator('[data-ai-user-message]')).toBeVisible();
  const composer = demo.locator('textarea');
  await expect(composer).toBeVisible();
  expect(
    await composer.evaluate(
      (element) => element.scrollHeight <= element.clientHeight,
    ),
  ).toBe(true);
});

for (const locale of ['vi', 'en'] as const) {
  test(`${locale} no JavaScript keeps useful Hero and four renderer proofs`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    try {
      await page.goto(`/${locale}`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(
        page.locator('[data-landing-visual="context-figure"] svg').first(),
      ).toBeVisible();
      await expect(
        page.locator('[data-landing-visual="context-figure"] figcaption'),
      ).not.toBeEmpty();
      await expect(page.locator('[data-feature-showcase]')).toHaveAttribute(
        'data-scroll-enhanced',
        'false',
      );
      for (const feature of features) {
        await expect(
          page.locator(`[data-story-copy="${feature}"]`),
        ).toBeVisible();
        await expect(
          page.locator(`[data-feature-stage="${feature}"]`),
        ).toBeVisible();
      }
      await expect(
        page.locator('[data-graph-demo-state] svg').first(),
      ).toBeVisible();
      await expect(
        page.locator('[data-market-demo-state] svg').first(),
      ).toBeVisible();
      await expect(page.locator('[data-ai-conversation-state]')).toContainText(
        'XAUUSD',
      );
      await expect(page.locator('[data-telegram-browser]')).toContainText(
        'Market Desk',
      );
      await expect(page.locator('a[href*="/dashboard"]')).toHaveCount(0);
      await assertNoOverflow(page);
    } finally {
      await context.close();
    }
  });
}

test('reduced motion renders stable final proofs and static provider logos', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, 'en');
  for (const feature of features) {
    await selectFeature(page, feature);
    const demo = page
      .locator(`[data-feature-stage="${feature}"] [data-demo-running]`)
      .first();
    await expect(demo).toHaveAttribute('data-demo-running', 'false');
    const before = await progressValue(page, feature);
    await page.waitForTimeout(250);
    expect(await progressValue(page, feature)).toBe(before);
  }
  await expect(page.locator('[data-telegram-demo-state]')).toHaveAttribute(
    'data-telegram-demo-state',
    'delivered',
  );
  await expect(page.locator('[data-ai-conversation-demo]')).toHaveAttribute(
    'data-ai-conversation-state',
    'complete',
  );
  const providers = page.locator('[data-landing-section="ai-providers"]');
  await expect(providers.locator('[data-provider-item]')).toHaveCount(6);
  await expect(providers.locator('ul[aria-hidden="true"]')).toBeHidden();
});

test('WebGL unavailable preserves visible fallback and navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      name: string,
      ...args: unknown[]
    ) {
      if (
        name === 'webgl' ||
        name === 'webgl2' ||
        name === 'experimental-webgl'
      )
        return null;
      return Reflect.apply(original, this, [name, ...args]);
    } as typeof original;
  });
  await ready(page, 'en');
  await expect(page.locator('[data-context-stage]')).toHaveAttribute(
    'data-renderer-state',
    'fallback',
  );
  await expect(
    page.locator('[data-landing-visual="context-figure"] svg').first(),
  ).toBeVisible();
  await expect(page.locator('[data-context-status]')).toContainText(
    'unavailable',
  );
  await page.locator('#ai-assistant').click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('Hero WebGL interaction uses keyboard and pointer semantics when available', async ({
  page,
}) => {
  await ready(page, 'en');
  const stage = page.locator('[data-context-stage]');
  await expect(stage).not.toHaveAttribute('role', 'application');
  if ((await stage.getAttribute('data-enhanced')) !== 'true') {
    await expect(
      page.locator('[data-landing-visual="context-figure"] svg').first(),
    ).toBeVisible();
    return;
  }
  await expect(stage).toHaveAttribute('role', 'group');
  await stage.focus();
  await stage.press('Enter');
  await expect(stage).toHaveAttribute('data-context-mode', 'price');
  await stage.press('Space');
  await expect(stage).toHaveAttribute('data-context-mode', 'graph');
  await stage.press('ArrowRight');
  await stage.press('ArrowUp');
  await expect(stage).toBeFocused();
  await stage.hover();
  await expect(stage).toHaveAttribute('data-context-mode', 'price');
  await page.mouse.move(0, 0);
  await expect(stage).toHaveAttribute('data-context-mode', 'graph');
});

test('zoom, keyboard skip link and accessibility keep content reachable', async ({
  page,
}, testInfo) => {
  await ready(page, 'en');
  await page.keyboard.press('Tab');
  const skip = page.locator('a[href="#main-content"]').first();
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);
  await page.setViewportSize({ width: 720, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await assertNoOverflow(page);
  await expect(page.locator('h1')).toBeVisible();
  await page.locator('#strategy-coding').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await testInfo.attach('axe-results.json', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });
  expect(
    results.violations.filter(
      (violation) =>
        violation.impact === 'serious' || violation.impact === 'critical',
    ),
  ).toEqual([]);
});

test('fixed landing palette preserves stored dashboard theme preferences', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
  await ready(page, 'en');
  const hero = page.locator('[data-landing-section="hero-product-proof"]');
  const before = await hero.evaluate(
    (element) => getComputedStyle(element).color,
  );
  await page.evaluate(() => document.documentElement.classList.toggle('dark'));
  expect(
    await hero.evaluate((element) => getComputedStyle(element).color),
  ).toBe(before);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
});

test('without IntersectionObserver all previews stay in the natural document flow', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
  });
  await ready(page, 'en', '#strategy-coding');
  await expect(page.locator('[data-context-stage]')).toHaveAttribute(
    'data-renderer-state',
    'fallback',
  );
  await expect(page.locator('[data-context-fallback] svg')).toBeVisible();
  await expect(
    page.locator('[data-capability-detail="strategy-coding"]'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-feature-showcase]')).toHaveAttribute(
    'data-scroll-enhanced',
    'false',
  );
  for (const feature of features) {
    const stage = page.locator(`[data-feature-stage="${feature}"]`);
    await expect(stage).toBeVisible();
    await expect(stage).toHaveCSS('position', 'relative');
    const running = stage.locator('[data-demo-running]');
    if (await running.count())
      await expect(running).toHaveAttribute('data-demo-running', 'false');
  }
  await page.locator('#audience-analyst').click();
  await expect(page.locator('#audience-analyst')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('[data-audience-fallback]')).toBeVisible();
  await assertNoOverflow(page);
});

test('Market Chart retains annotation, outcomes and its close-detail control', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await ready(page, 'en');
  await selectFeature(page, 'market-chart');
  const stage = page.locator('[data-feature-stage="market-chart"]');
  await expect(
    stage.getByRole('heading', {
      name: 'US retail sales come in below forecast',
    }),
  ).toBeVisible();
  const close = stage.getByRole('button', { name: /Close/ });
  await expect(close).toBeVisible();
  await close.focus();
  await close.press('Enter');
  await expect(close).toHaveCount(0);
  await expect(stage.locator('svg').first()).toBeVisible();
  await expect(stage.locator('[data-market-demo-state]')).toHaveAttribute(
    'data-market-demo-state',
    'outcomeConfirmed',
  );
});

for (const locale of ['vi', 'en'] as const) {
  test(`${locale} audience choices and every demo pass accessibility in both wide and mobile layouts`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await ready(page, locale);
      for (const feature of features) {
        await selectFeature(page, feature);
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        await testInfo.attach(`axe-${locale}-${width}-${feature}.json`, {
          body: JSON.stringify(result.violations),
          contentType: 'application/json',
        });
        expect(result.violations).toEqual([]);
      }
      for (let index = 1; index <= 4; index += 1) {
        const choice = page.locator(`[data-audience-option="${index}"]`);
        await choice.click();
        await expect(choice).toHaveAttribute('aria-pressed', 'true');
        await choice.focus();
        await expect(choice).toBeFocused();
        const body = choice.locator('span').last();
        await expect(body).toBeVisible();
        await assertNoOverflow(page);
      }
    }
  });
}

test('root is a useful default landing entry with locale links and noindex', async ({
  page,
  request,
}) => {
  await page.goto('/?source=root#knowledge-graph');
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
  await expect(page.locator('h1')).toContainText('Hiểu nhanh hơn.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  );
  await expect(
    page.locator('[data-capability-detail="knowledge-graph"]'),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('[data-locale-menu-trigger]').click();
  await page
    .getByRole('link', { name: 'English', exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\?source=root#knowledge-graph$/);
  expect((await request.get('/fr')).status()).toBe(404);
});

for (const locale of ['vi', 'en'] as const) {
  const copy = contactCopy[locale];

  test(`${locale} contact form exposes labels, validation, focus and localized copy`, async ({
    page,
  }) => {
    let requestCount = 0;
    await interceptContactApi(page, async (route) => {
      requestCount += 1;
      await route.fulfill({ status: 201, body: '' });
    });
    await openContactForm(page, locale);

    const section = page.locator('#access');
    const name = page.getByLabel(copy.name, { exact: true });
    const email = page.getByLabel(copy.email, { exact: true });
    const message = page.getByLabel(copy.message, { exact: true });
    const submit = page.getByRole('button', { name: copy.title, exact: true });

    await expect(section.getByRole('heading', { level: 2 })).toContainText(
      locale === 'vi' ? 'Liên hệ với Signapse' : 'Contact Signapse',
    );
    await expect(page.getByRole('heading', { name: copy.title })).toBeVisible();
    await expect(name).toHaveValue('');
    await expect(email).toHaveValue('');
    await expect(message).toHaveValue('');
    await expect(name).toHaveAttribute('placeholder', copy.namePlaceholder);
    await expect(email).toHaveAttribute('placeholder', copy.emailPlaceholder);
    await expect(message).toHaveAttribute(
      'placeholder',
      copy.messagePlaceholder,
    );
    await expect(email).toHaveAttribute('maxlength', '254');
    await expect(email).toHaveAttribute('required', '');
    await expect(name).toHaveAttribute('maxlength', '100');
    await expect(message).toHaveAttribute('maxlength', '5000');
    await expect(section).toContainText(copy.required);

    const initialAxe = await new AxeBuilder({ page })
      .include('#access')
      .analyze();
    expect(initialAxe.violations).toEqual([]);

    await submit.click();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-email-error')).toHaveText(
      copy.required,
    );
    await expect(email).toBeFocused();

    await fillContact(page, locale, {
      email: 'not-an-email',
      message: 'A message',
    });
    await submit.click();
    await expect(page.locator('#contact-email-error')).toHaveText(
      copy.invalidEmail,
    );

    await fillContact(page, locale, { message: ' \n\t ' });
    await submit.click();
    await expect(page.locator('#contact-message-error')).toHaveText(
      copy.emptyMessage,
    );
    await expect(message).toHaveAttribute('aria-invalid', 'true');
    expect(requestCount).toBe(0);

    await email.focus();
    await email.press('Tab');
    await expect(message).toBeFocused();
    await message.press('Tab');
    await expect(submit).toBeFocused();
    await expect(
      page.locator(
        '[data-landing-section="hero-product-proof"] a[href="#access"]',
      ),
    ).toBeVisible();
    await expect(page.locator('[data-landing-part="footer"]')).toContainText(
      'access@signapse.cloud',
    );
  });

  test(`${locale} contact form sends the producer payload and accepts an empty 201`, async ({
    page,
  }) => {
    let requestCount = 0;
    let requestHeaders: Record<string, string> = {};
    let requestBody: unknown;
    await interceptContactApi(page, async (route) => {
      requestCount += 1;
      requestHeaders = await route.request().allHeaders();
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 201, body: '' });
    });
    await openContactForm(page, locale);

    const message = 'Xin chào 🌿\nDòng thứ hai — 合作';
    await fillContact(page, locale, { message });
    await page.getByLabel(copy.email, { exact: true }).press('Enter');

    await expect(page.getByRole('status')).toHaveText(copy.success);
    expect(requestCount).toBe(1);
    expect(requestBody).toEqual({
      email: 'visitor@example.test',
      message,
    });
    expect(requestHeaders['content-type']).toContain('application/json');
    expect(requestHeaders['accept-language']).toBe(locale);
    expect(requestHeaders.authorization).toBeUndefined();
    expect(requestHeaders.cookie).toBeUndefined();
    await expect(page.getByLabel(copy.name, { exact: true })).toHaveValue('');
    await expect(page.getByLabel(copy.email, { exact: true })).toHaveValue('');
    await expect(page.getByLabel(copy.message, { exact: true })).toHaveValue(
      '',
    );
    await expect(page).toHaveURL(new RegExp(`#access$`));
  });

  test(`${locale} contact form submits values at the published producer limits`, async ({
    page,
  }) => {
    let requestBody: unknown;
    await interceptContactApi(page, async (route) => {
      requestBody = route.request().postDataJSON();
      await route.fulfill({ status: 201, body: '' });
    });
    await openContactForm(page, locale);

    const maxEmail = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(56)}.test`;
    const maxName = 'N'.repeat(100);
    const maxMessage = 'M'.repeat(5000);
    await fillContact(page, locale, {
      email: maxEmail,
      name: maxName,
      message: maxMessage,
    });
    await page.getByRole('button', { name: copy.title, exact: true }).click();
    await expect(page.getByRole('status')).toHaveText(copy.success);
    expect(requestBody).toEqual({
      email: maxEmail,
      name: maxName,
      message: maxMessage,
    });
  });

  test(`${locale} contact form keeps a useful email path when JavaScript is disabled`, async ({
    page,
  }) => {
    let requestCount = 0;
    const browser = page.context().browser();
    if (!browser) throw new Error('Expected the Chromium browser fixture.');
    const noJsContext = await browser.newContext({ javaScriptEnabled: false });

    try {
      const noJsPage = await noJsContext.newPage();
      await interceptContactApi(noJsPage, async (route) => {
        requestCount += 1;
        await route.fulfill({ status: 201, body: '' });
      });
      await noJsPage.goto(`/${locale}#access`);

      const section = noJsPage.locator('#access');
      await expect(
        section.getByText(copy.noJavaScript, { exact: true }),
      ).toBeVisible();
      await expect(section.locator('a[href^="mailto:"]')).toContainText(
        'access@signapse.cloud',
      );
      await expect(section.locator('#contact-request-form')).toHaveCount(0);
      await expect(section.getByRole('status')).toHaveCount(0);
      await expect(section.getByRole('alert')).toHaveCount(0);
      expect(requestCount).toBe(0);
    } finally {
      await noJsContext.close();
    }
  });

  test(`${locale} contact layout fits the assigned widths and 200% zoom`, async ({
    page,
  }, testInfo) => {
    await openContactForm(page, locale);
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect
      .poll(() =>
        page
          .locator('[data-contact-form-card]')
          .evaluate((element) => getComputedStyle(element).paddingTop),
      )
      .toBe('32px');
    await expect
      .poll(() =>
        page
          .locator('[data-contact-form-card]')
          .evaluate((element) => getComputedStyle(element).borderTopWidth),
      )
      .toBe('1px');
    await expect
      .poll(() =>
        page
          .locator('#contact-request-form button[type="submit"]')
          .evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(400);

    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await assertNoOverflow(page);
      const layout = page.locator('[data-contact-layout]');
      const form = page.locator('[data-contact-form-card]');
      const box = await form.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      const columnCount = await layout.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/)
            .length,
      );
      expect(columnCount).toBe(width >= 1152 ? 2 : 1);
      const nameBox = await page.locator('#contact-name').boundingBox();
      const emailBox = await page.locator('#contact-email').boundingBox();
      expect(nameBox).not.toBeNull();
      expect(emailBox).not.toBeNull();
      if (width >= 640) expect(emailBox!.y).toBe(nameBox!.y);
      else expect(emailBox!.y).toBeGreaterThan(nameBox!.y);
    }

    await page.setViewportSize({ width: 720, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    await assertNoOverflow(page);
    await expect(page.locator('[data-contact-form-card]')).toBeVisible();

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.zoom = '1';
      void document.documentElement.offsetHeight;
    });
    await page.evaluate(() => document.fonts.ready);
    const contactSection = page.locator('#access');
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeInViewport();
    await expect(page.locator('[data-contact-form-card]')).toBeInViewport();
    await expect
      .poll(() =>
        page
          .locator('[data-contact-form-card]')
          .evaluate((element) => getComputedStyle(element).paddingTop),
      )
      .toBe('32px');
    await expect
      .poll(() =>
        page
          .locator('#contact-request-form button[type="submit"]')
          .evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(400);
    await testInfo.attach(`contact-form-${locale}-desktop.png`, {
      body: await contactSection.screenshot({ animations: 'disabled' }),
      contentType: 'image/png',
    });
  });
}

test('contact API errors, unreadable bodies and network failure never lose input or retry', async ({
  page,
}) => {
  const locale = 'vi';
  const copy = contactCopy[locale];
  const responses = [
    {
      status: 400,
      body: JSON.stringify({ message: copy.tooLong }),
    },
    { status: 400, body: 'not-json' },
    { status: 413, body: '' },
    {
      status: 415,
      body: JSON.stringify({ message: 'db host 10.0.0.1 is unavailable' }),
    },
    {
      status: 500,
      body: JSON.stringify({ message: 'internal database detail' }),
    },
    { status: 0, networkFailure: true },
    { status: 204, body: undefined },
    {
      status: 429,
      body: JSON.stringify({ message: copy.rateLimit }),
      retryAfter: '60',
    },
  ];
  const expectedMessages = [
    copy.tooLong,
    copy.fallback,
    copy.requestTooLarge,
    copy.submissionError,
    copy.submissionError,
    copy.submissionError,
    copy.submissionError,
    copy.rateLimit,
  ];
  let requestCount = 0;
  await interceptContactApi(page, async (route) => {
    const reply = responses[requestCount];
    requestCount += 1;
    if (reply.networkFailure) {
      await route.abort('failed');
      return;
    }
    await route.fulfill({
      status: reply.status,
      contentType: 'application/json',
      headers: reply.retryAfter ? { 'Retry-After': reply.retryAfter } : {},
      body: reply.body,
    });
  });
  await openContactForm(page, locale);
  await fillContact(page, locale);

  for (let index = 0; index < expectedMessages.length; index += 1) {
    await page.getByRole('button', { name: copy.title, exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(expectedMessages[index]);
    await expect(page.getByLabel(copy.email, { exact: true })).toHaveValue(
      'visitor@example.test',
    );
    await expect(page.getByLabel(copy.message, { exact: true })).toHaveValue(
      'Please contact me about a demo.',
    );
  }

  await expect(page.getByRole('button', { name: copy.title })).toBeEnabled();
  await page.waitForTimeout(100);
  expect(requestCount).toBe(responses.length);
  await expect(page.locator('#access')).not.toContainText('10.0.0.1');
  await expect(page.locator('#access')).not.toContainText('internal database');
});

test('contact submission in flight ignores repeated click and Enter submits', async ({
  page,
}) => {
  let requestCount = 0;
  await interceptContactApi(page, async (route) => {
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({ status: 201, body: '' });
  });
  await openContactForm(page, 'en');
  await fillContact(page, 'en');

  await page.evaluate(() => {
    const form = document.querySelector<HTMLFormElement>(
      '#contact-request-form',
    );
    form?.requestSubmit();
    form?.requestSubmit();
  });

  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();
  await expect(page.getByRole('status')).toHaveText(contactCopy.en.success);
  expect(requestCount).toBe(1);
});
