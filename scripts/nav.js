(function () {
  window.toggleGroup = function (id) {
    document.querySelectorAll('.nav-group').forEach(function (g) {
      g.classList.toggle('is-open', g.id === id && !g.classList.contains('is-open'));
    });
  };

  // Nested subgroup (e.g. Cell) — toggles independently, doesn't touch the top-level accordion
  window.toggleSubgroup = function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('is-open');
  };

  document.addEventListener('DOMContentLoaded', function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash; // e.g. "#tab-bar-item" or ""

    // Auto-open the group that owns the current page
    var groupId = page === 'icons.html'    ? 'nav-icons'
                : page === 'index.html'    ? 'nav-atoms'
                : page === 'molecules.html' ? 'nav-molecules'
                : page === 'organisms.html' ? 'nav-components'
                : null;
    if (groupId) {
      var openGroup = document.getElementById(groupId);
      if (openGroup) openGroup.classList.add('is-open');
    }

    // Mark active link: exact href match wins; fallback to page-only match
    var fullHref = page + hash;
    var bestLink = null;
    var bestScore = -1;

    document.querySelectorAll('.sidebar__link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace(/^\.\//, '');
      var score = 0;
      if (href === fullHref) score = 2;
      else if (href.split('#')[0] === page && !href.includes('#') && hash === '') score = 1;
      else if (href.split('#')[0] === page && href.includes('#') && hash === '') score = 0;

      if (score > bestScore) { bestScore = score; bestLink = a; }
    });

    if (bestLink && bestScore > 0) {
      // Clear any pre-set active (e.g. hardcoded default) so only one link highlights
      document.querySelectorAll('.sidebar__link--active').forEach(function (el) {
        el.classList.remove('sidebar__link--active');
      });
      bestLink.classList.add('sidebar__link--active');
      // If the active link sits inside a collapsible subgroup, open it
      var sub = bestLink.closest('.nav-subgroup');
      if (sub) sub.classList.add('is-open');
    }
  });
})();
