(() => {
  const wizard = document.querySelector('.wizard');
  if (!wizard) return;

  const form = wizard.querySelector('.form');
  const track = wizard.querySelector('.track');
  const panels = [...wizard.querySelectorAll('.panel')];
  const steps = [...wizard.querySelectorAll('.step')];
  const bar = wizard.querySelector('.progress__bar');
  const backBtn = wizard.querySelector('[data-back]');
  const nextBtn = wizard.querySelector('[data-next]');
  const submitBtn = wizard.querySelector('[data-submit]');
  const success = wizard.querySelector('.success');
  const restartBtn = wizard.querySelector('[data-restart]');

  let current = 0;
  const last = panels.length - 1;

  function markField(input, ok) {
    input.closest('.field')?.classList.toggle('invalid', !ok);
  }

  function validateStep(i) {
    const inputs = panels[i].querySelectorAll('input');
    let ok = true;
    inputs.forEach((input) => {
      const valid = input.checkValidity();
      if (input.type !== 'checkbox') markField(input, valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function fillReview() {
    wizard.querySelectorAll('[data-out]').forEach((el) => {
      const val = form.elements[el.dataset.out]?.value.trim();
      el.textContent = val || '—';
    });
  }

  function render() {
    track.style.transform = `translateX(-${current * 100}%)`;
    steps.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      s.classList.toggle('is-done', i < current);
    });
    bar.style.transform = `scaleX(${(current + 1) / panels.length})`;

    backBtn.disabled = current === 0;
    nextBtn.hidden = current === last;
    submitBtn.hidden = current !== last;

    if (current === last) fillReview();

    const focusable = panels[current].querySelector('input');
    if (focusable) setTimeout(() => focusable.focus(), 320);
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep(current)) return;
    if (current < last) { current++; render(); }
  });

  backBtn.addEventListener('click', () => {
    if (current > 0) { current--; render(); }
  });

  // clear invalid state as user fixes it
  form.addEventListener('input', (e) => {
    if (e.target.matches('input') && e.target.type !== 'checkbox') {
      if (e.target.checkValidity()) markField(e.target, true);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(current)) return;
    form.hidden = true;
    wizard.querySelector('.progress').style.transform = 'scaleY(1)';
    success.hidden = false;
  });

  restartBtn.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    current = 0;
    success.hidden = true;
    form.hidden = false;
    render();
  });

  // Enter advances instead of submitting mid-flow
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && current !== last) {
      e.preventDefault();
      nextBtn.click();
    }
  });

  render();
})();
