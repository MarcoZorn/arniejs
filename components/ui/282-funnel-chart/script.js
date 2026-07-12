(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var mount = document.getElementById('fnl-funnel');
  if (!mount) return;

  var stages = [
    { name: 'Visited', value: 48200, color: '#d4a85a' },
    { name: 'Signed up', value: 12730, color: '#c4622d' },
    { name: 'Activated', value: 7840, color: '#9b6b3a' },
    { name: 'Purchased', value: 3115, color: '#5a7a3a' },
    { name: 'Retained', value: 1962, color: '#8fa86e' }
  ];

  var maxValue = stages[0].value;

  function fmtNumber(n) {
    return n.toLocaleString('en-US');
  }

  stages.forEach(function (stage, i) {
    var widthPct = (stage.value / maxValue) * 100;
    var pctOfPrev = i === 0 ? null : Math.round((stage.value / stages[i - 1].value) * 1000) / 10;
    var pctOfFirst = Math.round((stage.value / maxValue) * 1000) / 10;

    var stageEl = document.createElement('div');
    stageEl.className = 'fnl-stage';

    var head = document.createElement('div');
    head.className = 'fnl-stage-head';

    var nameEl = document.createElement('span');
    nameEl.className = 'fnl-stage-name';
    nameEl.textContent = stage.name;

    var meta = document.createElement('span');
    meta.className = 'fnl-stage-meta';

    var countEl = document.createElement('span');
    countEl.className = 'fnl-stage-count';
    countEl.textContent = fmtNumber(stage.value);
    meta.appendChild(countEl);

    var pctEl = document.createElement('span');
    if (i === 0) {
      pctEl.className = 'fnl-stage-pct is-first';
      pctEl.textContent = '100% of visits';
    } else {
      pctEl.className = 'fnl-stage-pct';
      pctEl.textContent = pctOfPrev + '% of prev · ' + pctOfFirst + '% total';
    }
    meta.appendChild(pctEl);

    head.appendChild(nameEl);
    head.appendChild(meta);

    var track = document.createElement('div');
    track.className = 'fnl-bar-track';

    var fill = document.createElement('div');
    fill.className = 'fnl-bar-fill';
    fill.style.background = stage.color;
    track.appendChild(fill);

    stageEl.appendChild(head);
    stageEl.appendChild(track);
    mount.appendChild(stageEl);

    if (i < stages.length - 1) {
      var connector = document.createElement('div');
      connector.className = 'fnl-connector';
      mount.appendChild(connector);
    }

    // Animate width on next frame (skip transition if reduced motion, but still set final value).
    if (reduceMotion) {
      fill.style.width = widthPct + '%';
    } else {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          fill.style.width = widthPct + '%';
        });
      });
    }
  });
})();
