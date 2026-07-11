(function () {
  var list = document.getElementById('crumbList');
  if (!list) return;

  list.addEventListener('click', function (e) {
    var link = e.target.closest('a.crumb-link');
    if (!link) return;
    e.preventDefault();

    var item = link.closest('.crumb-item');
    var allItems = Array.prototype.slice.call(list.querySelectorAll('.crumb-item'));
    var idx = allItems.indexOf(item);
    if (idx === -1) return;

    // Remove everything after the clicked crumb (including separators)
    var nodes = Array.prototype.slice.call(list.children);
    var keepUntil = nodes.indexOf(item);
    for (var i = nodes.length - 1; i > keepUntil; i--) {
      list.removeChild(nodes[i]);
    }

    // Turn the clicked crumb into the new "current"
    allItems.forEach(function (it) { it.classList.remove('current'); it.removeAttribute('aria-current'); });
    item.classList.add('current');
    item.setAttribute('aria-current', 'page');
    var text = link.textContent;
    var span = document.createElement('span');
    span.className = 'crumb-link';
    span.textContent = text;
    link.replaceWith(span);
  });
})();
