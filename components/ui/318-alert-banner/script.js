(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var banners = Array.prototype.slice.call(document.querySelectorAll('[data-banner]'));
  var restoreBtns = Array.prototype.slice.call(document.querySelectorAll('[data-restore]'));

  if (!banners.length) return;

  function syncRestoreButtons() {
    restoreBtns.forEach(function (btn) {
      var variant = btn.getAttribute('data-restore');
      var banner = document.querySelector('[data-banner="' + variant + '"]');
      var visible = banner && !banner.classList.contains('is-hidden');
      btn.disabled = !!visible;
    });
  }

  banners.forEach(function (banner) {
    var closeBtn = banner.querySelector('[data-dismiss]');
    if (!closeBtn) return;

    closeBtn.addEventListener('click', function () {
      dismiss(banner);
    });
  });

  function dismiss(banner) {
    banner.classList.add('is-hidden');
    syncRestoreButtons();
  }

  function restore(variant) {
    var banner = document.querySelector('[data-banner="' + variant + '"]');
    if (!banner) return;
    banner.classList.remove('is-hidden');
    syncRestoreButtons();
  }

  restoreBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      restore(btn.getAttribute('data-restore'));
    });
  });

  syncRestoreButtons();
})();
