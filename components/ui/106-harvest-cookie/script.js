(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var banner = document.getElementById('cookieBanner');
  var showBtn = document.getElementById('showBanner');
  var acceptBtn = document.getElementById('acceptCookies');
  var rejectBtn = document.getElementById('rejectCookies');

  var STORAGE_KEY = 'harvest-cookie-consent';

  function show() {
    banner.classList.add('visible');
  }

  function hide() {
    banner.classList.remove('visible');
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    hide();
  }

  acceptBtn.addEventListener('click', function () { setConsent('accepted'); });
  rejectBtn.addEventListener('click', function () { setConsent('rejected'); });
  showBtn.addEventListener('click', show);

  var existing = null;
  try {
    existing = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}

  if (!existing) {
    setTimeout(show, reduceMotion ? 0 : 400);
  }

  if (reduceMotion) {
    banner.style.transition = 'none';
  }
})();
