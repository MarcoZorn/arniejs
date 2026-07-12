(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var menuBtn = document.getElementById('shellMenuBtn');
  var sidebar = document.getElementById('shellSidebar');
  var overlay = document.getElementById('shellOverlay');
  if (!menuBtn || !sidebar || !overlay) return;

  var mobileQuery = window.matchMedia('(max-width: 820px)');
  var isOpen = false;

  function openSidebar() {
    isOpen = true;
    sidebar.classList.add('is-open');
    overlay.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKeydown);
    var firstLink = sidebar.querySelector('.shell-nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeSidebar(returnFocus) {
    isOpen = false;
    sidebar.classList.remove('is-open');
    overlay.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    if (returnFocus) menuBtn.focus();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closeSidebar(true);
    }
  }

  menuBtn.addEventListener('click', function () {
    if (isOpen) {
      closeSidebar(true);
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', function () {
    closeSidebar(true);
  });

  sidebar.querySelectorAll('.shell-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileQuery.matches) closeSidebar(false);
    });
  });

  function handleViewportChange() {
    if (!mobileQuery.matches && isOpen) {
      closeSidebar(false);
    }
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', handleViewportChange);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(handleViewportChange);
  }
})();
