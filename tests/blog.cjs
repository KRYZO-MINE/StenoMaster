const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  '/blog/index.html',
  '/blog/english-shorthand-beginners.html',
  '/blog/hindi-shorthand-practice.html',
  '/blog/stenographer-exam-preparation.html'
];
const widths = [320, 768, 1440];
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(`${root}${path.sep}`)) { res.writeHead(403); return res.end(); }
    const data = await fs.readFile(file);
    const mime = { '.html': 'text/html', '.css': 'text/css', '.jpg': 'image/jpeg' }[path.extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime }); res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu'] });
  const errors = [];
  try {
    const context = await browser.newContext();
    await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await context.route('https://fonts.gstatic.com/**', route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const url of pages) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: width === 320 ? 800 : 900 });
        await page.goto(origin + url, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('h1').count(), 1, `${url} H1`);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${url} overflow at ${width}`);
        await page.locator('img').last().scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        assert.ok(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), `${url} images at ${width}`);
        if (url !== '/blog/index.html') assert.equal(await page.locator('article img').count(), 2, `${url} article images`);
      }
    }
    assert.deepEqual(errors, []);
    console.log(`Blog checks passed for ${pages.length} pages at ${widths.join(', ')}px.`);
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
