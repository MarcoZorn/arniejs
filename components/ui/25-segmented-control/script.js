(function () {
  'use strict';

  // Segmented control
  var seg = document.querySelector('.segmented');
  var pill = seg.querySelector('[data-pill]');
  var btns = Array.prototype.slice.call(seg.querySelectorAll('.segmented__btn'));

  function movePill(btn) {
    pill.style.width = btn.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + (btn.offsetLeft - pill.offsetLeft) + 'px)';
  }

  function select(btn, focus) {
    btns.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    movePill(btn);
    if (focus) btn.focus();
  }

  btns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { select(btn); });
    btn.addEventListener('keydown', function (e) {
      var t = i;
      if (e.key === 'ArrowRight') t = (i + 1) % btns.length;
      else if (e.key === 'ArrowLeft') t = (i - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') t = 0;
      else if (e.key === 'End') t = btns.length - 1;
      else return;
      e.preventDefault();
      select(btns[t], true);
    });
  });

  // Initial pill placement (and on resize)
  function place() {
    var active = seg.querySelector('.segmented__btn.is-active') || btns[0];
    var prev = pill.style.transition;
    pill.style.transition = 'none';
    movePill(active);
    // force reflow then restore transition
    void pill.offsetWidth;
    pill.style.transition = prev;
  }
  place();
  window.addEventListener('resize', place);

  // Toggle switches
  Array.prototype.forEach.call(document.querySelectorAll('.toggle'), function (t) {
    function flip() {
      var on = t.classList.toggle('is-on');
      t.setAttribute('aria-checked', on ? 'true' : 'false');
    }
    t.addEventListener('click', flip);
    t.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    });
  });
})();
