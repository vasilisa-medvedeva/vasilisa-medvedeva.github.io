(function () {
  window.toggleGroup = function (id) {
    document.querySelectorAll('.nav-group').forEach(function (g) {
      g.classList.toggle('is-open', g.id === id && !g.classList.contains('is-open'));
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    var page = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash; // e.g. "#tab-bar-item" or ""

    // Auto-open the group that owns the current page
    var groupId = page === 'icons.html' ? 'nav-icons'
                : page === 'index.html' ? 'nav-atoms'
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

    if (bestLink && bestScore > 0) bestLink.classList.add('sidebar__link--active');
  });
})();
