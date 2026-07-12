(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var startBtn = document.getElementById('tourStart');
  var dim = document.getElementById('tourDim');
  var cutout = document.getElementById('tourCutout');
  var caption = document.getElementById('tourCaption');
  var stepCount = document.getElementById('tourStepCount');
  var capTitle = document.getElementById('tourCapTitle');
  var capText = document.getElementById('tourCapText');
  var closeBtn = document.getElementById('tourClose');
  var nextBtn = document.getElementById('tourNext');

  if (!startBtn || !dim || !cutout || !caption) return;

  var steps = [
    {
      target: document.getElementById('tourTarget1'),
      title: 'Your plot, at a glance',
      text: 'This is home base — it always brings you back to the full garden overview.'
    },
    {
      target: document.getElementById('tourTarget2'),
      title: 'Beds',
      text: 'Every bed you have planted lives here, sorted by how recently you tended it.'
    },
    {
      target: document.getElementById('tourTarget3'),
      title: 'Start something new',
      text: 'When you are ready to break new ground, this is where a fresh bed begins.'
    }
  ].filter(function (s) { return !!s.target; });

  var current = -1;
  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice.call(
      caption.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    );
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function placeAround(target) {
    var rect = target.getBoundingClientRect();
    var pad = 8;

    cutout.style.top = (rect.top - pad) + 'px';
    cutout.style.left = (rect.left - pad) + 'px';
    cutout.style.width = (rect.width + pad * 2) + 'px';
    cutout.style.height = (rect.height + pad * 2) + 'px';

    // Position caption below the target by default, flip above if it
    // would overflow the bottom of the viewport.
    var capHeight = 170;
    var top = rect.bottom + pad + 14;
    if (top + capHeight > window.innerHeight) {
      top = Math.max(12, rect.top - pad - capHeight - 14);
    }
    var left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - 300 - 12
    );

    caption.style.top = top + 'px';
    caption.style.left = left + 'px';
  }

  function renderStep() {
    var step = steps[current];
    if (!step) return;
    placeAround(step.target);
    stepCount.textContent = 'Step ' + (current + 1) + ' of ' + steps.length;
    capTitle.textContent = step.title;
    capText.textContent = step.text;
    nextBtn.textContent = current === steps.length - 1 ? 'Done' : 'Next';
  }

  function openTour() {
    if (!steps.length) return;
    lastFocused = document.activeElement;
    current = 0;

    dim.hidden = false;
    cutout.hidden = false;
    caption.hidden = false;

    void caption.offsetWidth;
    dim.classList.add('is-open');
    cutout.classList.add('is-open');
    caption.classList.add('is-open');

    renderStep();

    document.addEventListener('keydown', onKeydown);

    window.setTimeout(function () {
      caption.focus();
    }, reduceMotion ? 0 : 80);
  }

  function closeTour() {
    dim.classList.remove('is-open');
    cutout.classList.remove('is-open');
    caption.classList.remove('is-open');

    var finish = function () {
      dim.hidden = true;
      cutout.hidden = true;
      caption.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 220);
    }

    document.removeEventListener('keydown', onKeydown);
    current = -1;

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function goNext() {
    if (current >= steps.length - 1) {
      closeTour();
      return;
    }
    current += 1;
    renderStep();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeTour();
      return;
    }
    trapTab(e);
  }

  startBtn.addEventListener('click', openTour);
  closeBtn.addEventListener('click', closeTour);
  nextBtn.addEventListener('click', goNext);

  window.addEventListener('resize', function () {
    if (current >= 0) renderStep();
  });
})();
