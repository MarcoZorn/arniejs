(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var root = document.querySelector('.tp-wrap');
  if (!root) return;

  var trigger = root.querySelector('.tp-trigger');
  var triggerValue = root.querySelector('.tp-trigger-value');
  var panel = root.querySelector('.tp-panel');
  var hint = root.querySelector('.tp-hint');
  var doneBtn = root.querySelector('.tp-done');
  var meridiemBtns = Array.prototype.slice.call(root.querySelectorAll('.tp-meridiem-btn'));

  var state = { hour: 6, minute: 0, meridiem: 'AM' };

  var hourList = root.querySelector('[data-list="hour"]');
  var minuteList = root.querySelector('[data-list="minute"]');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function buildList(listEl, values, formatter, key) {
    listEl.innerHTML = '';
    values.forEach(function (val) {
      var opt = document.createElement('div');
      opt.className = 'tp-option';
      opt.setAttribute('role', 'option');
      opt.dataset.value = val;
      opt.textContent = formatter(val);
      opt.addEventListener('click', function () {
        selectValue(key, val);
      });
      listEl.appendChild(opt);
    });
  }

  var hours = [];
  for (var h = 1; h <= 12; h++) hours.push(h);
  var minutes = [];
  for (var m = 0; m < 60; m += 5) minutes.push(m);

  buildList(hourList, hours, function (v) { return pad(v); }, 'hour');
  buildList(minuteList, minutes, function (v) { return pad(v); }, 'minute');

  function refreshSelection() {
    [{ list: hourList, key: 'hour' }, { list: minuteList, key: 'minute' }].forEach(function (entry) {
      var opts = Array.prototype.slice.call(entry.list.querySelectorAll('.tp-option'));
      opts.forEach(function (opt) {
        var isSelected = Number(opt.dataset.value) === state[entry.key];
        opt.classList.toggle('is-selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    });
    meridiemBtns.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.meridiem === state.meridiem);
    });
    triggerValue.textContent = pad(state.hour) + ':' + pad(state.minute) + ' ' + state.meridiem;
    hint.textContent = 'Selected: ' + pad(state.hour) + ':' + pad(state.minute) + ' ' + state.meridiem;
  }

  function selectValue(key, val) {
    state[key] = val;
    refreshSelection();
  }

  meridiemBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectValue('meridiem', btn.dataset.meridiem);
    });
  });

  function scrollToSelected(listEl, key) {
    var selected = listEl.querySelector('.tp-option.is-selected');
    if (!selected) return;
    var target = selected.offsetTop - (listEl.clientHeight / 2) + (selected.clientHeight / 2);
    if (reduceMotion) {
      listEl.scrollTop = target;
    } else {
      listEl.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  function openPanel() {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    scrollToSelected(hourList, 'hour');
    scrollToSelected(minuteList, 'minute');
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
    if (!root.contains(e.target)) closePanel();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      closePanel();
      trigger.focus();
      return;
    }

    var activeList = null;
    var key = null;
    if (document.activeElement === hourList) { activeList = hourList; key = 'hour'; }
    if (document.activeElement === minuteList) { activeList = minuteList; key = 'minute'; }
    if (!activeList) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var values = key === 'hour' ? hours : minutes;
      var idx = values.indexOf(state[key]);
      if (idx === -1) idx = 0;
      idx = e.key === 'ArrowDown' ? Math.min(idx + 1, values.length - 1) : Math.max(idx - 1, 0);
      selectValue(key, values[idx]);
      scrollToSelected(activeList, key);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closePanel();
      trigger.focus();
    }
  }

  trigger.addEventListener('click', function () {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  doneBtn.addEventListener('click', function () {
    closePanel();
    trigger.focus();
  });

  refreshSelection();
})();
