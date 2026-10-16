import assert from 'node:assert/strict';
import { test } from 'node:test';

import { verifyDeploymentTarget } from '../../scripts/verify-deployment-target.mjs';

const production = {
  name: 'signapse-landing',
  vars: { PUBLIC_BLOG_API_ORIGIN: 'https://dev-api.signapse.cloud' },
};
const dev = {
  ...production,
  name: 'signapse-landing-dev',
  routes: [{ pattern: 'dev.signapse.cloud', custom_domain: true }],
  workers_dev: false,
  preview_urls: false,
};

test('accepts the existing public Worker and isolated dev Worker', () => {
  verifyDeploymentTarget(production);
  verifyDeploymentTarget(dev, 'dev');
});

test('rejects cross-environment publishing and unknown environments', () => {
  assert.throws(() => verifyDeploymentTarget(production, 'dev'));
  assert.throws(() => verifyDeploymentTarget(dev));
  assert.throws(() => verifyDeploymentTarget(production, 'unknown'));
});

test('rejects a dev build routed to public or missing its runtime binding', () => {
  assert.throws(() =>
    verifyDeploymentTarget(
      { ...dev, routes: [{ pattern: 'signapse.cloud', custom_domain: true }] },
      'dev',
    ),
  );
  assert.throws(() => verifyDeploymentTarget({ ...dev, vars: {} }, 'dev'));
  assert.throws(() =>
    verifyDeploymentTarget({ ...dev, workers_dev: true }, 'dev'),
  );
});
