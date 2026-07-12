(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var banner = document.getElementById('consent-banner');
  var customizeBtn = document.getElementById('consent-customize-btn');
  var prefs = document.getElementById('consent-prefs');
  var acceptBtn = document.getElementById('consent-accept-btn');
  var rejectBtn = document.getElementById('consent-reject-btn');
  var saveBtn = document.getElementById('consent-save-btn');
  var analyticsToggle = document.getElementById('consent-analytics-toggle');
  var marketingToggle = document.getElementById('consent-marketing-toggle');
  var status = document.getElementById('consent-status');
  if (!banner || !customizeBtn || !prefs) return;

  var STORAGE_KEY = 'arniejs-consent-demo';

  var state = {
    necessary: true,
    analytics: false,
    marketing: false
  };

  function applyStateToToggles() {
    analyticsToggle.checked = state.analytics;
    marketingToggle.checked = state.marketing;
  }

  function log(message) {
    // Real state changes are reflected here (and visible in devtools console)
    // in place of a real analytics/consent-management backend call.
    window.console && window.console.log('[consent]', message, state);
  }

  function setStatus(message) {
    if (status) status.textContent = message;
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* storage unavailable — ignore, demo still works in-memory */
    }
  }

  function dismissBanner() {
    if (reduceMotion) {
      banner.style.display = 'none';
      return;
    }
    banner.classList.add('is-dismissed');
    banner.addEventListener('animationend', function () {
      banner.style.display = 'none';
    }, { once: true });
  }

  function togglePrefs(open) {
    prefs.hidden = !open;
    customizeBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      applyStateToToggles();
      window.setTimeout(function () {
        analyticsToggle.focus();
      }, reduceMotion ? 0 : 30);
    }
  }

  customizeBtn.addEventListener('click', function () {
    var isOpen = !prefs.hidden;
    togglePrefs(!isOpen);
  });

  banner.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !prefs.hidden) {
      togglePrefs(false);
      customizeBtn.focus();
    }
  });

  acceptBtn.addEventListener('click', function () {
    state.analytics = true;
    state.marketing = true;
    applyStateToToggles();
    persist();
    log('accepted all cookies');
    setStatus('All cookies accepted.');
    dismissBanner();
  });

  rejectBtn.addEventListener('click', function () {
    state.analytics = false;
    state.marketing = false;
    applyStateToToggles();
    persist();
    log('rejected non-essential cookies');
    setStatus('Only necessary cookies kept.');
    dismissBanner();
  });

  saveBtn.addEventListener('click', function () {
    state.analytics = analyticsToggle.checked;
    state.marketing = marketingToggle.checked;
    persist();
    log('saved custom preferences');

    var parts = [];
    if (state.analytics) parts.push('Analytics');
    if (state.marketing) parts.push('Marketing');
    setStatus(parts.length
      ? 'Preferences saved — ' + parts.join(' and ') + ' enabled.'
      : 'Preferences saved — only necessary cookies enabled.');

    window.setTimeout(dismissBanner, reduceMotion ? 200 : 1100);
  });
})();
