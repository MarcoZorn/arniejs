(function () {
  var input = document.getElementById('mdInput');
  var preview = document.getElementById('mdPreview');

  var DEFAULT_TEXT = [
    "# Grove Docs",
    "",
    "A **lightweight** markdown preview built with *no external library*.",
    "",
    "## Features",
    "",
    "- Headers (`#`, `##`, `###`)",
    "- **Bold** and *italic* text",
    "- [Links](https://example.com)",
    "- Unordered lists",
    "",
    "### Try it",
    "",
    "Edit this text and watch the preview update in real time."
  ].join('\n');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderInline(text) {
    var html = escapeHtml(text);

    // inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // links [label](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
      var safeUrl = /^https?:\/\//.test(url) ? url : '#';
      return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });

    // bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // italic *text*
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return html;
  }

  function renderMarkdown(source) {
    var lines = source.split('\n');
    var htmlParts = [];
    var listBuffer = [];

    function flushList() {
      if (listBuffer.length) {
        htmlParts.push('<ul>' + listBuffer.map(function (item) {
          return '<li>' + renderInline(item) + '</li>';
        }).join('') + '</ul>');
        listBuffer = [];
      }
    }

    lines.forEach(function (rawLine) {
      var line = rawLine;

      var headerMatch = line.match(/^(#{1,3})\s+(.*)$/);
      var listMatch = line.match(/^[-*]\s+(.*)$/);

      if (headerMatch) {
        flushList();
        var level = headerMatch[1].length;
        htmlParts.push('<h' + level + '>' + renderInline(headerMatch[2]) + '</h' + level + '>');
      } else if (listMatch) {
        listBuffer.push(listMatch[1]);
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        htmlParts.push('<p>' + renderInline(line) + '</p>');
      }
    });

    flushList();
    return htmlParts.join('\n');
  }

  function update() {
    preview.innerHTML = renderMarkdown(input.value);
  }

  input.value = DEFAULT_TEXT;
  input.addEventListener('input', update);
  update();
})();
