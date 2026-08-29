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

   A tour step: { target: '#css-selector', say: 'bubble text', hold: ms,
   id: 'short-name', sayRu: 'реплика' } — id is optional and only names the
   stop in analytics; sayRu is the line he uses while the site is in Russian.
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
    '<svg viewBox="0 0 124 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="gb-blob-grad" cx="35%" cy="30%" r="85%"><stop offset="0%" style="stop-color:#A78BFA"/><stop offset="55%" style="stop-color:var(--color-accent-orange)"/><stop offset="100%" style="stop-color:var(--color-accent-orange-pressed)"/></radialGradient></defs><g class="gb__figure"><g class="gb__leg gb__leg--back"><path class="gb__fA" d="M21.5 104.5L24 97C36.6667 96.6667 61 104.5 61 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M63.998 137H58.498C59.6647 120.167 60.798 82 55.998 64" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M68.7505 115.952L63.2053 110.317C68.6636 98.8821 86.6978 80.7647 47.9473 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__leg gb__leg--front"><path class="gb__fA" d="M71.5 130L64.5 133.5C65.8333 118.167 64.9 83.5 50.5 67.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M31.5 133L35 136.5C38.6667 121.333 45.5 87.9 43.5 69.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M38.9365 126.627L31.1244 126.158C39.9457 113.545 56.4708 83.0564 52 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><g class="gb__fA" transform="translate(10 8)"><path d="M83.7192 47C85.8859 56.5 93.7192 74.6 107.719 71C121.719 67.4 119.553 42.1667 116.719 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__hand"><path d="M116.719 30L110.719 23.5M116.719 30V14M116.719 30L122.219 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></g><path class="gb__fD" transform="translate(8.5 8)" d="M83.2334 43.5788C80.3598 52.8894 78.0937 72.4811 92.018 76.3634C105.942 80.2458 116.683 57.3097 120.312 45.3564M120.312 45.3564L118.366 36.7272M120.312 45.3564L128.312 31.5M120.312 45.3564L131.075 37.7141" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><path class="gb__head" transform="translate(13 2) scale(1.15)" fill="url(#gb-blob-grad)"><animate attributeName="d" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" values="M8.54 20.42C7.05 23.46 6.11 26.87 5.5 30.23C4.89 33.58 5.48 37.18 4.85 40.54C4.23 43.9 2.54 47.06 1.74 50.4C0.93 53.73 0.14 57.14 0.03 60.54C-0.08 63.94 0.12 67.55 1.09 70.79C2.06 74.02 3.99 77.05 5.85 79.93C7.72 82.8 9.88 85.58 12.26 88.04C14.64 90.51 17.22 93.01 20.13 94.72C23.04 96.43 26.42 97.68 29.75 98.29C33.07 98.9 36.64 98.55 40.08 98.38C43.51 98.2 46.94 97.75 50.35 97.26C53.75 96.77 57.37 96.65 60.5 95.44C63.64 94.23 66.76 92.33 69.17 90C71.58 87.67 73.29 84.46 74.98 81.47C76.66 78.48 77.99 75.26 79.28 72.06C80.56 68.86 81.81 65.6 82.66 62.28C83.52 58.97 84.73 55.44 84.42 52.16C84.1 48.87 82.32 45.62 80.77 42.58C79.22 39.53 76.77 36.92 75.14 33.9C73.51 30.88 72.19 27.67 70.99 24.45C69.79 21.24 69.56 17.55 67.94 14.6C66.32 11.65 63.85 8.95 61.28 6.75C58.71 4.55 55.67 2.5 52.5 1.39C49.34 0.27 45.71 -0.03 42.31 0.06C38.92 0.16 35.46 1.04 32.16 1.95C28.85 2.86 25.43 3.85 22.47 5.51C19.52 7.17 16.74 9.45 14.42 11.93C12.1 14.42 10.02 17.37 8.54 20.42Z;M15.07 21C13.52 24.1 12.17 27.35 11.18 30.66C10.2 33.98 10.44 37.75 9.14 40.9C7.83 44.05 4.86 46.5 3.34 49.55C1.81 52.6 0.37 55.86 0.01 59.2C-0.36 62.53 0.24 66.24 1.13 69.55C2.01 72.87 3.53 76.15 5.33 79.08C7.13 82.01 9.44 84.75 11.94 87.13C14.43 89.51 17.34 91.58 20.31 93.36C23.28 95.13 26.53 96.5 29.76 97.77C32.99 99.04 36.32 100.47 39.7 100.99C43.08 101.52 46.82 101.77 50.05 100.93C53.28 100.09 56.43 98.09 59.08 95.95C61.73 93.81 63.51 90.56 65.96 88.08C68.4 85.61 71.17 83.46 73.74 81.12C76.31 78.77 79.14 76.62 81.38 73.99C83.62 71.37 85.93 68.49 87.2 65.36C88.46 62.23 89.28 58.52 88.97 55.2C88.67 51.89 86.89 48.56 85.37 45.46C83.84 42.36 81.57 39.61 79.84 36.59C78.11 33.58 76.26 30.57 74.99 27.36C73.71 24.14 73.63 20.4 72.2 17.29C70.77 14.18 68.78 11.16 66.43 8.69C64.08 6.22 61.16 3.9 58.09 2.46C55.03 1.01 51.42 0.2 48.02 0.01C44.61 -0.18 41.04 0.55 37.68 1.34C34.32 2.13 30.72 2.97 27.86 4.76C24.99 6.55 22.6 9.35 20.47 12.06C18.34 14.77 16.62 17.9 15.07 21Z;M5.1 22.12C3.73 25.23 3.18 28.57 2.81 31.79C2.44 35.01 3.14 38.18 2.85 41.43C2.57 44.68 1.65 48.05 1.12 51.27C0.59 54.49 -0.07 57.64 -0.3 60.77C-0.54 63.9 -1.05 67.12 -0.29 70.07C0.48 73.02 2.51 75.69 4.28 78.47C6.05 81.25 8.04 84.1 10.35 86.76C12.66 89.42 15.08 92.52 18.14 94.44C21.21 96.36 25 97.89 28.71 98.27C32.43 98.66 36.61 97.2 40.44 96.78C44.27 96.35 47.83 95.65 51.69 95.7C55.54 95.76 59.85 97.44 63.58 97.12C67.32 96.79 71.69 96.06 74.09 93.77C76.5 91.49 77.23 87.19 78.01 83.42C78.79 79.66 78.59 75.19 78.77 71.18C78.95 67.16 78.92 63.17 79.08 59.34C79.24 55.52 80.39 51.78 79.73 48.25C79.08 44.71 76.97 41.26 75.18 38.12C73.38 34.98 70.6 32.41 68.99 29.41C67.37 26.41 66.53 23.16 65.5 20.14C64.46 17.12 64.33 13.77 62.8 11.27C61.27 8.76 58.75 6.73 56.33 5.11C53.9 3.49 51.16 2.07 48.26 1.54C45.37 1.02 42.06 1.45 38.94 1.97C35.82 2.49 32.68 3.64 29.54 4.67C26.39 5.7 23.16 6.73 20.07 8.14C16.98 9.55 13.5 10.81 11.01 13.14C8.51 15.47 6.47 19.01 5.1 22.12Z;M8.54 20.42C7.05 23.46 6.11 26.87 5.5 30.23C4.89 33.58 5.48 37.18 4.85 40.54C4.23 43.9 2.54 47.06 1.74 50.4C0.93 53.73 0.14 57.14 0.03 60.54C-0.08 63.94 0.12 67.55 1.09 70.79C2.06 74.02 3.99 77.05 5.85 79.93C7.72 82.8 9.88 85.58 12.26 88.04C14.64 90.51 17.22 93.01 20.13 94.72C23.04 96.43 26.42 97.68 29.75 98.29C33.07 98.9 36.64 98.55 40.08 98.38C43.51 98.2 46.94 97.75 50.35 97.26C53.75 96.77 57.37 96.65 60.5 95.44C63.64 94.23 66.76 92.33 69.17 90C71.58 87.67 73.29 84.46 74.98 81.47C76.66 78.48 77.99 75.26 79.28 72.06C80.56 68.86 81.81 65.6 82.66 62.28C83.52 58.97 84.73 55.44 84.42 52.16C84.1 48.87 82.32 45.62 80.77 42.58C79.22 39.53 76.77 36.92 75.14 33.9C73.51 30.88 72.19 27.67 70.99 24.45C69.79 21.24 69.56 17.55 67.94 14.6C66.32 11.65 63.85 8.95 61.28 6.75C58.71 4.55 55.67 2.5 52.5 1.39C49.34 0.27 45.71 -0.03 42.31 0.06C38.92 0.16 35.46 1.04 32.16 1.95C28.85 2.86 25.43 3.85 22.47 5.51C19.52 7.17 16.74 9.45 14.42 11.93C12.1 14.42 10.02 17.37 8.54 20.42Z"/></path><g class="gb__arm gb__arm--back"><path class="gb__fA" d="M32.219 50.4999C25.3857 44.9999 10.419 35.7999 5.21901 42.9999C0.0190084 50.1999 1.38567 64.9999 2.71901 71.4999M2.71901 71.4999L8.21924 82.9999M2.71901 71.4999L8.21924 69.9999M2.71901 71.4999V81.9999" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(0 0)" d="M25.5 57.5L7.79032 84M1.5 92L7.79032 84M1.5 84H7.79032M7.79032 84L6 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M31.6752 44.7846C23.0073 43.4381 5.4458 42.954 4.54247 51.7894C3.63913 60.6248 12.2227 72.7586 16.6274 77.7211M16.6274 77.7211L27.1407 84.9303M16.6274 77.7211L20.6407 73.672M16.6274 77.7211L21.8774 86.8144" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><path class="gb__fB" transform="translate(20 0)" d="M82.5 57.5L100.2 84M106.5 92L100.2 84M106.5 84H100.2M100.2 84L102 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fC" transform="translate(8 -3.5)" d="M92.9998 1.50024C93.6845 5.60853 94.4317 10.8004 95.0916 16.5002C97.3231 35.7738 98.5565 60.8565 92.9998 69.5002C85.7998 80.7002 76.3331 69.8336 72.4998 63.0002M95.0916 16.5002C97.2277 13.8336 104 13.5002 99.4999 22.5002" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__face gb__face--A"><path class="gb__mouth gb__mouth--a" d="M64 50C64.3333 51.3333 66.3 54 69.5 54C72.7 54 74.5 51.3333 75 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--al"><mask id="gb-eye-al" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="48" y="23" width="22" height="22"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-al)"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="57" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="60" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--ar"><mask id="gb-eye-ar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="68" y="23" width="22" height="22"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-ar)"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="81" cy="35" r="6" fill="currentColor"/><circle cx="77" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="80" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g></g><g class="gb__face gb__face--B" transform="translate(8 0)"><path class="gb__mouth gb__mouth--b" d="M46 50C46.3333 51.3333 48.3 54 51.5 54C54.7 54 56.5 51.3333 57 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--bl"><mask id="gb-eye-bl" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="30" y="23" width="22" height="22"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-bl)"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="41" cy="35" r="6" fill="currentColor"/><circle cx="39" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="42" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="43.5" cy="31" r="6" fill="currentColor"/><circle cx="41.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="44.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--br"><mask id="gb-eye-br" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="23" width="22" height="22"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-br)"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="59" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="62" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="63.5" cy="31" r="6" fill="currentColor"/><circle cx="61.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="64.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g></g></g></svg>';

  /* The buddy's own two labels. Copy a script writes at runtime can't sit in
     data-ru (see scripts/i18n.js), so it reads the live language instead and
     redraws when the switch fires. A tour step carries its Russian beside its
     English, as sayRu, so both lines stay in one place in the page. */
  var CHIP = {
    en: { start: 'Show me around',    stop: 'Stop the tour' },
    ru: { start: 'Проведи экскурсию',  stop: 'Остановить экскурсию' }
  };
  function lang() { return (typeof window.lang === 'function' && window.lang() === 'ru') ? 'ru' : 'en'; }
  function chipText(key) { return CHIP[lang()][key]; }
  function stepLine(step) { return (lang() === 'ru' && step.sayRu) ? step.sayRu : step.say; }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var small = window.matchMedia('(max-width: 900px), (hover: none)');
  function disabled() { return reduced.matches || small.matches; }

  var root = null, bubble = null, chip = null;
  var x = -140, facing = 1;
  var token = 0;            // bumping it cancels every pending await
  var active = false;       // a tour is running
  var greeting = false;     // standing at the edge waving, waiting for a click
  var tourSteps = null;
  var current = null;       // the step whose line is on screen, for a language swap
  var seen = 0;             // stops actually shown in the current run
  var seenId = '';          // id of the last stop shown

  /* GA4 events, no-ops when gtag never loaded. The funnel a run can produce:
     guide_unavailable (he can't come out at all) → guide_greet → tour_start →
     one tour_step per stop actually reached → tour_complete, or tour_stop
     carrying how far he got and what ended the run. */
  function send(name, params) {
    if (typeof window.gtag === 'function') { window.gtag('event', name, params || {}); }
  }

  // Stable name for a stop in the reports: the step's own id, else its selector.
  function stepId(step, i) {
    return String(step.id || step.target || ('step_' + (i + 1))).slice(0, 90);
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
      window.addEventListener(ev, function () { userAbort('scrolled_away'); }, { passive: true });
    });
    document.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('.gb-chip')) { return; }
      userAbort('clicked_page');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { userAbort('escape'); dismissGreet(); }
    });
    // The engine is rAF-driven and freezes in background tabs — if the user
    // switches away mid-tour, end it cleanly instead of resuming out of place.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { userAbort('tab_hidden'); }
    });
  }

  function buildChip() {
    if (chip) { return; }
    chip = document.createElement('button');
    chip.className = 'gb-chip';
    chip.type = 'button';
    chip.hidden = true;       // no chip until the buddy brings one in with him
    chip.textContent = chipText('start');
    chip.addEventListener('click', function () {
      if (active) { stop('chip'); } else { start(); }
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

  function hideBubble() { current = null; root.classList.remove('gb--talking'); }

  /* Switching language mid-visit: relabel the chip he is holding and redraw
     the line he is in the middle of saying. */
  document.addEventListener('langchange', function () {
    if (chip) { chip.textContent = chipText(active ? 'stop' : 'start'); }
    if (current && root.classList.contains('gb--talking')) { say(stepLine(current)); }
  });

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
    chip.textContent = chipText('start');
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

  // meta, when the step belongs to a tour run, logs the stop as reached — set
  // only once he is standing there saying the line, never on a missing target.
  function doStep(step, t, meta) {
    var el = document.querySelector(step.target);
    if (!el) { return Promise.resolve(); }
    return scrollToEl(el, t).then(function () {
      if (t !== token) { return; }
      return moveTo(standXFor(el), t).then(function () {
        if (t !== token) { return; }
        aimAt(el);
        current = step;
        say(stepLine(step));
        if (meta) {
          seen = meta.index;
          seenId = meta.id;
          send('guide_tour_step', { step_index: meta.index, step_total: meta.total, step_id: meta.id });
        }
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
    chip.textContent = chipText('start');
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
    seen = 0;
    seenId = '';
    chip.classList.remove('gb-chip--pop');
    root.classList.remove('gb--waving');
    chipCorner();
    chip.hidden = false;
    chip.textContent = chipText('stop');
    var total = tourSteps.length;
    send('guide_tour_start', { step_total: total });
    if (x < -100) { setX(-140); face(1); }
    var chain = Promise.resolve();
    tourSteps.forEach(function (step, i) {
      chain = chain.then(function () {
        if (t !== token) { return; }
        return doStep(step, t, { index: i + 1, total: total, id: stepId(step, i) });
      });
    });
    chain.then(function () {
      if (t !== token) { return; }
      // Every stop is done. Close the run *before* the exit sprint, so a click
      // while he trots off-stage can't book a finished tour as a drop-off.
      active = false;
      resetChip();
      send('guide_tour_complete', { steps_seen: seen, step_total: total });
      var exitX = (x > window.innerWidth / 2) ? window.innerWidth + 60 : -140;
      moveTo(exitX, t);
    });
  }

  function stop(reason) {
    if (!active) { return; }
    token++;
    var t = token;
    active = false;
    resetChip();
    send('guide_tour_stop', {
      reason: reason || 'chip',                      // what ended the run
      step_index: seen,                              // stops he had shown by then
      step_total: tourSteps ? tourSteps.length : 0,
      step_id: seenId || 'none'                      // 'none' = left before stop 1
    });
    hideBubble();
    root.classList.remove('gb--pointing');
    moveTo(-140, t);   // trot off-screen
  }

  function userAbort(reason) { if (active) { stop(reason || 'user_input'); } }

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
          if (active || greeting) { return; }
          // Log the visitors he can never greet, so a missing guide_greet in
          // the funnel reads as "phone / reduced motion", not "left too fast".
          if (disabled()) {
            send('guide_unavailable', { reason: reduced.matches ? 'reduced_motion' : 'small_or_touch' });
            return;
          }
          greet();
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
