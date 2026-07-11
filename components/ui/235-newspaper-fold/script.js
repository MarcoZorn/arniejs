(function () {
  var paper = document.querySelector('.paper');
  var fold = document.querySelector('.paper__fold');
  if (!paper || !fold) return;

  fold.addEventListener('click', function () {
    var open = paper.getAttribute('data-open') === 'true';
    paper.setAttribute('data-open', open ? 'false' : 'true');
    fold.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
})();
