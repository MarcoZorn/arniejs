(function () {
  var root = document.querySelector('.ep-wrap');
  if (!root) return;

  var trigger = root.querySelector('.ep-trigger');
  var panel = root.querySelector('.ep-panel');
  var search = root.querySelector('.ep-search');
  var grid = root.querySelector('.ep-grid');
  var empty = root.querySelector('.ep-empty');
  var target = root.querySelector('.ep-target');

  var EMOJI = [
    { char: '🌱', tags: 'seedling sprout plant grow new' },
    { char: '🌿', tags: 'herb plant leaf green' },
    { char: '🍀', tags: 'clover luck plant green' },
    { char: '🌳', tags: 'tree plant nature' },
    { char: '🌻', tags: 'sunflower flower sun plant' },
    { char: '🌼', tags: 'flower blossom plant' },
    { char: '🌸', tags: 'blossom flower cherry plant' },
    { char: '🌺', tags: 'hibiscus flower plant' },
    { char: '🌷', tags: 'tulip flower plant' },
    { char: '🍄', tags: 'mushroom fungus plant' },
    { char: '🍅', tags: 'tomato food harvest' },
    { char: '🥕', tags: 'carrot food harvest vegetable' },
    { char: '🌽', tags: 'corn food harvest' },
    { char: '🍓', tags: 'strawberry fruit food harvest' },
    { char: '🍇', tags: 'grapes fruit food harvest' },
    { char: '🍉', tags: 'watermelon fruit food harvest summer' },
    { char: '☀️', tags: 'sun sunny weather bright' },
    { char: '🌤️', tags: 'sun cloud weather' },
    { char: '🌧️', tags: 'rain weather water' },
    { char: '🌈', tags: 'rainbow weather sky' },
    { char: '💧', tags: 'water drop rain' },
    { char: '🔥', tags: 'fire hot' },
    { char: '❄️', tags: 'snow cold winter' },
    { char: '🐝', tags: 'bee bug insect pollinate' },
    { char: '🐞', tags: 'ladybug bug insect' },
    { char: '🦋', tags: 'butterfly bug insect' },
    { char: '🐌', tags: 'snail bug slow' },
    { char: '🐛', tags: 'caterpillar bug insect' },
    { char: '🕊️', tags: 'dove bird peace' },
    { char: '😀', tags: 'smile happy face grin' },
    { char: '😄', tags: 'smile happy face joy' },
    { char: '😊', tags: 'smile happy face blush' },
    { char: '🥳', tags: 'party happy face celebrate' },
    { char: '😍', tags: 'love face heart eyes' },
    { char: '🤗', tags: 'hug face happy' },
    { char: '👍', tags: 'thumbs up good yes' },
    { char: '🙌', tags: 'hands celebrate praise' },
    { char: '👏', tags: 'clap applause hands' },
    { char: '❤️', tags: 'heart love red' },
    { char: '✨', tags: 'sparkle shine magic' },
    { char: '🎉', tags: 'party celebrate confetti' },
    { char: '🏡', tags: 'home house garden' },
    { char: '🪴', tags: 'plant pot houseplant' },
    { char: '🧑‍🌾', tags: 'farmer person garden' },
    { char: '🧺', tags: 'basket harvest' },
    { char: '🐇', tags: 'rabbit bunny animal' },
    { char: '🐔', tags: 'chicken hen animal farm' },
    { char: '🐄', tags: 'cow animal farm' },
    { char: '🐐', tags: 'goat animal farm' }
  ];

  var highlightedIndex = -1;

  function renderGrid(list) {
    grid.innerHTML = '';
    list.forEach(function (item, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ep-emoji';
      btn.textContent = item.char;
      btn.setAttribute('role', 'option');
      btn.dataset.index = index;
      btn.addEventListener('click', function () {
        insertEmoji(item.char);
      });
      grid.appendChild(btn);
    });
    empty.hidden = list.length !== 0;
    highlightedIndex = list.length ? 0 : -1;
    updateHighlight();
  }

  function updateHighlight() {
    var btns = Array.prototype.slice.call(grid.querySelectorAll('.ep-emoji'));
    btns.forEach(function (btn, i) {
      btn.classList.toggle('is-highlighted', i === highlightedIndex);
    });
  }

  function filterEmoji(query) {
    query = query.trim().toLowerCase();
    if (!query) return EMOJI;
    return EMOJI.filter(function (item) {
      return item.tags.indexOf(query) !== -1;
    });
  }

  function insertEmoji(char) {
    var start = target.selectionStart != null ? target.selectionStart : target.value.length;
    var end = target.selectionEnd != null ? target.selectionEnd : target.value.length;
    var value = target.value;
    target.value = value.slice(0, start) + char + value.slice(end);
    var caret = start + char.length;
    target.focus();
    target.setSelectionRange(caret, caret);
    closePanel();
  }

  function openPanel() {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    search.value = '';
    renderGrid(EMOJI);
    search.focus();
    document.addEventListener('mousedown', onOutsideClick, true);
    document.addEventListener('keydown', onKeydown, true);
  }

  function closePanel() {
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutsideClick, true);
    document.removeEventListener('keydown', onKeydown, true);
  }

  function onOutsideClick(e) {
    if (!panel.contains(e.target) && e.target !== trigger) closePanel();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closePanel();
      trigger.focus();
      return;
    }

    var btns = Array.prototype.slice.call(grid.querySelectorAll('.ep-emoji'));
    if (!btns.length) return;
    var cols = 6;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, btns.length - 1);
      updateHighlight();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      updateHighlight();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + cols, btns.length - 1);
      updateHighlight();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - cols, 0);
      updateHighlight();
    } else if (e.key === 'Enter') {
      if (document.activeElement === search) {
        e.preventDefault();
        if (btns[highlightedIndex]) btns[highlightedIndex].click();
      }
    }
  }

  trigger.addEventListener('click', function () {
    if (panel.hidden) openPanel(); else closePanel();
  });

  search.addEventListener('input', function () {
    renderGrid(filterEmoji(search.value));
  });

  renderGrid(EMOJI);
})();
