import { expect, test } from '@playwright/test';

test('built output identifies its source revision independently of the backend', async ({
  request,
}) => {
  const response = await request.get('/build-revision.json');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    revision: process.env.SIGNAPSE_BUILD_REVISION || null,
  });
  expect(response.headers()['cache-control']).toContain('no-store');
});
