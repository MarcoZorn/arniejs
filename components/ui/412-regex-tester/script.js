(function () {
  var patternInput = document.getElementById('rgx-pattern');
  var flagsInput = document.getElementById('rgx-flags');
  var textInput = document.getElementById('rgx-input');
  var errorEl = document.getElementById('rgx-error');
  var countEl = document.getElementById('rgx-count');
  var outputEl = document.getElementById('rgx-output');

  if (!patternInput || !textInput || !outputEl) return;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findMatches(regex, text) {
    var matches = [];

    if (regex.global) {
      var m;
      var lastIndex = -1;
      while ((m = regex.exec(text)) !== null) {
        // Guard against zero-length matches causing an infinite loop.
        if (m.index === lastIndex) {
          regex.lastIndex++;
          continue;
        }
        matches.push({ start: m.index, end: m.index + m[0].length });
        lastIndex = m.index;
        if (m[0].length === 0) {
          regex.lastIndex++;
        }
      }
    } else {
      var single = regex.exec(text);
      if (single) {
        matches.push({ start: single.index, end: single.index + single[0].length });
      }
    }

    return matches;
  }

  function render() {
    var pattern = patternInput.value;
    var flags = flagsInput.value;
    var text = textInput.value;

    errorEl.textContent = '';

    if (!pattern) {
      countEl.textContent = '0 matches';
      countEl.classList.add('rgx-count--zero');
      outputEl.innerHTML = escapeHtml(text);
      return;
    }

    var regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch (err) {
      errorEl.textContent = 'Invalid pattern: ' + err.message;
      countEl.textContent = '0 matches';
      countEl.classList.add('rgx-count--zero');
      outputEl.innerHTML = escapeHtml(text);
      return;
    }

    var matches;
    try {
      matches = findMatches(regex, text);
    } catch (err) {
      errorEl.textContent = 'Error while matching: ' + err.message;
      countEl.textContent = '0 matches';
      countEl.classList.add('rgx-count--zero');
      outputEl.innerHTML = escapeHtml(text);
      return;
    }

    countEl.textContent = matches.length + (matches.length === 1 ? ' match' : ' matches');
    countEl.classList.toggle('rgx-count--zero', matches.length === 0);

    if (matches.length === 0) {
      outputEl.innerHTML = escapeHtml(text);
      return;
    }

    var html = '';
    var cursor = 0;

    matches.forEach(function (match) {
      html += escapeHtml(text.slice(cursor, match.start));
      html += '<mark>' + escapeHtml(text.slice(match.start, match.end)) + '</mark>';
      cursor = match.end;
    });

    html += escapeHtml(text.slice(cursor));
    outputEl.innerHTML = html;
  }

  patternInput.addEventListener('input', render);
  flagsInput.addEventListener('input', render);
  textInput.addEventListener('input', render);

  render();
})();
