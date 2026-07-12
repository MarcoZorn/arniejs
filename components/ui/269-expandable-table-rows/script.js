(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pens = [
    {
      pen: 'Pen 1', animal: 'Laying hens', count: 42, status: 'Healthy',
      breed: 'Rhode Island Red', age: '14 months', lastCheck: 'Jun 28, 2026', feed: 'Layer mash',
      note: 'Egg output steady at ~36/day. Water lines flushed this week, no issues found.'
    },
    {
      pen: 'Pen 2', animal: 'Dairy goats', count: 8, status: 'Watch',
      breed: 'Nubian', age: '2–4 years', lastCheck: 'Jun 30, 2026', feed: 'Alfalfa + grain mix',
      note: 'One doe showing mild limp, vet scheduled for Thursday. Rest of herd unaffected.'
    },
    {
      pen: 'Pen 3', animal: 'Meat rabbits', count: 26, status: 'Healthy',
      breed: 'New Zealand White', age: '3–8 months', lastCheck: 'Jul 1, 2026', feed: 'Pellet + hay',
      note: 'Second litter of the season weaned successfully, moved to grow-out hutches.'
    },
    {
      pen: 'Pen 4', animal: 'Turkeys', count: 14, status: 'Attention',
      breed: 'Bourbon Red', age: '6 months', lastCheck: 'Jul 2, 2026', feed: 'Grower feed',
      note: 'Two birds off their feed since Monday. Isolated and monitoring temperature closely.'
    },
    {
      pen: 'Pen 5', animal: 'Beef cattle', count: 11, status: 'Healthy',
      breed: 'Angus cross', age: '1–3 years', lastCheck: 'Jun 27, 2026', feed: 'Pasture + mineral lick',
      note: 'Rotational grazing moved to the east paddock, good regrowth on the west side.'
    },
    {
      pen: 'Pen 6', animal: 'Ducks', count: 19, status: 'Healthy',
      breed: 'Khaki Campbell', age: '10 months', lastCheck: 'Jun 29, 2026', feed: 'Waterfowl crumble',
      note: 'Pond liner patched last week, holding well. Egg laying back to normal.'
    },
    {
      pen: 'Pen 7', animal: 'Sheep', count: 16, status: 'Watch',
      breed: 'Dorper', age: '1–5 years', lastCheck: 'Jul 3, 2026', feed: 'Pasture + hay',
      note: 'Shearing due within two weeks — flagging before fleece gets too heavy in the heat.'
    },
    {
      pen: 'Pen 8', animal: 'Broiler chickens', count: 60, status: 'Healthy',
      breed: 'Cornish Cross', age: '5 weeks', lastCheck: 'Jul 4, 2026', feed: 'Broiler starter',
      note: 'On track for processing in 3 weeks, average weight gain ahead of last batch.'
    },
    {
      pen: 'Pen 9', animal: 'Bees (hives)', count: 6, status: 'Healthy',
      breed: 'Italian honeybee', age: 'Mixed colonies', lastCheck: 'Jun 26, 2026', feed: 'Forage + syrup (spring)',
      note: 'Two hives split this spring, all six queens laying well ahead of the summer flow.'
    },
    {
      pen: 'Pen 10', animal: 'Pigs', count: 5, status: 'Attention',
      breed: 'Berkshire', age: '4 months', lastCheck: 'Jul 4, 2026', feed: 'Grower ration',
      note: 'Wallow needs re-digging after recent rain turned it to standing water near the fence.'
    }
  ];

  var tbody = document.querySelector('.exp-tbl-body');
  if (!tbody) return;

  var chevronSvg = '<svg class="exp-tbl-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  pens.forEach(function (item, index) {
    var rowId = 'exp-tbl-detail-' + index;

    var row = document.createElement('tr');
    row.className = 'exp-tbl-row';
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');
    row.setAttribute('aria-expanded', 'false');
    row.setAttribute('aria-controls', rowId);
    row.innerHTML =
      '<td>' + chevronSvg + '</td>' +
      '<td>' + item.pen + '</td>' +
      '<td>' + item.animal + '</td>' +
      '<td>' + item.count + '</td>' +
      '<td><span class="exp-tbl-status" data-status="' + item.status + '">' + item.status + '</span></td>';

    var detailRow = document.createElement('tr');
    detailRow.className = 'exp-tbl-detail-row';
    detailRow.id = rowId;
    detailRow.innerHTML =
      '<td colspan="5">' +
      '<div class="exp-tbl-detail-inner">' +
      '<div class="exp-tbl-detail-content">' +
      '<div class="exp-tbl-detail-field"><span class="exp-tbl-detail-label">Breed</span><span class="exp-tbl-detail-value">' + item.breed + '</span></div>' +
      '<div class="exp-tbl-detail-field"><span class="exp-tbl-detail-label">Age range</span><span class="exp-tbl-detail-value">' + item.age + '</span></div>' +
      '<div class="exp-tbl-detail-field"><span class="exp-tbl-detail-label">Last check</span><span class="exp-tbl-detail-value">' + item.lastCheck + '</span></div>' +
      '<div class="exp-tbl-detail-field"><span class="exp-tbl-detail-label">Feed</span><span class="exp-tbl-detail-value">' + item.feed + '</span></div>' +
      '<p class="exp-tbl-detail-note">' + item.note + '</p>' +
      '</div>' +
      '</div>' +
      '</td>';

    function toggle() {
      var expanded = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    }

    row.addEventListener('click', toggle);
    row.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    tbody.appendChild(row);
    tbody.appendChild(detailRow);
  });
})();
