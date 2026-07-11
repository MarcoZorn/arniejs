(function () {
  var bar = document.getElementById('shareBar');
  var nativeBtn = document.getElementById('nativeShareBtn');
  var copyBtn = document.getElementById('copyLinkBtn');
  var copyLabel = document.getElementById('copyLinkLabel');
  var toast = document.getElementById('shareToast');
  var toastTimer = null;

  if (!bar) return;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-shown');
    }, 2200);
  }

  function updateVisibility() {
    var scrolled = window.scrollY || document.documentElement.scrollTop;
    var shouldShow = scrolled > 220;
    bar.classList.toggle('is-visible', shouldShow);
    bar.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();

  var shareData = {
    title: document.title || 'Composting for Small Urban Gardens',
    text: 'Composting for Small Urban Gardens — a field guide',
    url: window.location.href
  };

  nativeBtn.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share(shareData).catch(function () {
        /* user cancelled or share failed silently */
      });
    } else {
      copyToClipboard(shareData.url, 'Link copied — share away');
    }
  });

  copyBtn.addEventListener('click', function () {
    copyToClipboard(shareData.url, 'Link copied to clipboard');
  });

  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        onCopySuccess(successMessage);
      }).catch(function () {
        fallbackCopy(text, successMessage);
      });
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    var input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      onCopySuccess(successMessage);
    } catch (err) {
      showToast('Copy failed — select link manually');
    }
    document.body.removeChild(input);
  }

  function onCopySuccess(successMessage) {
    showToast(successMessage);
    var original = copyLabel.textContent;
    copyLabel.textContent = 'Copied!';
    setTimeout(function () {
      copyLabel.textContent = original;
    }, 2000);
  }
})();
