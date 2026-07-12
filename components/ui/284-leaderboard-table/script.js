(function () {
  var list = document.getElementById('lbd-list');
  var sortBtns = Array.prototype.slice.call(document.querySelectorAll('.lbd-sort-btn'));
  if (!list) return;

  var avatarColors = ['#c4622d', '#5a7a3a', '#9b6b3a', '#d4a85a', '#a03820', '#8fa86e'];

  // prevRank = rank last week (0 means unranked/new entrant).
  var growers = [
    { name: 'Marisol Fenn', plot: 'North Ridge Plot', score: 9840, prevRank: 2 },
    { name: 'Declan Osei', plot: 'Riverbend Field', score: 9615, prevRank: 1 },
    { name: 'Priya Anand', plot: 'Terrace Garden 3', score: 9120, prevRank: 4 },
    { name: 'Tomas Reyes', plot: 'Sunhollow Acres', score: 8790, prevRank: 3 },
    { name: 'Ingrid Solberg', plot: 'Meadowlight Farm', score: 8340, prevRank: 6 },
    { name: 'Kwame Asante', plot: 'East Orchard', score: 8055, prevRank: 5 },
    { name: 'Yuki Tanaka', plot: 'Cedarline Plot', score: 7710, prevRank: 8 },
    { name: 'Fatima Zahra', plot: 'Willow Creek', score: 7480, prevRank: 7 },
    { name: 'Oliver Bramwell', plot: 'Southfield Row', score: 7025, prevRank: 9 },
    { name: 'Nadia Kovac', plot: 'Highbank Terrace', score: 6690, prevRank: 11 },
    { name: 'Diego Marquez', plot: 'Sparrow Hill', score: 6410, prevRank: 10 },
    { name: 'Amara Chukwu', plot: 'Pine Hollow', score: 6055, prevRank: 13 },
    { name: 'Lena Fischer', plot: 'Brookside Beds', score: 5720, prevRank: 12 },
    { name: 'Rowan Blackwood', plot: 'Amber Fields', score: 5310, prevRank: 0 },
    { name: 'Sana Malik', plot: 'Copper Vale', score: 4980, prevRank: 14 },
    { name: 'Elias Nordvik', plot: 'Fernway Plot', score: 4602, prevRank: 15 }
  ];

  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var first = parts[0] ? parts[0][0] : '';
    var last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  function colorFor(name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    return avatarColors[hash % avatarColors.length];
  }

  function render(sortBy) {
    var sorted = growers.slice();
    if (sortBy === 'name') {
      sorted.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else {
      sorted.sort(function (a, b) { return b.score - a.score; });
    }

    list.innerHTML = '';

    sorted.forEach(function (grower, index) {
      var rank = index + 1;
      var row = document.createElement('div');
      row.className = 'lbd-row' + (rank <= 3 ? ' lbd-row--top' : '');
      row.setAttribute('role', 'row');

      var rankEl = document.createElement('div');
      rankEl.className = 'lbd-rank';
      rankEl.textContent = '#' + rank;

      var avatar = document.createElement('div');
      avatar.className = 'lbd-avatar';
      avatar.style.background = colorFor(grower.name);
      avatar.textContent = initials(grower.name);

      var identity = document.createElement('div');
      identity.className = 'lbd-identity';
      var nameEl = document.createElement('span');
      nameEl.className = 'lbd-name';
      nameEl.textContent = grower.name;
      var plotEl = document.createElement('span');
      plotEl.className = 'lbd-plot';
      plotEl.textContent = grower.plot;
      identity.appendChild(nameEl);
      identity.appendChild(plotEl);

      var scoreEl = document.createElement('div');
      scoreEl.className = 'lbd-score';
      scoreEl.textContent = grower.score.toLocaleString('en-US');

      var changeEl = document.createElement('div');
      changeEl.className = 'lbd-change';

      // Rank-change only meaningful when sorted by score (true ranking); computed from prevRank vs current rank.
      var dir = 'same';
      var label = 'No change since last week';
      if (sortBy === 'score') {
        if (grower.prevRank === 0) {
          dir = 'up';
          label = 'New entry this week';
        } else if (rank < grower.prevRank) {
          dir = 'up';
          label = 'Up ' + (grower.prevRank - rank) + ' from last week';
        } else if (rank > grower.prevRank) {
          dir = 'down';
          label = 'Down ' + (rank - grower.prevRank) + ' from last week';
        } else {
          label = 'Same position as last week';
        }
      } else {
        dir = 'same';
        label = 'Sorted alphabetically';
      }

      changeEl.setAttribute('data-dir', dir);
      changeEl.setAttribute('title', label);
      changeEl.setAttribute('aria-label', label);
      var icon = document.createElement('span');
      icon.className = 'lbd-change-icon';
      changeEl.appendChild(icon);

      row.appendChild(rankEl);
      row.appendChild(avatar);
      row.appendChild(identity);
      row.appendChild(scoreEl);
      row.appendChild(changeEl);

      list.appendChild(row);
    });
  }

  sortBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sortBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      render(btn.getAttribute('data-sort'));
    });
  });

  render('score');
})();
