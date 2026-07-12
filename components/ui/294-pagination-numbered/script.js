(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var list = document.getElementById('pgnList');
  var prevBtn = document.getElementById('pgnPrev');
  var nextBtn = document.getElementById('pgnNext');
  var status = document.getElementById('pgnStatus');
  if (!list || !prevBtn || !nextBtn) return;

  var TOTAL_PAGES = 42;
  var currentPage = 1;

  function getPageRange(current, total) {
    var delta = 1;
    var range = [];
    var withDots = [];
    var lastPage = 0;

    range.push(1);
    for (var i = current - delta; i <= current + delta; i++) {
      if (i > 1 && i < total) range.push(i);
    }
    range.push(total);

    range = range.filter(function (p) { return p >= 1 && p <= total; });
    range.sort(function (a, b) { return a - b; });
    range = range.filter(function (p, idx) { return range.indexOf(p) === idx; });

    range.forEach(function (page) {
      if (lastPage) {
        if (page - lastPage === 2) {
          withDots.push(lastPage + 1);
        } else if (page - lastPage > 2) {
          withDots.push('...');
        }
      }
      withDots.push(page);
      lastPage = page;
    });

    return withDots;
  }

  function render() {
    list.innerHTML = '';
    var pages = getPageRange(currentPage, TOTAL_PAGES);

    pages.forEach(function (page) {
      var li = document.createElement('li');
      if (page === '...') {
        li.className = 'pgn-ellipsis';
        li.textContent = '…';
        li.setAttribute('aria-hidden', 'true');
      } else {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pgn-btn pgn-page';
        btn.textContent = String(page);
        var isCurrent = page === currentPage;
        if (isCurrent) {
          btn.classList.add('is-current');
          btn.setAttribute('aria-current', 'page');
        }
        btn.setAttribute('aria-label', 'Page ' + page);
        btn.addEventListener('click', function () {
          goToPage(page);
        });
        li.appendChild(btn);
      }
      list.appendChild(li);
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === TOTAL_PAGES;

    if (status) {
      status.textContent = 'Page ' + currentPage + ' of ' + TOTAL_PAGES;
    }
  }

  function goToPage(page) {
    page = Math.max(1, Math.min(TOTAL_PAGES, page));
    if (page === currentPage) return;
    currentPage = page;
    render();
  }

  prevBtn.addEventListener('click', function () {
    goToPage(currentPage - 1);
  });

  nextBtn.addEventListener('click', function () {
    goToPage(currentPage + 1);
  });

  list.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    var buttons = Array.prototype.slice.call(list.querySelectorAll('.pgn-page'));
    var current = buttons.indexOf(document.activeElement);
    if (current === -1) return;
    event.preventDefault();
    var next = event.key === 'ArrowRight'
      ? Math.min(buttons.length - 1, current + 1)
      : Math.max(0, current - 1);
    buttons[next].focus();
  });

  render();
})();
