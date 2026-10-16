/* ScrollReveal — animação de entrada por scroll, sem dependências.
 *
 * Equivalente ao componente <ScrollReveal> do React, para HTML estático.
 * Uso declarativo, direto no HTML:
 *
 *   <div data-reveal="left" data-delay="150" data-duration="700"
 *        data-distance="40px" data-once="true" data-threshold="0.15">…</div>
 *
 * Props (todas opcionais, exceto data-reveal):
 *   data-reveal     "up" | "down" | "left" | "right" | "none"   (padrão "up")
 *   data-delay      atraso em ms                                (padrão 0)
 *   data-duration   duração em ms                               (padrão 700)
 *   data-distance   deslocamento inicial                        (padrão "40px")
 *   data-once       "false" para animar toda vez que reentrar   (padrão true)
 *   data-threshold  fração visível para disparar                (padrão 0.15)
 *   data-reveal-on-load  anima ao carregar a página, sem esperar o scroll
 *                        (usado no hero, que já é a primeira tela)
 *
 * Tudo é aplicado com estilos inline, para não conflitar com as classes do CSS.
 */
(() => {
  const root = document.documentElement;
  const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const ROOT_MARGIN = '0px 0px -50px 0px';
  const elements = document.querySelectorAll('[data-reveal]');

  const ready = () => {
    window.__revealReady = true;
    root.classList.add('reveal-ready');
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Sem suporte ou com "reduzir movimento" ativo: tudo aparece de imediato. */
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
    ready();
    return;
  }

  const offset = (direction, distance) => ({
    up: `translate3d(0, ${distance}, 0)`,
    down: `translate3d(0, -${distance}, 0)`,
    left: `translate3d(-${distance}, 0, 0)`,
    right: `translate3d(${distance}, 0, 0)`,
    none: 'translate3d(0, 0, 0)',
  }[direction] || `translate3d(0, ${distance}, 0)`);

  const readOptions = (el) => ({
    direction: el.dataset.reveal || 'up',
    delay: Number(el.dataset.delay) || 0,
    duration: Number(el.dataset.duration) || 700,
    distance: el.dataset.distance || '40px',
    once: el.dataset.once !== 'false',
    threshold: el.dataset.threshold !== undefined ? Number(el.dataset.threshold) : 0.15,
  });

  /* Estado inicial: invisível e deslocado na direção escolhida. */
  const hide = (el, o) => {
    el.style.transition = `opacity ${o.duration}ms ${EASE} ${o.delay}ms, transform ${o.duration}ms ${EASE} ${o.delay}ms`;
    el.style.opacity = '0';
    el.style.transform = offset(o.direction, o.distance);
  };

  const show = (el, o) => {
    /* will-change só durante a animação: reservar camada de GPU para dezenas
     * de elementos ao mesmo tempo pesa na memória do celular. */
    el.style.willChange = 'opacity, transform';
    el.style.opacity = '1';
    el.style.transform = 'translate3d(0, 0, 0)';
    if (!o.once) return;
    /* Ao terminar, devolve o transform e a transição ao CSS: assim os efeitos
     * de hover dos cards (translateY, scale) voltam a funcionar, e a GPU
     * deixa de reservar camada para o elemento. */
    const cleanup = (ev) => {
      if (ev && ev.target !== el) return;
      el.removeEventListener('transitionend', cleanup);
      el.style.transition = '';
      el.style.transform = '';
      el.style.willChange = '';
    };
    el.addEventListener('transitionend', cleanup);
    window.setTimeout(cleanup, o.delay + o.duration + 150);
  };

  const options = new Map();
  const observers = new Map();

  const observerFor = (threshold) => {
    if (!observers.has(threshold)) {
      observers.set(threshold, new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const o = options.get(el);
          if (entry.isIntersecting) {
            show(el, o);
            if (o.once) observer.unobserve(el);
          } else if (!o.once) {
            hide(el, o);
          }
        });
      }, { threshold, rootMargin: ROOT_MARGIN }));
    }
    return observers.get(threshold);
  };

  elements.forEach((el) => {
    const o = readOptions(el);
    options.set(el, o);
    hide(el, o);
  });

  /* Força o navegador a registrar o estado inicial antes de observar,
   * senão elementos já visíveis (hero) pulariam a transição. */
  void document.body.offsetHeight;

  elements.forEach((el) => {
    const o = options.get(el);
    if (el.hasAttribute('data-reveal-on-load')) {
      /* Hero: a entrada roda já no carregamento. Em telas baixas (notebook),
       * o botão principal fica na borda da tela e, esperando o scroll,
       * ficaria invisível justamente para quem acabou de chegar. */
      window.requestAnimationFrame(() => show(el, o));
      return;
    }
    observerFor(o.threshold).observe(el);
  });
  ready();
})();
