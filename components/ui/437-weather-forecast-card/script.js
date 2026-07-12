(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var row = document.querySelector('#weatherRow');
  var icon = document.querySelector('#weatherCurrentIcon');
  var dayLabel = document.querySelector('#weatherCurrentDay');
  var temp = document.querySelector('#weatherCurrentTemp');
  var desc = document.querySelector('#weatherCurrentDesc');
  if (!row || !icon || !dayLabel || !temp || !desc) return;

  var days = Array.prototype.slice.call(row.querySelectorAll('.weather-day'));

  function selectDay(btn) {
    days.forEach(function (d) { d.classList.toggle('is-selected', d === btn); });

    var applyContent = function () {
      dayLabel.textContent = btn.getAttribute('data-day');
      icon.textContent = btn.getAttribute('data-icon');
      temp.textContent = btn.getAttribute('data-hi');
      desc.textContent = btn.getAttribute('data-desc');
    };

    if (reduceMotion || !icon.animate) {
      applyContent();
      return;
    }

    var fadeOut = icon.animate(
      [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.85)' }],
      { duration: 120, easing: 'ease-in', fill: 'forwards' }
    );
    fadeOut.onfinish = function () {
      applyContent();
      icon.animate(
        [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 160, easing: 'ease-out' }
      );
    };
  }

  days.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectDay(btn);
    });
  });
})();
