(function () {
  var paragraphsInput = document.getElementById('lrm-paragraphs');
  var wordsInput = document.getElementById('lrm-words');
  var generateBtn = document.getElementById('lrm-generate');
  var output = document.getElementById('lrm-output');
  var copyBtn = document.getElementById('lrm-copy');
  var confirmEl = document.getElementById('lrm-confirm');
  var stepBtns = Array.prototype.slice.call(document.querySelectorAll('.lrm-step'));

  if (!output) return;

  var wordBank = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'sed', 'ut', 'perspiciatis',
    'unde', 'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium',
    'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae',
    'ab', 'illo', 'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae'
  ];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickWord() {
    return wordBank[randomInt(0, wordBank.length - 1)];
  }

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function buildParagraph(wordCount) {
    var words = [];
    var sinceLastPunct = 0;

    for (var i = 0; i < wordCount; i++) {
      var word = pickWord();
      words.push(word);
      sinceLastPunct++;

      var isLast = i === wordCount - 1;
      // Sprinkle commas naturally, avoid stacking punctuation.
      if (!isLast && sinceLastPunct > 4 && Math.random() < 0.18) {
        words[words.length - 1] += ',';
        sinceLastPunct = 0;
      }
    }

    if (words.length === 0) return '';

    // Break the word stream into sentences of varying length.
    var sentences = [];
    var cursor = 0;
    while (cursor < words.length) {
      var sentenceLen = Math.min(words.length - cursor, randomInt(6, 14));
      var chunk = words.slice(cursor, cursor + sentenceLen);
      cursor += sentenceLen;

      var text = chunk.join(' ').replace(/,$/, '');
      text = capitalize(text) + '.';
      sentences.push(text);
    }

    return sentences.join(' ');
  }

  function generate() {
    var paragraphCount = clampValue(paragraphsInput, 1, 20);
    var wordCount = clampValue(wordsInput, 5, 200);

    output.innerHTML = '';
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < paragraphCount; i++) {
      var p = document.createElement('p');
      p.textContent = buildParagraph(wordCount);
      fragment.appendChild(p);
    }

    output.appendChild(fragment);
  }

  function clampValue(input, min, max) {
    var value = parseInt(input.value, 10);
    if (isNaN(value)) value = min;
    value = Math.max(min, Math.min(max, value));
    input.value = value;
    return value;
  }

  stepBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.dataset.target;
      var dir = parseInt(btn.dataset.dir, 10);
      var target = document.getElementById(targetId);
      if (!target) return;
      var min = parseInt(target.min, 10);
      var max = parseInt(target.max, 10);
      var value = parseInt(target.value, 10);
      if (isNaN(value)) value = min;
      value = Math.max(min, Math.min(max, value + dir));
      target.value = value;
      generate();
    });
  });

  generateBtn.addEventListener('click', generate);
  paragraphsInput.addEventListener('change', generate);
  wordsInput.addEventListener('change', generate);

  var confirmTimer = null;
  function showConfirm(text) {
    confirmEl.textContent = text;
    confirmEl.classList.add('lrm-show');
    if (confirmTimer) clearTimeout(confirmTimer);
    confirmTimer = setTimeout(function () {
      confirmEl.classList.remove('lrm-show');
    }, 1800);
  }

  copyBtn.addEventListener('click', function () {
    var paragraphs = Array.prototype.slice.call(output.querySelectorAll('p'));
    var text = paragraphs.map(function (p) { return p.textContent; }).join('\n\n');
    if (!text) return;

    function fallbackCopy() {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showConfirm('Copied!');
      } catch (err) {
        showConfirm('Copy failed');
      }
      document.body.removeChild(textarea);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showConfirm('Copied!');
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  generate();
})();
