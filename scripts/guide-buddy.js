/* Guide buddy — a googly-eyed orange fella who runs along the bottom edge of
   the viewport and points at elements a tour script names. The sprite is an
   inline SVG built from two drawn poses (assets/Group 19.svg + Group 18.svg)
   split into limbs / eyes / mouth so CSS can animate each part and flip
   between the poses like flipbook frames; the movement engine is
   sprite-agnostic.

   Public API (window.GuideBuddy):
     setTour(steps, opts)  — register the page's tour; opts: { auto, delay }
     start() / stop()      — run or abort the registered tour
     pointAt(sel, text)    — one-off: run to an element and point at it

   With { auto: true } the buddy greets every visitor: he runs on stage,
   stands there waving his hand, with a "Show me around" chip beside him.
   The tour itself only runs when that chip is clicked.

   A tour step: { target: '#css-selector', say: 'bubble text', hold: ms }.
   The buddy scrolls the page to the target if needed (running on the spot),
   runs under it, aims his arm at its centre and says the line.
   Any user wheel / touch / click or Escape aborts the tour; Escape also
   dismisses the greeter. */
(function () {
  'use strict';

  var SPEED = 460;          // run speed, px/s
  var WIDTH = 92;           // sprite width, matches styles/guide-buddy.css
  var EDGE = 16;            // min gap to viewport edges when standing

  /* Four drawn poses in one SVG, sharing the head, aligned so the heads
     coincide: pose A = Group 19 (run frame 1, right arm high), pose B =
     Group 18 (standing, looking straight, shifted +8x), pose C = Group 20's
     pointing right arm + raised pupils (shifted +8x -3.5y; its legs / left
     arm / mouth equal pose B's), pose D = Group 21 (run frame 2, shifted
     -1.5x; its face equals pose A's). Limb groups hold the alternate
     drawings (.gb__fA/.gb__fB/.gb__fC/.gb__fD) and CSS flips between them
     like flipbook frames. All limb roots sit under the head circle, so
     rotating or swapping them never shows a gap. The pose-C pointing arm is
     drawn at ~-72° from horizontal — CSS compensates when aiming. Colors
     come from the site tokens. */
  var SPRITE =
    '<svg viewBox="0 0 124 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g class="gb__figure">' +
        '<g class="gb__arm gb__arm--back">' +
          '<path class="gb__fA" d="M32.219 50.4999C25.3857 44.9999 10.419 35.7999 5.21901 42.9999C0.0190084 50.1999 1.38567 64.9999 2.71901 71.4999M2.71901 71.4999L8.21924 82.9999M2.71901 71.4999L8.21924 69.9999M2.71901 71.4999V81.9999" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fB" transform="translate(8 0)" d="M25.5 57.5L7.79032 84M1.5 92L7.79032 84M1.5 84H7.79032M7.79032 84L6 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fD" transform="translate(-1.5 0)" d="M31.6752 44.7846C23.0073 43.4381 5.4458 42.954 4.54247 51.7894C3.63913 60.6248 12.2227 72.7586 16.6274 77.7211M16.6274 77.7211L27.1407 84.9303M16.6274 77.7211L20.6407 73.672M16.6274 77.7211L21.8774 86.8144" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="gb__leg gb__leg--back">' +
          '<path class="gb__fA" d="M21.5 104.5L24 97C36.6667 96.6667 61 104.5 61 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fB" transform="translate(8 0)" d="M63.998 137H58.498C59.6647 120.167 60.798 82 55.998 64" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fD" transform="translate(-1.5 0)" d="M68.7505 115.952L63.2053 110.317C68.6636 98.8821 86.6978 80.7647 47.9473 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="gb__leg gb__leg--front">' +
          '<path class="gb__fA" d="M71.5 130L64.5 133.5C65.8333 118.167 64.9 83.5 50.5 67.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fB" transform="translate(8 0)" d="M31.5 133L35 136.5C38.6667 121.333 45.5 87.9 43.5 69.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fD" transform="translate(-1.5 0)" d="M38.9365 126.627L31.1244 126.158C39.9457 113.545 56.4708 83.0564 52 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="gb__arm gb__arm--front">' +
          '<g class="gb__fA">' +
            '<path d="M83.7192 47C85.8859 56.5 93.7192 74.6 107.719 71C121.719 67.4 119.553 42.1667 116.719 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
            '<g class="gb__hand"><path d="M116.719 30L110.719 23.5M116.719 30V14M116.719 30L122.219 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g>' +
          '</g>' +
          '<path class="gb__fB" transform="translate(8 0)" d="M72 58C73.3333 67.8333 79.6 87.4 94 87C112 86.5 108 48 106 37M106 37C104.4 28.2 104.333 22 104.5 20M106 37L97 31.5M106 37L111 22" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fC" transform="translate(8 -3.5)" d="M92.9998 1.50024C93.6845 5.60853 94.4317 10.8004 95.0916 16.5002C97.3231 35.7738 98.5565 60.8565 92.9998 69.5002C85.7998 80.7002 76.3331 69.8336 72.4998 63.0002M95.0916 16.5002C97.2277 13.8336 104 13.5002 99.4999 22.5002" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<path class="gb__fD" transform="translate(-1.5 0)" d="M83.2334 43.5788C80.3598 52.8894 78.0937 72.4811 92.018 76.3634C105.942 80.2458 116.683 57.3097 120.312 45.3564M120.312 45.3564L118.366 36.7272M120.312 45.3564L128.312 31.5M120.312 45.3564L131.075 37.7141" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<circle cx="58" cy="35" r="35" fill="var(--color-accent-orange)"/>' +
        '<g class="gb__face gb__face--A">' +
          '<path class="gb__mouth gb__mouth--a" d="M64 50C64.3333 51.3333 66.3 54 69.5 54C72.7 54 74.5 51.3333 75 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<g class="gb__eye gb__eye--al">' +
            '<mask id="gb-eye-al" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="48" y="23" width="22" height="22"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/></mask>' +
            '<g mask="url(#gb-eye-al)"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="57" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="60" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g>' +
          '</g>' +
          '<g class="gb__eye gb__eye--ar">' +
            '<mask id="gb-eye-ar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="68" y="23" width="22" height="22"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/></mask>' +
            '<g mask="url(#gb-eye-ar)"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="81" cy="35" r="6" fill="currentColor"/><circle cx="77" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="80" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g>' +
          '</g>' +
        '</g>' +
        '<g class="gb__face gb__face--B" transform="translate(8 0)">' +
          '<path class="gb__mouth gb__mouth--b" d="M46 50C46.3333 51.3333 48.3 54 51.5 54C54.7 54 56.5 51.3333 57 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
          '<g class="gb__eye gb__eye--bl">' +
            '<mask id="gb-eye-bl" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="30" y="23" width="22" height="22"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/></mask>' +
            '<g mask="url(#gb-eye-bl)"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="41" cy="35" r="6" fill="currentColor"/><circle cx="39" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="42" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="43.5" cy="31" r="6" fill="currentColor"/><circle cx="41.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="44.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g>' +
          '</g>' +
          '<g class="gb__eye gb__eye--br">' +
            '<mask id="gb-eye-br" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="23" width="22" height="22"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/></mask>' +
            '<g mask="url(#gb-eye-br)"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="59" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="62" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="63.5" cy="31" r="6" fill="currentColor"/><circle cx="61.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="64.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g>' +
          '</g>' +
        '</g>' +
      '</g>' +
    '</svg>';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var small = window.matchMedia('(max-width: 900px), (hover: none)');
  function disabled() { return reduced.matches || small.matches; }

  var root = null, bubble = null, chip = null;
  var x = -140, facing = 1;
  var token = 0;            // bumping it cancels every pending await
  var active = false;       // a tour is running
  var greeting = false;     // standing at the edge waving, waiting for a click
  var tourSteps = null;

  function send(name) {
    if (typeof window.gtag === 'function') { window.gtag('event', name); }
  }

  function build() {
    if (root) { return; }
    root = document.createElement('div');
    root.className = 'gb';
    root.setAttribute('aria-hidden', 'true');
    root.style.transform = 'translate3d(' + x + 'px,0,0)';
    bubble = document.createElement('div');
    bubble.className = 'gb__bubble';
    var sprite = document.createElement('div');
    sprite.className = 'gb__sprite';
    sprite.innerHTML = SPRITE;
    root.appendChild(bubble);
    root.appendChild(sprite);
    document.body.appendChild(root);

    // Any real user input takes priority over the tour: abort gracefully.
    ['wheel', 'touchmove'].forEach(function (ev) {
      window.addEventListener(ev, userAbort, { passive: true });
    });
    document.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('.gb-chip')) { return; }
      userAbort();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { userAbort(); dismissGreet(); }
    });
    // The engine is rAF-driven and freezes in background tabs — if the user
    // switches away mid-tour, end it cleanly instead of resuming out of place.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { userAbort(); }
    });
  }

  function buildChip() {
    if (chip) { return; }
    chip = document.createElement('button');
    chip.className = 'gb-chip';
    chip.type = 'button';
    chip.hidden = true;       // no chip until the buddy brings one in with him
    chip.textContent = 'Show me around';
    chip.addEventListener('click', function () {
      if (active) { stop(); } else { start(); }
    });
    document.body.appendChild(chip);
  }

  function setX(nx) {
    x = nx;
    root.style.transform = 'translate3d(' + x + 'px,0,0)';
  }

  function face(dir) {
    if (dir !== facing) {
      facing = dir;
      root.classList.toggle('gb--left', dir < 0);
    }
  }

  function say(text) {
    if (!text) { return; }
    bubble.textContent = text;
    // Flip the bubble anchor near the edges so it never leaves the viewport.
    root.classList.remove('gb--bubble-left', 'gb--bubble-right');
    var half = 125; // bubble max-width / 2 + border
    var cx = x + WIDTH / 2;
    if (cx - half < 4) { root.classList.add('gb--bubble-left'); }
    else if (cx + half > window.innerWidth - 4) { root.classList.add('gb--bubble-right'); }
    root.classList.add('gb--talking');
  }

  function hideBubble() { root.classList.remove('gb--talking'); }

  function delay(ms, t) {
    return new Promise(function (res) {
      var t0 = performance.now();
      (function wait(now) {
        if (t !== token || now - t0 >= ms) { return res(); }
        requestAnimationFrame(wait);
      })(t0);
    });
  }

  // Run to a viewport x position at constant speed; cancels when token changes.
  function moveTo(nx, t) {
    return new Promise(function (res) {
      var from = x, dist = nx - from;
      if (Math.abs(dist) < 6) { setX(nx); return res(); }
      face(dist > 0 ? 1 : -1);
      hideBubble();
      root.classList.remove('gb--pointing');
      root.classList.add('gb--running');
      var dur = Math.max(320, Math.abs(dist) / SPEED * 1000);
      var t0 = performance.now();
      (function tick(now) {
        if (t !== token) { return res(); }
        var p = Math.min(1, (now - t0) / dur);
        setX(from + dist * p);
        if (p < 1) { requestAnimationFrame(tick); }
        else { root.classList.remove('gb--running'); res(); }
      })(t0);
    });
  }

  // Smooth-scroll the page until the element sits in the comfortable band;
  // the buddy runs on the spot while the page moves under him.
  function scrollToEl(el, t) {
    return new Promise(function (res) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.top >= 70 && r.bottom <= vh - 150) { return res(); }
      var offset = Math.max(90, (vh - Math.min(r.height, vh * 0.5)) / 2 + 40);
      var targetY = window.scrollY + r.top - offset;
      var maxY = document.documentElement.scrollHeight - vh;
      targetY = Math.max(0, Math.min(targetY, maxY));
      root.classList.remove('gb--pointing');
      root.classList.add('gb--running');
      hideBubble();
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      var last = window.scrollY, still = 0, t0 = performance.now();
      (function wait() {
        if (t !== token) { return res(); }
        if (Math.abs(window.scrollY - last) < 1) { still++; } else { still = 0; last = window.scrollY; }
        if (still > 12 || performance.now() - t0 > 4000) {
          // Smooth scroll can be interrupted or throttled — snap the rest.
          if (Math.abs(window.scrollY - targetY) > 60) { window.scrollTo(0, targetY); }
          root.classList.remove('gb--running');
          return res();
        }
        requestAnimationFrame(wait);
      })();
    });
  }

  // Rotate the front arm so it aims at the element's centre (clamped to the
  // visible part of tall sections). 0deg = horizontal forward, negative = up.
  function aimAt(el) {
    var r = el.getBoundingClientRect();
    var tx = r.left + r.width / 2;
    var ty = r.top + r.height / 2;
    ty = Math.max(60, Math.min(ty, window.innerHeight - 170));
    var b = root.getBoundingClientRect();
    face(tx >= b.left + b.width / 2 ? 1 : -1);
    // Shoulder of the pointing (right) arm; mirrored when the sprite flips.
    var sx = b.left + b.width * (facing > 0 ? 0.649 : 0.351);
    var sy = b.top + b.height * 0.425;
    var deg = Math.atan2(ty - sy, Math.abs(tx - sx)) * 180 / Math.PI;
    deg = Math.max(-88, Math.min(30, deg));
    root.style.setProperty('--gb-aim', deg.toFixed(1) + 'deg');
    root.classList.add('gb--pointing');
  }

  // Stand a step to the side of the target's centre so the raised arm points
  // diagonally instead of straight up from underneath.
  function standXFor(el) {
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var desired = cx - WIDTH / 2 - 110;
    if (desired < EDGE + 60) { desired = cx - WIDTH / 2 + 110; }
    return Math.max(EDGE, Math.min(window.innerWidth - WIDTH - EDGE, desired));
  }

  /* The one tour chip only ever lives on the left: it pops in at the
     greeter's feet once he has run on, and rests in the bottom-left corner
     the rest of the time. Never the right corner — that side stays clear. */
  function chipBeside() {
    chip.style.left = Math.round(x + WIDTH + 12) + 'px';
    chip.style.bottom = '18px';
  }

  function chipCorner() {
    chip.style.left = '14px';
    chip.style.bottom = '14px';
  }

  // Greeting: run on from the left, stop and wave the hand — and only once
  // he's standing does the chip pop in at his feet. The tour waits for a click.
  function greet() {
    if (disabled() || !tourSteps || !tourSteps.length) { return; }
    build();
    buildChip();
    token++;
    var t = token;
    greeting = true;
    chip.textContent = 'Show me around';
    chip.hidden = true;
    setX(-140);
    face(1);
    send('guide_greet');
    moveTo(Math.max(EDGE, Math.min(170, window.innerWidth * 0.16)), t).then(function () {
      if (t !== token) { return; }
      root.classList.add('gb--waving');
      return delay(320, t).then(function () {
        if (t !== token) { return; }
        chipBeside();
        chip.hidden = false;
        chip.classList.add('gb-chip--pop');
      });
    });
  }

  function dismissGreet() {
    if (!greeting) { return; }
    greeting = false;
    token++;
    var t = token;
    root.classList.remove('gb--waving');
    resetChip();
    moveTo(-140, t);
  }

  function doStep(step, t) {
    var el = document.querySelector(step.target);
    if (!el) { return Promise.resolve(); }
    return scrollToEl(el, t).then(function () {
      if (t !== token) { return; }
      return moveTo(standXFor(el), t).then(function () {
        if (t !== token) { return; }
        aimAt(el);
        say(step.say);
        return delay(step.hold || 3000, t).then(function () {
          if (t !== token) { return; }
          hideBubble();
          root.classList.remove('gb--pointing');
          return delay(280, t);
        });
      });
    });
  }

  function resetChip() {
    if (!chip) { return; }
    chip.classList.remove('gb-chip--pop');
    chip.textContent = 'Show me around';
    chipCorner();
    chip.hidden = false;
  }

  function start() {
    if (disabled() || !tourSteps || !tourSteps.length) { return; }
    build();
    buildChip();
    token++;
    var t = token;
    active = true;
    greeting = false;
    chip.classList.remove('gb-chip--pop');
    root.classList.remove('gb--waving');
    chipCorner();
    chip.hidden = false;
    chip.textContent = 'Stop the tour';
    send('guide_tour_start');
    if (x < -100) { setX(-140); face(1); }
    var chain = Promise.resolve();
    tourSteps.forEach(function (step) {
      chain = chain.then(function () {
        if (t !== token) { return; }
        return doStep(step, t);
      });
    });
    chain.then(function () {
      if (t !== token) { return; }
      // Done — run off the nearest edge and rest.
      var exitX = (x > window.innerWidth / 2) ? window.innerWidth + 60 : -140;
      moveTo(exitX, t).then(function () {
        if (t !== token) { return; }
        active = false;
        resetChip();
        send('guide_tour_finish');
      });
    });
  }

  function stop() {
    if (!active) { return; }
    token++;
    var t = token;
    active = false;
    resetChip();
    send('guide_tour_stop');
    hideBubble();
    root.classList.remove('gb--pointing');
    moveTo(-140, t);   // trot off-screen
  }

  function userAbort() { if (active) { stop(); } }

  function pointAt(sel, text, hold) {
    if (disabled()) { return; }
    build();
    token++;
    var t = token;
    active = true;
    greeting = false;
    root.classList.remove('gb--waving');
    resetChip();
    doStep({ target: sel, say: text, hold: hold || 3600 }, t).then(function () {
      if (t !== token) { return; }
      active = false;
      moveTo(-140, t);
    });
  }

  function setTour(steps, opts) {
    tourSteps = steps || null;
    opts = opts || {};
    // Always build — CSS hides the buddy on small / touch / reduced-motion
    // environments, and start() re-checks; the viewport may change after load.
    function init() {
      build();
      buildChip();
      if (opts.auto) {
        var autoGreet = function () {
          if (document.hidden) {
            // Wait for the tab to actually be shown — timers fire in
            // background tabs but the rAF engine can't run there.
            document.addEventListener('visibilitychange', function once() {
              if (!document.hidden) {
                document.removeEventListener('visibilitychange', once);
                setTimeout(autoGreet, 600);
              }
            });
            return;
          }
          if (!active && !greeting && !disabled()) { greet(); }
        };
        setTimeout(autoGreet, opts.delay || 1500);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  window.GuideBuddy = { setTour: setTour, start: start, stop: stop, pointAt: pointAt };
})();
