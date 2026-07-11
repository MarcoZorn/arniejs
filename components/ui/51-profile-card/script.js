(function () {
  const wrap = document.getElementById('avatarWrap');
  if (!wrap) return;

  // touch devices: tap the avatar to toggle the fanned-out social links
  const avatar = wrap.querySelector('.profile__avatar');
  avatar.addEventListener('click', () => {
    wrap.classList.toggle('is-active');
  });
})();
