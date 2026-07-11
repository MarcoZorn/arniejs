(function () {
  var list = document.getElementById('harvestList');
  var sentinel = document.getElementById('sentinel');
  var loaderText = document.getElementById('loaderText');
  if (!list || !sentinel) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var crops = ['Tomato', 'Squash', 'Pumpkin', 'Kale', 'Carrot', 'Beet', 'Onion', 'Basil', 'Pepper', 'Radish', 'Corn', 'Lettuce'];
  var icons = ['🍅', '🎃', '🥬', '🥕', '🧅', '🌽', '🌶️', '🫑'];

  var PAGE_SIZE = 8;
  var MAX_ITEMS = 64;
  var loaded = 0;
  var loading = false;

  function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildItem(index) {
    var li = document.createElement('li');
    li.className = 'harvest-item';
    if (!reduceMotion) {
      li.style.animationDelay = (index % PAGE_SIZE) * 0.05 + 's';
    } else {
      li.style.animation = 'none';
    }

    var crop = randomFrom(crops);
    var qty = (Math.random() * 12 + 1).toFixed(1);

    li.innerHTML =
      '<div class="harvest-icon">' + randomFrom(icons) + '</div>' +
      '<div class="harvest-body">' +
        '<p class="harvest-title">' + crop + ' — Row ' + (index + 1) + '</p>' +
        '<p class="harvest-meta">Harvested ' + qty + ' kg &middot; Plot ' + (1 + (index % 6)) + '</p>' +
      '</div>' +
      '<span class="harvest-tag">#' + (index + 1) + '</span>';

    return li;
  }

  function loadMore() {
    if (loading || loaded >= MAX_ITEMS) return;
    loading = true;

    var next = Math.min(PAGE_SIZE, MAX_ITEMS - loaded);
    var delay = reduceMotion ? 0 : 500;

    setTimeout(function () {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < next; i++) {
        frag.appendChild(buildItem(loaded + i));
      }
      list.appendChild(frag);
      loaded += next;
      loading = false;

      if (loaded >= MAX_ITEMS) {
        sentinel.classList.add('done');
        loaderText.textContent = 'The whole field has been harvested.';
        observer.disconnect();
      }
    }, delay);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) loadMore();
    });
  }, { rootMargin: '200px 0px' });

  observer.observe(sentinel);
  loadMore();
})();
