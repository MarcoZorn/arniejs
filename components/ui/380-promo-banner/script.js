(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STORAGE_KEY = 'arniejs-promo-banner-dismissed';

  var banner = document.getElementById('promo-banner');
  var closeBtn = banner ? banner.querySelector('.promo-close') : null;
  var cta = banner ? banner.querySelector('[data-role="cta"]') : null;
  var reopenBtn = document.querySelector('.promo-reopen');

  if (!banner) return;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* localStorage unavailable — dismissal just won't persist */
    }
  }

  function storageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      /* ignore */
    }
  }

  function hideBanner() {
    banner.hidden = true;
    if (reopenBtn) reopenBtn.hidden = false;
  }

  function showBanner() {
    banner.hidden = false;
    if (reopenBtn) reopenBtn.hidden = true;
  }

  // Respect a prior dismissal recorded in localStorage.
  if (storageGet(STORAGE_KEY) === 'true') {
    hideBanner();
  } else if (reopenBtn) {
    reopenBtn.hidden = true;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      storageSet(STORAGE_KEY, 'true');

      if (reduceMotion) {
        hideBanner();
        return;
      }

      var anim = banner.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-100%)' }
        ],
        { duration: 220, easing: 'ease-in' }
      );
      anim.onfinish = hideBanner;
    });
  }

  if (cta) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      cta.textContent = 'Offer claimed';
    });
  }

  // Demo affordance: clears the stored dismissal so the banner can return.
  if (reopenBtn) {
    reopenBtn.addEventListener('click', function () {
      storageRemove(STORAGE_KEY);
      showBanner();
    });
  }
})();
