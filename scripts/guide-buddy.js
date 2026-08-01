/* Guide buddy — a hand-drawn stickman that runs along the bottom edge of the
   viewport and points at elements a tour script names. Prototype: the sprite
   is an inline SVG stickman; swap the contents of SPRITE for a Rive/Lottie
   character later — the movement / scenario engine stays the same.

   Public API (window.GuideBuddy):
     setTour(steps, opts)  — register the page's tour; opts: { auto, delay }
     start() / stop()      — run or abort the registered tour
     pointAt(sel, text)    — one-off: run to an element and point at it

   A tour step: { target: '#css-selector', say: 'bubble text', hold: ms }.
   The buddy scrolls the page to the target if needed (running on the spot),
   runs under it, aims his arm at its centre and says the line.
   Any user wheel / touch / click or Escape aborts the tour. */
(function () {
  'use strict';

  var SPEED = 460;          // run speed, px/s
  var WIDTH = 78;           // sprite width, matches styles/guide-buddy.css
  var EDGE = 16;            // min gap to viewport edges when standing

  /* Same doodle language as the site: wobbly strokes, round caps, currentColor.
     Arms are drawn pointing forward (+x) so CSS can rotate them from one origin
     for both the run swing and the aimed point. */
  var SPRITE =
    '<svg viewBox="0 0 96 132" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g class="gb__figure">' +
        '<g class="gb__arm gb__arm--back"><path d="M49.8 51.2 C58.2 49.6 66.8 49.8 75.4 51 C76.9 51.1 78.3 50.8 79.6 50.3" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<g class="gb__leg gb__leg--back"><path d="M48.2 84.2 C47.4 97 47.5 110 47.8 124.9 C50.1 125.9 52.9 125.8 55.5 125.2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<path d="M50.2 40.8 C49 50 47.8 66 48.2 84.2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M52.6 11.4 C44 9.6 36.9 15.7 36.3 24.6 C35.7 33.8 42.5 40.9 50.7 40.5 C58.9 40.1 64.6 33.3 63.9 24.8 C63.2 16.3 57.4 11.6 49.6 11.3" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M56.2 21.4 L56.5 22.6" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M52.8 29.6 C54.8 31.8 58 31.6 60.4 29.2" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' +
        '<g class="gb__leg gb__leg--front"><path d="M48.2 84.2 C48.9 97 49.3 110 49.5 124.9 C51.9 125.9 54.8 125.8 57.4 125.2" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<g class="gb__arm gb__arm--front"><path d="M49.8 51.6 C59 50.4 68.4 50 77.6 50.9 C79.6 51 81.6 50.6 83.4 49.9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '</g>' +
    '</svg>';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var small = window.matchMedia('(max-width: 900px), (hover: none)');
  function disabled() { return reduced.matches || small.matches; }

  var root = null, bubble = null, chip = null;
  var x = -140, facing = 1;
  var token = 0;            // bumping it cancels every pending await
  var active = false;
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
      if (e.key === 'Escape') { userAbort(); }
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
      var offset = Math.max(90, (vh - Math.min(r.height, vh * 0.5)) / 2 - 60);
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
    var sx = b.left + b.width * 0.5;
    var sy = b.top + b.height * 0.42;
    face(tx >= sx ? 1 : -1);
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
    if (chip) { chip.textContent = 'Show me around'; }
  }

  function markSeen() {
    try { sessionStorage.setItem('gb_tour_seen', '1'); } catch (e) {}
  }

  function seen() {
    try { return sessionStorage.getItem('gb_tour_seen') === '1'; } catch (e) { return false; }
  }

  function start() {
    if (disabled() || !tourSteps || !tourSteps.length) { return; }
    build();
    token++;
    var t = token;
    active = true;
    if (chip) { chip.textContent = 'Stop the tour'; }
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
        markSeen();
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
    markSeen();
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
      if (opts.auto && !seen()) {
        var autoStart = function () {
          if (document.hidden) {
            // Wait for the tab to actually be shown — timers fire in
            // background tabs but the rAF engine can't run there.
            document.addEventListener('visibilitychange', function once() {
              if (!document.hidden) {
                document.removeEventListener('visibilitychange', once);
                setTimeout(autoStart, 600);
              }
            });
            return;
          }
          if (!active && !disabled()) { start(); }
        };
        setTimeout(autoStart, opts.delay || 1500);
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
