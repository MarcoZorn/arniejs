(function () {
  var planRow = document.getElementById('planRow');
  var note = document.getElementById('planNote');
  if (!planRow || !note) return;

  var badges = Array.prototype.slice.call(planRow.querySelectorAll('.plan-badge'));
  var names = { free: 'Free', pro: 'Pro', enterprise: 'Enterprise' };

  badges.forEach(function (badge) {
    badge.addEventListener('click', function () {
      badges.forEach(function (b) { b.setAttribute('aria-checked', 'false'); });
      badge.setAttribute('aria-checked', 'true');

      var tier = badge.getAttribute('data-tier');
      note.innerHTML = 'You\'re currently on the <strong>' + names[tier] + '</strong> plan.';
    });
  });
})();
