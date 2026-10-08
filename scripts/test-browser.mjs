import { spawn } from 'node:child_process';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const fixturePath = resolve('tests/fixtures/public-blog-api-server.mjs');
const varsPath = resolve('dist/server/.dev.vars');
let fixture;
let runner;
let originalVars;
let hadVars = false;
let cleanPromise;

function waitForPort(child) {
  return new Promise((resolvePort, reject) => {
    let output = '';
    const timeout = setTimeout(
      () => reject(new Error('Fixture API did not start.')),
      10_000,
    );
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      output += chunk;
      const match = output.match(/(?:^|\n)(\d+)(?:\n|$)/);
      if (match) {
        clearTimeout(timeout);
        resolvePort(Number(match[1]));
      }
    });
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Fixture API exited before startup (${code}).`));
    });
  });
}

function stop(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolveStop) => {
    child.once('exit', resolveStop);
    child.kill('SIGTERM');
    setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
      }
    }, 2_000).unref();
  });
}

async function cleanup() {
  if (cleanPromise) return cleanPromise;
  cleanPromise = (async () => {
    await stop(runner);
    await stop(fixture);
    if (hadVars) await writeFile(varsPath, originalVars, { mode: 0o600 });
    else await rm(varsPath, { force: true });
  })();
  return cleanPromise;
}

process.once('SIGINT', () => {
  runner?.kill('SIGINT');
  void cleanup().finally(() => process.exit(130));
});
process.once('SIGTERM', () => {
  runner?.kill('SIGTERM');
  void cleanup().finally(() => process.exit(143));
});

let exitCode = 1;
try {
  try {
    originalVars = await readFile(varsPath);
    hadVars = true;
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  fixture = spawn(process.execPath, [fixturePath], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const port = await waitForPort(fixture);
  const existingText = hadVars ? originalVars.toString('utf8') : '';
  const otherVars = existingText.split(/\r?\n/).filter((line) => {
    const name = line.match(/^\s*([A-Z_]+)\s*=/)?.[1];
    return name !== 'PUBLIC_BLOG_API_ORIGIN';
  });
  const varsText = [
    ...otherVars.filter((line, index) => line || index < otherVars.length - 1),
    `PUBLIC_BLOG_API_ORIGIN=http://127.0.0.1:${port}`,
    '',
  ].join('\n');
  await writeFile(varsPath, varsText, { mode: 0o600 });

  const childEnv = { ...process.env };
  childEnv.PUBLIC_BLOG_API_ORIGIN = `http://127.0.0.1:${port}`;
  runner = spawn(
    process.execPath,
    ['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)],
    { cwd: process.cwd(), env: childEnv, stdio: 'inherit' },
  );
  exitCode = await new Promise((resolveExit, reject) => {
    runner.once('error', reject);
    runner.once('exit', (code, signal) => {
      resolveExit(code ?? (signal === 'SIGINT' ? 130 : 1));
    });
  });
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Browser test setup failed.'}\n`,
  );
} finally {
  await cleanup();
}

process.exitCode = exitCode;
