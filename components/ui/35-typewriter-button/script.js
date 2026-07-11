(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btn = document.querySelector('.type-btn');
  if (!btn) return;

  const textEl = btn.querySelector('.type-btn__text');
  const fullText = btn.dataset.text || '';
  let timer = null;
  let typing = false;

  function setText(str) {
    textEl.textContent = str;
  }

  function typeOut() {
    if (typing) return;
    typing = true;
    window.clearInterval(timer);
    let i = 0;
    setText('');
    timer = window.setInterval(() => {
      i += 1;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(timer);
        typing = false;
      }
    }, 45);
  }

  if (reduce) {
    setText(fullText);
    return;
  }

  // Idle state shows the full text; hover retriggers the typing animation.
  setText(fullText);
  btn.addEventListener('pointerenter', typeOut);
  btn.addEventListener('focus', typeOut);
})();
