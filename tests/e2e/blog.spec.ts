import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './fixtures';

const fixtureOrigin = process.env.PUBLIC_BLOG_API_ORIGIN;
if (!fixtureOrigin) {
  throw new Error(
    'PUBLIC_BLOG_API_ORIGIN must be set by the browser fixture runner.',
  );
}

test.beforeEach(async ({ request }) => {
  const publishResponse = await request.get(
    `${fixtureOrigin}/__fixture/publish?value=true`,
  );
  expect(publishResponse.ok()).toBe(true);
  const emptyResponse = await request.get(
    `${fixtureOrigin}/__fixture/empty?value=false`,
  );
  expect(emptyResponse.ok()).toBe(true);
});

test('public blog list is rendered by the server with metadata and route links', async ({
  page,
  request,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto('/vi/blogs');

  expect(response?.status()).toBe(200);
  expect(response?.headers()['cache-control']).toContain('no-store');
  expect(response?.headers()['surrogate-control']).toBe('no-store');
  await expect(page).toHaveTitle('Bài viết | Signapse');
  await expect(
    page.getByRole('heading', { name: 'Bài viết', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Đường dẫn' }).getByText('Bài viết'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Đọc thị trường qua mối liên hệ giữa sự kiện và giá',
      level: 3,
    }),
  ).toBeVisible();
  await expect(page.getByText('Hiển thị 1–6 trong 18 bài viết')).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Bài viết mới nhất' })
      .getByRole('link', { name: 'Trang sau' }),
  ).toHaveAttribute('href', '/vi/blogs?page=1');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Khám phá phân tích thị trường, góc nhìn và cập nhật từ Signapse.',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://landing.example.test/vi/blogs',
  );
  await expect(page.locator('[data-locale-link="en"]').first()).toHaveAttribute(
    'href',
    '/en/blogs',
  );
  await expect(page.locator('[data-locale-link="vi"]').first()).toHaveAttribute(
    'href',
    '/vi/blogs',
  );
  await expect(page.locator('a[href="/vi/blogs/fixture-post"]')).toHaveCount(1);
  await expect(
    page.locator('[data-landing-part="header"] a[href="/vi/blogs"]').first(),
  ).toHaveAttribute('href', '/vi/blogs');

  const authorization = await request.get(
    `${fixtureOrigin}/__fixture/authorization`,
  );
  expect(await authorization.json()).toEqual({ authorization: null });
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('blog-list-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('list HTML includes pagination and locale destinations when JavaScript is disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  try {
    const response = await page.goto('/vi/blogs');
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: 'Bài viết', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Trang 2 trên 3' }),
    ).toHaveAttribute('href', '/vi/blogs?page=1');
    await expect(
      page.locator('[data-locale-link="en"]').first(),
    ).toHaveAttribute('href', '/en/blogs');
    await page.getByRole('link', { name: 'Trang 2 trên 3' }).click();
    await expect(page).toHaveURL(/\/vi\/blogs\?page=1$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://landing.example.test/vi/blogs?page=1',
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveAttribute('href', 'https://landing.example.test/en/blogs?page=1');
    await expect(
      page.getByRole('heading', { name: 'A second page article', level: 3 }),
    ).toBeVisible();
    const detailResponse = await page.goto('/vi/blogs/second-page');
    expect(detailResponse?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: 'A second page article', level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText('This paragraph remains after the broken image.'),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Tất cả bài viết' }).first(),
    ).toHaveAttribute('href', '/vi/blogs');
    await expect(
      page.locator('[data-locale-link="en"]').first(),
    ).toHaveAttribute('href', '/en/blogs/second-page');
  } finally {
    await context.close();
  }
});

test('an out-of-range list page redirects to the last available page', async ({
  page,
  request,
}) => {
  const staleResponse = await request.get('/vi/blogs?page=999', {
    maxRedirects: 0,
  });

  expect(staleResponse.status()).toBe(302);
  expect(staleResponse.headers()['location']).toBe('/vi/blogs?page=2');
  expect(staleResponse.headers()['cache-control']).toContain('no-store');
  expect(staleResponse.headers()['surrogate-control']).toBe('no-store');

  const response = await page.goto('/vi/blogs?page=999');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/vi\/blogs\?page=2$/);
  await expect(
    page.getByText('Hiển thị 13–18 trong 18 bài viết'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Following a market event', level: 3 }),
  ).toBeVisible();
});

test('public blog detail renders structured v1 content, metadata and locale navigation', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/vi');
  const vietnameseNavigation = page
    .locator(
      '[data-landing-part="header"] nav[aria-label="Điều hướng landing"]',
    )
    .first();
  await vietnameseNavigation.getByText('Tài nguyên', { exact: true }).hover();
  const blogLink = vietnameseNavigation.locator('a[href="/vi/blogs"]');
  await expect(blogLink).toBeVisible();
  await blogLink.click();
  await expect(page).toHaveURL(/\/vi\/blogs$/);
  await page.getByRole('link', { name: 'Trang 2 trên 3' }).click();
  await expect(page).toHaveURL(/\/vi\/blogs\?page=1$/);
  const [response] = await Promise.all([
    page.waitForResponse(
      (candidate) =>
        new URL(candidate.url()).pathname === '/vi/blogs/second-page',
    ),
    page.locator('a[href="/vi/blogs/second-page"]').first().click(),
  ]);

  expect(response?.status()).toBe(200);
  expect(response?.headers()['cache-control']).toContain('no-store');
  await expect(page).toHaveTitle('A second page article | Signapse');
  await expect(
    page.getByRole('heading', { name: 'A second page article', level: 1 }),
  ).toBeVisible();
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'article',
  );
  await expect(
    page.locator('meta[property="article:published_time"]'),
  ).toHaveAttribute('content', '2026-10-01T08:00:00.000Z');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://landing.example.test/vi/blogs/second-page',
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]'),
  ).toHaveAttribute(
    'href',
    'https://landing.example.test/en/blogs/second-page',
  );
  await expect(
    page.getByRole('link', { name: 'Tất cả bài viết' }).first(),
  ).toHaveAttribute('href', '/vi/blogs');
  await expect(page.getByRole('link', { name: 'Tất cả bài viết' })).toHaveCount(
    2,
  );
  await expect(page.getByText('Xuất bản', { exact: true })).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(
    page.getByText('This paragraph remains after the broken image.'),
  ).toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Unavailable market chart' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'a safe link' })).toHaveAttribute(
    'rel',
    'noopener noreferrer',
  );
  await expect(page.getByText('an unsafe link')).toBeVisible();
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Section one' })).toHaveAttribute(
    'href',
    '#blog-section-one',
  );
  await expect(page.getByText('First list item')).toBeVisible();
  const bulletList = page
    .getByText('First list item')
    .locator('xpath=ancestor::ul[1]');
  await expect(bulletList).toHaveCSS('list-style-type', 'disc');
  const orderedList = page
    .getByText('First ordered item')
    .locator('xpath=ancestor::ol[1]');
  await expect(orderedList).toHaveCSS('list-style-type', 'lower-alpha');
  await expect(orderedList).toHaveAttribute('start', '4');
  await expect(orderedList.locator('li')).toHaveCount(2);
  const indentedList = page
    .getByText('Indented ordered item')
    .locator('xpath=ancestor::ol[1]');
  await expect(indentedList).toHaveCSS('list-style-type', 'lower-alpha');
  await expect(indentedList).not.toHaveAttribute('start', '4');
  const indentDifference = await indentedList.evaluate((list) => {
    return list.getBoundingClientRect().left;
  });
  const firstListPosition = await orderedList.evaluate(
    (list) => list.getBoundingClientRect().left,
  );
  expect(indentDifference).toBeGreaterThan(firstListPosition);
  await expect(
    page.getByRole('checkbox', { name: 'Completed task' }),
  ).toBeChecked();
  await expect(
    page.getByRole('checkbox', { name: 'Open task' }),
  ).not.toBeChecked();
  await expect(page.locator('pre code')).toHaveText(
    'const publicReading = true;\nconsole.log(publicReading);',
  );
  const inlineObjectGap = await page
    .locator('time + span')
    .evaluate((element) => {
      const previous = element.previousElementSibling;
      if (!previous) return 0;
      return (
        element.getBoundingClientRect().left -
        previous.getBoundingClientRect().right
      );
    });
  expect(inlineObjectGap).toBeGreaterThan(0);
  await expect(page.getByText('Callout content.')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Table cell' })).toBeVisible();
  await expect(page.getByText('More details', { exact: true })).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(accessibility.violations).toEqual([]);

  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('blog-content-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  });

  const englishLocaleLink = page.locator('[data-locale-link="en"]').first();
  await page.locator('[data-locale-menu-trigger]').click();
  await expect(englishLocaleLink).toHaveAttribute(
    'href',
    '/en/blogs/second-page',
  );
  await expect(englishLocaleLink).toBeVisible();
  await englishLocaleLink.click();
  await expect(page).toHaveURL(/\/en\/blogs\/second-page$/);
  await expect(
    page.getByRole('link', { name: 'All articles' }).first(),
  ).toHaveAttribute('href', '/en/blogs');
  await expect(page.locator('article p time')).toHaveText('2 October 2026');
  await page.getByRole('link', { name: 'All articles' }).first().click();
  await expect(page).toHaveURL(/\/en\/blogs$/);
  const productNavigation = page
    .locator(
      '[data-landing-part="header"] nav[aria-label="Landing navigation"]',
    )
    .first();
  const knowledgeGraphLink = page
    .locator('[data-landing-part="header"] a[href="/en#knowledge-graph"]')
    .first();
  await expect(knowledgeGraphLink).toHaveAttribute(
    'href',
    '/en#knowledge-graph',
  );
  await productNavigation.getByText('Product', { exact: true }).hover();
  await expect(knowledgeGraphLink).toBeVisible();
  await knowledgeGraphLink.click();
  await expect(page).toHaveURL(/\/en#knowledge-graph$/);
});

test('approved Vietnamese blog detail content matches the desktop design', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const response = await page.goto('/vi/blogs/fixture-post');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(
    'Đọc thị trường qua mối liên hệ giữa sự kiện và giá | Signapse',
  );
  await expect(
    page.getByRole('heading', {
      name: 'Đọc thị trường qua mối liên hệ giữa sự kiện và giá',
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Bắt đầu từ sự kiện', level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Đối chiếu với chuyển động của giá',
      level: 2,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Giữ lại giả thuyết và giới hạn',
      level: 2,
    }),
  ).toBeVisible();
  const structuredList = page
    .getByText(/Thời điểm: biến động xuất hiện/)
    .locator('xpath=ancestor::ul[1]');
  await expect(structuredList).toHaveCSS('list-style-type', 'disc');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('blog-detail-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  });
});

test('public blog maps missing, private and failed API reads to safe HTTP states', async ({
  page,
}) => {
  for (const slug of ['missing-post', 'private-post', 'draft-body']) {
    const response = await page.goto(`/vi/blogs/${slug}`);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'Không tìm thấy bài viết' }),
    ).toBeVisible();
    await expect(page.getByText(/PRIVATE-/)).toHaveCount(0);
  }

  for (const slug of ['upstream-error', 'unsupported-version']) {
    const response = await page.goto(`/vi/blogs/${slug}`);
    expect(response?.status()).toBe(502);
    await expect(
      page.getByRole('heading', { name: 'Không thể tải bài viết' }),
    ).toBeVisible();
    await expect(page.getByText(/PRIVATE-/)).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Thử lại' })).toHaveAttribute(
      'href',
      `/vi/blogs/${slug}`,
    );
  }

  const listResponse = await page.goto('/vi/blogs?page=99');
  expect(listResponse?.status()).toBe(502);
  await expect(
    page.getByRole('heading', { name: 'Không thể tải bài viết' }),
  ).toBeVisible();
  await expect(page.getByText(/PRIVATE-/)).toHaveCount(0);
});

test('public blog list renders its empty state from a successful empty API response', async ({
  page,
  request,
}) => {
  const empty = await request.get(
    `${fixtureOrigin}/__fixture/empty?value=true`,
  );
  expect(empty.ok()).toBe(true);

  const response = await page.goto('/vi/blogs');
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { name: 'Chưa có bài viết' }),
  ).toBeVisible();
  await expect(
    page.getByText('Các bài viết mới sẽ xuất hiện tại đây.'),
  ).toBeVisible();
  await expect(page.locator('main a[href^="/vi/blogs/"]')).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Bài viết mới nhất' }),
  ).toHaveCount(0);
});

test('each new blog read reflects publish state from the server API', async ({
  page,
  request,
}) => {
  const listResponse = await page.goto('/vi/blogs');
  expect(listResponse?.status()).toBe(200);
  await expect(
    page.getByRole('heading', {
      name: 'Đọc thị trường qua mối liên hệ giữa sự kiện và giá',
    }),
  ).toBeVisible();

  const update = await request.get(
    `${fixtureOrigin}/__fixture/publish?value=false`,
  );
  expect(update.ok()).toBe(true);
  const freshList = await page.reload();
  expect(freshList?.status()).toBe(200);
  await expect(
    page.getByRole('heading', { name: 'Chưa có bài viết' }),
  ).toBeVisible();
  await expect(
    page.getByText('Đọc thị trường qua mối liên hệ giữa sự kiện và giá'),
  ).toHaveCount(0);

  const freshDetail = await page.goto('/vi/blogs/fixture-post');
  expect(freshDetail?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { name: 'Không tìm thấy bài viết' }),
  ).toBeVisible();
});

test('blog layouts fit mobile, remain keyboard reachable and keep content ordered', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vi/blogs');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press('Tab');
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.goto('/vi/blogs/second-page');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const bodyText = await page.locator('article').innerText();
  expect(bodyText.indexOf('Unavailable market chart')).toBeLessThan(
    bodyText.indexOf('This paragraph remains after the broken image.'),
  );
});
