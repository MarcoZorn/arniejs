(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var listEl = document.getElementById('soilList');
  var shuffleBtn = document.getElementById('soilShuffle');
  if (!listEl || !shuffleBtn) return;

  var avatarColors = [
    'var(--accent-terra)',
    'var(--accent-moss)',
    'var(--accent-clay)',
    'var(--accent-sand)',
    'var(--accent-sage)',
    'var(--accent-rust)'
  ];

  var gardeners = [
    { id: 'g1', name: 'Marisol Vega', plot: 'Terra Nova Plot', score: 982 },
    { id: 'g2', name: 'Owen Faircroft', plot: 'Hollow Creek Field', score: 947 },
    { id: 'g3', name: 'Ines Aduba', plot: 'Sunroot Garden', score: 915 },
    { id: 'g4', name: 'Kenji Hoshino', plot: 'Amber Furrow', score: 888 },
    { id: 'g5', name: 'Priya Anand', plot: 'Willow Bend Plot', score: 861 },
    { id: 'g6', name: 'Tobias Renn', plot: 'Copper Hollow', score: 830 },
    { id: 'g7', name: 'Dahlia Reyes', plot: 'Meadowlight Field', score: 799 },
    { id: 'g8', name: 'Sam Okoye', plot: 'Briarwood Plot', score: 764 }
  ];

  // Assign a stable rank and a mutable "previous rank" for delta display.
  gardeners.forEach(function (g, i) {
    g.rank = i + 1;
    g.prevRank = i + 1;
  });

  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0][0] : '';
    var last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  function deltaMarkup(delta) {
    if (delta > 0) {
      return (
        '<span class="soil-delta soil-delta--up">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>' +
        delta +
        '</span>'
      );
    }
    if (delta < 0) {
      return (
        '<span class="soil-delta soil-delta--down">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
        Math.abs(delta) +
        '</span>'
      );
    }
    return '<span class="soil-delta soil-delta--flat">&mdash;</span>';
  }

  function rankClass(rank) {
    if (rank === 1) return ' soil-item--top1';
    if (rank === 2) return ' soil-item--top2';
    if (rank === 3) return ' soil-item--top3';
    return '';
  }

  function buildItem(g, index) {
    var li = document.createElement('li');
    li.className = 'soil-item' + rankClass(g.rank);
    li.dataset.id = g.id;

    var delta = g.prevRank - g.rank;

    li.innerHTML =
      '<span class="soil-rank">' + g.rank + '</span>' +
      '<span class="soil-avatar" style="--avatar-color:' + avatarColors[index % avatarColors.length] + '">' + initials(g.name) + '</span>' +
      '<span class="soil-info">' +
        '<span class="soil-name">' + g.name + '</span>' +
        '<span class="soil-plot">' + g.plot + '</span>' +
      '</span>' +
      '<span class="soil-score">' + g.score + '<small>yield pts</small></span>' +
      deltaMarkup(delta);

    return li;
  }

  function render() {
    gardeners.sort(function (a, b) {
      return b.score - a.score;
    });
    gardeners.forEach(function (g, i) {
      g.rank = i + 1;
    });

    listEl.innerHTML = '';
    gardeners.forEach(function (g, i) {
      listEl.appendChild(buildItem(g, i));
    });
  }

  // FLIP animation: capture First positions, apply new order/state (Last),
  // Invert by translating back, then Play by animating to identity.
  function updateWithFlip(mutate) {
    var itemsBefore = Array.prototype.slice.call(listEl.children);
    var firstRects = {};
    itemsBefore.forEach(function (el) {
      firstRects[el.dataset.id] = el.getBoundingClientRect();
    });

    var movedUpIds = mutate();

    render();

    if (reduceMotion) return;

    var itemsAfter = Array.prototype.slice.call(listEl.children);

    itemsAfter.forEach(function (el) {
      var id = el.dataset.id;
      var first = firstRects[id];
      if (!first) return;

      var last = el.getBoundingClientRect();
      var deltaX = first.left - last.left;
      var deltaY = first.top - last.top;

      if (deltaX === 0 && deltaY === 0) return;

      el.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
      el.style.transition = 'transform 0s';

      // Force reflow before playing the transition.
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;

      requestAnimationFrame(function () {
        el.style.transition = 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate(0, 0)';
      });

      el.addEventListener('transitionend', function handler() {
        el.style.transition = '';
        el.style.transform = '';
        el.removeEventListener('transitionend', handler);
      });
    });

    if (movedUpIds && movedUpIds.length) {
      movedUpIds.forEach(function (id) {
        var el = listEl.querySelector('.soil-item[data-id="' + id + '"]');
        if (!el) return;
        window.setTimeout(function () {
          el.classList.add('is-moved-up');
          el.addEventListener('animationend', function handler() {
            el.classList.remove('is-moved-up');
            el.removeEventListener('animationend', handler);
          });
        }, 480);
      });
    }
  }

  function simulateUpdate() {
    var movedUpIds = [];

    updateWithFlip(function mutate() {
      gardeners.forEach(function (g) {
        g.prevRank = g.rank;
      });

      // Perturb a handful of scores to shuffle standings believably.
      var shuffleCount = 2 + Math.floor(Math.random() * 2);
      var pool = gardeners.slice();

      for (var i = 0; i < shuffleCount && pool.length; i++) {
        var idx = Math.floor(Math.random() * pool.length);
        var g = pool.splice(idx, 1)[0];
        var swing = 15 + Math.floor(Math.random() * 60);
        var direction = Math.random() < 0.65 ? 1 : -1;
        g.score = Math.max(50, g.score + swing * direction);
      }

      gardeners.sort(function (a, b) {
        return b.score - a.score;
      });
      gardeners.forEach(function (g, i) {
        var newRank = i + 1;
        if (newRank < g.prevRank) {
          movedUpIds.push(g.id);
        }
        g.rank = newRank;
      });

      return movedUpIds;
    });
  }

  shuffleBtn.addEventListener('click', function () {
    if (!reduceMotion) {
      shuffleBtn.classList.add('is-spinning');
      window.setTimeout(function () {
        shuffleBtn.classList.remove('is-spinning');
      }, 400);
    }
    simulateUpdate();
  });

  render();
})();
