import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function verifyDeploymentTarget(config, environment = '') {
  assert(
    ['', 'dev'].includes(environment),
    'Unsupported Cloudflare environment',
  );
  const dev = environment === 'dev';
  assert.equal(config.name, dev ? 'signapse-landing-dev' : 'signapse-landing');
  const domains = (config.routes ?? []).map((route) => {
    assert.equal(route.custom_domain, true);
    return route.pattern;
  });
  if (dev) {
    assert.deepEqual(domains, ['dev.signapse.cloud']);
    assert.equal(config.workers_dev, false);
    assert.equal(config.preview_urls, false);
  } else {
    assert(domains.every((domain) => domain === 'signapse.cloud'));
  }
  assert(
    config.vars?.PUBLIC_BLOG_API_ORIGIN,
    'Blog runtime binding is missing',
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const config = JSON.parse(
    await readFile('dist/server/wrangler.json', 'utf8'),
  );
  verifyDeploymentTarget(config, process.env.CLOUDFLARE_ENV || '');
  console.log(`Verified deployment target: ${config.name}`);
}
