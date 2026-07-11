(function () {
  var STORAGE_KEY = 'arnie-cookie-consent';

  var bar = document.getElementById('cookieBar');
  var settingsPanel = document.getElementById('cookieSettings');
  var settingsBtn = document.getElementById('settingsBtn');
  var acceptBtn = document.getElementById('acceptBtn');
  var declineBtn = document.getElementById('declineBtn');
  var saveBtn = document.getElementById('saveBtn');
  var resetBtn = document.getElementById('resetBtn');
  var consentValue = document.getElementById('consentValue');
  var prefAnalytics = document.getElementById('prefAnalytics');
  var prefMarketing = document.getElementById('prefMarketing');

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable, ignore */
    }
    renderStoredValue();
  }

  function renderStoredValue() {
    var stored = readConsent();
    if (!stored) {
      consentValue.textContent = 'none';
      return;
    }
    consentValue.textContent = stored.status +
      (stored.status === 'custom' ? ' (analytics: ' + stored.analytics + ', marketing: ' + stored.marketing + ')' : '');
  }

  function hideBar() {
    bar.classList.add('is-hidden');
  }

  function showBar() {
    bar.classList.remove('is-hidden');
  }

  acceptBtn.addEventListener('click', function () {
    writeConsent({ status: 'accepted', analytics: true, marketing: true, ts: Date.now() });
    hideBar();
  });

  declineBtn.addEventListener('click', function () {
    writeConsent({ status: 'declined', analytics: false, marketing: false, ts: Date.now() });
    hideBar();
  });

  settingsBtn.addEventListener('click', function () {
    var isOpen = !settingsPanel.hidden;
    settingsPanel.hidden = isOpen;
    saveBtn.hidden = isOpen;
    acceptBtn.hidden = !isOpen ? false : true;
    settingsBtn.textContent = isOpen ? 'Settings' : 'Hide settings';
  });

  saveBtn.addEventListener('click', function () {
    writeConsent({
      status: 'custom',
      analytics: prefAnalytics.checked,
      marketing: prefMarketing.checked,
      ts: Date.now()
    });
    hideBar();
  });

  resetBtn.addEventListener('click', function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    renderStoredValue();
    settingsPanel.hidden = true;
    saveBtn.hidden = true;
    acceptBtn.hidden = false;
    settingsBtn.textContent = 'Settings';
    showBar();
  });

  // Init: only show bar if no prior consent recorded.
  var existing = readConsent();
  renderStoredValue();
  if (existing) {
    hideBar();
  }
})();
