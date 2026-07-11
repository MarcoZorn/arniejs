(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var main = document.getElementById('galleryMain');
  var mainImg = document.getElementById('galleryMainImg');
  var thumbs = document.querySelectorAll('.gallery-thumb');
  if (!main || !mainImg) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      thumb.classList.add('is-active');
      thumb.setAttribute('aria-selected', 'true');
      var full = thumb.getAttribute('data-full');
      if (full) {
        mainImg.src = full;
      }
      var label = thumb.querySelector('img');
      mainImg.alt = label ? label.alt.replace(/^./, function (c) { return c; }) : mainImg.alt;
    });
  });

  if (prefersReducedMotion) return;

  main.addEventListener('mousemove', function (e) {
    var rect = main.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImg.style.transformOrigin = x + '% ' + y + '%';
    main.classList.add('is-zooming');
  });

  main.addEventListener('mouseleave', function () {
    main.classList.remove('is-zooming');
    mainImg.style.transformOrigin = 'center';
  });
})();
