(() => {
  const toggle = document.getElementById('gallery-menu-toggle');
  const nav = document.getElementById('gallery-nav');
  if (!toggle || !nav) return;
  const desktop = window.matchMedia('(min-width: 1024px)');
  toggle.hidden = false;
  function setOpen(open, returnFocus = false) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
    nav.hidden = !desktop.matches && !open;
    nav.dataset.open = String(open);
    if (returnFocus) toggle.focus();
  }
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
  });
  desktop.addEventListener('change', () => setOpen(false));
})();
