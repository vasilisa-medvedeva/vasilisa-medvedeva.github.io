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
    '<svg viewBox="0 0 124 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><radialGradient id="gb-blob-grad" cx="35%" cy="30%" r="85%"><stop offset="0%" stop-color="#A78BFA"/><stop offset="55%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#7C3AED"/></radialGradient></defs><g class="gb__figure"><g class="gb__leg gb__leg--back"><path class="gb__fA" d="M21.5 104.5L24 97C36.6667 96.6667 61 104.5 61 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M63.998 137H58.498C59.6647 120.167 60.798 82 55.998 64" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M68.7505 115.952L63.2053 110.317C68.6636 98.8821 86.6978 80.7647 47.9473 61" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__leg gb__leg--front"><path class="gb__fA" d="M71.5 130L64.5 133.5C65.8333 118.167 64.9 83.5 50.5 67.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(8 0)" d="M31.5 133L35 136.5C38.6667 121.333 45.5 87.9 43.5 69.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M38.9365 126.627L31.1244 126.158C39.9457 113.545 56.4708 83.0564 52 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><g class="gb__fA" transform="translate(10 8)"><path d="M83.7192 47C85.8859 56.5 93.7192 74.6 107.719 71C121.719 67.4 119.553 42.1667 116.719 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__hand"><path d="M116.719 30L110.719 23.5M116.719 30V14M116.719 30L122.219 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g></g><path class="gb__fD" transform="translate(8.5 8)" d="M83.2334 43.5788C80.3598 52.8894 78.0937 72.4811 92.018 76.3634C105.942 80.2458 116.683 57.3097 120.312 45.3564M120.312 45.3564L118.366 36.7272M120.312 45.3564L128.312 31.5M120.312 45.3564L131.075 37.7141" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><path class="gb__head" transform="translate(13 2) scale(1.15)" fill="url(#gb-blob-grad)"><animate attributeName="d" dur="10s" repeatCount="indefinite" calcMode="linear" values="M8.71 24.14C7.03 27.37 7.51 30.43 7.39 33.5C7.28 36.57 8.34 39.7 8.01 42.56C7.68 45.42 6.17 47.91 5.38 50.65C4.6 53.39 3.65 56.12 3.28 58.98C2.91 61.84 2.68 64.92 3.17 67.79C3.66 70.67 4.96 73.44 6.25 76.24C7.53 79.03 9.03 81.88 10.88 84.55C12.72 87.22 14.76 90.12 17.31 92.28C19.85 94.44 22.95 96.31 26.17 97.5C29.39 98.7 33.01 99.05 36.62 99.45C40.24 99.86 44.04 100 47.87 99.93C51.69 99.86 55.89 100.07 59.59 99.02C63.29 97.97 67.06 96.08 70.04 93.62C73.01 91.16 75.32 87.64 77.44 84.27C79.56 80.89 81.27 77.11 82.74 73.36C84.21 69.61 85.52 65.67 86.28 61.77C87.03 57.86 87.96 53.7 87.28 49.94C86.6 46.18 84.28 42.5 82.2 39.21C80.12 35.92 77 33.18 74.79 30.21C72.58 27.23 70.63 24.25 68.95 21.35C67.27 18.46 66.6 15.28 64.73 12.85C62.85 10.42 60.24 8.39 57.69 6.78C55.14 5.17 52.29 3.79 49.43 3.2C46.56 2.6 43.4 2.79 40.51 3.2C37.62 3.62 34.8 4.71 32.08 5.66C29.35 6.61 26.59 7.47 24.15 8.88C21.72 10.3 20.04 11.61 17.46 14.15C14.89 16.69 10.39 20.92 8.71 24.14Z;M7.24 20.62C5.56 23.49 4.81 28.26 4.34 32.11C3.87 35.95 4.8 40.1 4.42 43.7C4.03 47.3 2.53 50.42 2.05 53.69C1.56 56.96 1.19 60.2 1.52 63.34C1.84 66.48 2.7 69.71 3.99 72.51C5.27 75.31 7.31 77.81 9.23 80.14C11.16 82.46 13.3 84.56 15.52 86.46C17.74 88.35 20.05 90.16 22.55 91.52C25.05 92.87 27.78 93.87 30.51 94.59C33.24 95.31 36.06 95.61 38.92 95.85C41.79 96.08 44.76 96.22 47.69 96.01C50.63 95.81 53.74 95.6 56.55 94.61C59.35 93.63 61.98 91.92 64.52 90.1C67.07 88.28 69.45 86.04 71.83 83.71C74.2 81.38 76.61 78.91 78.77 76.12C80.93 73.32 83.21 70.26 84.78 66.93C86.35 63.59 88.04 59.75 88.19 56.1C88.33 52.46 86.97 48.66 85.67 45.08C84.37 41.49 82.09 38.17 80.38 34.57C78.67 30.98 76.95 27.22 75.42 23.52C73.88 19.82 73.21 15.66 71.15 12.38C69.1 9.1 66.15 6.13 63.08 3.83C60.01 1.54 56.36 -0.43 52.73 -1.39C49.1 -2.34 44.99 -2.37 41.28 -1.89C37.58 -1.4 33.87 0.06 30.51 1.5C27.14 2.94 23.78 4.53 21.1 6.76C18.42 8.99 16.72 12.56 14.41 14.87C12.1 17.18 8.91 17.75 7.24 20.62Z;M13.58 17.27C12.24 20.19 9.57 23.81 8.16 27.41C6.75 31.01 6.59 35.2 5.13 38.88C3.67 42.56 0.78 45.8 -0.62 49.49C-2.02 53.18 -3.19 57.13 -3.26 61C-3.33 64.87 -2.41 69.08 -1.04 72.71C0.32 76.35 2.55 79.83 4.94 82.83C7.32 85.83 10.26 88.5 13.26 90.7C16.27 92.9 19.65 94.69 22.99 96.02C26.32 97.34 29.9 98.09 33.27 98.65C36.65 99.21 40.01 99.56 43.24 99.37C46.47 99.19 49.8 98.7 52.66 97.54C55.53 96.37 58.21 94.47 60.42 92.39C62.63 90.3 64.05 87.33 65.93 85.01C67.8 82.7 69.74 80.61 71.67 78.49C73.6 76.37 75.71 74.52 77.53 72.3C79.35 70.08 81.34 67.78 82.6 65.18C83.85 62.57 85.01 59.52 85.05 56.67C85.09 53.82 83.83 50.92 82.82 48.07C81.82 45.22 80.15 42.62 79.02 39.56C77.89 36.49 76.79 33.23 76.02 29.7C75.25 26.17 75.58 21.96 74.38 18.38C73.19 14.8 71.25 11.21 68.84 8.23C66.44 5.24 63.33 2.35 59.96 0.48C56.6 -1.4 52.53 -2.58 48.65 -3.01C44.76 -3.44 40.58 -2.88 36.66 -2.1C32.74 -1.32 28.53 -0.33 25.12 1.67C21.71 3.67 18.12 7.29 16.2 9.89C14.27 12.49 14.92 14.36 13.58 17.27Z;M17.33 21.13C15.97 24.42 14.4 26.26 13.21 29.06C12.03 31.87 11.89 35.07 10.23 37.93C8.58 40.78 5.25 43.15 3.29 46.19C1.33 49.22 -0.66 52.59 -1.53 56.14C-2.4 59.69 -2.46 63.76 -1.93 67.49C-1.4 71.22 -0.07 75.04 1.65 78.51C3.37 81.99 5.7 85.41 8.38 88.36C11.05 91.32 14.27 94.07 17.69 96.24C21.11 98.41 25.02 100.09 28.88 101.36C32.73 102.63 36.83 103.65 40.82 103.88C44.8 104.11 49.09 103.89 52.81 102.76C56.53 101.63 60.16 99.54 63.12 97.09C66.07 94.64 68.21 91.05 70.53 88.04C72.84 85.03 75.04 82.01 77 79.04C78.96 76.07 80.84 73.24 82.27 70.24C83.7 67.23 85.04 64.14 85.6 61.01C86.15 57.87 86.4 54.42 85.59 51.42C84.78 48.43 82.55 45.61 80.75 43.03C78.96 40.45 76.5 38.38 74.83 35.94C73.16 33.49 71.66 31.09 70.73 28.38C69.8 25.67 70.2 22.43 69.26 19.67C68.32 16.91 66.9 14.18 65.11 11.81C63.32 9.45 61.07 7.08 58.53 5.48C55.98 3.87 52.9 2.76 49.84 2.18C46.78 1.6 43.47 1.75 40.17 2C36.88 2.24 33.21 2.46 30.07 3.67C26.93 4.89 23.47 6.39 21.35 9.29C19.22 12.2 18.69 17.83 17.33 21.13Z;M10.09 25.16C8.43 28.43 8.9 31.39 8.72 34.38C8.55 37.38 9.51 40.4 9.03 43.11C8.54 45.82 6.8 48.1 5.82 50.66C4.84 53.23 3.67 55.77 3.13 58.48C2.58 61.2 2.21 64.14 2.57 66.93C2.94 69.72 4.1 72.44 5.32 75.21C6.53 77.99 8.02 80.85 9.88 83.57C11.74 86.3 13.86 89.27 16.5 91.55C19.14 93.83 22.37 95.87 25.72 97.26C29.07 98.66 32.85 99.31 36.62 99.91C40.38 100.51 44.38 100.85 48.33 100.87C52.28 100.88 56.58 101.06 60.33 99.99C64.07 98.92 67.81 96.95 70.8 94.44C73.79 91.94 76.13 88.42 78.24 84.98C80.35 81.55 82.04 77.69 83.45 73.83C84.86 69.97 86.07 65.87 86.7 61.83C87.33 57.78 88.05 53.44 87.23 49.56C86.4 45.67 83.94 41.87 81.75 38.51C79.57 35.15 76.39 32.38 74.14 29.41C71.9 26.45 69.92 23.53 68.28 20.73C66.65 17.92 66.08 14.87 64.33 12.57C62.58 10.26 60.16 8.39 57.78 6.92C55.39 5.45 52.73 4.22 50.03 3.74C47.32 3.26 44.32 3.55 41.55 4.03C38.77 4.5 36.05 5.65 33.37 6.6C30.69 7.54 27.93 8.36 25.48 9.72C23.02 11.08 21.2 12.17 18.64 14.74C16.07 17.31 11.74 21.89 10.09 25.16Z;M2.78 21.95C1.22 24.86 0.9 29.61 0.72 33.35C0.55 37.08 1.64 40.83 1.71 44.38C1.79 47.93 1.23 51.39 1.15 54.63C1.07 57.88 0.96 60.92 1.24 63.85C1.51 66.77 1.67 69.64 2.8 72.18C3.92 74.71 6.14 76.85 8 79.08C9.86 81.31 11.82 83.48 13.95 85.57C16.08 87.65 18.19 90.07 20.8 91.59C23.41 93.11 26.53 94.31 29.62 94.69C32.71 95.07 36.11 94.01 39.32 93.87C42.54 93.73 45.55 93.49 48.91 93.83C52.28 94.17 56.09 95.94 59.52 95.94C62.95 95.93 66.96 95.53 69.49 93.78C72.02 92.04 73.32 88.61 74.72 85.47C76.11 82.32 76.86 78.54 77.85 74.91C78.84 71.29 79.79 67.51 80.66 63.7C81.54 59.89 83.26 55.9 83.12 52.04C82.98 48.19 81.32 44.24 79.81 40.58C78.29 36.93 75.69 33.67 74.02 30.1C72.35 26.53 71.16 22.68 69.78 19.14C68.4 15.61 67.78 11.76 65.76 8.9C63.73 6.04 60.63 3.71 57.64 1.98C54.65 0.25 51.23 -1.13 47.8 -1.5C44.38 -1.87 40.54 -1.15 37.08 -0.24C33.61 0.67 30.2 2.4 26.99 3.97C23.78 5.54 20.62 7.21 17.8 9.19C14.98 11.18 12.59 13.75 10.09 15.88C7.59 18 4.34 19.04 2.78 21.95Z;M5.9 18.14C4.7 21.06 2.65 24.75 1.71 28.28C0.78 31.8 0.97 35.53 0.29 39.29C-0.38 43.04 -1.69 46.99 -2.33 50.81C-2.96 54.63 -3.53 58.49 -3.5 62.21C-3.47 65.93 -3.4 69.75 -2.13 73.11C-0.86 76.47 1.76 79.48 4.13 82.36C6.49 85.24 9.18 88 12.04 90.42C14.91 92.83 17.91 95.42 21.32 96.85C24.72 98.29 28.72 99.16 32.47 99.04C36.22 98.91 40.23 97.05 43.81 96.13C47.38 95.21 50.58 93.99 53.92 93.52C57.27 93.04 60.84 93.97 63.89 93.28C66.93 92.59 70.35 91.57 72.19 89.4C74.04 87.23 74.4 83.47 74.95 80.26C75.51 77.05 75.29 73.42 75.52 70.14C75.75 66.85 75.95 63.68 76.35 60.55C76.75 57.41 78.17 54.33 77.94 51.31C77.71 48.29 76.19 45.3 74.98 42.42C73.76 39.54 71.71 37.07 70.67 34.02C69.62 30.98 69.3 27.53 68.71 24.15C68.13 20.77 68.42 16.85 67.14 13.74C65.87 10.63 63.52 7.8 61.07 5.48C58.61 3.15 55.63 0.94 52.4 -0.23C49.16 -1.39 45.33 -1.62 41.66 -1.5C37.99 -1.39 34.15 -0.5 30.39 0.46C26.63 1.42 22.7 2.57 19.12 4.28C15.54 5.99 11.12 8.41 8.91 10.72C6.71 13.03 7.1 15.21 5.9 18.14Z;M10.93 21.02C9.65 24.28 8.52 26.25 7.71 29.05C6.91 31.85 7.09 34.82 6.1 37.83C5.11 40.84 3.06 43.86 1.78 47.11C0.5 50.37 -0.91 53.8 -1.59 57.35C-2.26 60.89 -2.83 64.79 -2.28 68.38C-1.73 71.97 -0.01 75.49 1.74 78.91C3.49 82.32 5.66 85.78 8.22 88.85C10.77 91.93 13.68 95.19 17.08 97.35C20.48 99.51 24.6 101.15 28.63 101.81C32.65 102.46 37.1 101.69 41.23 101.27C45.35 100.84 49.4 99.96 53.37 99.25C57.34 98.55 61.54 98.49 65.04 97.04C68.55 95.59 72.13 93.43 74.42 90.55C76.7 87.68 77.77 83.49 78.76 79.79C79.75 76.09 79.99 72.06 80.35 68.37C80.7 64.69 80.84 61.1 80.88 57.69C80.92 54.28 81.49 50.93 80.6 47.91C79.71 44.88 77.39 42.08 75.52 39.52C73.65 36.97 70.96 35.03 69.38 32.59C67.8 30.15 66.86 27.56 66.04 24.89C65.21 22.23 65.5 19.11 64.42 16.59C63.34 14.07 61.5 11.77 59.55 9.78C57.61 7.78 55.32 5.78 52.75 4.6C50.19 3.41 47.15 2.91 44.17 2.67C41.18 2.42 38.04 2.77 34.83 3.15C31.61 3.52 28.14 3.87 24.89 4.92C21.65 5.98 17.69 6.78 15.36 9.46C13.04 12.15 12.2 17.75 10.93 21.02Z;M8.71 24.14C7.03 27.37 7.51 30.43 7.39 33.5C7.28 36.57 8.34 39.7 8.01 42.56C7.68 45.42 6.17 47.91 5.38 50.65C4.6 53.39 3.65 56.12 3.28 58.98C2.91 61.84 2.68 64.92 3.17 67.79C3.66 70.67 4.96 73.44 6.25 76.24C7.53 79.03 9.03 81.88 10.88 84.55C12.72 87.22 14.76 90.12 17.31 92.28C19.85 94.44 22.95 96.31 26.17 97.5C29.39 98.7 33.01 99.05 36.62 99.45C40.24 99.86 44.04 100 47.87 99.93C51.69 99.86 55.89 100.07 59.59 99.02C63.29 97.97 67.06 96.08 70.04 93.62C73.01 91.16 75.32 87.64 77.44 84.27C79.56 80.89 81.27 77.11 82.74 73.36C84.21 69.61 85.52 65.67 86.28 61.77C87.03 57.86 87.96 53.7 87.28 49.94C86.6 46.18 84.28 42.5 82.2 39.21C80.12 35.92 77 33.18 74.79 30.21C72.58 27.23 70.63 24.25 68.95 21.35C67.27 18.46 66.6 15.28 64.73 12.85C62.85 10.42 60.24 8.39 57.69 6.78C55.14 5.17 52.29 3.79 49.43 3.2C46.56 2.6 43.4 2.79 40.51 3.2C37.62 3.62 34.8 4.71 32.08 5.66C29.35 6.61 26.59 7.47 24.15 8.88C21.72 10.3 20.04 11.61 17.46 14.15C14.89 16.69 10.39 20.92 8.71 24.14Z"/></path><g class="gb__arm gb__arm--back"><path class="gb__fA" d="M32.219 50.4999C25.3857 44.9999 10.419 35.7999 5.21901 42.9999C0.0190084 50.1999 1.38567 64.9999 2.71901 71.4999M2.71901 71.4999L8.21924 82.9999M2.71901 71.4999L8.21924 69.9999M2.71901 71.4999V81.9999" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fB" transform="translate(0 0)" d="M25.5 57.5L7.79032 84M1.5 92L7.79032 84M1.5 84H7.79032M7.79032 84L6 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fD" transform="translate(-1.5 0)" d="M31.6752 44.7846C23.0073 43.4381 5.4458 42.954 4.54247 51.7894C3.63913 60.6248 12.2227 72.7586 16.6274 77.7211M16.6274 77.7211L27.1407 84.9303M16.6274 77.7211L20.6407 73.672M16.6274 77.7211L21.8774 86.8144" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__arm gb__arm--front"><path class="gb__fB" transform="translate(20 0)" d="M82.5 57.5L100.2 84M106.5 92L100.2 84M106.5 84H100.2M100.2 84L102 94" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path class="gb__fC" transform="translate(99.5 -3.5)" d="M1.50016 1.50024C2.18488 5.60853 2.93211 10.8004 3.59203 16.5002C5.82351 35.7738 7.05685 60.8565 1.50016 69.5002M3.59203 16.5002C5.72805 13.8336 12.4999 13.5002 8.00029 22.5002" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g><g class="gb__face gb__face--A"><path class="gb__mouth gb__mouth--a" d="M64 50C64.3333 51.3333 66.3 54 69.5 54C72.7 54 74.5 51.3333 75 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--al"><mask id="gb-eye-al" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="48" y="23" width="22" height="22"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-al)"><circle cx="59" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="57" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="60" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--ar"><mask id="gb-eye-ar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="68" y="23" width="22" height="22"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-ar)"><circle cx="79" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil"><circle cx="81" cy="35" r="6" fill="currentColor"/><circle cx="77" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="80" cy="35" r="1" fill="var(--color-constant-primary)"/></g></g></g></g><g class="gb__face gb__face--B" transform="translate(8 0)"><path class="gb__mouth gb__mouth--b" d="M46 50C46.3333 51.3333 48.3 54 51.5 54C54.7 54 56.5 51.3333 57 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><g class="gb__eye gb__eye--bl"><mask id="gb-eye-bl" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="30" y="23" width="22" height="22"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-bl)"><circle cx="41" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="41" cy="35" r="6" fill="currentColor"/><circle cx="39" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="42" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="43.5" cy="31" r="6" fill="currentColor"/><circle cx="41.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="44.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g><g class="gb__eye gb__eye--br"><mask id="gb-eye-br" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="23" width="22" height="22"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/></mask><g mask="url(#gb-eye-br)"><circle cx="61" cy="34" r="11" fill="var(--color-constant-primary)"/><g class="gb__pupil gb__pupil--rest"><circle cx="61" cy="35" r="6" fill="currentColor"/><circle cx="59" cy="33" r="2" fill="var(--color-constant-primary)"/><circle cx="62" cy="35" r="1" fill="var(--color-constant-primary)"/></g><g class="gb__pupil gb__pupil--up"><circle cx="63.5" cy="31" r="6" fill="currentColor"/><circle cx="61.5" cy="29" r="2" fill="var(--color-constant-primary)"/><circle cx="64.5" cy="31" r="1" fill="var(--color-constant-primary)"/></g></g></g></g><g class="gb__face gb__face--laugh" transform="translate(8 0)"><path d="M34 36 Q41 27 48 36" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M54 36 Q61 27 68 36" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/><path transform="translate(42.5 47) scale(0.9)" d="M1 0.5C8 0.5 16 1.5 20 3.5C21 5 21 7 19.5 8.5C16 11 12 12 9.5 11.5C6.5 11 4 8.5 2.5 5.5C1.5 3.5 0.5 1.5 1 0.5Z" fill="var(--color-constant-transparent-87)"/></g></g></svg>';

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
