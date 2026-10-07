// Renders portfolio mockups to public/images/work/*.webp using the local Chrome.
// Usage: npm run mockups [-- name1 name2]   (CHROME_PATH overrides the browser)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { W, H } from './kit.mjs';
import { screens } from './screens.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(root, 'public/images/work');
fs.mkdirSync(outDir, { recursive: true });

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = candidates.find((p) => fs.existsSync(p));
if (!executablePath) throw new Error('No Chrome/Edge found; set CHROME_PATH');

const only = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath, headless: true });

for (const [name, def] of Object.entries(screens)) {
  if (only.length && !only.includes(name)) continue;
  const { html, w = W, h = H } = typeof def === 'string' ? { html: def } : def;
  const tab = await browser.newPage();
  await tab.setViewport({ width: w, height: h, deviceScaleFactor: 1.5 });
  await tab.setContent(html, { waitUntil: 'networkidle0', timeout: 120000 });
  await tab.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, `${name}.webp`);
  await tab.screenshot({ path: file, type: 'webp', quality: 82 });
  await tab.close();
  console.log(`${name}.webp  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}

await browser.close();
