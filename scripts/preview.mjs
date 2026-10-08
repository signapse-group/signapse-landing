import { spawn } from 'node:child_process';
import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceVars = resolve('.dev.vars');
const outputDirectory = resolve('dist/server');
const outputVars = resolve(outputDirectory, '.dev.vars');

if (!process.env.CI) {
  try {
    await mkdir(outputDirectory, { recursive: true });
    await copyFile(sourceVars, outputVars);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const astro = spawn(
  process.execPath,
  ['node_modules/astro/bin/astro.mjs', 'preview', ...process.argv.slice(2)],
  { cwd: process.cwd(), env: process.env, stdio: 'inherit' },
);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => astro.kill(signal));
}

const exit = await new Promise((resolveExit, reject) => {
  astro.once('error', reject);
  astro.once('exit', (code, signal) => {
    resolveExit(code ?? (signal === 'SIGINT' ? 130 : 1));
  });
});
process.exitCode = exit;
