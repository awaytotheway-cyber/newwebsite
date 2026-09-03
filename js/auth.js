/**
 * auth.js — Google Sign-In via Supabase Auth (corner widget)
 * Exposes: window.AuthState, window.showAuthModal()
 */
(function () {
  'use strict';

  var _client = null;
  var _user = null;
  var _ready = false;
  var _callbacks = [];
  var _configured = false;

  var G_SVG =
    '<svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>' +
      '<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
      '<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>' +
      '<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>' +
    '</svg>';

  function _normalizeUrl(url) {
    url = String(url || '').trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    return url.replace(/\/+$/, '');
  }

  function _redirectUri() {
    return window.location.origin + window.location.pathname;
  }

  function _initSupabase() {
    var cfg = window.SITE_CONFIG || {};
    var url = _normalizeUrl(cfg.SUPABASE_URL);
    var key = (cfg.SUPABASE_ANON_KEY || '').trim();
    var lib = window.supabase;

    if (!url || !key) {
      console.warn('[auth] Missing SUPABASE_URL or SUPABASE_ANON_KEY in js/config.js');
      return false;
    }
    if (!lib || typeof lib.createClient !== 'function') {
      console.error('[auth] Supabase library failed to load');
      return false;
    }

    try {
      _client = lib.createClient(url, key, {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
          storage: window.localStorage
        }
      });
      _configured = true;
      return true;
    } catch (e) {
      console.error('[auth] Client init failed:', e.message);
      return false;
    }
  }

  function _showAuthError(message) {
    var text = message || 'Sign-in failed. Please try again.';
    console.error('[auth]', text);

    var toast = document.getElementById('authErrorToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'authErrorToast';
      toast.className = 'auth-error-toast';
      toast.setAttribute('role', 'alert');
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(function () {
      toast.classList.remove('visible');
    }, 8000);
  }

  function _cleanAuthUrl() {
    var params = new URLSearchParams(window.location.search);
    if (!params.has('code') && !params.has('error') && !params.has('error_description')) return;
    window.history.replaceState({}, document.title, _redirectUri());
  }

  async function _handleOAuthReturn() {
    if (!_client) return;

    var params = new URLSearchParams(window.location.search);
    var oauthError = params.get('error_description') || params.get('error');
    if (oauthError) {
      _showAuthError(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
      _cleanAuthUrl();
      return;
    }

    var code = params.get('code');
    if (!code) return;

    try {
      var result = await _client.auth.exchangeCodeForSession(code);
      if (result.error) {
        _showAuthError(result.error.message);
      }
    } catch (e) {
      _showAuthError(e.message || 'Could not complete sign-in.');
    } finally {
      _cleanAuthUrl();
    }
  }

  async function signIn() {
    if (!_client) {
      _showAuthError('Sign-in is unavailable. Check js/config.js Supabase settings.');
      return;
    }

    try {
      var res = await _client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: _redirectUri(),
          skipBrowserRedirect: true
        }
      });

      if (res.error) {
        _showAuthError(res.error.message);
        _resetGoogleBtn();
        return;
      }

      if (res.data && res.data.url) {
        window.location.assign(res.data.url);
        return;
      }

      _showAuthError('Google sign-in URL was not returned. Enable Google in Supabase Auth providers.');
      _resetGoogleBtn();
    } catch (e) {
      _showAuthError(e.message || 'Sign-in failed.');
      _resetGoogleBtn();
    }
  }

  async function signOut() {
    try {
      if (_client) await _client.auth.signOut();
    } catch (e) {}
    _user = null;
    _renderCornerWidget(null);
    _notify(null);
    document.dispatchEvent(new CustomEvent('userSignedOut'));
  }

  function _resetGoogleBtn() {
    var btn = document.getElementById('authGoogleBtn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = G_SVG + ' Continue with Google';
    }
    var corner = document.getElementById('authCornerSignIn');
    if (corner) {
      corner.disabled = false;
      corner.innerHTML = G_SVG + '<span>Sign in</span><span class="sq-btn__glow" aria-hidden="true"></span>';
    }
  }

  function onAuthChange(cb) {
    _callbacks.push(cb);
  }

  function _notify(user) {
    _callbacks.forEach(function (cb) {
      try { cb(user); } catch (e) {}
    });
  }

  function _esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _closeDropdown() {
    var dd = document.getElementById('authDropdown');
    var btn = document.getElementById('authUserBtn');
    if (dd) dd.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  var _outsideBound = false;
  function _bindOutsideClose() {
    if (_outsideBound) return;
    _outsideBound = true;
    document.addEventListener('click', function (e) {
      var dd = document.getElementById('authDropdown');
      if (!dd || !dd.classList.contains('open')) return;
      if (e.target.closest && e.target.closest('.auth-widget-wrap')) return;
      _closeDropdown();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') _closeDropdown();
    });
  }

  function _renderCornerWidget(user) {
    var wrap = document.getElementById('authCornerWidget');
    if (!wrap) return;

    if (!_configured) {
      wrap.hidden = true;
      wrap.innerHTML = '';
      return;
    }

    wrap.hidden = false;

    if (user) {
      var meta = user.user_metadata || {};
      var name = meta.full_name || meta.name || user.email || 'User';
      var avatar = meta.avatar_url || meta.picture || '';
      var first = name.split(' ')[0];

      wrap.innerHTML =
        '<div class="auth-widget-wrap">' +
          '<button type="button" class="sq-btn sq-btn--ghost auth-avatar-btn" id="authUserBtn" aria-label="My account" aria-haspopup="menu" aria-expanded="false" aria-controls="authDropdown">' +
            (avatar
              ? '<img src="' + _esc(avatar) + '" alt="" class="auth-avatar-img" width="22" height="22" referrerpolicy="no-referrer">'
              : '<span class="auth-avatar-initials">' + _esc(first.charAt(0).toUpperCase()) + '</span>') +
            '<span class="auth-user-name">' + _esc(first) + '</span>' +
            '<svg class="auth-chevron" width="10" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.2 1.2L6 6l4.8-4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '<span class="sq-btn__glow" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="auth-dropdown" id="authDropdown" role="menu">' +
            '<p class="auth-dropdown-name">' + _esc(name) + '</p>' +
            '<p class="auth-dropdown-email">' + _esc(user.email || '') + '</p>' +
            '<div class="auth-dropdown-divider"></div>' +
            '<button type="button" class="sq-btn sq-btn--ghost auth-dropdown-btn" id="authSignOutBtn" role="menuitem">Sign out<span class="sq-btn__glow" aria-hidden="true"></span></button>' +
          '</div>' +
        '</div>';

      var btn = document.getElementById('authUserBtn');
      var dd = document.getElementById('authDropdown');
      if (btn && dd) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var open = !dd.classList.contains('open');
          dd.classList.toggle('open', open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }
      var soBtn = document.getElementById('authSignOutBtn');
      if (soBtn) {
        soBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          _closeDropdown();
          signOut();
        });
      }
      return;
    }

    wrap.innerHTML =
      '<button class="sq-btn sq-btn--ghost auth-corner-signin" id="authCornerSignIn" type="button" aria-label="Sign in">' +
        G_SVG +
        '<span>Sign in</span>' +
        '<span class="sq-btn__glow" aria-hidden="true"></span>' +
      '</button>';

    var signBtn = document.getElementById('authCornerSignIn');
    if (signBtn) {
      signBtn.addEventListener('click', function () {
        signBtn.disabled = true;
        signBtn.innerHTML = '<span class="auth-btn-spinner"></span><span>Signing in…</span>';
        signIn();
        setTimeout(_resetGoogleBtn, 12000);
      });
    }
  }

  function _injectCornerWidget() {
    if (document.getElementById('authCornerWidget')) return;
    var inner = document.querySelector('.nav-inner');
    if (inner) {
      var el = document.createElement('div');
      el.id = 'authNavItem';
      el.className = 'auth-nav-item';
      el.innerHTML = '<div id="authCornerWidget" class="auth-corner-widget"></div>';
      inner.appendChild(el);
      return;
    }
    var fallback = document.createElement('div');
    fallback.id = 'authCorner';
    fallback.className = 'auth-corner';
    fallback.innerHTML = '<div id="authCornerWidget" class="auth-corner-widget"></div>';
    document.body.appendChild(fallback);
  }

  function showAuthModal() {
    var overlay = document.getElementById('authModalOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('visible');
      });
    });
  }
  window.showAuthModal = showAuthModal;

  function hideAuthModal() {
    var overlay = document.getElementById('authModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('visible');
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 260);
  }

  function _buildModalContent() {
    return (
      '<button class="auth-modal-close" id="authModalClose" aria-label="Close">✕</button>' +
      '<div class="auth-modal-emblem">' +
        '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>' +
          '<rect x="9" y="3" width="6" height="4" rx="1"/>' +
          '<line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>' +
        '</svg>' +
      '</div>' +
      '<h2 id="authModalTitle" class="auth-modal-title">Sign in to save notes</h2>' +
      '<p class="auth-modal-subtitle">Your notes are private and synced to your account. Sign in with Google to continue.</p>' +
      '<button class="sq-btn sq-btn--primary auth-google-btn" id="authGoogleBtn" type="button">' + G_SVG + ' Continue with Google<span class="sq-btn__glow" aria-hidden="true"></span></button>' +
      '<p class="auth-modal-note">🔒 Only you can read your saved notes.</p>'
    );
  }

  function _injectModal() {
    if (document.getElementById('authModalOverlay')) return;
    var overlay = document.createElement('div');
    overlay.id = 'authModalOverlay';
    overlay.className = 'auth-modal-overlay';
    overlay.style.display = 'none';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'authModalTitle');
    overlay.innerHTML = '<div class="auth-modal" id="authModalBox">' + _buildModalContent() + '</div>';
    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('authModalClose');
    var googleBtn = document.getElementById('authGoogleBtn');
    if (closeBtn) closeBtn.addEventListener('click', hideAuthModal);
    if (googleBtn) {
      googleBtn.addEventListener('click', function () {
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<span class="auth-btn-spinner"></span> Signing in…';
        signIn();
        setTimeout(_resetGoogleBtn, 12000);
      });
    }
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideAuthModal();
    });
  }

  window.AuthState = {
    get user() { return _user; },
    get client() { return _client; },
    get isReady() { return _ready; },
    get configured() { return _configured; },
    signIn: signIn,
    signOut: signOut,
    onAuthChange: onAuthChange,
    hideModal: hideAuthModal
  };

  document.addEventListener('DOMContentLoaded', async function () {
    _injectCornerWidget();
    _bindOutsideClose();
    _injectModal();

    if (!_initSupabase()) {
      _ready = true;
      _renderCornerWidget(null);
      document.dispatchEvent(new CustomEvent('authReady', {
        detail: { user: null, configured: false }
      }));
      return;
    }

    await _handleOAuthReturn();

    if (_configured && _client) {
      try {
        var sd = await _client.auth.getSession();
        _user = sd && sd.data && sd.data.session ? sd.data.session.user : null;
      } catch (e) {
        console.error('[auth] getSession error:', e.message);
        _user = null;
      }

      _client.auth.onAuthStateChange(function (event, session) {
        _user = session ? session.user : null;
        _renderCornerWidget(_user);
        _notify(_user);

        if (event === 'SIGNED_IN') {
          hideAuthModal();
          document.dispatchEvent(new CustomEvent('userSignedIn', { detail: _user }));
        }
        if (event === 'SIGNED_OUT') {
          document.dispatchEvent(new CustomEvent('userSignedOut'));
        }
      });
    }

    _ready = true;
    _renderCornerWidget(_user);
    _notify(_user);
    document.dispatchEvent(new CustomEvent('authReady', {
      detail: { user: _user, configured: _configured }
    }));
  });
})();
