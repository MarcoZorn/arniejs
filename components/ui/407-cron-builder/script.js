(function () {
  var minuteSel = document.getElementById('cronMinute');
  var hourSel = document.getElementById('cronHour');
  var domSel = document.getElementById('cronDom');
  var monthSel = document.getElementById('cronMonth');
  var dowSel = document.getElementById('cronDow');
  var exprEl = document.getElementById('cronExpr');
  var readableEl = document.getElementById('cronReadable');

  var MONTH_NAMES = {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April',
    '5': 'May', '6': 'June', '7': 'July', '8': 'August',
    '9': 'September', '10': 'October', '11': 'November', '12': 'December'
  };

  var DOW_NAMES = {
    '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
    '4': 'Thursday', '5': 'Friday', '6': 'Saturday'
  };

  function describeMinuteHour(minute, hour) {
    if (minute === '*' && hour === '*') return 'every minute';

    if (/^\*\/\d+$/.test(minute) && hour === '*') {
      return 'every ' + minute.split('/')[1] + ' minutes';
    }

    if (hour === '*') {
      return 'at minute ' + minute + ' of every hour';
    }

    if (/^\*\/\d+$/.test(hour)) {
      return 'every ' + hour.split('/')[1] + ' hours' + (minute !== '*' ? ' at minute ' + minute : '');
    }

    if (minute === '*') {
      return 'every minute during hour ' + hour;
    }

    var h = parseInt(hour, 10);
    var m = parseInt(minute, 10);
    var period = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    var mm = m < 10 ? '0' + m : String(m);
    return 'at ' + h12 + ':' + mm + ' ' + period;
  }

  function describeDom(dom) {
    if (dom === '*') return '';
    if (dom === 'L') return ' on the last day of the month';
    return ' on day ' + dom + ' of the month';
  }

  function describeMonth(month) {
    if (month === '*') return '';
    return ' in ' + (MONTH_NAMES[month] || month);
  }

  function describeDow(dow) {
    if (dow === '*') return '';
    if (dow === '1-5') return ', Monday through Friday';
    if (dow === '0,6') return ', on weekends';
    var parts = dow.split(',').map(function (d) {
      return DOW_NAMES[d] || d;
    });
    return ', on ' + parts.join(' and ');
  }

  function update() {
    var minute = minuteSel.value;
    var hour = hourSel.value;
    var dom = domSel.value;
    var month = monthSel.value;
    var dow = dowSel.value;

    var expr = [minute, hour, dom, month, dow].join(' ');
    exprEl.textContent = expr;

    var sentence = 'Runs ' + describeMinuteHour(minute, hour) +
      describeDom(dom) +
      describeMonth(month) +
      describeDow(dow) + '.';

    // Capitalize the first letter after "Runs " stays fine; just ensure clean punctuation.
    sentence = sentence.replace(/\s+\./, '.');

    readableEl.textContent = sentence;
  }

  [minuteSel, hourSel, domSel, monthSel, dowSel].forEach(function (el) {
    el.addEventListener('change', update);
  });

  update();
})();
