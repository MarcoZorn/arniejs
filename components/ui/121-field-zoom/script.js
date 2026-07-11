(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));
  var lightbox = document.getElementById('lightbox');
  var lightboxMedia = document.getElementById('lightboxMedia');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxDesc = document.getElementById('lightboxDesc');
  var lastFocused = null;

  if (!thumbs.length || !lightbox) return;

  function openLightbox(thumb) {
    var svg = thumb.querySelector('svg');
    lightboxMedia.innerHTML = svg ? svg.outerHTML : '';
    lightboxTitle.textContent = thumb.getAttribute('data-title') || '';
    lightboxDesc.textContent = thumb.getAttribute('data-desc') || '';

    lastFocused = document.activeElement;
    lightbox.hidden = false;
    // Force reflow so the open transition runs.
    void lightbox.offsetWidth;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    var closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';

    var finish = function () {
      lightbox.hidden = true;
      lightboxMedia.innerHTML = '';
    };

    if (prefersReducedMotion) {
      finish();
    } else {
      setTimeout(finish, 240);
    }

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      openLightbox(thumb);
    });
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target && event.target.getAttribute('data-close') === 'true') {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
})();
