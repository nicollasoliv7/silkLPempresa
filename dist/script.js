const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  navLinks.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
};

navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealElements = new Set();
const reveal = (element, options = {}) => {
  if (!element) return;
  const {
    direction = 'up', delay = 0, duration = 700,
    distance = '40px', once = true, threshold = 0.15,
  } = options;
  const transforms = {
    up: `translate3d(0, ${distance}, 0)`,
    down: `translate3d(0, -${distance}, 0)`,
    left: `translate3d(-${distance}, 0, 0)`,
    right: `translate3d(${distance}, 0, 0)`,
    none: 'translate3d(0, 0, 0)',
  };

  element.classList.remove('reveal', 'visible');
  element.style.opacity = reduceMotion ? '1' : '0';
  element.style.transform = reduceMotion ? 'none' : transforms[direction];
  element.style.transition = reduceMotion
    ? 'none'
    : `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`;
  element.style.willChange = reduceMotion ? 'auto' : 'opacity, transform';
  element.dataset.revealOnce = String(once);
  element.dataset.revealThreshold = String(threshold);
  revealElements.add(element);
};

const revealAll = (selector, options = {}) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    reveal(element, {
      ...options,
      delay: (options.delay || 0) + index * (options.stagger || 0),
    });
  });
};

// Hero: entrada lateral com ritmo progressivo.
const heroCopy = document.querySelector('.hero-copy');
heroCopy?.classList.remove('reveal');
heroCopy?.classList.add('visible');
if (heroCopy) {
  heroCopy.style.opacity = '1';
  heroCopy.style.transform = 'none';
}
[
  ['.eyebrow', 0], ['h1', 150], ['.hero-text', 300], ['.hero-actions', 450],
].forEach(([selector, delay]) => reveal(heroCopy?.querySelector(selector), { direction: 'left', delay }));
reveal(heroCopy?.querySelector('.hero-location'), { direction: 'up', delay: 600 });
reveal(heroCopy?.querySelector('.trust'), { direction: 'up', delay: 600 });
reveal(document.querySelector('.hero-visual'), { direction: 'right', delay: 300, duration: 800 });

// Cabeçalhos, cards, etapas e blocos editoriais.
revealAll('.section-head', { direction: 'up' });
revealAll('.service', { direction: 'up', stagger: 150 });
revealAll('.tech', { direction: 'up', stagger: 150 });
const portfolioGrid = document.querySelector('.portfolio-editorial');
portfolioGrid?.classList.remove('reveal');
portfolioGrid?.classList.add('visible');
if (portfolioGrid) {
  portfolioGrid.style.opacity = '1';
  portfolioGrid.style.transform = 'none';
}
revealAll('.portfolio-item', { direction: 'up', stagger: 120 });
revealAll('.process li', { direction: 'left', stagger: 150 });
reveal(document.querySelector('.about-card'), { direction: 'left' });
reveal(document.querySelector('.about-quote'), { direction: 'right', delay: 200, duration: 800 });
revealAll('.store-gallery figure', { direction: 'up', stagger: 150 });
revealAll('.stats, .portfolio-more, .store-action, .cta-inner, .contact-title, .contact-list', { direction: 'up' });
revealAll('.schools-copy', { direction: 'left' });
revealAll('.school-list', { direction: 'right', delay: 200, duration: 800 });
revealAll('.footer-top > *, .footer-bottom > *', { direction: 'up', stagger: 150 });

// Mantém compatibilidade com qualquer bloco futuro que use a classe reveal.
document.querySelectorAll('.reveal').forEach((element) => reveal(element));

if (!reduceMotion) {
  const observers = new Map();
  revealElements.forEach((element) => {
    const threshold = Number(element.dataset.revealThreshold);
    if (!observers.has(threshold)) {
      observers.set(threshold, new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          const once = entry.target.dataset.revealOnce === 'true';
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translate3d(0, 0, 0)';
            entry.target.addEventListener('transitionend', () => {
              entry.target.style.willChange = 'auto';
            }, { once: true });
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.style.opacity = '0';
          }
        });
      }, { threshold, rootMargin: '0px 0px -50px 0px' }));
    }
    observers.get(threshold).observe(element);
  });
}

window.addEventListener('scroll', () => {
  document.querySelector('.site-header').classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });
