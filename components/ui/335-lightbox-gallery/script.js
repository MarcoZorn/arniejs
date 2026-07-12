(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.lb-thumb'));
  var overlay = document.getElementById('lbOverlay');
  var frame = document.getElementById('lbFrame');
  var closeBtn = document.getElementById('lbClose');
  var prevBtn = document.getElementById('lbPrev');
  var nextBtn = document.getElementById('lbNext');
  var imageEl = document.getElementById('lbImage');
  var imageLabel = document.getElementById('lbImageLabel');
  var counter = document.getElementById('lbCounter');

  var items = thumbs.map(function (thumb) {
    return {
      label: thumb.querySelector('.lb-thumb-label').textContent,
      a: thumb.style.getPropertyValue('--lb-a'),
      b: thumb.style.getPropertyValue('--lb-b')
    };
  });

  var currentIndex = 0;
  var isOpen = false;
  var lastFocused = null;

  function render() {
    var item = items[currentIndex];
    imageEl.style.setProperty('--lb-a', item.a);
    imageEl.style.setProperty('--lb-b', item.b);
    imageLabel.textContent = item.label;
    counter.textContent = (currentIndex + 1) + ' of ' + items.length;
  }

  function open(index, trigger) {
    currentIndex = index;
    isOpen = true;
    lastFocused = trigger || document.activeElement;
    render();

    overlay.hidden = false;
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.addEventListener('keydown', onKeydown, true);

    if (reduceMotion) {
      closeBtn.focus();
    } else {
      window.setTimeout(function () {
        closeBtn.focus();
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
      window.setTimeout(finish, 220);
    }

    if (lastFocused) lastFocused.focus();
  }

  function next() {
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = frame.querySelectorAll('button');
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

  // Click on the dimmed backdrop (not the frame/image) closes the lightbox.
  overlay.addEventListener('mousedown', function (e) {
    if (e.target === overlay) close();
  });

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var index = parseInt(thumb.getAttribute('data-index'), 10);
      open(index, thumb);
    });
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
})();
