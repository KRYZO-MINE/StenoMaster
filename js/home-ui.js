document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro-screen');
  if (intro) {
    if (reducedMotion) intro.remove();
    else setTimeout(() => { intro.classList.add('zoom-out'); setTimeout(() => intro.remove(), 400); }, 1100);
  }
  const menu = document.querySelector('.nav-links');
  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => {
    menu?.classList.remove('mobile-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
  };
  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('mobile-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  matchMedia('(min-width:1200px)').addEventListener('change', closeMenu);
  const top = document.getElementById('scroll-top-btn');
  const update = () => {
    top?.classList.toggle('visible', scrollY > 400);
    for (const link of document.querySelectorAll('.nav-item[data-section]')) {
      const section = document.getElementById(link.dataset.section);
      const active = section && section.getBoundingClientRect().top <= 120 && section.getBoundingClientRect().bottom > 120;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
  };
  window.addEventListener('scroll', update, {passive:true}); update();
  top?.addEventListener('click', () => scrollTo({top:0,behavior:reducedMotion?'instant':'smooth'}));
  const chat = document.getElementById('floating-chatbot');
  const chatToggle = document.getElementById('chatbot-toggle-btn');
  const closeChat = () => {
    chat?.classList.remove('open'); if(chat) chat.inert = true;
    chatToggle?.setAttribute('aria-expanded', 'false');
    chatToggle?.setAttribute('aria-label', 'Open assistant');
  };
  chatToggle?.addEventListener('click', () => {
    if(chat.classList.contains('open')) closeChat();
    else { chat.inert=false; chat.classList.add('open');chatToggle.setAttribute('aria-expanded','true');chatToggle.setAttribute('aria-label','Close assistant'); document.getElementById('chat-input').focus(); }
  });
  document.getElementById('chatbot-minimize-btn')?.addEventListener('click', () => { closeChat();chatToggle.focus(); });
  document.addEventListener('keydown', event => {
    if(event.key !== 'Escape') return;
    if(chat?.classList.contains('open')) {closeChat();chatToggle.focus();}
    if(menu?.classList.contains('mobile-open')) {closeMenu();toggle.focus();}
  });
  for(const selector of ['.student-tab-btn','.student-sub-tab-btn','.toggle-btn']) {
    const buttons=[...document.querySelectorAll(selector)];
    const sync=()=>buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
    buttons.forEach(button=>button.addEventListener('click',sync));sync();
  }
  const cert = document.getElementById('cert-modal');
  document.getElementById('cert-input')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();document.getElementById('cert-check-btn').click();}});
  cert?.addEventListener('close',()=>document.querySelector('.cert-download-btn')?.focus());
});
