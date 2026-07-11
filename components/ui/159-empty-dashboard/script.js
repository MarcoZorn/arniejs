(function () {
  var emptyState = document.getElementById('emptyState');
  var ctaBtn = document.getElementById('ctaBtn');
  var successChip = document.getElementById('successChip');

  if (!emptyState || !ctaBtn || !successChip) return;

  ctaBtn.addEventListener('click', function () {
    ctaBtn.disabled = true;
    ctaBtn.textContent = 'Creating…';

    setTimeout(function () {
      emptyState.classList.add('is-hidden');
      successChip.hidden = false;
    }, 500);
  });
})();
