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
    '<svg viewBox="0 0 124 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="gb-blob-grad" cx="35%" cy="30%" r="85%"><stop offset="0%" style="stop-color:#A78BFA"/><stop offset="55%" style="stop-color:var(--color-accent-orange)"/><stop offset="100%" style="stop-color:var(--color-accent-orange-pressed)"/></radialGradient></defs><g class="gb__figure"><g class="gb__leg gb__leg--back"><path class="gb__fA" d="M21.5 104.5L24 97C36.6667 96.6667 61 104.5 61 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M63.998 137H58.498C59.6647 120.167 60.798 82 55.998 64" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M68.7505 115.952L63.2053 110.317C68.6636 98.8821 86.6978 80.7647 47.9473 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__leg gb__leg--front"><path class="gb__fA" d="M71.5 130L64.5 133.5C65.8333 118.167 64.9 83.5 50.5 67.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M31.5 133L35 136.5C38.6667 121.333 45.5 87.9 43.5 69.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M38.9365 126.627L31.1244 126.158C39.9457 113.545 56.4708 83.0564 52 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><g class="gb__fA" transform="translate(10 8)"><path d="M83.7192 47C85.8859 56.5 93.7192 74.6 107.719 71C121.719 67.4 119.553 42.1667 116.719 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__hand"><path d="M116.719 30L110.719 23.5M116.719 30V14M116.719 30L122.219 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></g><path class="gb__fD" transform="translate(8.5 8)" d="M83.2334 43.5788C80.3598 52.8894 78.0937 72.4811 92.018 76.3634C105.942 80.2458 116.683 57.3097 120.312 45.3564M120.312 45.3564L118.366 36.7272M120.312 45.3564L128.312 31.5M120.312 45.3564L131.075 37.7141" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><path class="gb__head" transform="translate(13 2) scale(1.15)" fill="url(#gb-blob-grad)"><animate attributeName="d" dur="10s" repeatCount="indefinite" calcMode="linear" values="M8.71 22.04C7.14 25.17 6.8 28.42 6.38 31.65C5.97 34.88 6.76 38.28 6.24 41.42C5.73 44.56 4.1 47.43 3.29 50.5C2.48 53.57 1.6 56.69 1.37 59.85C1.14 63.02 1.15 66.4 1.91 69.48C2.68 72.55 4.33 75.47 5.95 78.31C7.57 81.15 9.45 83.96 11.61 86.52C13.77 89.07 16.13 91.74 18.89 93.65C21.66 95.55 24.94 97.08 28.23 97.95C31.52 98.81 35.12 98.78 38.64 98.86C42.16 98.94 45.76 98.75 49.35 98.44C52.94 98.13 56.8 98.15 60.18 97C63.55 95.86 66.94 93.95 69.59 91.57C72.23 89.18 74.2 85.84 76.06 82.69C77.93 79.53 79.42 76.07 80.77 72.64C82.13 69.2 83.39 65.64 84.2 62.07C85.01 58.5 86.08 54.7 85.61 51.21C85.13 47.72 83.11 44.27 81.33 41.12C79.56 37.97 76.82 35.3 74.94 32.3C73.07 29.3 71.49 26.19 70.09 23.12C68.7 20.04 68.29 16.57 66.57 13.85C64.86 11.13 62.34 8.72 59.79 6.77C57.24 4.83 54.29 3.07 51.27 2.18C48.24 1.29 44.81 1.2 41.64 1.43C38.46 1.66 35.28 2.64 32.22 3.57C29.16 4.49 26.01 5.42 23.27 6.97C20.53 8.53 18.2 10.39 15.77 12.9C13.35 15.41 10.27 18.92 8.71 22.04Z;M9.34 20.62C7.76 23.61 6.81 27.55 6.18 31.1C5.55 34.65 6.22 38.52 5.55 41.93C4.89 45.35 3.01 48.34 2.2 51.59C1.38 54.84 0.63 58.16 0.64 61.43C0.66 64.71 1.22 68.18 2.3 71.25C3.39 74.32 5.28 77.18 7.16 79.84C9.03 82.5 11.22 84.98 13.55 87.19C15.89 89.4 18.42 91.53 21.17 93.11C23.93 94.68 27.01 95.85 30.07 96.64C33.13 97.43 36.33 97.72 39.52 97.86C42.7 98 46.01 97.94 49.18 97.49C52.36 97.05 55.67 96.51 58.56 95.2C61.46 93.89 64.1 91.79 66.57 89.65C69.05 87.5 71.26 84.91 73.41 82.33C75.57 79.74 77.65 77.06 79.5 74.15C81.34 71.23 83.24 68.14 84.48 64.85C85.71 61.56 87.04 57.87 86.92 54.43C86.8 50.99 85.19 47.49 83.75 44.21C82.32 40.93 79.97 37.99 78.29 34.73C76.6 31.47 75.01 28.08 73.65 24.66C72.3 21.24 71.92 17.35 70.15 14.23C68.39 11.1 65.82 8.23 63.08 5.93C60.35 3.64 57.08 1.57 53.75 0.45C50.41 -0.66 46.58 -0.96 43.06 -0.76C39.53 -0.56 35.94 0.53 32.6 1.64C29.26 2.74 25.83 3.95 23.01 5.88C20.18 7.8 17.94 10.73 15.66 13.18C13.38 15.64 10.92 17.64 9.34 20.62Z;M13.58 19.37C12.13 22.39 10.28 25.81 9.17 29.25C8.05 32.69 8.18 36.61 6.9 40.01C5.62 43.41 2.85 46.29 1.48 49.64C0.1 52.99 -1.14 56.56 -1.35 60.12C-1.56 63.69 -0.88 67.59 0.21 71.03C1.31 74.47 3.18 77.8 5.23 80.75C7.29 83.7 9.83 86.42 12.53 88.73C15.22 91.05 18.28 93.07 21.4 94.64C24.51 96.22 27.92 97.32 31.22 98.2C34.53 99.09 37.9 99.83 41.22 99.97C44.55 100.11 48.08 99.96 51.18 99.03C54.29 98.1 57.3 96.4 59.84 94.4C62.37 92.41 64.18 89.45 66.38 87.07C68.58 84.68 70.86 82.41 73.05 80.07C75.23 77.73 77.56 75.56 79.5 73.03C81.43 70.5 83.47 67.81 84.67 64.87C85.88 61.93 86.89 58.52 86.73 55.4C86.56 52.28 85 49.15 83.69 46.16C82.38 43.17 80.33 40.5 78.86 37.46C77.39 34.43 75.93 31.29 74.88 27.94C73.82 24.59 73.89 20.66 72.54 17.38C71.18 14.1 69.15 10.89 66.74 8.24C64.34 5.59 61.33 3.07 58.13 1.49C54.92 -0.09 51.12 -0.98 47.52 -1.23C43.92 -1.48 40.11 -0.81 36.52 -0.01C32.93 0.79 29.1 1.72 26 3.58C22.89 5.44 19.96 8.51 17.89 11.14C15.82 13.78 15.03 16.36 13.58 19.37Z;M15.23 21.13C13.78 24.31 12.39 26.98 11.37 30.07C10.35 33.17 10.47 36.66 9.1 39.69C7.73 42.73 4.77 45.22 3.14 48.28C1.52 51.34 -0.09 54.64 -0.66 58.05C-1.22 61.46 -0.98 65.28 -0.25 68.74C0.48 72.2 1.96 75.66 3.73 78.81C5.49 81.96 7.79 84.99 10.34 87.63C12.9 90.27 15.9 92.7 19.06 94.65C22.23 96.6 25.79 98.1 29.32 99.31C32.84 100.51 36.55 101.54 40.22 101.87C43.89 102.2 47.84 102.17 51.32 101.28C54.8 100.38 58.24 98.63 61.1 96.5C63.96 94.37 66.09 91.17 68.48 88.49C70.86 85.81 73.24 83.13 75.42 80.42C77.6 77.7 79.8 75.09 81.54 72.2C83.29 69.32 85.02 66.27 85.9 63.08C86.79 59.9 87.4 56.3 86.86 53.1C86.32 49.9 84.32 46.78 82.67 43.89C81.01 41.01 78.62 38.55 76.93 35.78C75.23 33 73.6 30.23 72.49 27.24C71.38 24.24 71.49 20.74 70.26 17.82C69.03 14.9 67.23 12.08 65.1 9.71C62.98 7.35 60.35 5.08 57.51 3.64C54.67 2.19 51.31 1.35 48.07 1.06C44.83 0.76 41.39 1.27 38.08 1.86C34.76 2.44 31.16 3.04 28.16 4.56C25.17 6.08 22.25 8.22 20.1 10.98C17.94 13.74 16.68 17.94 15.23 21.13Z;M10.09 23.06C8.55 26.23 8.19 29.39 7.72 32.54C7.24 35.69 7.92 38.98 7.26 41.97C6.59 44.97 4.73 47.62 3.72 50.52C2.72 53.41 1.62 56.34 1.22 59.36C0.81 62.37 0.68 65.62 1.32 68.61C1.95 71.6 3.47 74.47 5.02 77.29C6.57 80.11 8.44 82.93 10.62 85.54C12.8 88.14 15.23 90.89 18.09 92.92C20.95 94.95 24.35 96.64 27.77 97.71C31.2 98.77 34.96 99.03 38.63 99.31C42.3 99.59 46.1 99.6 49.81 99.38C53.53 99.15 57.49 99.14 60.91 97.97C64.34 96.81 67.69 94.82 70.35 92.39C73.01 89.96 75.01 86.61 76.86 83.4C78.72 80.18 80.19 76.65 81.48 73.1C82.78 69.56 83.95 65.85 84.62 62.13C85.3 58.42 86.17 54.44 85.55 50.82C84.93 47.2 82.76 43.64 80.89 40.42C79.01 37.2 76.21 34.49 74.3 31.51C72.39 28.52 70.78 25.48 69.42 22.49C68.07 19.5 67.77 16.16 66.18 13.56C64.59 10.97 62.26 8.71 59.88 6.91C57.49 5.1 54.73 3.5 51.87 2.73C49 1.95 45.73 1.96 42.67 2.25C39.61 2.55 36.52 3.57 33.51 4.5C30.49 5.43 27.35 6.31 24.59 7.81C21.83 9.31 19.37 10.95 16.95 13.49C14.53 16.03 11.62 19.88 10.09 23.06Z;M4.88 21.95C3.42 24.97 2.91 28.9 2.57 32.34C2.23 35.78 3.06 39.24 2.85 42.61C2.64 45.98 1.71 49.32 1.3 52.54C0.88 55.76 0.4 58.87 0.37 61.94C0.34 65 0.19 68.11 1.11 70.92C2.04 73.73 4.11 76.22 5.92 78.78C7.74 81.35 9.73 83.9 11.98 86.3C14.24 88.7 16.56 91.44 19.43 93.18C22.29 94.92 25.76 96.3 29.18 96.75C32.59 97.2 36.38 96.12 39.92 95.88C43.45 95.64 46.8 95.21 50.4 95.31C54 95.42 58.01 96.85 61.53 96.52C65.06 96.19 69.08 95.4 71.54 93.33C74 91.26 75.13 87.49 76.3 84.09C77.47 80.69 77.9 76.69 78.58 72.94C79.26 69.2 79.81 65.38 80.36 61.62C80.91 57.86 82.27 54.02 81.85 50.37C81.44 46.72 79.55 43.07 77.89 39.72C76.24 36.37 73.57 33.5 71.92 30.26C70.28 27.02 69.21 23.54 68.02 20.29C66.82 17.03 66.48 13.45 64.76 10.75C63.03 8.04 60.3 5.82 57.65 4.08C54.99 2.35 51.95 0.87 48.82 0.34C45.69 -0.19 42.14 0.26 38.85 0.89C35.56 1.51 32.27 2.87 29.08 4.11C25.89 5.35 22.66 6.63 19.7 8.31C16.75 9.99 13.81 11.91 11.34 14.19C8.87 16.46 6.34 18.92 4.88 21.95Z;M5.9 20.24C4.59 23.26 3.36 26.75 2.72 30.12C2.08 33.48 2.55 36.95 2.06 40.42C1.57 43.89 0.38 47.48 -0.23 50.96C-0.84 54.45 -1.48 57.93 -1.59 61.34C-1.7 64.75 -1.88 68.27 -0.87 71.43C0.13 74.59 2.39 77.44 4.42 80.28C6.45 83.12 8.76 85.92 11.31 88.45C13.86 90.98 16.54 93.79 19.73 95.48C22.91 97.17 26.74 98.39 30.41 98.59C34.09 98.8 38.12 97.32 41.79 96.72C45.47 96.13 48.86 95.24 52.44 95.01C56.03 94.77 59.93 95.89 63.3 95.3C66.67 94.7 70.47 93.69 72.64 91.45C74.82 89.21 75.53 85.28 76.33 81.85C77.14 78.42 77.14 74.46 77.49 70.86C77.84 67.26 78.07 63.71 78.43 60.24C78.78 56.77 80.04 53.34 79.61 50.05C79.18 46.76 77.36 43.52 75.84 40.51C74.32 37.49 71.89 34.95 70.51 31.93C69.13 28.91 68.44 25.58 67.57 22.39C66.7 19.19 66.73 15.56 65.3 12.74C63.86 9.93 61.42 7.48 58.97 5.49C56.51 3.49 53.63 1.66 50.56 0.79C47.49 -0.08 43.92 -0.02 40.53 0.27C37.15 0.56 33.67 1.57 30.25 2.55C26.83 3.54 23.28 4.61 20 6.18C16.73 7.75 12.95 9.63 10.6 11.97C8.25 14.31 7.22 17.21 5.9 20.24Z;M8.83 21.02C7.45 24.17 6.51 26.96 5.87 30.06C5.23 33.15 5.67 36.4 4.96 39.59C4.25 42.79 2.57 45.93 1.63 49.21C0.68 52.48 -0.34 55.85 -0.71 59.26C-1.08 62.66 -1.35 66.31 -0.6 69.64C0.16 72.96 2.02 76.12 3.82 79.2C5.61 82.28 7.75 85.36 10.18 88.12C12.62 90.88 15.3 93.82 18.45 95.76C21.6 97.7 25.37 99.17 29.07 99.75C32.77 100.33 36.83 99.58 40.63 99.25C44.43 98.92 48.15 98.24 51.88 97.77C55.62 97.3 59.61 97.58 63.03 96.45C66.44 95.32 70.01 93.55 72.37 91C74.72 88.46 75.97 84.61 77.18 81.17C78.38 77.72 78.95 73.91 79.62 70.34C80.29 66.77 80.81 63.22 81.18 59.76C81.56 56.3 82.49 52.81 81.87 49.58C81.24 46.35 79.17 43.25 77.43 40.39C75.7 37.53 73.08 35.2 71.48 32.43C69.87 29.66 68.81 26.7 67.8 23.75C66.79 20.8 66.79 17.42 65.42 14.75C64.04 12.07 61.82 9.67 59.54 7.68C57.26 5.68 54.6 3.78 51.74 2.76C48.88 1.73 45.56 1.5 42.39 1.54C39.23 1.58 35.97 2.3 32.73 3.01C29.5 3.72 26.09 4.45 22.99 5.81C19.89 7.16 16.47 8.62 14.11 11.15C11.75 13.69 10.2 17.86 8.83 21.02Z;M8.71 22.04C7.14 25.17 6.8 28.42 6.38 31.65C5.97 34.88 6.76 38.28 6.24 41.42C5.73 44.56 4.1 47.43 3.29 50.5C2.48 53.57 1.6 56.69 1.37 59.85C1.14 63.02 1.15 66.4 1.91 69.48C2.68 72.55 4.33 75.47 5.95 78.31C7.57 81.15 9.45 83.96 11.61 86.52C13.77 89.07 16.13 91.74 18.89 93.65C21.66 95.55 24.94 97.08 28.23 97.95C31.52 98.81 35.12 98.78 38.64 98.86C42.16 98.94 45.76 98.75 49.35 98.44C52.94 98.13 56.8 98.15 60.18 97C63.55 95.86 66.94 93.95 69.59 91.57C72.23 89.18 74.2 85.84 76.06 82.69C77.93 79.53 79.42 76.07 80.77 72.64C82.13 69.2 83.39 65.64 84.2 62.07C85.01 58.5 86.08 54.7 85.61 51.21C85.13 47.72 83.11 44.27 81.33 41.12C79.56 37.97 76.82 35.3 74.94 32.3C73.07 29.3 71.49 26.19 70.09 23.12C68.7 20.04 68.29 16.57 66.57 13.85C64.86 11.13 62.34 8.72 59.79 6.77C57.24 4.83 54.29 3.07 51.27 2.18C48.24 1.29 44.81 1.2 41.64 1.43C38.46 1.66 35.28 2.64 32.22 3.57C29.16 4.49 26.01 5.42 23.27 6.97C20.53 8.53 18.2 10.39 15.77 12.9C13.35 15.41 10.27 18.92 8.71 22.04Z"/></path><g class="gb__arm gb__arm--back"><path class="gb__fA" d="M32.219 50.4999C25.3857 44.9999 10.419 35.7999 5.21901 42.9999C0.0190084 50.1999 1.38567 64.9999 2.71901 71.4999M2.71901 71.4999L8.21924 82.9999M2.71901 71.4999L8.21924 69.9999M2.71901 71.4999V81.9999" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(0 0)" d="M25.5 57.5L7.79032 84M1.5 92L7.79032 84M1.5 84H7.79032M7.79032 84L6 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M31.6752 44.7846C23.0073 43.4381 5.4458 42.954 4.54247 51.7894C3.63913 60.6248 12.2227 72.7586 16.6274 77.7211M16.6274 77.7211L27.1407 84.9303M16.6274 77.7211L20.6407 73.672M16.6274 77.7211L21.8774 86.8144" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><path class="gb__fB" transform="translate(20 0)" d="M82.5 57.5L100.2 84M106.5 92L100.2 84M106.5 84H100.2M100.2 84L102 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fC" transform="translate(8 -3.5)" d="M92.9998 1.50024C93.6845 5.60853 94.4317 10.8004 95.0916 16.5002C97.3231 35.7738 98.5565 60.8565 92.9998 69.5002C85.7998 80.7002 76.3331 69.8336 72.4998 63.0002M95.0916 16.5002C97.2277 13.8336 104 13.5002 99.4999 22.5002" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__face gb__face--A"><path class="gb__mouth gb__mouth--a" d="M64 50C64.3333 51.3333 66.3 54 69.5 54C72.7 54 74.5 51.3333 75 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--al"><mask id="gb-eye-al" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="48" y="23" width="22" height="22"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-al)"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="57" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="60" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--ar"><mask id="gb-eye-ar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="68" y="23" width="22" height="22"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-ar)"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="81" cy="35" r="6" fill="currentColor"/><circle cx="77" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="80" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g></g><g class="gb__face gb__face--B" transform="translate(8 0)"><path class="gb__mouth gb__mouth--b" d="M46 50C46.3333 51.3333 48.3 54 51.5 54C54.7 54 56.5 51.3333 57 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--bl"><mask id="gb-eye-bl" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="30" y="23" width="22" height="22"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-bl)"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="41" cy="35" r="6" fill="currentColor"/><circle cx="39" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="42" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="43.5" cy="31" r="6" fill="currentColor"/><circle cx="41.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="44.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--br"><mask id="gb-eye-br" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="23" width="22" height="22"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-br)"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="59" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="62" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="63.5" cy="31" r="6" fill="currentColor"/><circle cx="61.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="64.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g></g></g></svg>';

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
