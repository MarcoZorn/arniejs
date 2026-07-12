(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scroller = document.getElementById('infScroll');
  var list = document.getElementById('infList');
  var loader = document.getElementById('infLoader');
  var endMsg = document.getElementById('infEnd');
  var status = document.getElementById('infStatus');
  if (!scroller || !list || !loader || !endMsg) return;

  var ICONS = ['🌱', '🪴', '💧', '🍂', '🐝', '🌾', '🧑‍🌾', '☀️'];
  var ACTIONS = [
    'Bed watered',
    'Seedlings transplanted',
    'Compost turned',
    'Pest check completed',
    'Mulch layer added',
    'Frost cover removed',
    'Harvest logged',
    'Soil sample taken'
  ];

  var PAGE_SIZE = 12;
  var MAX_ITEMS = 96;
  var itemCount = 0;
  var loading = false;
  var done = false;

  function fakeItem(index) {
    var icon = ICONS[index % ICONS.length];
    var action = ACTIONS[index % ACTIONS.length];
    var dayOffset = Math.floor(index / 3) + 1;
    var li = document.createElement('li');
    li.className = 'inf-item';
    li.innerHTML =
      '<span class="inf-item-icon" aria-hidden="true">' + icon + '</span>' +
      '<span class="inf-item-body">' +
      '<span class="inf-item-title">Entry #' + (index + 1) + ' — ' + action + '</span>' +
      '<span class="inf-item-meta">' + dayOffset + ' day' + (dayOffset === 1 ? '' : 's') + ' ago, Plot ' + ((index % 6) + 1) + '</span>' +
      '</span>';
    return li;
  }

  function loadMore() {
    if (loading || done) return;
    loading = true;
    loader.hidden = false;
    scroller.setAttribute('aria-busy', 'true');

    var delay = reduceMotion ? 0 : 650;

    window.setTimeout(function () {
      var frag = document.createDocumentFragment();
      var count = Math.min(PAGE_SIZE, MAX_ITEMS - itemCount);

      for (var i = 0; i < count; i++) {
        frag.appendChild(fakeItem(itemCount));
        itemCount++;
      }

      list.appendChild(frag);
      loader.hidden = true;
      scroller.setAttribute('aria-busy', 'false');
      loading = false;

      if (status) {
        status.textContent = itemCount + ' entries loaded.';
      }

      if (itemCount >= MAX_ITEMS) {
        done = true;
        endMsg.hidden = false;
      }
    }, delay);
  }

  function checkScroll() {
    if (loading || done) return;
    var threshold = 120;
    var remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    if (remaining <= threshold) {
      loadMore();
    }
  }

  scroller.addEventListener('scroll', checkScroll);

  // Initial fill so the list starts populated and scrollable.
  loadMore();
  window.setTimeout(checkScroll, 800);
})();
