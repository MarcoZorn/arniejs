(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openBtn = document.getElementById('pvOpen');
  var backdrop = document.getElementById('pvBackdrop');
  var modal = document.getElementById('pvModal');
  var closeBtn = document.getElementById('pvClose');
  var page = document.getElementById('pvPage');
  var pageNumber = document.getElementById('pvPageNumber');
  var indicator = document.getElementById('pvIndicator');
  var prevBtn = document.getElementById('pvPrev');
  var nextBtn = document.getElementById('pvNext');
  var zoomInBtn = document.getElementById('pvZoomIn');
  var zoomOutBtn = document.getElementById('pvZoomOut');
  var zoomValue = document.getElementById('pvZoomValue');

  if (reduceMotion) {
    modal.style.transition = 'none';
    backdrop.style.transition = 'none';
    page.style.transition = 'none';
  }

  var TOTAL_PAGES = 5;
  var currentPage = 1;
  var zoom = 100;
  var ZOOM_MIN = 50;
  var ZOOM_MAX = 200;
  var ZOOM_STEP = 10;
  var lastFocused = null;

  function focusableEls() {
    return Array.prototype.slice.call(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    var items = focusableEls();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    trapFocus(e);
  }

  function updatePage() {
    pageNumber.textContent = String(currentPage);
    indicator.textContent = 'Page ' + currentPage + ' of ' + TOTAL_PAGES;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === TOTAL_PAGES;
  }

  function updateZoom() {
    zoomValue.textContent = zoom + '%';
    page.style.transform = 'scale(' + (zoom / 100) + ')';
    zoomInBtn.disabled = zoom >= ZOOM_MAX;
    zoomOutBtn.disabled = zoom <= ZOOM_MIN;
  }

  function openModal() {
    lastFocused = document.activeElement;
    backdrop.classList.add('visible');
    modal.classList.add('open');
    document.addEventListener('keydown', onKeydown);
    window.setTimeout(function () {
      closeBtn.focus();
    }, reduceMotion ? 0 : 60);
  }

  function closeModal() {
    backdrop.classList.remove('visible');
    modal.classList.remove('open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  prevBtn.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage -= 1;
      updatePage();
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentPage < TOTAL_PAGES) {
      currentPage += 1;
      updatePage();
    }
  });

  zoomInBtn.addEventListener('click', function () {
    zoom = Math.min(ZOOM_MAX, zoom + ZOOM_STEP);
    updateZoom();
  });

  zoomOutBtn.addEventListener('click', function () {
    zoom = Math.max(ZOOM_MIN, zoom - ZOOM_STEP);
    updateZoom();
  });

  updatePage();
  updateZoom();
})();
