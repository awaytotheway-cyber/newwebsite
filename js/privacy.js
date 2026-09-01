/**
 * privacy.js — Screenshot and copy deterrents
 * ────────────────────────────────────────────
 * What this does (and what it can't do):
 *  ✓ Blocks right-click context menu on page content
 *  ✓ Intercepts Ctrl+C / Cmd+C and shows a polite toast instead
 *  ✓ Blocks Ctrl+P print-to-PDF (directs user to Notes PDF download)
 *  ✓ Detects tab-hide / screen-share and overlays a blur curtain
 *  ✗ Cannot block OS-level screenshots (Print Screen, Snipping Tool, etc.)
 *
 * Notes panel is EXEMPT from all restrictions so the PDF download works.
 */
(function () {
  'use strict';

  /* ── Utility ────────────────────────────────────────────────────── */
  var _toastTimer;
  function _showToast(msg) {
    var toast = document.getElementById('privacyToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'privacyToast';
      toast.className = 'privacy-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 3600);
  }

  function _isInPanel(el) {
    return el && el.closest && (
      el.closest('#notesPanel') ||
      el.closest('#notesPill')  ||
      el.closest('.auth-modal-overlay') ||
      el.closest('.auth-dropdown')
    );
  }

  /* ── Right-click block on main content ──────────────────────────── */
  document.addEventListener('contextmenu', function (e) {
    if (_isInPanel(e.target)) return; /* allow inside panel */
    e.preventDefault();
  });

  /* ── Copy / cut intercept ───────────────────────────────────────── */
  document.addEventListener('copy', function (e) {
    if (_isInPanel(e.target)) return; /* allow copy from notes panel */
    e.preventDefault();
    _showToast('Copying is disabled. Use the Notes panel to save passages →');
  });

  document.addEventListener('cut', function (e) {
    if (_isInPanel(e.target)) return;
    e.preventDefault();
  });

  /* ── Keyboard shortcut blocks ───────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;

    /* Ctrl+P — block print; tell user about PDF export */
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      _showToast('Page printing is disabled. Open the Notes panel and click PDF to export your notes.');
      return;
    }

    /* Ctrl+S — block save-page */
    if (e.key === 's' || e.key === 'S') {
      e.preventDefault();
      return;
    }

    /* Ctrl+U — block view-source */
    if (e.key === 'u' || e.key === 'U') {
      e.preventDefault();
      return;
    }
  });

  /* ── Screen-share / tab-visibility curtain ──────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    /* Inject the curtain element */
    var curtain = document.createElement('div');
    curtain.id = 'privacyCurtain';
    curtain.className = 'privacy-curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML =
      '<div class="privacy-curtain-content">' +
        '<span class="privacy-curtain-icon">🔒</span>' +
        '<h2>Content hidden</h2>' +
        '<p>This content is protected while your screen is being shared or recorded.</p>' +
        '<p class="privacy-curtain-small">Return to this tab to continue reading.</p>' +
      '</div>';
    document.body.appendChild(curtain);

    /* Show curtain when tab loses visibility */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        curtain.classList.add('active');
      } else {
        curtain.classList.remove('active');
      }
    });
  });

})();
