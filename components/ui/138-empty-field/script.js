(function () {
  var scene = document.getElementById('scene');
  var plantBtn = document.getElementById('plant-btn');
  var resetBtn = document.getElementById('reset-btn');
  var status = document.getElementById('status');
  var title = document.getElementById('empty-title');
  var subtitle = document.getElementById('empty-subtitle');

  if (!scene || !plantBtn || !resetBtn || !status || !title || !subtitle) {
    return;
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EMPTY_TITLE = 'Nothing planted yet';
  var EMPTY_SUBTITLE = 'This little pot is just soil and hope right now. Give it a seed and see what grows.';
  var FILLED_TITLE = 'It’s growing!';
  var FILLED_SUBTITLE = 'A little sprout has taken root. Keep it watered and watch it flourish.';

  var isFilled = false;

  function showStatus(message) {
    status.textContent = message;
    status.classList.add('visible');
  }

  function clearStatus() {
    status.classList.remove('visible');
    window.setTimeout(function () {
      if (!status.classList.contains('visible')) {
        status.textContent = '';
      }
    }, prefersReducedMotion ? 0 : 400);
  }

  function plantSeed() {
    if (isFilled) return;
    isFilled = true;

    scene.classList.add('filled');
    title.textContent = FILLED_TITLE;
    subtitle.textContent = FILLED_SUBTITLE;

    plantBtn.disabled = true;
    plantBtn.querySelector('.btn-icon') && (plantBtn.querySelector('.btn-icon').textContent = '✅');
    plantBtn.lastChild && (plantBtn.textContent = '');
    plantBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">✅</span>Planted';

    resetBtn.hidden = false;
    showStatus('A seed has been planted — sprout is on its way.');

    resetBtn.focus();
  }

  function resetField() {
    if (!isFilled) return;
    isFilled = false;

    scene.classList.remove('filled');
    title.textContent = EMPTY_TITLE;
    subtitle.textContent = EMPTY_SUBTITLE;

    plantBtn.disabled = false;
    plantBtn.innerHTML = '<span class="btn-icon" aria-hidden="true">🌱</span>Plant a seed';

    resetBtn.hidden = true;
    showStatus('Pot cleared. Ready for a new seed.');

    plantBtn.focus();

    clearStatus();
  }

  plantBtn.addEventListener('click', plantSeed);
  resetBtn.addEventListener('click', resetField);
})();
