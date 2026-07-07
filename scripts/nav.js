(function () {
  // ─────────────────────────────────────────────────────────────
  // Canonical navigation — SINGLE SOURCE OF TRUTH for every page.
  // Add a component once here and it appears in the sidebar everywhere.
  // Item = [href, label]. Subgroup = { id, label, items: [ [href,label], … ] }.
  // ─────────────────────────────────────────────────────────────
  var NAV = [
    { id: 'nav-styles', label: 'Styles', items: [
      ['typography.html', 'Typography'],
      ['colors.html', 'Colors'],
    ]},
    { id: 'nav-icons', label: 'Icons', items: [
      ['icons.html', 'Tab bar'],
      ['icons.html#chats', 'Chats'],
      ['icons.html#menu', 'Menu'],
      ['icons.html#general', 'General'],
      ['icons.html#small', 'Small'],
      ['icons.html#loader', 'Loader'],
    ]},
    { id: 'nav-atoms', label: 'Atoms', items: [
      ['index.html#chips', 'VideoChip'],
      ['index.html#preview', 'Preview'],
      ['index.html#preview-doc-chat', 'PreviewDocChat'],
      ['index.html#button', 'Button'],
      ['index.html#toggle', 'Toggle'],
      ['index.html#tab-profile', 'TabProfile'],
      ['index.html#tab-item', 'TabItem'],
      ['index.html#avatar', 'Avatar'],
      ['index.html#channel-avatar', 'ChannelAvatar'],
      ['index.html#statusbar', 'Statusbar'],
      ['index.html#notification-counter', 'NotificationCounter'],
      ['index.html#separator-message', 'SeparatorMessage'],
      ['index.html#info-title', 'InfoTitle'],
      ['index.html#bubble-2', 'Bubble2.0'],
      ['index.html#send-time', 'SendTime'],
      ['index.html#reaction', 'Reaction'],
      ['index.html#reaction-arrow', 'ReactionArrow'],
      ['index.html#bubble-comments', 'BubbleComments'],
      ['index.html#cell-menu', 'CellMenu'],
      ['index.html#emoji-badge', 'EmojiBadge'],
      ['index.html#tag-chip', 'Chip'],
      ['index.html#allocation', 'Allocation'],
      ['index.html#menu-compact-item', 'MenuCompactItem'],
    ]},
    { id: 'nav-molecules', label: 'Molecules', items: [
      { id: 'sub-cell', label: 'Cell', items: [
        ['molecules.html#cell-base', 'CellBase'],
        ['molecules.html#table-rows-chats', 'TableRowsChats'],
        ['molecules.html#cell-toggle', 'CellToggle'],
        ['molecules.html#cell-contact', 'CellContact'],
        ['molecules.html#cell-activity', 'CellActivity'],
        ['molecules.html#cell-separator', 'CellSeparator'],
        ['molecules.html#cell-category', 'CellCategory'],
        ['molecules.html#cell-subchannel', 'CellSubchannel'],
        ['molecules.html#cell-links', 'CellLinks'],
      ]},
      { id: 'sub-field', label: 'Field', items: [
        ['molecules.html#text-fields', 'TextFields'],
        ['molecules.html#search-field', 'SearchField'],
        ['molecules.html#tf-s', 'TextFields.S'],
        ['molecules.html#tf-l', 'TextFields.L'],
        ['molecules.html#tf-bar', 'TextFieldsBar'],
      ]},
      ['molecules.html#photo-placeholder', 'PhotoPlaceholder'],
      ['molecules.html#gallery', 'Gallery'],
      ['molecules.html#card-profile-text', 'CardProfileText'],
      ['molecules.html#tabs', 'Tabs'],
      ['molecules.html#top-bar', 'TopBar'],
      ['molecules.html#swipe-tab-item', 'SwipeTabItem'],
      ['molecules.html#top-search-bar', 'TopSearchBar'],
      ['molecules.html#text-reply', 'TextReply'],
      ['molecules.html#above-text-field', 'AboveTheTextField'],
      ['molecules.html#bubble-bottom-2', 'BubbleBottom 2.0'],
      ['molecules.html#message', 'Message'],
      ['molecules.html#dropdown-menu', 'DropdownMenu'],
      ['molecules.html#menu-compact', 'MenuCompact'],
    ]},
    { id: 'nav-components', label: 'Organisms', items: [
      ['organisms.html#card-profile', 'CardProfile'],
      ['organisms.html#confirm-dialog', 'ConfirmDialog'],
      ['organisms.html#dropdown-row', 'DropdownRow'],
    ]},
  ];

  function chevron(cls) {
    return '<svg class="' + cls + '" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function link(item) {
    return '<a class="sidebar__link" href="' + item[0] + '">' + item[1] + '</a>';
  }
  function items(list) {
    return list.map(function (it) {
      if (Array.isArray(it)) return link(it);
      return '<div class="nav-subgroup" id="' + it.id + '">' +
        '<button class="nav-subgroup__header" onclick="toggleSubgroup(\'' + it.id + '\')">' +
        chevron('nav-subgroup__chevron') + it.label + '</button>' +
        '<div class="nav-subgroup__items">' + it.items.map(link).join('') + '</div></div>';
    }).join('');
  }
  function buildSidebar() {
    var html = '<a class="sidebar__logo" href="home.html"><img src="assets/pyroblast-logo.svg" alt="Pyroblast" /></a>';
    html += NAV.map(function (g) {
      return '<div class="nav-group" id="' + g.id + '">' +
        '<button class="nav-group__header" onclick="toggleGroup(\'' + g.id + '\')">' + g.label +
        chevron('nav-group__chevron') + '</button>' +
        '<div class="nav-group__items">' + items(g.items) + '</div></div>';
    }).join('');
    return html;
  }

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
    var sidebar = document.querySelector('.sidebar');

    // Embedded library preview (?embed=1) — strip the chrome, show only the components
    if (location.search.indexOf('embed') !== -1) {
      document.body.classList.add('lib-embed');
      if (sidebar) sidebar.remove();
      var main = document.querySelector('.main');
      if (main) { main.style.marginLeft = '0'; main.style.padding = '24px'; }
      var pt = document.querySelector('.page-title'); if (pt) pt.style.display = 'none';
      var ps = document.querySelector('.page-subtitle'); if (ps) ps.style.display = 'none';
      return;
    }

    if (sidebar) sidebar.innerHTML = buildSidebar();

    var page = location.pathname.split('/').pop() || 'index.html';
    var hash = location.hash; // e.g. "#tab-bar-item" or ""

    // Auto-open the group that owns the current page
    var groupId = page === 'icons.html'      ? 'nav-icons'
                : page === 'index.html'       ? 'nav-atoms'
                : page === 'molecules.html'   ? 'nav-molecules'
                : page === 'organisms.html'   ? 'nav-components'
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
      document.querySelectorAll('.sidebar__link--active').forEach(function (el) {
        el.classList.remove('sidebar__link--active');
      });
      bestLink.classList.add('sidebar__link--active');
      var sub = bestLink.closest('.nav-subgroup');
      if (sub) sub.classList.add('is-open');
    }
  });
})();
