(function () {
  var btn = document.getElementById('liquidBtn');
  if (!btn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  btn.addEventListener('mouseenter', function () {
    btn.classList.add('is-active');
  });

  btn.addEventListener('mouseleave', function () {
    btn.classList.remove('is-active');
  });

  btn.addEventListener('focus', function () {
    btn.classList.add('is-active');
  });

  btn.addEventListener('blur', function () {
    btn.classList.remove('is-active');
  });

  btn.addEventListener('click', function () {
    if (reduceMotion) return;
    btn.classList.remove('is-active');
    void btn.offsetWidth;
    btn.classList.add('is-active');
  });
})();
