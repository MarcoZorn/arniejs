(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var openAbtn = document.getElementById('openA');
  var openBbtn = document.getElementById('openB');
  var overlayA = document.getElementById('overlayA');
  var overlayB = document.getElementById('overlayB');
  var modalA = document.getElementById('modalA');
  var modalB = document.getElementById('modalB');

  if (!openAbtn || !overlayA || !overlayB) return;

  // Stack of currently-open modals, topmost last.
  var stack = [];
  var lastFocused = null;

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    );
  }

  function trapTab(e, container) {
    if (e.key !== 'Tab') return;
    var focusable = getFocusable(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openModal(overlay, modal, triggerEl) {
    if (stack.length === 0) {
      lastFocused = triggerEl || document.activeElement;
    }

    overlay.hidden = false;
    // Force reflow so the transition runs.
    void overlay.offsetWidth;
    overlay.classList.add('is-open');

    var entry = { overlay: overlay, modal: modal, trigger: triggerEl };
    stack.push(entry);

    window.setTimeout(function () {
      modal.focus();
    }, reduceMotion ? 0 : 60);

    modal.addEventListener('keydown', entry.tabHandler = function (e) {
      trapTab(e, modal);
    });
  }

  function closeTop() {
    if (!stack.length) return;
    var entry = stack[stack.length - 1];

    entry.overlay.classList.remove('is-open');
    entry.modal.removeEventListener('keydown', entry.tabHandler);

    var finish = function () {
      entry.overlay.hidden = true;
    };

    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 220);
    }

    stack.pop();

    // Restore focus: to the entry's trigger, or if stack still has items,
    // focus back into the modal now on top.
    if (stack.length) {
      var top = stack[stack.length - 1];
      window.setTimeout(function () {
        top.modal.focus();
      }, reduceMotion ? 0 : 220);
    } else if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  function closeByLetter(letter) {
    // Close a specific modal if it happens to be on the stack (used by
    // explicit close buttons), removing it wherever it is in the stack —
    // but in practice only the top one should ever be closable via UI
    // since B always opens on top of A.
    if (!stack.length) return;
    var top = stack[stack.length - 1];
    if ((letter === 'A' && top.modal === modalA) || (letter === 'B' && top.modal === modalB)) {
      closeTop();
    }
  }

  openAbtn.addEventListener('click', function () {
    openModal(overlayA, modalA, openAbtn);
  });

  if (openBbtn) {
    openBbtn.addEventListener('click', function () {
      openModal(overlayB, modalB, openBbtn);
    });
  }

  // Close buttons (footer + X) — each closes only its own modal, and only
  // acts if that modal is actually the topmost (it always will be in this UI).
  document.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeByLetter(btn.getAttribute('data-close'));
    });
  });

  // Click-outside: clicking the dimmed backdrop (not the modal card itself)
  // closes only that overlay's modal, and only if it is the topmost.
  overlayA.addEventListener('mousedown', function (e) {
    if (e.target === overlayA) closeByLetter('A');
  });
  overlayB.addEventListener('mousedown', function (e) {
    if (e.target === overlayB) closeByLetter('B');
  });

  // Escape closes only the topmost modal in the stack.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && stack.length) {
      e.preventDefault();
      closeTop();
    }
  });
})();
