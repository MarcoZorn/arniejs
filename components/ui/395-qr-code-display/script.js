(function () {
  var textInput = document.getElementById('qrd-text');
  var canvas = document.getElementById('qrd-canvas');
  var ctx = canvas.getContext('2d');

  var GRID = 25; // modules per side
  var QUIET = 2; // quiet-zone modules around the edge
  var debounceTimer = null;

  // Real FNV-1a 32-bit hash, run once per keystroke over the full string,
  // then re-mixed per module coordinate below. Deterministic: same text
  // always yields the same grid; any character change ripples the grid.
  function fnv1a(str) {
    var hash = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 0x01000193) >>> 0;
    }
    return hash >>> 0;
  }

  // Cheap splitmix-style integer mixer, used to derive a per-cell bit from
  // the base hash + cell coordinates without needing Math.random.
  function mix(seed) {
    var x = seed >>> 0;
    x ^= x >>> 16;
    x = Math.imul(x, 0x7feb352d) >>> 0;
    x ^= x >>> 15;
    x = Math.imul(x, 0x846ca68b) >>> 0;
    x ^= x >>> 16;
    return x >>> 0;
  }

  function isFinderZone(r, c) {
    var zones = [
      { r0: 0, c0: 0 },
      { r0: 0, c0: GRID - 7 },
      { r0: GRID - 7, c0: 0 }
    ];
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      if (r >= z.r0 && r < z.r0 + 8 && c >= z.c0 && c < z.c0 + 8) return true;
    }
    return false;
  }

  function finderModule(r, c, r0, c0) {
    var lr = r - r0;
    var lc = c - c0;
    if (lr < 0 || lr > 7 || lc < 0 || lc > 7) return null;
    // 8th row/col around the pattern is the separator (always light)
    if (lr === 7 || lc === 7) return 0;
    // outer ring dark
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return 1;
    // inner ring light
    if (lr === 1 || lr === 5 || lc === 1 || lc === 5) return 0;
    // 3x3 core dark
    return 1;
  }

  function getFinderValue(r, c) {
    var zones = [
      { r0: 0, c0: 0 },
      { r0: 0, c0: GRID - 7 },
      { r0: GRID - 7, c0: 0 }
    ];
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      var v = finderModule(r, c, z.r0, z.c0);
      if (v !== null) return v;
    }
    return null;
  }

  function buildGrid(text) {
    var baseHash = fnv1a(text || ' ');
    var grid = [];
    for (var r = 0; r < GRID; r++) {
      var row = [];
      for (var c = 0; c < GRID; c++) {
        if (isFinderZone(r, c)) {
          row.push(getFinderValue(r, c));
          continue;
        }
        // Timing pattern: alternating modules along row 6 / col 6, real QR-style.
        if (r === 6) {
          row.push(c % 2 === 0 ? 1 : 0);
          continue;
        }
        if (c === 6) {
          row.push(r % 2 === 0 ? 1 : 0);
          continue;
        }
        var cellSeed = (baseHash ^ (r * 0x1f1f1f1 + c * 0x9e3779b1)) >>> 0;
        var bit = mix(cellSeed) & 1;
        row.push(bit);
      }
      grid.push(row);
    }
    return grid;
  }

  function draw(text) {
    var grid = buildGrid(text.trim());
    var totalModules = GRID + QUIET * 2;
    var moduleSize = canvas.width / totalModules;

    ctx.fillStyle = '#f0e6d3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1a1208';

    for (var r = 0; r < GRID; r++) {
      for (var c = 0; c < GRID; c++) {
        if (grid[r][c] === 1) {
          var x = (c + QUIET) * moduleSize;
          var y = (r + QUIET) * moduleSize;
          ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(moduleSize), Math.ceil(moduleSize));
        }
      }
    }
  }

  function scheduleRender() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      draw(textInput.value || ' ');
    }, 180);
  }

  textInput.addEventListener('input', scheduleRender);

  draw(textInput.value);
})();
