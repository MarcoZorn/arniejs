(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var overlay = document.getElementById('spotOverlay');
  var callout = document.getElementById('spotCallout');
  var target = document.getElementById('spotTarget');
  var dismissBtn = document.getElementById('spotDismiss');
  var replayBtn = document.getElementById('spotReplay');

  if (!overlay || !callout || !target || !dismissBtn || !replayBtn) return;

  var isOpen = false;

  function positionSpotlight() {
    var rect = target.getBoundingClientRect();
    var pad = 8;

    overlay.style.top = (rect.top - pad) + 'px';
    overlay.style.left = (rect.left - pad) + 'px';
    overlay.style.width = (rect.width + pad * 2) + 'px';
    overlay.style.height = (rect.height + pad * 2) + 'px';

    var cw = callout.offsetWidth || 300;
    var ch = callout.offsetHeight || 150;
    var gap = 16;
    var top = rect.bottom + gap;
    var left = rect.right - cw;

    var margin = 12;
    var maxLeft = window.innerWidth - cw - margin;
    var maxTop = window.innerHeight - ch - margin;
    left = Math.max(margin, Math.min(left, maxLeft));
    top = Math.max(margin, Math.min(top, maxTop));

    callout.style.top = top + 'px';
    callout.style.left = left + 'px';
  }

  function openSpotlight() {
    isOpen = true;
    overlay.hidden = false;
    callout.hidden = false;
    target.classList.add('is-spotlit');
    positionSpotlight();
    window.addEventListener('resize', positionSpotlight);
    document.addEventListener('keydown', onKeydown);
    dismissBtn.focus();
  }

  function closeSpotlight() {
    isOpen = false;
    overlay.hidden = true;
    callout.hidden = true;
    target.classList.remove('is-spotlit');
    window.removeEventListener('resize', positionSpotlight);
    document.removeEventListener('keydown', onKeydown);
    replayBtn.focus();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSpotlight();
    }
  }

  dismissBtn.addEventListener('click', closeSpotlight);
  replayBtn.addEventListener('click', function () {
    if (isOpen) return;
    openSpotlight();
  });

  openSpotlight();
})();
