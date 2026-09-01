/**
 * notes.js — Notes Panel with text-selection capture, custom drag, and PDF export
 * ──────────────────────────────────────────────────────────────────────────────
 * Depends on: auth.js (window.AuthState) loaded first
 * Storage: Supabase public.messages (role = user), sign-in required
 */
(function () {
  'use strict';

  /* ── State ──────────────────────────────────────────────────────── */
  var _notes         = [];    // current notes array
  var _panelOpen     = false;
  var _selectionData = null;  // captured { text, sourceContext }
  var _pendingSave   = null;  // payload awaiting auth

  function _formatMessage(text, context) {
    if (context) return '[' + context + ']\n\n' + text;
    return text;
  }

  function _parseMessage(raw) {
    var match = /^\[([^\]]+)\]\n\n([\s\S]*)$/.exec(raw || '');
    if (match) {
      return { source_context: match[1], content: match[2] };
    }
    return { source_context: '', content: raw || '' };
  }

  function _rowToNote(row) {
    var parsed = _parseMessage(row.message);
    return {
      id: row.id,
      content: parsed.content,
      source_context: parsed.source_context,
      created_at: row.created_at
    };
  }

  /* drag ghost lerp */
  var _ghostX = 0, _ghostY = 0;
  var _targetX = 0, _targetY = 0;
  var _rafId   = null;
  var _isDragging = false;

  /* ── Helpers ────────────────────────────────────────────────────── */
  function _esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function _genId() {
    return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }
  function _relTime(iso) {
    var d = new Date(iso), diff = Date.now() - d;
    if (diff < 60000)   return 'just now';
    if (diff < 3600000) return Math.floor(diff/60000)  + 'm ago';
    if (diff < 86400000)return Math.floor(diff/3600000)+ 'h ago';
    return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  }

  /* ── Storage ────────────────────────────────────────────────────── */
  async function _loadNotes() {
    var auth = window.AuthState;
    _notes = [];

    if (!auth || !auth.configured) {
      _renderAll();
      return;
    }

    if (!auth.user || !auth.client) {
      _renderAll();
      return;
    }

    try {
      var res = await auth.client
        .from('messages')
        .select('id, message, role, created_at')
        .eq('role', 'user')
        .order('created_at', { ascending: false });
      if (!res.error && res.data) {
        _notes = res.data.map(_rowToNote);
      }
    } catch (e) {}
    _renderAll();
  }

  async function _saveNote(note) {
    _notes.unshift(note);
    _renderCard(note, true);
    _syncCount();

    var auth = window.AuthState;
    if (!auth || !auth.user || !auth.client) return;

    try {
      var res = await auth.client
        .from('messages')
        .insert({
          message: _formatMessage(note.content, note.source_context),
          role: 'user'
        })
        .select('id, created_at')
        .single();

      if (res.error) {
        console.warn('[notes] Supabase save error:', res.error);
        _markSyncError(note.id);
        return;
      }

      if (res.data) {
        var card = document.querySelector('.note-card[data-id="' + note.id + '"]');
        note.id = res.data.id;
        note.created_at = res.data.created_at;
        if (card) card.setAttribute('data-id', note.id);
      }
    } catch (e) {
      _markSyncError(note.id);
    }
  }

  async function _deleteNote(id) {
    _notes = _notes.filter(function (n) { return n.id !== id; });
    _syncCount();
    var empty = document.getElementById('notesEmptyState');
    if (_notes.length === 0 && empty) empty.style.display = '';

    var auth = window.AuthState;
    if (!auth || !auth.user || !auth.client) return;

    try {
      await auth.client.from('messages').delete().eq('id', id).eq('role', 'user');
    } catch (e) {}
  }

  function _markSyncError(id) {
    var card = document.querySelector('.note-card[data-id="' + id + '"]');
    if (card) card.classList.add('note-card--sync-error');
  }

  /* ── DOM Injection ──────────────────────────────────────────────── */
  function _buildPanelHTML() {
    var clipSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>';

    return (
      /* ── edge tab ── */
      '<div id="notesTab" class="notes-tab" role="button" tabindex="0" aria-label="Open notes panel" title="Open Notes">' +
        clipSVG +
        '<span class="notes-tab-badge" id="notesTabBadge">0</span>' +
      '</div>' +

      /* ── panel ── */
      '<aside id="notesPanel" class="notes-panel" aria-label="Notes" role="complementary">' +
        '<div class="notes-panel-header">' +
          '<div class="notes-header-left">' +
            '<span class="notes-title-icon">' + clipSVG + '</span>' +
            '<span class="notes-panel-title">Notes</span>' +
            '<span class="notes-panel-count" id="notesPanelCount">0</span>' +
          '</div>' +
          '<div class="notes-header-actions">' +
            '<button id="notesDownloadBtn" class="notes-icon-btn" title="Download notes as PDF" aria-label="Download notes as PDF">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
              'PDF' +
            '</button>' +
            '<button id="notesPanelClose" class="notes-close-btn" title="Close" aria-label="Close notes panel">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +

        /* drop zone strip (appears on dragover) */
        '<div class="notes-drop-zone" id="notesDropZone">' +
          '<div class="notes-drop-hint">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="21" x2="12" y2="3"/></svg>' +
            'Drop here' +
          '</div>' +
        '</div>' +

        '<div class="notes-panel-body" id="notesPanelBody">' +
          '<div class="notes-empty-state" id="notesEmptyState">' +
            '<div class="notes-empty-icon">' +
              '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>' +
            '</div>' +
            '<p class="notes-empty-text">Select any text on the page and drag it here, or click the <strong>+</strong> button that appears near your selection.</p>' +
            '<p class="notes-empty-hint">Sign in with Google to save notes to your private account.</p>' +
          '</div>' +
          '<div class="notes-list" id="notesList"></div>' +
        '</div>' +
      '</aside>' +

      /* ── floating selection pill ── */
      '<div id="notesPill" class="notes-pill" role="button" tabindex="0" aria-label="Add selected text to notes" style="display:none">' +
        '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        'Add to Notes' +
      '</div>' +

      /* ── custom drag ghost (positioned by JS) ── */
      '<div id="noteDragGhost" class="note-drag-ghost" aria-hidden="true"></div>'
    );
  }

  function _injectPanel() {
    var wrap = document.createElement('div');
    wrap.innerHTML = _buildPanelHTML();
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  }

  function _injectNavBtn() {
    if (document.getElementById('notesNavItem')) return;
    var navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    // Insert before translate item to keep nav compact
    var anchor = document.querySelector('.translate-nav-item');
    var authItem = document.getElementById('authNavItem');
    if (authItem) authItem.remove();
    var li = document.createElement('li');
    li.id = 'notesNavItem';
    li.className = 'notes-nav-item';
    li.innerHTML =
      '<button class="notes-nav-btn" id="notesNavBtn" title="Toggle Notes panel" aria-label="Toggle notes panel">' +
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>' +
        'Notes' +
        '<span class="notes-nav-badge" id="notesNavBadge" style="display:none">0</span>' +
      '</button>';
    if (anchor && anchor.parentElement === navLinks) navLinks.insertBefore(li, anchor);
    else navLinks.appendChild(li);

    document.getElementById('notesNavBtn').addEventListener('click', _togglePanel);
  }

  /* ── Panel open/close ───────────────────────────────────────────── */
  function _openPanel() {
    _panelOpen = true;
    document.getElementById('notesPanel').classList.add('open');
    document.getElementById('notesTab').classList.add('panel-open');
  }
  function _closePanel() {
    _panelOpen = false;
    document.getElementById('notesPanel').classList.remove('open');
    document.getElementById('notesTab').classList.remove('panel-open');
  }
  function _togglePanel() { _panelOpen ? _closePanel() : _openPanel(); }

  /* ── Count badge sync ───────────────────────────────────────────── */
  function _syncCount() {
    var n = _notes.length;
    var tabBadge  = document.getElementById('notesTabBadge');
    var panelCnt  = document.getElementById('notesPanelCount');
    var navBadge  = document.getElementById('notesNavBadge');
    if (tabBadge)  { tabBadge.textContent  = n; tabBadge.style.display  = n ? 'flex' : 'none'; }
    if (panelCnt)  panelCnt.textContent = n;
    if (navBadge)  { navBadge.textContent  = n; navBadge.style.display  = n ? 'flex' : 'none'; }
  }

  /* ── Render all notes ───────────────────────────────────────────── */
  function _renderAll() {
    var list  = document.getElementById('notesList');
    var empty = document.getElementById('notesEmptyState');
    if (!list) return;
    list.innerHTML = '';
    if (_notes.length === 0) {
      if (empty) empty.style.display = '';
    } else {
      if (empty) empty.style.display = 'none';
      _notes.forEach(function(n) { _renderCard(n, false); });
    }
    _syncCount();
  }

  /* ── Render a single card ───────────────────────────────────────── */
  function _renderCard(note, animate) {
    var list  = document.getElementById('notesList');
    var empty = document.getElementById('notesEmptyState');
    if (!list) return;
    if (empty) empty.style.display = 'none';

    var MAX = 280;
    var full  = note.content || '';
    var short = full.length > MAX ? full.slice(0, MAX) + '…' : full;
    var isLong = full.length > MAX;

    var card  = document.createElement('div');
    card.className = 'note-card' + (animate ? ' note-card--entering' : '');
    card.setAttribute('data-id', note.id);

    card.innerHTML =
      '<div class="note-card-body">' +
        '<p class="note-card-text" data-full="' + _esc(full) + '" data-short="' + _esc(short) + '" data-expanded="false">' +
          _esc(short) +
        '</p>' +
        (isLong ? '<button class="note-show-more">Show more</button>' : '') +
      '</div>' +
      '<div class="note-card-footer">' +
        '<div class="note-card-meta">' +
          (note.source_context ? '<span class="note-source">' + _esc(note.source_context) + '</span>' : '') +
          '<span class="note-timestamp">' + _relTime(note.created_at) + '</span>' +
        '</div>' +
        '<button class="note-delete-btn" title="Delete note" aria-label="Delete note">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
        '</button>' +
      '</div>';

    /* show more / less */
    if (isLong) {
      var smBtn  = card.querySelector('.note-show-more');
      var textEl = card.querySelector('.note-card-text');
      smBtn.addEventListener('click', function() {
        var exp = textEl.getAttribute('data-expanded') === 'true';
        if (exp) { textEl.textContent = textEl.getAttribute('data-short'); textEl.setAttribute('data-expanded','false'); smBtn.textContent = 'Show more'; }
        else      { textEl.textContent = textEl.getAttribute('data-full');  textEl.setAttribute('data-expanded','true');  smBtn.textContent = 'Show less'; }
      });
    }

    /* delete */
    card.querySelector('.note-delete-btn').addEventListener('click', function() {
      card.classList.add('note-card--removing');
      setTimeout(function() { card.remove(); _deleteNote(note.id); }, 200);
    });

    /* insert newest-first */
    if (list.firstChild) list.insertBefore(card, list.firstChild);
    else list.appendChild(card);

    /* animate in */
    if (animate) {
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          card.classList.remove('note-card--entering');
          card.classList.add('note-card--landed');
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(function() { card.classList.add('note-card--highlight'); }, 40);
          setTimeout(function() { card.classList.remove('note-card--highlight'); }, 900);
        });
      });
    }
  }

  /* ── Text Selection Capture ─────────────────────────────────────── */
  function _getContext(node) {
    /* walk up to find nearest heading above the selected node */
    try {
      var el = node ? (node.nodeType === 3 ? node.parentElement : node) : null;
      while (el && el !== document.body) {
        var prev = el.previousElementSibling;
        if (prev && /^H[1-6]$/i.test(prev.tagName)) return prev.textContent.trim().slice(0, 60);
        el = el.parentElement;
      }
    } catch(e) {}
    return document.title.replace(/ [—–|-].*/,'').trim().slice(0, 60);
  }

  document.addEventListener('mouseup', _onSelectionChange);
  document.addEventListener('touchend', _onSelectionChange);

  function _onSelectionChange(e) {
    if (!e.target) return;
    /* ignore events inside the panel, pill, or modal */
    if (e.target.closest && e.target.closest('#notesPanel, #notesPill, .auth-modal-overlay, .auth-dropdown')) return;

    setTimeout(function() {
      var sel  = window.getSelection && window.getSelection();
      var text = sel ? sel.toString().trim() : '';

      if (!text || text.length < 3) {
        _hidePill();
        _selectionData = null;
        return;
      }

      _selectionData = {
        text: text,
        sourceContext: _getContext(sel.anchorNode)
      };

      /* position pill near selection anchor */
      if (sel.rangeCount) {
        var rect = sel.getRangeAt(0).getBoundingClientRect();
        _showPill(rect);
      }
    }, 12);
  }

  /* Hide pill on outside click */
  document.addEventListener('mousedown', function(e) {
    if (!e.target.closest('#notesPill') && !e.target.closest('#notesPanel') && !e.target.closest('.auth-modal-overlay')) {
      _hidePill();
    }
  });

  function _showPill(rect) {
    var pill = document.getElementById('notesPill');
    if (!pill) return;
    pill.style.display = 'flex';
    /* position: above selection, horizontally centred */
    var scrollY = window.scrollY || window.pageYOffset || 0;
    var scrollX = window.scrollX || window.pageXOffset || 0;
    var pW = pill.offsetWidth || 140;
    var x  = rect.left + scrollX + rect.width / 2 - pW / 2;
    var y  = rect.top  + scrollY - 46;
    pill.style.left = Math.max(8, Math.min(x, window.innerWidth - pW - 8)) + 'px';
    pill.style.top  = y + 'px';
    requestAnimationFrame(function() { pill.classList.add('visible'); });
  }

  function _hidePill() {
    var pill = document.getElementById('notesPill');
    if (!pill) return;
    pill.classList.remove('visible');
    setTimeout(function() { pill.style.display = 'none'; }, 160);
  }

  /* ── Auth-gated save ────────────────────────────────────────────── */
  function _attemptSave(text, context) {
    var auth = window.AuthState;

    if (!auth || !auth.configured) {
      alert('Sign-in is not configured yet. Add your Supabase URL and anon key in js/config.js.');
      return;
    }

    if (!auth.user) {
      _pendingSave = { text: text, context: context };
      if (window.showAuthModal) window.showAuthModal();
      return;
    }

    _saveLocally(text, context);
  }

  function _saveLocally(text, context) {
    var note = {
      id: 'temp-' + _genId(),
      content: text,
      source_context: context,
      created_at: new Date().toISOString()
    };
    if (!_panelOpen) _openPanel();
    _saveNote(note);
  }

  document.addEventListener('userSignedIn', function () {
    if (!_pendingSave) return;
    var p = _pendingSave;
    _pendingSave = null;
    _loadNotes().then(function() { _saveLocally(p.text, p.context); });
  });

  /* ── Pill click (tap-to-save) ───────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    var pill = document.getElementById('notesPill');
    if (!pill) return;
    pill.addEventListener('click', function() {
      if (!_selectionData) return;
      var d = _selectionData;
      _selectionData = null;
      _hidePill();
      _attemptSave(d.text, d.sourceContext);
    });
    pill.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pill.click(); }
    });
  });

  /* ── Custom Pointer Drag ─────────────────────────────────────────── */
  /* We use pointer events so it works on touch + desktop uniformly.   */
  document.addEventListener('DOMContentLoaded', function() {
    var pill  = document.getElementById('notesPill');
    var ghost = document.getElementById('noteDragGhost');
    if (!pill || !ghost) return;

    var _dragPayload   = null;
    var _ptrStartX     = 0, _ptrStartY = 0;
    var _ptrDragActive = false;
    var _ptrMoved      = false;
    var THRESHOLD      = 8; /* px before we commit to drag */

    pill.addEventListener('pointerdown', function(e) {
      if (!_selectionData) return;
      _dragPayload   = { text: _selectionData.text, ctx: _selectionData.sourceContext };
      _ptrStartX     = e.clientX;
      _ptrStartY     = e.clientY;
      _ptrDragActive = true;
      _ptrMoved      = false;
      pill.setPointerCapture(e.pointerId);
      e.preventDefault(); /* prevent text de-selection */
    });

    pill.addEventListener('pointermove', function(e) {
      if (!_ptrDragActive) return;

      var dx = e.clientX - _ptrStartX;
      var dy = e.clientY - _ptrStartY;

      if (!_ptrMoved && Math.sqrt(dx*dx + dy*dy) > THRESHOLD) {
        /* ── commit to drag ── */
        _ptrMoved  = true;
        _isDragging = true;
        ghost.textContent = _dragPayload.text.length > 65
          ? _dragPayload.text.slice(0, 65) + '…'
          : _dragPayload.text;
        ghost.style.display = 'block';
        _ghostX = e.clientX;
        _ghostY = e.clientY;
        _targetX = e.clientX;
        _targetY = e.clientY;
        _startGhostFollow();
        document.body.classList.add('notes-dragging');
        /* pulse the tab hint if panel is closed */
        if (!_panelOpen) {
          var tab = document.getElementById('notesTab');
          if (tab) tab.classList.add('pulse-hint');
        }
        _hidePill();
      }

      if (_ptrMoved) {
        _targetX = e.clientX;
        _targetY = e.clientY;

        /* drop-hover feedback */
        var overPanel = _isOverElement(e.clientX, e.clientY, '#notesPanel') ||
                        _isOverElement(e.clientX, e.clientY, '#notesTab');
        var panel = document.getElementById('notesPanel');
        if (overPanel) {
          if (panel) panel.classList.add('drop-hover');
          if (!_panelOpen) _openPanel();
        } else {
          if (panel) panel.classList.remove('drop-hover');
        }
      }
    });

    pill.addEventListener('pointerup', function(e) {
      if (!_ptrDragActive) return;
      _ptrDragActive = false;
      _stopGhostFollow();
      ghost.style.display = 'none';
      document.body.classList.remove('notes-dragging');
      var tab = document.getElementById('notesTab');
      if (tab) tab.classList.remove('pulse-hint');
      var panel = document.getElementById('notesPanel');
      if (panel) panel.classList.remove('drop-hover');

      if (_ptrMoved && _dragPayload) {
        var dropped = _isOverElement(e.clientX, e.clientY, '#notesPanel') ||
                      _isOverElement(e.clientX, e.clientY, '#notesTab')   ||
                      _isOverElement(e.clientX, e.clientY, '#notesDropZone');
        if (dropped) {
          if (!_panelOpen) _openPanel();
          _attemptSave(_dragPayload.text, _dragPayload.ctx);
        }
      }
      _isDragging = false;
      _ptrMoved   = false;
      _dragPayload = null;
    });

    pill.addEventListener('pointercancel', function() {
      _ptrDragActive = false;
      _stopGhostFollow();
      ghost.style.display = 'none';
      document.body.classList.remove('notes-dragging');
      var tab   = document.getElementById('notesTab');
      var panel = document.getElementById('notesPanel');
      if (tab)   tab.classList.remove('pulse-hint');
      if (panel) panel.classList.remove('drop-hover');
      _isDragging  = false;
      _ptrMoved    = false;
      _dragPayload = null;
    });
  });

  /* ── Ghost RAF lerp ────────────────────────────────────────────── */
  function _startGhostFollow() {
    if (_rafId) cancelAnimationFrame(_rafId);
    function _step() {
      var ghost = document.getElementById('noteDragGhost');
      if (!ghost || ghost.style.display === 'none') { _rafId = null; return; }
      _ghostX += (_targetX - _ghostX) * 0.22;
      _ghostY += (_targetY - _ghostY) * 0.22;
      ghost.style.left = (_ghostX - ghost.offsetWidth  / 2) + 'px';
      ghost.style.top  = (_ghostY - ghost.offsetHeight / 2 - 18) + 'px';
      _rafId = requestAnimationFrame(_step);
    }
    _rafId = requestAnimationFrame(_step);
  }
  function _stopGhostFollow() {
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  }

  /* ── HTML5 drag-and-drop (direct text drag without pill) ─────── */
  document.addEventListener('dragstart', function(e) {
    if (!_selectionData) return;
    e.dataTransfer.setData('text/plain', _selectionData.text);
    e.dataTransfer.setData('text/x-source-context', _selectionData.sourceContext);
    e.dataTransfer.effectAllowed = 'copy';

    /* set custom ghost image */
    var ghost = document.getElementById('noteDragGhost');
    if (ghost) {
      ghost.textContent = _selectionData.text.length > 65
        ? _selectionData.text.slice(0, 65) + '…'
        : _selectionData.text;
      ghost.style.display = 'block';
      ghost.style.top  = '-300px';
      ghost.style.left = '-300px';
      try { e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2); } catch(ex){}
    }

    document.body.classList.add('notes-dragging');
    if (!_panelOpen) {
      var tab = document.getElementById('notesTab');
      if (tab) tab.classList.add('pulse-hint');
    }
  });

  document.addEventListener('dragend', function() {
    document.body.classList.remove('notes-dragging');
    var ghost = document.getElementById('noteDragGhost');
    var tab   = document.getElementById('notesTab');
    var panel = document.getElementById('notesPanel');
    if (ghost) ghost.style.display = 'none';
    if (tab)   tab.classList.remove('pulse-hint');
    if (panel) panel.classList.remove('drop-hover');
  });

  function _setupDropZone() {
    var panel = document.getElementById('notesPanel');
    var tab   = document.getElementById('notesTab');

    function onOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (panel) panel.classList.add('drop-hover');
      if (!_panelOpen) _openPanel();
    }
    function onLeave(e) {
      var rel = e.relatedTarget;
      if (panel && !panel.contains(rel) && rel !== tab) {
        panel.classList.remove('drop-hover');
      }
    }
    function onDrop(e) {
      e.preventDefault();
      if (panel) panel.classList.remove('drop-hover');
      var text = e.dataTransfer.getData('text/plain');
      var ctx  = e.dataTransfer.getData('text/x-source-context') || _getContext(null);
      if (text && text.trim().length >= 3) _attemptSave(text.trim(), ctx);
    }

    [panel, tab].forEach(function(el) {
      if (!el) return;
      el.addEventListener('dragover',  onOver);
      el.addEventListener('dragleave', onLeave);
      el.addEventListener('drop',      onDrop);
    });
  }

  /* ── hit-test helper ───────────────────────────────────────────── */
  function _isOverElement(x, y, selector) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }
    return false;
  }

  /* ── PDF Download ───────────────────────────────────────────────── */
  function _downloadPDF() {
    if (_notes.length === 0) {
      alert('No notes to export yet. Select text on the page and add it to your notes first.');
      return;
    }
    var cardsHTML = _notes.map(function(note, i) {
      return (
        '<div class="note-item">' +
          '<div class="note-num">' + (i + 1) + '</div>' +
          '<div class="note-body">' +
            '<blockquote class="note-text">' + _escFull(note.content) + '</blockquote>' +
            '<div class="note-meta">' +
              (note.source_context ? '<span class="note-src">From: ' + _escFull(note.source_context) + '</span>' : '') +
              '<span class="note-date">' + new Date(note.created_at).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var win = window.open('', '_blank', 'width=750,height=650');
    if (!win) { alert('Please allow popups to download your notes as PDF.'); return; }

    win.document.write(
      '<!DOCTYPE html><html><head>' +
      '<meta charset="UTF-8">' +
      '<title>My Notes — Srila Prabhupad</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">' +
      '<style>' +
        '*{box-sizing:border-box;margin:0;padding:0}' +
        'body{font-family:Inter,sans-serif;background:#fff;color:#16111f;padding:48px 52px;max-width:720px;margin:0 auto}' +
        '.pdf-header{border-bottom:2.5px solid #c9a153;padding-bottom:22px;margin-bottom:38px}' +
        '.pdf-header h1{font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;font-weight:500;color:#16111f;margin-bottom:5px}' +
        '.pdf-sub{font-size:11px;color:#aaa;letter-spacing:0.06em;text-transform:uppercase}' +
        '.note-item{display:flex;gap:18px;padding:18px 0;border-bottom:1px solid #ece6d9;align-items:flex-start}' +
        '.note-num{font-family:"Cormorant Garamond",serif;font-size:22px;font-weight:500;color:#c9a153;min-width:26px;line-height:1.7;flex-shrink:0}' +
        '.note-body{flex:1}' +
        '.note-text{font-family:"Cormorant Garamond",Georgia,serif;font-size:18px;line-height:1.72;color:#16111f;font-style:italic;border-left:3px solid #c9a153;padding-left:16px;margin-bottom:8px;display:block}' +
        '.note-meta{display:flex;flex-direction:column;gap:2px}' +
        '.note-src{font-size:11px;color:#a07a3a;font-family:Inter,sans-serif}' +
        '.note-date{font-size:10.5px;color:#bbb;font-family:Inter,sans-serif}' +
        '.pdf-footer{margin-top:42px;text-align:center;font-size:10.5px;color:#ccc;letter-spacing:0.07em;text-transform:uppercase}' +
        '@media print{body{padding:20px}.note-item{page-break-inside:avoid}}' +
      '</style></head><body>' +
      '<div class="pdf-header"><h1>SRILA PRABHUPAD</h1><div class="pdf-sub">My Notes · ' +
        new Date().toLocaleDateString('en-IN',{dateStyle:'long'}) + '</div></div>' +
      cardsHTML +
      '<div class="pdf-footer">srila prabhupad · a living archive</div>' +
      '<script>window.onload=function(){window.print();}<\/script>' +
      '</body></html>'
    );
    win.document.close();
  }

  function _escFull(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  /* ── Event wiring (after DOM ready) ────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    _injectPanel();
    _injectNavBtn();
    _setupDropZone();

    /* panel controls */
    var tab       = document.getElementById('notesTab');
    var closeBtn  = document.getElementById('notesPanelClose');
    var dlBtn     = document.getElementById('notesDownloadBtn');

    if (tab)      { tab.addEventListener('click', _togglePanel); tab.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ')_togglePanel(); }); }
    if (closeBtn) closeBtn.addEventListener('click', _closePanel);
    if (dlBtn)    dlBtn.addEventListener('click', _downloadPDF);

    /* load notes once auth is ready; retry on auth change */
    if (window.AuthState) window.AuthState.onAuthChange(function() { _loadNotes(); });

    /* initial load (with short delay to allow auth.js to finish its async session check) */
    setTimeout(_loadNotes, 400);
  });

})();
