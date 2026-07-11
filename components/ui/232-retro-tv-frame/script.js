(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var screen = document.querySelector('.tv__screen');
  var btn = document.querySelector('.tv__btn');
  var channelEl = document.querySelector('.tv__channel');
  if (!screen || !btn || !channelEl) return;

  var channels = ['CH 02', 'CH 04', 'CH 07', 'CH 09', 'CH 13'];
  var index = 1;

  btn.addEventListener('click', function () {
    index = (index + 1) % channels.length;
    channelEl.textContent = channels[index];

    if (reduce) return;

    screen.classList.remove('is-flickering');
    // force reflow so the animation can restart
    void screen.offsetWidth;
    screen.classList.add('is-flickering');
  });

  screen.addEventListener('animationend', function (e) {
    if (e.target.classList.contains('tv__static')) {
      screen.classList.remove('is-flickering');
    }
  });
})();
