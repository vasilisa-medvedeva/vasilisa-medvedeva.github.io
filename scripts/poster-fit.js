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
  /* Widest declared line at the current font size.

     This used to read t.scrollWidth, which looks right and is quietly wrong:
     scrollWidth is never reported below clientWidth, so a headline narrower
     than its column measured as exactly the column. The ratio came out at 1,
     the fitter returned the probe size untouched, and the thing could only
     ever shrink text — never grow it into the space beside it. A Range over
     the contents reports what the glyphs actually occupy, under or over. */
  function widestLine () {
    var range = document.createRange();
    range.selectNodeContents(t);
    var rects = range.getClientRects();
    var max = 0;
    for (var i = 0; i < rects.length; i++) { if (rects[i].width > max) max = rects[i].width; }
    range.detach && range.detach();
    return max;
  }

  function fit () {
    t.style.fontSize = '100px';
    t.style.whiteSpace = 'nowrap';   // measure the intended <br> lines, not wrapped fragments
    var natural = widestLine();
    t.style.whiteSpace = '';
    if (!natural) return;
    var size = 100 * t.clientWidth / natural * 0.995;   /* 0.5% of air, not 1.5% */
    /* The floor is a safety net, not a design choice: the fitted size is what
       should win. It used to be 40px, which was never reached on the front
       page's short headline but is far above what a case headline needs on a
       narrow screen — the line then stayed wider than the viewport, and the
       nbsp-joined words gave the browser nowhere to break it. */
    t.style.fontSize = Math.max(28, Math.min(220, size)) + 'px';
  }
  var queue;
  function refit () { clearTimeout(queue); queue = setTimeout(fit, 60); }
  window.addEventListener('resize', refit);
  document.addEventListener('langchange', refit);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(refit); }
  if (document.fonts && document.fonts.addEventListener) { document.fonts.addEventListener('loadingdone', refit); }

  /* Ask for the display face by name and refit when it lands. fonts.ready can
     resolve before a stylesheet-triggered face has even been requested, and
     then no 'loadingdone' follows either — the headline keeps the size it was
     measured at in the fallback font and quietly under-fills its column. The
     two timed refits are the belt to that braces: cheap, and they cover a
     slow network where the face arrives after everything else has settled. */
  if (document.fonts && document.fonts.load) {
    var face = getComputedStyle(t).fontFamily.split(',')[0].replace(/["']/g, '').trim();
    if (face) { document.fonts.load('900 100px "' + face + '"').then(refit).catch(function () {}); }
  }
  setTimeout(refit, 400);
  setTimeout(refit, 1500);

  fit();
})();
