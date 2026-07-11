(function () {
  var scroller = document.getElementById('scroller');
  var track = document.getElementById('track');
  var dotsWrap = document.getElementById('dots');
  if (!scroller || !track) return;

  var swatches = ['#c4622d', '#5a7a3a', '#8fa86e', '#9b6b3a', '#d4a85a', '#a03820'];
  var names = ['Taproot', 'Rhizome', 'Fibrous', 'Bulb', 'Tuber', 'Corm', 'Runner', 'Adventitious'];
  var descriptions = [
    'Anchors deep, drawing water from far below the surface.',
    'Spreads sideways underground, sending up new shoots.',
    'A dense web of thin roots close to the soil surface.',
    'Stores energy in a swollen underground stem.',
    'Fat and starchy, built to survive the dormant season.',
    'A compact underground stem base, tightly packed.',
    'Stretches above ground to root and start anew.',
    'Sprouts from unexpected places — stems, leaves, anywhere.'
  ];

  names.forEach(function (name, i) {
    var card = document.createElement('div');
    card.className = 'root-card';
    card.style.setProperty('--accent-swatch', swatches[i % swatches.length]);
    card.innerHTML =
      '<span class="root-card-num">0' + (i + 1) + '</span>' +
      '<h3>' + name + '</h3>' +
      '<p>' + descriptions[i % descriptions.length] + '</p>';
    track.appendChild(card);
  });

  var cards = Array.prototype.slice.call(track.children);
  cards.forEach(function () {
    var dot = document.createElement('span');
    dot.className = 'dot';
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function updateDots() {
    var scrollLeft = scroller.scrollLeft;
    var closestIndex = 0;
    var closestDist = Infinity;
    cards.forEach(function (card, i) {
      var dist = Math.abs(card.offsetLeft - scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === closestIndex);
    });
  }

  dots.forEach(function (dot, i) {
    dot.style.cursor = 'pointer';
    dot.addEventListener('click', function () {
      cards[i].scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  });

  var ticking = false;
  scroller.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        updateDots();
        ticking = false;
      });
    }
  }, { passive: true });

  // Pointer drag-to-scroll
  var isDown = false;
  var startX = 0;
  var startScroll = 0;

  scroller.addEventListener('pointerdown', function (e) {
    isDown = true;
    scroller.classList.add('dragging');
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
    scroller.setPointerCapture(e.pointerId);
  });

  scroller.addEventListener('pointermove', function (e) {
    if (!isDown) return;
    var dx = e.clientX - startX;
    scroller.scrollLeft = startScroll - dx;
  });

  function endDrag() {
    isDown = false;
    scroller.classList.remove('dragging');
  }

  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('pointerleave', function () {
    if (isDown) endDrag();
  });

  updateDots();
})();
