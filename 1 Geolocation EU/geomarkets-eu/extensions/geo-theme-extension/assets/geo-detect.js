/**
 * GeoMarkets EU — Storefront Detection Script
 * <5KB minified, injected in <head> via Theme App Extension
 * 
 * Flow:
 * 1. Check if user has a geo_override cookie (they chose manually)
 * 2. Check meta tag for current market info
 * 3. Call Worker to detect country
 * 4. If redirect needed → redirect (auto mode) or show banner (banner mode)
 * 5. If no redirect → do nothing (fail silently)
 * 
 * CRITICAL: This script must NEVER break the store.
 * All errors are caught and swallowed.
 */
(function() {
  'use strict';

  // === 1. Check for manual override ===
  if (getCookie('geo_override')) return;

  // === 2. Check for session-seen flag (don't re-check in same session) ===
  if (sessionStorage.getItem('geo_checked')) return;
  sessionStorage.setItem('geo_checked', '1');

  // === 3. Get shop info from meta tag ===
  var meta = document.querySelector('meta[name="geo-current-market"]');
  if (!meta) return;

  var shop = meta.getAttribute('data-shop');
  var currentPath = meta.getAttribute('data-market-path') || '/';
  var workerUrl = meta.getAttribute('data-worker-url') || 'https://geo.geomarkets.workers.dev';

  if (!shop) return;

  // === 4. Call Worker ===
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', workerUrl + '/detect?shop=' + encodeURIComponent(shop), true);
    xhr.timeout = 2000; // 2s max — never block the store
    
    xhr.onload = function() {
      if (xhr.status !== 200) return;
      
      try {
        var data = JSON.parse(xhr.responseText);
        
        if (!data.redirect) return;
        
        // Don't redirect if already on the correct market
        if (data.redirect === currentPath || 
            window.location.pathname.startsWith(data.redirect)) {
          return;
        }

        // === 5. Handle based on mode ===
        if (data.mode === 'auto') {
          // Auto redirect — immediate, preserving query params
          window.location.replace(data.redirect + window.location.search);
        } else if (data.mode === 'banner' && data.banner) {
          // Show confirmation banner
          showBanner(data);
        }
        // 'manual' mode → do nothing, selector widget handles it
        
      } catch(e) { /* JSON parse failed — fail silently */ }
    };

    xhr.onerror = function() { /* Network error — fail silently */ };
    xhr.ontimeout = function() { /* Timeout — fail silently */ };
    xhr.send();
  } catch(e) { /* XMLHttpRequest failed — fail silently */ }

  // === Banner Display ===
  function showBanner(data) {
    var banner = document.createElement('div');
    banner.id = 'geo-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');
    
    var flag = data.country ? getFlagEmoji(data.country) : '🌍';
    var text = (data.banner && data.banner.text) || 
               'You are visiting from ' + (data.country || 'another country') + '. Would you like to switch?';
    var acceptLabel = (data.banner && data.banner.buttons && data.banner.buttons.accept) || 'Yes, switch';
    var rejectLabel = (data.banner && data.banner.buttons && data.banner.buttons.reject) || 'No, stay here';

    var position = (data.banner && data.banner.position) || 'top';
    
    banner.style.cssText = 'position:fixed;' + 
      (position === 'bottom' ? 'bottom:0;' : 'top:0;') +
      'left:0;right:0;z-index:999999;' +
      'background:#fff;border-' + (position === 'bottom' ? 'top' : 'bottom') + ':2px solid #2563EB;' +
      'padding:12px 20px;display:flex;align-items:center;justify-content:center;gap:12px;' +
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:14px;' +
      'box-shadow:0 2px 12px rgba(0,0,0,0.1);' +
      'animation:geoSlide 0.3s ease-out;';

    // Inject animation keyframes
    if (!document.getElementById('geo-banner-styles')) {
      var style = document.createElement('style');
      style.id = 'geo-banner-styles';
      style.textContent = '@keyframes geoSlide{from{transform:translateY(' + 
        (position === 'bottom' ? '100%' : '-100%') + ')}to{transform:translateY(0)}}' +
        '#geo-banner button{cursor:pointer;border:none;padding:8px 16px;border-radius:6px;' +
        'font-size:13px;font-weight:600;transition:opacity 0.2s}' +
        '#geo-banner .geo-accept{background:#008060;color:#fff}' +
        '#geo-banner .geo-accept:hover{opacity:0.9}' +
        '#geo-banner .geo-reject{background:transparent;color:#6B7280;text-decoration:underline}' +
        '#geo-banner .geo-dismiss{position:absolute;right:12px;top:50%;transform:translateY(-50%);' +
        'background:none;border:none;color:#9CA3AF;font-size:18px;cursor:pointer;padding:4px}';
      document.head.appendChild(style);
    }

    banner.innerHTML = 
      '<span style="font-size:20px">' + flag + '</span>' +
      '<span>' + escapeHtml(text) + '</span>' +
      '<button class="geo-accept" onclick="window.location.replace(\'' + escapeAttr(data.redirect + window.location.search) + '\')">' + 
        escapeHtml(acceptLabel) + '</button>' +
      '<button class="geo-reject" id="geo-reject">' + escapeHtml(rejectLabel) + '</button>';

    if (data.banner && data.banner.showDismiss !== false) {
      banner.innerHTML += '<button class="geo-dismiss" aria-label="Close">×</button>';
    }

    banner.style.position = 'relative'; // For dismiss button positioning
    banner.style.position = 'fixed'; // Override back

    document.body.appendChild(banner);

    // Reject button — set cookie and dismiss
    var rejectBtn = document.getElementById('geo-reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        setCookie('geo_override', currentPath, 30);
        banner.style.transform = 'translateY(' + (position === 'bottom' ? '100%' : '-100%') + ')';
        setTimeout(function() { banner.remove(); }, 300);
      });
    }

    // Dismiss button
    var dismissBtn = banner.querySelector('.geo-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function() {
        setCookie('geo_override', currentPath, 1); // Only 1 day for dismiss
        banner.style.transform = 'translateY(' + (position === 'bottom' ? '100%' : '-100%') + ')';
        setTimeout(function() { banner.remove(); }, 300);
      });
    }
  }

  // === Utilities ===
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + ';expires=' + expires + ';path=/;SameSite=Lax';
  }

  function getFlagEmoji(countryCode) {
    try {
      return String.fromCodePoint(
        ...[...countryCode.toUpperCase()].map(function(c) { 
          return 0x1F1E6 + c.charCodeAt(0) - 65; 
        })
      );
    } catch(e) { return '🌍'; }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }
})();
