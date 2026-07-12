(function () {
  var input = document.getElementById('mdeInput');
  var preview = document.getElementById('mdePreview');

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function inlineFormat(escapedText) {
    // Links first: [text](url) — url has already been escaped, so quotes are &quot;.
    var html = escapedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, text, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
    });

    // Bold: **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* (single asterisks, after bold has consumed double ones)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    return html;
  }

  function renderMarkdown(raw) {
    var escaped = escapeHtml(raw);
    var lines = escaped.split(/\r?\n/);
    var htmlParts = [];
    var inList = false;
    var paragraphBuffer = [];

    function flushParagraph() {
      if (paragraphBuffer.length) {
        htmlParts.push('<p>' + inlineFormat(paragraphBuffer.join(' ')) + '</p>');
        paragraphBuffer = [];
      }
    }

    function closeList() {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
    }

    lines.forEach(function (line) {
      var trimmed = line.trim();

      if (trimmed === '') {
        flushParagraph();
        closeList();
        return;
      }

      var h3 = trimmed.match(/^### (.+)/);
      var h2 = trimmed.match(/^## (.+)/);
      var h1 = trimmed.match(/^# (.+)/);
      var li = trimmed.match(/^- (.+)/);

      if (h3) {
        flushParagraph();
        closeList();
        htmlParts.push('<h3>' + inlineFormat(h3[1]) + '</h3>');
      } else if (h2) {
        flushParagraph();
        closeList();
        htmlParts.push('<h2>' + inlineFormat(h2[1]) + '</h2>');
      } else if (h1) {
        flushParagraph();
        closeList();
        htmlParts.push('<h1>' + inlineFormat(h1[1]) + '</h1>');
      } else if (li) {
        flushParagraph();
        if (!inList) {
          htmlParts.push('<ul>');
          inList = true;
        }
        htmlParts.push('<li>' + inlineFormat(li[1]) + '</li>');
      } else {
        closeList();
        paragraphBuffer.push(trimmed);
      }
    });

    flushParagraph();
    closeList();

    return htmlParts.join('\n');
  }

  function update() {
    preview.innerHTML = renderMarkdown(input.value);
  }

  input.addEventListener('input', update);

  update();
})();
