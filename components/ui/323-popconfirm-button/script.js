(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trigger = document.querySelector('.pop-trigger');
  var card = document.querySelector('.pop-card');
  var item = document.querySelector('.pop-item');
  var status = document.querySelector('.pop-status');

  if (!trigger || !card) return;

  var isOpen = false;

  function open() {
    if (isOpen) return;
    isOpen = true;
    card.hidden = false;
    void card.offsetWidth;
    card.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKeydown);

    var yesBtn = card.querySelector('[data-answer="yes"]');
    window.setTimeout(function () {
      if (yesBtn) yesBtn.focus();
    }, reduceMotion ? 0 : 60);
  }

  function close(restoreFocus) {
    if (!isOpen) return;
    isOpen = false;
    card.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');

    var finish = function () {
      card.hidden = true;
    };
    if (reduceMotion) {
      finish();
    } else {
      window.setTimeout(finish, 150);
    }

    document.removeEventListener('mousedown', onOutside);
    document.removeEventListener('keydown', onKeydown);

    if (restoreFocus !== false) trigger.focus();
  }

  function onOutside(e) {
    if (!card.contains(e.target) && e.target !== trigger) {
      close();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  trigger.addEventListener('click', function () {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  card.querySelectorAll('[data-answer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = btn.getAttribute('data-answer');
      if (answer === 'yes') {
        var name = item ? item.getAttribute('data-item') : 'Item';
        if (item) item.classList.add('is-removed');
        if (status) status.textContent = name + ' removed from the plot.';
        close(false);
        if (item) {
          window.setTimeout(function () {
            item.style.display = 'none';
          }, reduceMotion ? 0 : 250);
        }
      } else {
        close();
      }
    });
  });
})();
