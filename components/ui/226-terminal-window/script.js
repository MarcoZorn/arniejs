(function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.getElementById('termBody');
  if (!body) return;

  var commands = [
    { cmd: 'ls components/', output: '221-hover-distort  222-kinetic-typography  223-draggable-window' },
    { cmd: 'cat README.md', output: 'ArnieJs — playful interactive UI components.' },
    { cmd: 'npm run build', output: 'Build complete in 412ms.' }
  ];

  if (prefersReducedMotion) {
    var html = '';
    commands.forEach(function (item) {
      html += '<span class="term__line"><span class="term__prompt">$</span> ' + item.cmd + '</span>';
      html += '<span class="term__line term__output">' + item.output + '</span>';
    });
    body.innerHTML = html;
    return;
  }

  var timeoutId = null;

  function typeLine(text, prefix, container, onDone) {
    var line = document.createElement('span');
    line.className = 'term__line';
    var promptSpan = document.createElement('span');
    promptSpan.className = 'term__prompt';
    promptSpan.textContent = prefix;
    line.appendChild(promptSpan);
    line.appendChild(document.createTextNode(' '));
    var textNode = document.createTextNode('');
    line.appendChild(textNode);
    var cursor = document.createElement('span');
    cursor.className = 'term__cursor';
    line.appendChild(cursor);
    container.appendChild(line);

    var i = 0;
    function step() {
      if (i <= text.length) {
        textNode.textContent = text.slice(0, i);
        i += 1;
        timeoutId = setTimeout(step, 28 + Math.random() * 40);
      } else {
        cursor.remove();
        onDone();
      }
    }
    step();
  }

  function runSequence() {
    body.innerHTML = '';
    var index = 0;

    function next() {
      if (index >= commands.length) {
        timeoutId = setTimeout(runSequence, 2200);
        return;
      }
      var item = commands[index];
      index += 1;

      typeLine(item.cmd, '$', body, function () {
        timeoutId = setTimeout(function () {
          var out = document.createElement('span');
          out.className = 'term__line term__output';
          out.textContent = item.output;
          body.appendChild(out);
          timeoutId = setTimeout(next, 500);
        }, 200);
      });
    }

    next();
  }

  runSequence();
})();
