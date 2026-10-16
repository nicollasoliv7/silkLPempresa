/* Silkmania — menu, cabeçalho e animação de entrada. */
(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('nav-links');

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && navLinks.classList.contains('open')) setMenu(false);
    });
  }

  /* ---------- Cabeçalho compacto ao rolar ---------- */
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Ano no rodapé ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Animação de entrada ---------- */
  const items = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Pequeno escalonamento entre irmãos do mesmo grupo (cards, fotos, etapas). */
  items.forEach((el) => {
    const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [];
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
    observer.observe(el);
  });
})();
