/* Figma-style hotspot hints for the Pyroblast flow prototypes.
   A real tap (e.isTrusted) inside the phone that hits nothing clickable
   flashes an outline over every tappable element on the current screen.
   "Clickable" is read off the page itself: a pointer cursor (every control
   in the flows carries one) or an inline onclick. Scrims count as clickable
   (tapping them dismisses), so they never trigger the flash. */
(function () {
  var phone = document.querySelector('.phone');
  if (!phone) return;

  var layer = document.createElement('div');
  layer.className = 'hotspot-layer';
  phone.appendChild(layer);

  /* the auto-demo drives synthetic taps; a real tap during it hands control
     over (flows/*.html takeControl) — that handover click shouldn't flash */
  var playing = false, stoppedAt = 0;
  document.addEventListener('demo-start', function () { playing = true; });
  document.addEventListener('demo-end',   function () { playing = false; });
  document.addEventListener('demo-stop',  function () { playing = false; stoppedAt = performance.now(); });

  function isPointer(el) {
    return getComputedStyle(el).cursor.indexOf('pointer') !== -1;
  }
  function isClickable(el) {
    return isPointer(el) || el.hasAttribute('onclick') ||
           /(^|[ _-])scrim/.test(el.className || '');
  }
  function clickableFrom(el) {
    while (el && el !== phone) {
      if (el.nodeType === 1 && isClickable(el)) return el;
      el = el.parentElement;
    }
    return null;
  }

  /* an element earns a mark when its centre actually receives the tap —
     covered rows (open sheet, scrim) and off-screen panels drop out here */
  function hittable(el, pr) {
    var r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return null;
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < pr.left || cx > pr.right || cy < pr.top || cy > pr.bottom) return null;
    var hit = document.elementFromPoint(cx, cy);
    if (!hit || !(el === hit || el.contains(hit) || hit.contains(el))) return null;
    return r;
  }

  function flash() {
    layer.classList.remove('is-on');
    layer.innerHTML = '';
    var pr = phone.getBoundingClientRect();
    var scale = pr.width / phone.offsetWidth;   /* .device / fitStage transforms */
    phone.querySelectorAll('*').forEach(function (el) {
      if (!el.getClientRects().length) return;
      if (!(isPointer(el) || el.hasAttribute('onclick'))) return;
      /* outermost only — cursor inherits, so a pointer parent covers its children */
      var p = el.parentElement;
      if (p && p !== phone && isPointer(p)) return;
      var r = hittable(el, pr);
      if (!r) return;
      var m = document.createElement('div');
      m.className = 'hotspot-mark';
      m.style.left   = (r.left - pr.left) / scale + 'px';
      m.style.top    = (r.top  - pr.top ) / scale + 'px';
      m.style.width  = r.width  / scale + 'px';
      m.style.height = r.height / scale + 'px';
      m.style.borderRadius = getComputedStyle(el).borderRadius;
      layer.appendChild(m);
    });
    if (!layer.children.length) return;
    /* restart the animation even mid-flash */
    void layer.offsetWidth;
    layer.classList.add('is-on');
    clearTimeout(flash._t);
    flash._t = setTimeout(function () { layer.classList.remove('is-on'); layer.innerHTML = ''; }, 950);
  }

  phone.addEventListener('click', function (e) {
    if (!e.isTrusted || playing) return;
    if (performance.now() - stoppedAt < 350) return;   /* the tap that stopped the demo */
    if (clickableFrom(e.target)) return;
    flash();
  });
})();
