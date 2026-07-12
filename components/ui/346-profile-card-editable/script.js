(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var card = document.querySelector('.pce-card');
  if (!card) return;

  var viewEl = card.querySelector('[data-view]');
  var editEl = card.querySelector('[data-edit]');
  var editOnlyEls = Array.prototype.slice.call(card.querySelectorAll('[data-edit-only]'));
  var statusEl = card.querySelector('[data-status]');
  var counterEl = card.querySelector('[data-counter]');

  var nameField = viewEl.querySelector('[data-field="name"]');
  var titleField = viewEl.querySelector('[data-field="title"]');
  var bioField = viewEl.querySelector('[data-field="bio"]');

  var nameInput = editEl.querySelector('#pce-name-input');
  var titleInput = editEl.querySelector('#pce-title-input');
  var bioInput = editEl.querySelector('#pce-bio-input');

  var editBtn = card.querySelector('[data-action="edit"]');
  var saveBtn = card.querySelector('[data-action="save"]');
  var cancelBtn = card.querySelector('[data-action="cancel"]');

  var bioMax = parseInt(bioInput.getAttribute('maxlength'), 10) || 220;

  var statusTimer = null;
  function setStatus(msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    window.clearTimeout(statusTimer);
    if (msg) {
      statusTimer = window.setTimeout(function () {
        statusEl.textContent = '';
      }, 3000);
    }
  }

  function currentValues() {
    return {
      name: nameField.textContent.trim(),
      title: titleField.textContent.trim(),
      bio: bioField.textContent.trim()
    };
  }

  function fillInputsFromView() {
    var v = currentValues();
    nameInput.value = v.name;
    titleInput.value = v.title;
    bioInput.value = v.bio;
    updateCounter();
  }

  function updateCounter() {
    if (!counterEl) return;
    var left = bioMax - bioInput.value.length;
    counterEl.textContent = Math.max(left, 0) + ' characters left';
  }

  function enterEditMode() {
    fillInputsFromView();
    viewEl.hidden = true;
    editEl.hidden = false;
    editOnlyEls.forEach(function (el) { el.hidden = false; });
    editBtn.hidden = true;
    nameInput.focus();
    setStatus('');
  }

  function exitEditMode() {
    viewEl.hidden = false;
    editEl.hidden = true;
    editOnlyEls.forEach(function (el) { el.hidden = true; });
    editBtn.hidden = false;
  }

  editBtn.addEventListener('click', enterEditMode);

  cancelBtn.addEventListener('click', function () {
    exitEditMode();
    setStatus('Edit discarded');
  });

  saveBtn.addEventListener('click', function () {
    var name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      setStatus('Name can\'t be empty');
      return;
    }
    nameField.textContent = name;
    titleField.textContent = titleInput.value.trim();
    bioField.textContent = bioInput.value.trim() || 'No bio yet.';

    exitEditMode();
    setStatus('Profile updated');

    if (!reduceMotion) {
      card.animate(
        [
          { boxShadow: '0 20px 50px rgba(0,0,0,0.35)' },
          { boxShadow: '0 20px 50px rgba(90,122,58,0.35)' },
          { boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }
        ],
        { duration: 500, easing: 'ease-out' }
      );
    }
  });

  bioInput.addEventListener('input', updateCounter);

  editEl.addEventListener('submit', function (e) {
    e.preventDefault();
    saveBtn.click();
  });

  var avatarBtn = card.querySelector('.pce-avatar-btn');
  var avatarInitials = card.querySelector('.pce-avatar-initials');
  var placeholders = ['RM', 'GT', 'JK', 'SV'];
  var placeholderIndex = 0;
  if (avatarBtn) {
    avatarBtn.addEventListener('click', function () {
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
      avatarInitials.textContent = placeholders[placeholderIndex];
      setStatus('Placeholder photo swapped');
    });
  }
})();
