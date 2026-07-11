(function () {
  var card = document.getElementById('card');
  var toggleBtn = document.getElementById('toggle-state');
  if (!card || !toggleBtn) return;

  var loaded = false;

  function render() {
    card.classList.toggle('is-loaded', loaded);

    var loadedEls = card.querySelectorAll('.loaded-img, .loaded-text, .loaded-tag');
    loadedEls.forEach(function (el) {
      if (loaded) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });

    toggleBtn.textContent = loaded ? 'Show Skeleton' : 'Show Loaded State';
  }

  toggleBtn.addEventListener('click', function () {
    loaded = !loaded;
    render();
  });

  render();
})();
