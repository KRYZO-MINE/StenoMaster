const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html',
  'gallery.html',
  'blog/index.html',
  'blog/english-shorthand-beginners.html',
  'blog/hindi-shorthand-practice.html',
  'blog/stenographer-exam-preparation.html'
];

const attribute = (html, tag, name, value) => {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
  return tags.find(item => new RegExp(`${name}=["']${value}["']`, 'i').test(item));
};

for (const page of pages) {
  const filename = path.join(root, page);
  const html = fs.readFileSync(filename, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1].trim();
  const description = attribute(html, 'meta', 'name', 'description');
  const keywords = attribute(html, 'meta', 'name', 'keywords');
  const canonical = attribute(html, 'link', 'rel', 'canonical');

  assert.ok(title && title.length >= 30 && title.length <= 70, `${page}: useful title`);
  assert.ok(description, `${page}: meta description`);
  assert.ok(keywords, `${page}: meta keywords`);
  assert.ok(canonical?.includes('https://kryzo-mine.github.io/StenoMaster/'), `${page}: production canonical`);
  for (const property of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
    assert.ok(attribute(html, 'meta', 'property', property), `${page}: ${property}`);
  }
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    assert.ok(attribute(html, 'meta', 'name', name), `${page}: ${name}`);
  }
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${page}: exactly one H1`);
  assert.ok(!html.includes('https://example.com'), `${page}: no placeholder domain`);

  const jsonLd = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  assert.ok(jsonLd.length, `${page}: JSON-LD`);
  for (const block of jsonLd) JSON.parse(block[1]);

  const pageDir = path.dirname(filename);
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(ref)) continue;
    const localPath = ref.split('#')[0].split('?')[0];
    if (!localPath) continue;
    assert.ok(fs.existsSync(path.resolve(pageDir, localPath)), `${page}: missing ${localPath}`);
  }

  for (const img of html.match(/<img\b[^>]*>/gi) || []) {
    assert.match(img, /\balt=["'][^"']+["']/i, `${page}: image alt text`);
    assert.match(img, /\bwidth=["']\d+["']/i, `${page}: image width`);
    assert.match(img, /\bheight=["']\d+["']/i, `${page}: image height`);
  }

  if (page.startsWith('blog/') && page !== 'blog/index.html') {
    assert.ok((html.match(/<img\b/gi) || []).length >= 2, `${page}: at least two article images`);
    assert.ok(html.includes('"@type": "BlogPosting"'), `${page}: BlogPosting schema`);
    assert.ok(html.includes('"@type": "BreadcrumbList"'), `${page}: breadcrumb schema`);
  }
}

console.log(`SEO checks passed for ${pages.length} public pages.`);
