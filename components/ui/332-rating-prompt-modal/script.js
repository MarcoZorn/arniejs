(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('rpOpenBtn');
  var overlay = document.getElementById('rpOverlay');
  var modal = document.getElementById('rpModal');
  var stars = Array.prototype.slice.call(document.querySelectorAll('.rp-star'));
  var laterBtn = document.getElementById('rpLater');
  var submitBtn = document.getElementById('rpSubmit');
  var note = document.getElementById('rpNote');

  var isOpen = false;
  var selected = 0;
  var lastFocused = null;
  var noteTimer = null;

  function setStarsDisplay(activeValue) {
    stars.forEach(function (star) {
      var val = parseInt(star.getAttribute('data-value'), 10);
      star.classList.toggle('is-hover', val <= activeValue);
    });
  }

  function commitSelection(value) {
    selected = value;
    stars.forEach(function (star) {
      var val = parseInt(star.getAttribute('data-value'), 10);
      star.classList.toggle('is-selected', val <= value);
      star.setAttribute('aria-checked', val === value ? 'true' : 'false');
    });
    submitBtn.disabled = selected < 1;
  }

  stars.forEach(function (star) {
    var val = parseInt(star.getAttribute('data-value'), 10);

    star.addEventListener('mouseenter', function () {
      setStarsDisplay(val);
    });
    star.addEventListener('mouseleave', function () {
      setStarsDisplay(selected);
    });
    star.addEventListener('focus', function () {
      setStarsDisplay(val);
    });
    star.addEventListener('blur', function () {
      setStarsDisplay(selected);
    });
    star.addEventListener('click', function () {
      commitSelection(val);
    });
    star.addEventListener('keydown', function (e) {
      var idx = stars.indexOf(star);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        var next = stars[Math.min(idx + 1, stars.length - 1)];
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        var prev = stars[Math.max(idx - 1, 0)];
        prev.focus();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        commitSelection(val);
      }
    });
  });

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);

    var focusTarget = stars[0];
    if (reduceMotion) {
      focusTarget.focus();
    } else {
      window.setTimeout(function () {
        focusTarget.focus();
      }, 150);
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);

    var finish = function () {
      overlay.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 240);
    }

    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = modal.querySelectorAll('button:not([disabled])');
      focusable = Array.prototype.slice.call(focusable);
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
  }

  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  openBtn.addEventListener('click', open);
  laterBtn.addEventListener('click', close);

  submitBtn.addEventListener('click', function () {
    if (selected < 1) return;
    note.textContent = 'Thanks for the ' + selected + '-star rating — it helps us grow.';
    submitBtn.disabled = true;
    laterBtn.disabled = true;

    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(function () {
      close();
      note.textContent = '';
      laterBtn.disabled = false;
      commitSelection(0);
    }, reduceMotion ? 400 : 1300);
  });
})();
