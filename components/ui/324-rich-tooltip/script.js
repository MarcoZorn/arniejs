(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.querySelector('.rt-trigger');
  var card = document.getElementById('rtCard');

  if (!trigger || !card) return;

  var isOpen = false;
  var hideTimer = null;

  function positionCard() {
    // Default is above; flip below if there isn't enough room near the
    // top of the viewport.
    var anchorRect = trigger.getBoundingClientRect();
    card.classList.remove('rt-card--below');
    card.hidden = false;
    card.style.visibility = 'hidden';
    var cardRect = card.getBoundingClientRect();

    if (anchorRect.top - cardRect.height - 16 < 0) {
      card.classList.add('rt-card--below');
    }
    card.style.visibility = '';
  }

  function open() {
    window.clearTimeout(hideTimer);
    if (isOpen) return;
    isOpen = true;
    positionCard();
    void card.offsetWidth;
    card.classList.add('is-open');
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    card.classList.remove('is-open');

    var finish = function () {
      if (!isOpen) card.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      hideTimer = window.setTimeout(finish, 180);
    }
  }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', close);
  trigger.addEventListener('focus', open);
  trigger.addEventListener('blur', close);

  // Keep the tooltip open while the pointer is over the card itself
  // (e.g. to click the link), and close when leaving it.
  card.addEventListener('mouseenter', function () {
    window.clearTimeout(hideTimer);
    isOpen = true;
  });
  card.addEventListener('mouseleave', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) {
      close();
      trigger.blur();
    }
  });
})();
