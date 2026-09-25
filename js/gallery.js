(() => {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  const categories = { campus: 'Campus life', awards: 'Awards & achievements', functions: 'Functions & events', placements: 'Student placements', tutorials: 'Learning & tutorials' };
  const safeURL = value => {
    if (typeof value !== 'string' || !value.trim() || value.trim().startsWith('#')) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  function normalize(item, category) {
    if (!item || typeof item !== 'object') return null;
    const type = item.type === 'video' || item.video ? 'video' : 'photo';
    const src = safeURL(item.src || (type === 'video' ? item.video : item.image));
    if (!src) return null;
    // Video entries are playable media files, not arbitrary embeds or watch-page URLs.
    if (type === 'video' && !/\.(mp4|webm|ogg|ogv)$/i.test(new URL(src).pathname)) return null;
    const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback;
    return { type, src, title: text(item.title, 'Steno Master moment') || 'Steno Master moment', description: text(item.description || item.desc), alt: text(item.alt || item.title, 'Steno Master gallery photo'), category: categories[item.category || category] ? item.category || category : 'campus', poster: safeURL(item.poster), captions: safeURL(item.captions) };
  }
  let local = {};
  try { local = JSON.parse(localStorage.getItem('sm_student_corner') || '{}') || {}; } catch { /* Public catalogue remains available if storage is blocked/corrupt. */ }
  const published = Array.isArray(window.STENO_GALLERY) ? window.STENO_GALLERY : [];
  const candidates = [...published.map(item => normalize(item)), ...Object.keys(categories).flatMap(category => Array.isArray(local[category]) ? local[category].map(item => normalize(item, category)) : [])];
  const seen = new Set();
  const items = candidates.filter(item => {
    if (!item || seen.has(item.src)) return false;
    seen.add(item.src); return true;
  });
  const filters = [...document.querySelectorAll('[data-media-filter]')];
  const select = document.getElementById('gallery-category');
  const empty = document.getElementById('gallery-empty');
  const status = document.getElementById('gallery-status');
  const reset = document.getElementById('gallery-reset');
  const dialog = document.getElementById('media-viewer');
  const stage = document.getElementById('viewer-stage');
  const error = document.getElementById('viewer-error');
  let type = 'all', visible = [], active = 0, opener, previousOverflow;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  function render() {
    visible = items.filter(item => (type === 'all' || item.type === type) && (select.value === 'all' || item.category === select.value));
    grid.replaceChildren();
    status.textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'}${items.length ? ` of ${items.length}` : ''}`;
    empty.hidden = visible.length > 0;
    reset.hidden = !items.length;
    document.getElementById('gallery-empty-title').textContent = items.length ? 'No moments in this view yet' : 'The next chapter is on its way';
    document.getElementById('gallery-empty-message').textContent = items.length ? 'Try another category or show all photos and videos.' : 'Photos and videos will appear here once they are published. In the meantime, visit our YouTube channel for more from Steno Master.';
    visible.forEach((item, index) => {
      const article = node('article', 'min-w-0');
      const button = node('button', 'media-card');
      button.type = 'button';
      button.setAttribute('aria-label', `${item.type === 'photo' ? 'View photo' : 'Play video'}: ${item.title}`);
      button.setAttribute('aria-haspopup', 'dialog');
      const preview = node('div', 'media-preview');
      if (item.type === 'photo' || item.poster) {
        const image = node('img', 'media-image');
        image.src = item.type === 'photo' ? item.src : item.poster;
        image.alt = item.type === 'photo' ? item.alt : `Video thumbnail: ${item.title}`;
        image.loading = 'lazy'; image.decoding = 'async'; image.width = 800; image.height = 450;
        image.addEventListener('error', () => preview.replaceChildren(node('span', 'px-4 text-center text-sm', 'Preview unavailable')));
        preview.append(image);
      } else preview.append(node('span', 'text-lg font-semibold', '\u25b7 Video'));
      const body = node('div', 'media-body');
      body.append(node('p', 'media-tag', `${item.type === 'photo' ? 'Photo' : 'Video'} / ${categories[item.category]}`), node('h3', 'media-title', item.title));
      if (item.description) body.append(node('p', 'media-description', item.description));
      body.append(node('span', 'media-action', item.type === 'photo' ? 'View photo \u2197' : 'Play video \u25b7'));
      button.append(preview, body);
      button.addEventListener('click', () => {
        active = index; opener = button; showMedia();
        previousOverflow = document.body.style.overflowY;
        document.body.style.overflowY = 'hidden';
        dialog.showModal();
      });
      article.append(button); grid.append(article);
    });
  }
  function clearMedia() {
    stage.querySelector('video')?.pause();
    stage.replaceChildren();
  }
  function showMedia() {
    clearMedia(); error.hidden = true;
    const item = visible[active];
    document.getElementById('viewer-title').textContent = item.title;
    document.getElementById('viewer-category').textContent = categories[item.category];
    document.getElementById('viewer-description').textContent = item.description;
    document.getElementById('viewer-position').textContent = `${active + 1} / ${visible.length}`;
    const media = node(item.type === 'photo' ? 'img' : 'video', 'block max-h-[55dvh] w-full min-w-0 rounded-lg object-contain');
    if (item.type === 'photo') media.alt = item.alt;
    else {
      media.controls = true; media.playsInline = true; media.preload = 'metadata';
      media.setAttribute('aria-label', item.title);
      if (item.poster) media.poster = item.poster;
      if (item.captions) {
        const track = node('track'); track.kind = 'captions'; track.label = 'English'; track.srclang = 'en'; track.src = item.captions; track.default = true; media.append(track);
      }
      media.append(node('p', '', 'Your browser does not support video playback.'));
    }
    media.addEventListener('error', () => {
      error.textContent = 'This media could not be loaded. Please try another item or contact Steno Master.';
      error.hidden = false;
    });
    media.src = item.src; stage.append(media);
    document.getElementById('viewer-prev').disabled = visible.length < 2;
    document.getElementById('viewer-next').disabled = visible.length < 2;
  }
  function step(direction) { active = (active + direction + visible.length) % visible.length; showMedia(); }
  filters.forEach(button => button.addEventListener('click', () => {
    type = button.dataset.mediaFilter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    render();
  }));
  select.addEventListener('change', render);
  reset.addEventListener('click', () => { select.value = 'all'; filters[0].click(); filters[0].focus(); });
  document.getElementById('viewer-close').addEventListener('click', () => dialog.close());
  document.getElementById('viewer-prev').addEventListener('click', () => step(-1));
  document.getElementById('viewer-next').addEventListener('click', () => step(1));
  dialog.addEventListener('close', () => {
    clearMedia(); document.body.style.overflowY = previousOverflow || ''; opener?.focus();
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    // Leave native video keyboard controls intact.
    if (event.target.closest('video')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
  });
  document.getElementById('gallery-controls').hidden = false;
  render();
})();
