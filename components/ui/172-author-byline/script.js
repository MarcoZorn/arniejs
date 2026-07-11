(function () {
  var followBtn = document.querySelector('.byline__follow');
  if (!followBtn) return;

  followBtn.addEventListener('click', function () {
    var isFollowing = followBtn.getAttribute('aria-pressed') === 'true';
    followBtn.setAttribute('aria-pressed', isFollowing ? 'false' : 'true');
    followBtn.textContent = isFollowing ? 'Follow' : 'Following';
  });
})();
