(function () {
  var sendBtn = document.getElementById('arvSend');
  var resultEl = document.getElementById('arvResult');

  var scenarios = [
    {
      status: 200,
      body: {
        id: 'harv_8841',
        crop: 'heirloom-tomato',
        weight_kg: 42.7,
        organic: true,
        harvestedAt: '2026-07-09T08:14:00Z',
        notes: null
      }
    },
    {
      status: 201,
      body: {
        id: 'plot_1092',
        name: 'north terrace',
        created: true,
        area_sqm: 18,
        tags: ['shade', 'clay-soil']
      }
    },
    {
      status: 404,
      body: {
        error: 'not_found',
        message: 'No plot matches the given id.',
        requestId: 'req_5f2a91'
      }
    },
    {
      status: 500,
      body: {
        error: 'internal_error',
        message: 'The irrigation service did not respond in time.',
        retryable: true
      }
    }
  ];

  function statusClass(status) {
    if (status >= 500) return 'arv-status--5xx';
    if (status >= 400) return 'arv-status--4xx';
    return 'arv-status--2xx';
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (ch) {
      return ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : '&gt;';
    });
  }

  function highlightJson(json) {
    var escaped = escapeHtml(json);
    return escaped.replace(
      /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      function (match) {
        if (/^"/.test(match)) {
          var cls = /:$/.test(match) ? 'tok-key' : 'tok-string';
          return '<span class="' + cls + '">' + match + '</span>';
        }
        if (/true|false/.test(match)) {
          return '<span class="tok-bool">' + match + '</span>';
        }
        if (/null/.test(match)) {
          return '<span class="tok-null">' + match + '</span>';
        }
        return '<span class="tok-number">' + match + '</span>';
      }
    );
  }

  function send() {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    resultEl.innerHTML = '<p class="arv-loading">Waiting for response…</p>';

    var delay = 400 + Math.random() * 700;

    window.setTimeout(function () {
      var scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      var latency = Math.round(delay);
      var pretty = JSON.stringify(scenario.body, null, 2);

      resultEl.innerHTML =
        '<div class="arv-meta">' +
          '<span class="arv-status ' + statusClass(scenario.status) + '">' + scenario.status + '</span>' +
          '<span class="arv-latency">' + latency + 'ms</span>' +
        '</div>' +
        '<pre class="arv-body">' + highlightJson(pretty) + '</pre>';

      sendBtn.disabled = false;
      sendBtn.textContent = 'Send request';
    }, delay);
  }

  sendBtn.addEventListener('click', send);
})();
