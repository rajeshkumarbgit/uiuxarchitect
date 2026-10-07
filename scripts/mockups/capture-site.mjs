// Captures real screenshots of the running portfolio (npm run dev) for the
// "this site" project mockups. Usage: node scripts/mockups/capture-site.mjs [baseUrl]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, 'assets');
fs.mkdirSync(outDir, { recursive: true });
const base = process.argv[2] || 'http://127.0.0.1:5173/';
const chrome = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'].find((p) => p && fs.existsSync(p));

const shots = [
  { name: 'site-home-light', theme: 'light', w: 1440, h: 900, nav: [] },
  { name: 'site-home-dark', theme: 'dark', w: 1440, h: 900, nav: [] },
  { name: 'site-case-dark', theme: 'dark', w: 1440, h: 900, nav: ['Case Studies', 'Network'], scroll: 640 },
  { name: 'site-portfolio-light', theme: 'light', w: 1440, h: 900, nav: ['Portfolio'], scroll: 300 },
  { name: 'site-contact-light', theme: 'light', w: 1440, h: 900, nav: ['Contact'] },
  { name: 'site-home-mobile', theme: 'light', w: 390, h: 844, nav: [] },
];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
for (const s of shots) {
  const tab = await browser.newPage();
  await tab.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
  await tab.evaluateOnNewDocument((t) => localStorage.setItem('portfolio-theme', t), s.theme);
  await tab.goto(base, { waitUntil: 'networkidle0' });
  for (const label of s.nav) {
    await tab.evaluate((l) => {
      const el = [...document.querySelectorAll('nav button, article, button')].find(
        (b) => (b.tagName === 'ARTICLE' ? b.textContent.includes(l) : b.textContent.trim().startsWith(l)) && b.offsetParent,
      );
      el?.click();
    }, label);
    await new Promise((r) => setTimeout(r, 900));
  }
  if (s.scroll) await tab.evaluate((y) => window.scrollTo(0, y), s.scroll);
  await tab.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1200));
  await tab.screenshot({ path: path.join(outDir, `${s.name}.webp`), type: 'webp', quality: 85 });
  await tab.close();
  console.log(s.name);
}
await browser.close();
