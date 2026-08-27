(function () {
  'use strict';
  // ─────────────────────────────────────────────────────────────
  // Guidelines panel — surfaces each component's .md guide inside
  // the viewer. Map = component-block id → md path (site-relative).
  // Blocks without a guide simply don't get the button.
  // ─────────────────────────────────────────────────────────────
  var DOCS = {
    // atoms.html
    'chips':                'atoms/videochip.md',
    'preview':              'atoms/preview.md',
    'preview-doc-chat':     'atoms/preview-doc-chat.md',
    'toggle':               'atoms/toggle.md',
    'tab-profile':          'atoms/tab-profile.md',
    'tab-item':             'atoms/tab-item.md',
    'avatar':               'atoms/avatar.md',
    'channel-avatar':       'atoms/channel-avatar.md',
    'statusbar':            'atoms/statusbar.md',
    'notification-counter': 'atoms/notification-counter.md',
    'separator-message':    'atoms/separator-message.md',
    'info-title':           'atoms/info-title.md',
    'bubble-2':             'atoms/bubble-2.md',
    'send-time':            'atoms/send-time.md',
    'reaction':             'atoms/reaction.md',
    'reaction-arrow':       'atoms/reaction-arrow.md',
    'bubble-comments':      'atoms/bubble-comments.md',
    'cell-menu':            'atoms/cell-menu.md',
    'emoji-badge':          'atoms/emoji-badge.md',
    'tag-chip':             'atoms/chip.md',
    'allocation':           'atoms/allocation.md',
    'menu-compact-item':    'atoms/menu-compact-item.md',
    // molecules.html
    'cell-base':            'molecules/cell/cell-base.md',
    'table-rows-chats':     'molecules/table-rows-chats.md',
    'cell-toggle':          'molecules/cell/cell-toggle.md',
    'cell-contact':         'molecules/cell/cell-contact.md',
    'cell-activity':        'molecules/cell/cell-activity.md',
    'cell-separator':       'molecules/cell/cell-separator.md',
    'cell-category':        'molecules/cell/cell-category.md',
    'cell-subchannel':      'molecules/cell/cell-subchannel.md',
    'cell-links':           'molecules/cell/cell-links.md',
    'text-fields':          'molecules/text-fields.md',
    'search-field':         'molecules/search-field.md',
    'tf-s':                 'molecules/text-fields-s.md',
    'tf-l':                 'molecules/text-fields-l.md',
    'tf-bar':               'molecules/text-fields-bar.md',
    'gallery':              'molecules/gallery.md',
    'card-profile-text':    'molecules/card-profile-text.md',
    'tabs':                 'molecules/tabs.md',
    'top-bar':              'molecules/top-bar.md',
    'swipe-tab-item':       'molecules/swipe-tab-item.md',
    'top-search-bar':       'molecules/top-search-bar.md',
    'text-reply':           'molecules/text-reply.md',
    'above-text-field':     'molecules/above-text-field.md',
    'bubble-bottom-2':      'molecules/bubble-bottom-2.md',
    'message':              'molecules/message.md',
    'dropdown-menu':        'molecules/dropdown-menu.md',
    'menu-compact':         'molecules/menu-compact.md',
    // organisms.html
    'card-profile':         'organisms/card-profile.md',
    'confirm-dialog':       'organisms/confirm-dialog.md',
    'dropdown-row':         'organisms/dropdown-row.md'
  };

  // Sections lifted out of the md. Variants / States / Tokens / Status stay in
  // the aside; the panel shows what the aside can't fit.
  var SECTIONS = [
    { match: /^when to use/i,    title: 'When to use' },
    { match: /^anatomy/i,        title: 'Anatomy' },
    { match: /^do \/ don/i,      title: 'Do / Don’t' },
    { match: /^accessibility/i,  title: 'Accessibility' }
  ];

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  // Parse the md into { desc, sections: {name → lines[]} }
  function parse(md) {
    var lines = md.split(/\r?\n/);
    var current = '';        // '' = preamble before the first "## "
    var out = { desc: '', sections: {} };
    lines.forEach(function (raw) {
      var line = raw.replace(/\s+$/, '');
      if (/^#\s/.test(line)) return;                       // component name — the block shows it already
      var h = line.match(/^##\s+(.*)$/);
      if (h) { current = h[1].trim(); out.sections[current] = []; return; }
      if (current === '') {
        var q = line.match(/^>\s?(.*)$/);
        if (q) out.desc += (out.desc ? ' ' : '') + q[1];
        return;
      }
      out.sections[current].push(line);
    });
    return out;
  }

  // Render a section body (lists, paragraphs, table rows) to HTML
  function renderBody(bodyLines) {
    var html = '', list = [];
    function flushList() {
      if (!list.length) return;
      html += '<ul>' + list.map(function (li) { return '<li>' + inline(li) + '</li>'; }).join('') + '</ul>';
      list = [];
    }
    bodyLines.forEach(function (line) {
      if (!line.trim()) { flushList(); return; }
      if (/^\|/.test(line)) {                              // table row → "label — value" bullet
        if (/^\|[\s:-]+\|/.test(line.replace(/\|/g, '|').trim()) && /^[|\s:-]+$/.test(line)) return;
        var cells = line.split('|').map(function (c) { return c.trim(); }).filter(Boolean);
        if (cells.length >= 2 && !/^-+$/.test(cells[0])) list.push(cells.join(' — '));
        return;
      }
      var m = line.match(/^[-*]\s+(.*)$/);
      if (m) { list.push(m[1]); return; }
      flushList();
      html += '<p>' + inline(line) + '</p>';
    });
    flushList();
    return html;
  }

  // Rows of the States table flagged as missing ("⚠️ State missing: …")
  function missingStates(sections) {
    var states = null;
    Object.keys(sections).forEach(function (k) { if (/^states/i.test(k)) states = sections[k]; });
    if (!states) return [];
    var gaps = [];
    states.forEach(function (line) {
      if (line.indexOf('⚠') === -1) return;
      var cells = line.split('|').map(function (c) { return c.trim(); }).filter(Boolean);
      if (cells.length) gaps.push(cells.join(' — '));
    });
    return gaps;
  }

  function render(md) {
    var doc = parse(md);
    var html = '<div class="guides-panel__inner">';
    if (doc.desc) html += '<div class="guides-panel__desc">' + inline(doc.desc) + '</div>';
    SECTIONS.forEach(function (spec) {
      var body = null;
      Object.keys(doc.sections).forEach(function (k) { if (spec.match.test(k)) body = doc.sections[k]; });
      if (!body) return;
      var bodyHtml = renderBody(body);
      if (!bodyHtml) return;
      html += '<div class="guides-panel__section"><div class="guides-panel__title">' + spec.title + '</div>' + bodyHtml + '</div>';
    });
    var gaps = missingStates(doc.sections);
    if (gaps.length) {
      html += '<div class="guides-panel__section"><div class="guides-panel__title">Missing states — flagged, not hidden</div>' +
        '<ul class="guides-panel__gaps">' + gaps.map(function (g) { return '<li>' + inline(g) + '</li>'; }).join('') + '</ul></div>';
    }
    html += '</div>';
    return html;
  }

  function toggleGuides(id, btn) {
    var panel = document.getElementById('guides-' + id);
    if (!panel) return;
    var open = panel.classList.toggle('is-open');
    btn.classList.toggle('is-active', open);
    if (!open || panel.__loaded) return;
    panel.__loaded = true;
    fetch(DOCS[id]).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (md) {
      panel.innerHTML = render(md);
    }).catch(function () {
      panel.innerHTML = '<p class="guides-panel__error">Couldn’t load the guide here — the full spec lives at <code>' + esc(DOCS[id]) + '</code> in the repo.</p>';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Object.keys(DOCS).forEach(function (id) {
      var block = document.getElementById(id);
      if (!block || !block.classList.contains('component-block')) return;
      var header = block.querySelector('.component-block__preview-header');
      if (!header) return;

      var btn = document.createElement('button');
      btn.className = 'code-toggle-btn guides-btn';
      btn.type = 'button';
      btn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0" aria-hidden="true">' +
        '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5V5.5ZM20 5.5C20 4.7 19.3 4 18.5 4H13v16h5.5c.8 0 1.5-.7 1.5-1.5V5.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg> Guidelines';
      btn.addEventListener('click', function () { toggleGuides(id, btn); });

      var codeBtn = header.querySelector('.code-toggle-btn');
      if (codeBtn) header.insertBefore(btn, codeBtn); else header.appendChild(btn);

      var panel = document.createElement('div');
      panel.className = 'guides-panel';
      panel.id = 'guides-' + id;
      block.appendChild(panel);
    });
  });
})();
