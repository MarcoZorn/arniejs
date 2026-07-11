(function () {
  'use strict';

  var CAPTIONS = ['Tap a star', 'Awful', 'Poor', 'Okay', 'Good', 'Great'];

  var rating = document.querySelector('.rating');
  var stars = Array.prototype.slice.call(rating.querySelectorAll('.star'));
  var valueEl = document.querySelector('[data-value]');
  var captionEl = document.querySelector('[data-caption]');
  var current = 0;

  function paint(n) {
    stars.forEach(function (s, i) {
      s.classList.toggle('is-active', i < n);
    });
  }

  function label(n) {
    valueEl.textContent = n.toFixed(1);
    captionEl.textContent = CAPTIONS[n] || CAPTIONS[0];
  }

  function set(n, pop) {
    current = n;
    paint(n);
    label(n);
    rating.setAttribute('aria-valuenow', String(n));
    rating.setAttribute('aria-valuetext', n ? CAPTIONS[n] + ', ' + n + ' of 5' : 'No rating');
    if (pop && n > 0) {
      var star = stars[n - 1];
      star.classList.remove('pop');
      void star.offsetWidth;
      star.classList.add('pop');
    }
  }

  stars.forEach(function (star, i) {
    var n = i + 1;
    star.addEventListener('mouseenter', function () { paint(n); label(n); });
    star.addEventListener('click', function () { set(n, true); });
  });

  rating.addEventListener('mouseleave', function () { paint(current); label(current); });

  rating.addEventListener('keydown', function (e) {
    var next = current;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(5, current + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, current - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = 5;
    else if (/^[0-5]$/.test(e.key)) next = parseInt(e.key, 10);
    else return;
    e.preventDefault();
    set(next, true);
  });

  set(0, false);

  // Emoji variant
  var faces = Array.prototype.slice.call(document.querySelectorAll('.emoji__face'));
  var moodCaption = document.querySelector('[data-mood-caption]');
  var MOODS = { 1: 'Awful', 2: 'Meh', 3: 'Okay', 4: 'Good', 5: 'Great' };
  var moodIndex = -1;

  function selectMood(i) {
    moodIndex = i;
    faces.forEach(function (f, k) {
      var on = k === i;
      f.classList.toggle('is-active', on);
      f.setAttribute('aria-checked', on ? 'true' : 'false');
      f.tabIndex = on ? 0 : -1;
    });
    moodCaption.textContent = MOODS[faces[i].dataset.mood];
  }

  faces.forEach(function (f, i) {
    f.tabIndex = i === 0 ? 0 : -1;
    f.addEventListener('click', function () { selectMood(i); f.focus(); });
    f.addEventListener('keydown', function (e) {
      var t = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') t = (i + 1) % faces.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') t = (i - 1 + faces.length) % faces.length;
      else if (e.key === ' ' || e.key === 'Enter') { selectMood(i); return; }
      else return;
      e.preventDefault();
      selectMood(t);
      faces[t].focus();
    });
  });
})();
