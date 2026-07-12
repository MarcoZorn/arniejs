(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var form = document.querySelector('.rsi-form');
  var starButtons = Array.prototype.slice.call(document.querySelectorAll('.rsi-star'));
  var starHint = document.querySelector('.rsi-star-hint');
  var nameInput = document.getElementById('rsi-name');
  var textInput = document.getElementById('rsi-text');
  var errorEl = document.querySelector('.rsi-error');
  var list = document.getElementById('rsi-list');

  if (!form || !starButtons.length || !list) return;

  var rating = 0;

  function paintStars(activeValue, hoverValue) {
    starButtons.forEach(function (btn) {
      var val = Number(btn.getAttribute('data-star'));
      btn.classList.toggle('is-active', val <= activeValue);
      btn.classList.toggle('is-hovered', hoverValue > 0 && val <= hoverValue);
      btn.setAttribute('aria-checked', val === activeValue ? 'true' : 'false');
      btn.tabIndex = val === (activeValue || 1) ? 0 : -1;
    });
  }

  function setRating(value) {
    rating = value;
    paintStars(rating, 0);
    starHint.textContent = rating > 0 ? rating + ' out of 5 stars' : 'Pick a star rating';
  }

  starButtons.forEach(function (btn) {
    var val = Number(btn.getAttribute('data-star'));

    btn.addEventListener('click', function () {
      setRating(val);
    });

    btn.addEventListener('mouseenter', function () {
      paintStars(rating, val);
    });

    btn.addEventListener('mouseleave', function () {
      paintStars(rating, 0);
    });

    btn.addEventListener('keydown', function (e) {
      var currentIndex = starButtons.indexOf(btn);
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        var next = starButtons[Math.min(currentIndex + 1, starButtons.length - 1)];
        setRating(Number(next.getAttribute('data-star')));
        next.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        var prev = starButtons[Math.max(currentIndex - 1, 0)];
        setRating(Number(prev.getAttribute('data-star')));
        prev.focus();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRating(val);
      }
    });
  });

  function starGlyphs(value) {
    var filled = new Array(value + 1).join('★');
    var empty = new Array(6 - value).join('☆');
    return filled + empty;
  }

  function timeAgoLabel() {
    return 'just now';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.textContent = '';

    var name = nameInput.value.trim();
    var text = textInput.value.trim();

    if (rating === 0) {
      errorEl.textContent = 'Please choose a star rating.';
      return;
    }
    if (!name) {
      errorEl.textContent = 'Please add your name.';
      nameInput.focus();
      return;
    }
    if (!text) {
      errorEl.textContent = 'Please write a short review.';
      textInput.focus();
      return;
    }

    var li = document.createElement('li');
    li.className = 'rsi-review';
    li.innerHTML =
      '<div class="rsi-review-top">' +
        '<span class="rsi-review-stars" data-rating="' + rating + '" aria-label="' + rating + ' out of 5 stars">' + starGlyphs(rating) + '</span>' +
        '<span class="rsi-review-name"></span>' +
        '<span class="rsi-review-time">' + timeAgoLabel() + '</span>' +
      '</div>' +
      '<p class="rsi-review-text"></p>';

    li.querySelector('.rsi-review-name').textContent = name;
    li.querySelector('.rsi-review-text').textContent = text;

    list.insertBefore(li, list.firstChild);

    if (!reduceMotion) {
      li.animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 260, easing: 'ease-out' }
      );
    }

    form.reset();
    setRating(0);
    nameInput.focus();
  });

  setRating(0);
})();
