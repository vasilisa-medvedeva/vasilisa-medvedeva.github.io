(function () {
  // Gentle stagger for the component-block load animation.
  // This is purely additive — the reveal itself is CSS-driven, so blocks
  // are never left invisible even if this script doesn't run.
  var blocks = document.querySelectorAll('.component-block');
  if (!blocks.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.animationDelay = (Math.min(i, 10) * 0.06 + 0.05) + 's';
  }
})();
