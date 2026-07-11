(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var toggleBtn = document.getElementById('toggleBtn');
  var cardGrid = document.getElementById('cardGrid');
  if (!toggleBtn || !cardGrid) return;

  var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.skel-card'));
  var loaded = false;

  function showLoading() {
    loaded = false;
    toggleBtn.setAttribute('aria-pressed', 'false');
    toggleBtn.textContent = '';
    var dot = document.createElement('span');
    dot.className = 'dot';
    toggleBtn.appendChild(dot);
    toggleBtn.appendChild(document.createTextNode('Load content'));

    cards.forEach(function (card) {
      card.classList.remove('loaded');
      var real = card.querySelector('.real-content');
      if (real) real.hidden = true;
      var lines = card.querySelectorAll('.skel');
      lines.forEach(function (el) { el.hidden = false; });
    });
  }

  function showLoaded() {
    loaded = true;
    toggleBtn.setAttribute('aria-pressed', 'true');
    toggleBtn.textContent = '';
    var dot = document.createElement('span');
    dot.className = 'dot';
    toggleBtn.appendChild(dot);
    toggleBtn.appendChild(document.createTextNode('Reset'));

    var delay = 0;
    cards.forEach(function (card) {
      var reveal = function (c) {
        c.classList.add('loaded');
        var real = c.querySelector('.real-content');
        if (real) real.hidden = false;
        var lines = c.querySelectorAll('.skel-line');
        lines.forEach(function (el) { el.style.display = 'none'; });
      };
      if (prefersReducedMotion) {
        reveal(card);
      } else {
        setTimeout(function () { reveal(card); }, delay);
        delay += 180;
      }
    });
  }

  toggleBtn.addEventListener('click', function () {
    if (loaded) {
      showLoading();
    } else {
      showLoaded();
    }
  });
})();
