/* ── Fire cursor (Pyroblast flame) ──
   Статичен по умолчанию. Анимация только на интерактивных элементах.
   Только для точного указателя (мышь/трекпад). */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var FLAME =
    '<svg viewBox="0 0 409 307" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M249.324 76.9167C291.071 148.851 443.435 96.031 401.741 183.922C415.53 141.849 364.618 146.799 364.618 146.799C364.618 146.799 329.151 147.618 315.736 168.159C302.393 196.013 288.866 196.613 288.866 196.613C288.874 196.613 301.02 204.612 327.595 177.698C343.395 161.7 358.767 146.703 382.296 169.43C349.825 163.895 341.564 208.512 311.95 229.751C287.761 247.097 248.727 246.49 244.061 247.068C227.801 249.097 217.725 253.281 214.119 259.501C210.444 265.843 214.296 272.841 220.848 275.407C230.567 279.212 248.211 275.481 273.314 264.315C249.007 291.723 215.246 307.297 182.436 306.1C121.945 303.902 85.6246 245.632 85.6246 245.632C85.6246 245.632 88.5709 267.493 96.8058 281.186C8.00492 224.816 -34.9518 122.691 34.422 44.5077C100.404 -29.849 201.443 -5.5833 249.324 76.9167ZM373.936 201.441C381.361 199.04 378.853 189.122 371.045 189.512C365.282 189.796 358.152 195.541 355.872 204.465C364.118 200.572 367.421 203.544 373.936 201.441ZM294.914 280.486C283.813 285.016 274.183 272.115 287.596 264.646C298.416 258.621 313.35 252.622 325.754 236.152C328.092 255.248 307.306 275.43 294.914 280.486Z" fill="currentColor"/>' +
    '</svg>';

  var el = document.createElement('div');
  el.className = 'fire-cursor';
  el.innerHTML = FLAME;

  var ANCHOR_X = 5;
  var ANCHOR_Y = 2;
  var x = -100, y = -100, raf = null;

  function render() {
    el.style.transform = 'translate3d(' + (x - ANCHOR_X) + 'px,' + (y - ANCHOR_Y) + 'px,0)';
    raf = null;
  }

  function onMove(e) {
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  }

  /* Интерактивные элементы — ссылки, кнопки, карточки, nav-items, курсор-pointer */
  var INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"], [role="link"], [role="tab"], .sidebar__link, .code-toggle-btn, .copy-code-btn, .nav-group__header';

  function isInteractive(target) {
    if (!target || !target.closest) return false;
    if (target.closest(INTERACTIVE)) return true;
    /* элементы, которым явно задан cursor: pointer в инлайн-стиле */
    var t = target;
    while (t && t !== document.body) {
      if (t.style && t.style.cursor === 'pointer') return true;
      t = t.parentElement;
    }
    return false;
  }

  function setHover(active) {
    if (active) {
      el.classList.add('fire-cursor--hover');
    } else {
      el.classList.remove('fire-cursor--hover');
      el.classList.remove('fire-cursor--press');
    }
  }

  function start() {
    document.documentElement.classList.add('fire-cursor-on');
    document.body.appendChild(el);

    window.addEventListener('mousemove', onMove, { passive: true });

    window.addEventListener('mousedown', function () {
      if (el.classList.contains('fire-cursor--hover')) {
        el.classList.add('fire-cursor--press');
      }
    });
    window.addEventListener('mouseup', function () {
      el.classList.remove('fire-cursor--press');
    });

    /* mouseover/mouseout с проверкой relatedTarget —
       анимация не мигает при переходе между дочерними узлами */
    document.addEventListener('mouseover', function (e) {
      if (isInteractive(e.target)) setHover(true);
    });

    document.addEventListener('mouseout', function (e) {
      /* снимаем hover только если курсор уходит за пределы интерактивной зоны */
      var leaving = e.target;
      var entering = e.relatedTarget;
      if (isInteractive(leaving) && !isInteractive(entering)) {
        setHover(false);
      }
    });

    /* курсор покинул окно */
    document.addEventListener('mouseleave', function () {
      el.style.opacity = '0';
      setHover(false);
    });
    document.addEventListener('mouseenter', function () {
      el.style.opacity = '1';
    });
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
