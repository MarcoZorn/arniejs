(function () {
  var content = document.getElementById('articleContent');
  var readingText = document.getElementById('readingText');
  var readingBadge = document.getElementById('readingBadge');
  var wordCountEl = document.getElementById('wordCount');
  var addBtn = document.getElementById('addParagraph');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var WORDS_PER_MINUTE = 200;

  var extraParagraphs = [
    'Worm castings, a byproduct of vermicomposting, add an extra boost of microbial life to any bed they touch, and a small worm bin can live happily under a kitchen counter.',
    'Mulching on top of finished compost locks in moisture and suppresses weeds, letting the nutrients work their way down slowly with every watering.',
    'Rotating what you compost with the seasons — more leaves in autumn, more clippings in summer — keeps the greens-to-browns balance easy to maintain year round.'
  ];
  var addIndex = 0;

  function countWords(text) {
    var trimmed = text.trim();
    if (!trimmed) {
      return 0;
    }
    var matches = trimmed.match(/\S+/g);
    return matches ? matches.length : 0;
  }

  function updateReadingTime() {
    var text = content.textContent || '';
    var words = countWords(text);
    var minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));

    readingText.textContent = minutes + ' min read';
    wordCountEl.textContent = words.toLocaleString() + ' words';

    if (!reduceMotion) {
      readingBadge.classList.remove('pulse');
      // force reflow to restart animation
      void readingBadge.offsetWidth;
      readingBadge.classList.add('pulse');
    }
  }

  addBtn.addEventListener('click', function () {
    var p = document.createElement('p');
    p.textContent = extraParagraphs[addIndex % extraParagraphs.length];
    addIndex += 1;
    content.appendChild(p);
    updateReadingTime();
  });

  var observer = new MutationObserver(function () {
    updateReadingTime();
  });
  observer.observe(content, { childList: true, characterData: true, subtree: true });

  updateReadingTime();
})();
