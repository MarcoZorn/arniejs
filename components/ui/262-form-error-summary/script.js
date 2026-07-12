(function () {
  var wrap = document.querySelector('.plot-wrap');
  if (!wrap) return;

  var form = wrap.querySelector('.plot-form');
  var summary = wrap.querySelector('.plot-summary');
  var summaryList = wrap.querySelector('.plot-summary-list');
  var success = wrap.querySelector('.plot-success');

  var FIELDS = [
    {
      name: 'name',
      label: 'Full name',
      validate: function (el) {
        if (!el.value.trim()) return 'Enter your full name.';
        if (el.value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    {
      name: 'email',
      label: 'Email address',
      validate: function (el) {
        var v = el.value.trim();
        if (!v) return 'Enter your email address.';
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(v)) return 'Enter a valid email address.';
        return '';
      }
    },
    {
      name: 'topic',
      label: 'Topic',
      validate: function (el) {
        if (!el.value) return 'Choose a topic.';
        return '';
      }
    },
    {
      name: 'message',
      label: 'Message',
      validate: function (el) {
        var v = el.value.trim();
        if (!v) return 'Enter a message.';
        if (v.length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    }
  ];

  function getField(name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function getFieldWrap(el) {
    return el.closest('.plot-field');
  }

  function validateOne(fieldDef) {
    var el = getField(fieldDef.name);
    var msg = fieldDef.validate(el);
    var errorEl = document.getElementById('plot-' + fieldDef.name + '-error');
    var fieldWrap = getFieldWrap(el);

    if (msg) {
      fieldWrap.classList.add('is-invalid');
      errorEl.textContent = msg;
    } else {
      fieldWrap.classList.remove('is-invalid');
      errorEl.textContent = '';
    }
    return msg;
  }

  function renderSummary(errors) {
    summaryList.innerHTML = '';

    if (errors.length === 0) {
      summary.hidden = true;
      return;
    }

    errors.forEach(function (err) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#plot-' + err.name;
      a.textContent = err.label + ': ' + err.message;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        focusField(err.name);
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    });

    summary.hidden = false;
    summary.focus();
  }

  function focusField(name) {
    var el = getField(name);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    el.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    success.hidden = true;

    var errors = [];
    FIELDS.forEach(function (fieldDef) {
      var msg = validateOne(fieldDef);
      if (msg) errors.push({ name: fieldDef.name, label: fieldDef.label, message: msg });
    });

    if (errors.length > 0) {
      renderSummary(errors);
    } else {
      summary.hidden = true;
      success.hidden = false;
      form.reset();
      FIELDS.forEach(function (fieldDef) {
        getFieldWrap(getField(fieldDef.name)).classList.remove('is-invalid');
        document.getElementById('plot-' + fieldDef.name + '-error').textContent = '';
      });
    }
  });

  // Re-validate individual fields as the user fixes them, and refresh the
  // summary list so a corrected field's entry disappears without a resubmit.
  FIELDS.forEach(function (fieldDef) {
    var el = getField(fieldDef.name);
    var evt = (el.tagName === 'SELECT') ? 'change' : 'input';
    el.addEventListener(evt, function () {
      if (!getFieldWrap(el).classList.contains('is-invalid') && summary.hidden) return;
      validateOne(fieldDef);

      if (!summary.hidden) {
        var remaining = [];
        FIELDS.forEach(function (fd) {
          var fEl = getField(fd.name);
          var msg = fd.validate(fEl);
          if (msg) remaining.push({ name: fd.name, label: fd.label, message: msg });
        });
        renderSummaryQuiet(remaining);
      }
    });
  });

  function renderSummaryQuiet(errors) {
    summaryList.innerHTML = '';
    if (errors.length === 0) {
      summary.hidden = true;
      return;
    }
    errors.forEach(function (err) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#plot-' + err.name;
      a.textContent = err.label + ': ' + err.message;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        focusField(err.name);
      });
      li.appendChild(a);
      summaryList.appendChild(li);
    });
  }
})();
