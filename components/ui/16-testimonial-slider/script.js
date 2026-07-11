(() => {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const data = [
    { q: "This is the first tool that actually got out of my way. Shipped a landing page in an afternoon.", name: "Ada Okafor", role: "Founder, Loft", seed: "ada" },
    { q: "The polish is unreal. Every interaction feels considered — my clients think I hired an agency.", name: "Milo Vestergaard", role: "Freelance Designer", seed: "milo" },
    { q: "We replaced three separate tools with this. Onboarding took ten minutes, not ten days.", name: "Priya Nair", role: "Head of Ops, Northwind", seed: "priya" },
    { q: "Fast, accessible, and genuinely beautiful. That combination basically never happens.", name: "Theo Marchetti", role: "Eng Lead, Cadence", seed: "theo" },
    { q: "Our conversion jumped 24% the week we switched. The team is obsessed.", name: "Lena Bauer", role: "Growth, Prism", seed: "lena" }
  ];

  const deck = slider.querySelector('.deck');
  const dotsWrap = slider.querySelector('.dots');
  const prev = slider.querySelector('.nav--prev');
  const next = slider.querySelector('.nav--next');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // build slides + dots
  const cards = data.map((d, i) => {
    const card = document.createElement('figure');
    card.className = 'card';
    card.innerHTML =
      `<img class="card__avatar" src="https://picsum.photos/seed/${d.seed}/120/120" alt="" width="60" height="60">
       <blockquote class="card__quote">${d.q}</blockquote>
       <figcaption class="card__who">
         <span class="card__name">${d.name}</span>
         <span class="card__role">${d.role}</span>
       </figcaption>`;
    card.setAttribute('aria-hidden', 'true');
    deck.appendChild(card);

    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
    return card;
  });
  const dots = [...dotsWrap.children];

  let index = 0;
  let timer = null;
  const DELAY = 5000;

  function render(prevIndex) {
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i === index);
      c.classList.toggle('is-prev', i === prevIndex && i !== index);
      c.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function go(i) {
    const prevIndex = index;
    index = (i + cards.length) % cards.length;
    render(prevIndex);
    restart();
  }

  const nextSlide = () => go(index + 1);
  const prevSlide = () => go(index - 1);

  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);

  // autoplay
  function start() {
    if (reduce) return;
    stop();
    timer = setInterval(nextSlide, DELAY);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { if (timer || !reduce) start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // keyboard
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
  });

  // drag / swipe
  let startX = 0, dragging = false;
  const viewport = slider.querySelector('.viewport');

  function down(x) { dragging = true; startX = x; stop(); slider.classList.add('dragging'); }
  function up(x) {
    if (!dragging) return;
    dragging = false;
    slider.classList.remove('dragging');
    const dx = x - startX;
    if (Math.abs(dx) > 50) (dx < 0 ? nextSlide : prevSlide)();
    else start();
  }

  viewport.addEventListener('pointerdown', (e) => down(e.clientX));
  window.addEventListener('pointerup', (e) => up(e.clientX));
  viewport.addEventListener('touchstart', (e) => down(e.touches[0].clientX), { passive: true });
  viewport.addEventListener('touchend', (e) => up(e.changedTouches[0].clientX));

  render(-1);
  start();
})();
