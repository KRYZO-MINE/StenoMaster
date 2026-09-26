document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro-screen');
  const introText = intro?.querySelector('.intro-typewriter');
  const introTagline = intro?.querySelector('.intro-tagline');
  if (intro && introText) {
    if (reducedMotion) intro.remove();
    else {
      const title = 'STENO MASTER';
      introText.textContent = '';
      let index = 0;
      const typeIntro = () => {
        if (index < title.length) {
          introText.textContent += title.charAt(index++);
          setTimeout(typeIntro, 120);
          return;
        }
        setTimeout(() => introTagline?.classList.add('reveal'), 400);
        setTimeout(() => {
          intro.classList.add('zoom-out');
          setTimeout(() => intro.remove(), 800);
        }, 1600);
      };
      setTimeout(typeIntro, 500);
    }
  }

  const headingObserver = reducedMotion ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.classList.contains('typed-ready')) return;
      const heading = entry.target;
      heading.classList.add('typed-ready');
      const text = heading.dataset.title || heading.textContent;
      heading.dataset.title = text;
      heading.textContent = '';
      let index = 0;
      const revealCharacter = () => {
        if (index >= text.length) return;
        const character = text.charAt(index++);
        const span = document.createElement('span');
        span.className = 'typed-char';
        span.textContent = character;
        span.style.animationDelay = '0ms';
        heading.appendChild(span);
        setTimeout(revealCharacter, 60);
      };
      revealCharacter();
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.section-title').forEach(title => {
    if (headingObserver) headingObserver.observe(title);
    else title.classList.add('typed-ready');
  });
  const menu = document.querySelector('.nav-links');
  const toggle = document.getElementById('gallery-menu-toggle');
  const closeMenu = () => {
    menu?.classList.remove('mobile-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
    if (toggle) toggle.querySelector('span').textContent = 'Menu';
  };
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('mobile-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  matchMedia('(min-width:1200px)').addEventListener('change', closeMenu);
  const top = document.getElementById('scroll-top-btn');
  const navbar = document.getElementById('navbar');
  const navLinks = [...document.querySelectorAll('.nav-item:not(.nav-cta)')];
  let navTyped = false;
  const typeNavbarLinks = () => {
    if (reducedMotion || navTyped) return;
    navTyped = true;
    navLinks.forEach((link, linkIndex) => {
      const label = link.dataset.title || link.textContent.trim();
      link.dataset.title = label;
      link.textContent = '';
      let characterIndex = 0;
      const typeCharacter = () => {
        if (characterIndex < label.length) {
          link.textContent += label.charAt(characterIndex++);
          setTimeout(typeCharacter, 40);
        }
      };
      setTimeout(typeCharacter, linkIndex * 100);
    });
  };
  const update = () => {
    navbar?.classList.add('visible');
    typeNavbarLinks();
    top?.classList.toggle('visible', scrollY > 400);
    for (const link of document.querySelectorAll('.nav-item[data-section]')) {
      const section = document.getElementById(link.dataset.section);
      const active = section && section.getBoundingClientRect().top <= 120 && section.getBoundingClientRect().bottom > 120;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
  };
  window.addEventListener('scroll', update, { passive: true }); update();
  top?.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' }));
  const chat = document.getElementById('floating-chatbot');
  const chatToggle = document.getElementById('chatbot-toggle-btn');
  const closeChat = () => {
    chat?.classList.remove('open'); if (chat) chat.inert = true;
    chatToggle?.setAttribute('aria-expanded', 'false');
    chatToggle?.setAttribute('aria-label', 'Open assistant');
  };
  chatToggle?.addEventListener('click', () => {
    if (chat.classList.contains('open')) closeChat();
    else { chat.inert = false; chat.classList.add('open'); chatToggle.setAttribute('aria-expanded', 'true'); chatToggle.setAttribute('aria-label', 'Close assistant'); document.getElementById('chat-input').focus(); }
  });
  document.getElementById('chatbot-minimize-btn')?.addEventListener('click', () => { closeChat(); chatToggle.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (chat?.classList.contains('open')) { closeChat(); chatToggle.focus(); }
    if (menu?.classList.contains('mobile-open')) { closeMenu(); toggle.focus(); }
  });
  for (const selector of ['.student-tab-btn', '.student-sub-tab-btn', '.toggle-btn']) {
    const buttons = [...document.querySelectorAll(selector)];
    const sync = () => buttons.forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    buttons.forEach(button => button.addEventListener('click', sync)); sync();
  }
  const cert = document.getElementById('cert-modal');
  document.getElementById('cert-input')?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); document.getElementById('cert-check-btn').click(); } });
  cert?.addEventListener('close', () => document.querySelector('.cert-download-btn')?.focus());
});
