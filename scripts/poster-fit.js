/* Poster-fit hero — scale .hero__title so its longest line spans the full
   content width at any viewport. The headline is measured with white-space
   nowrap, so it sizes to the lines the markup actually declares with <br>,
   not to whatever fragments the browser happens to wrap into. A headline
   without <br> is therefore treated as one long line — which is the point:
   the break belongs to the copy, not to the container.

   Re-runs on resize, on the language switch (the RU lines are a different
   length) and whenever a late font finishes loading — the Cyrillic face
   arrives only when RU is first chosen.

   Lived inline in index.html until the case pages needed it too. */
(function () {
  'use strict';
  var t = document.querySelector('.hero__title');
  if (!t) return;
  function fit () {
    t.style.fontSize = '100px';
    t.style.whiteSpace = 'nowrap';   // measure the intended <br> lines, not wrapped fragments
    var natural = t.scrollWidth;
    t.style.whiteSpace = '';
    if (!natural) return;
    var size = 100 * t.clientWidth / natural * 0.985;
    t.style.fontSize = Math.max(40, Math.min(220, size)) + 'px';
  }
  var queue;
  function refit () { clearTimeout(queue); queue = setTimeout(fit, 60); }
  window.addEventListener('resize', refit);
  document.addEventListener('langchange', refit);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(refit); }
  if (document.fonts && document.fonts.addEventListener) { document.fonts.addEventListener('loadingdone', refit); }
  fit();
})();
