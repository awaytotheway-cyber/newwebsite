/* Shared: mobile nav (focus trap + Escape) and Google Translate. */

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: "en",
    autoDisplay: false
  }, "google_translate_element");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const closeBtn = document.getElementById("navClose");
  const panel = document.getElementById("navLinks");
  const nav = document.getElementById("siteNav");
  const sentinel = document.getElementById("navSentinel");
  let lastFocus = null;

  function focusables() {
    if (!panel) return [];
    return [...panel.querySelectorAll("a, button, select, textarea, input")].filter(
      (el) => !el.disabled && el.offsetParent !== null
    );
  }

  const burgerSvg =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const closeSvg =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  const setMenuOpen = (isOpen) => {
    if (!panel || !toggle) return;
    panel.classList.toggle("open", isOpen);
    document.documentElement.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    toggle.innerHTML = (isOpen ? closeSvg : burgerSvg) + '<span class="sq-btn__glow" aria-hidden="true"></span>';
    if (isOpen) {
      lastFocus = document.activeElement;
    } else if (lastFocus && lastFocus !== toggle && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  };

  if (toggle && panel) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenuOpen(!panel.classList.contains("open"));
    });
    if (closeBtn) closeBtn.addEventListener("click", () => setMenuOpen(false));
    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (!panel.classList.contains("open")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (nav && sentinel && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([entry]) => {
      nav.classList.toggle("is-scrolled", !entry.isIntersecting);
    });
    io.observe(sentinel);
  }

  const translateBtn = document.getElementById("translateBtn");
  const translateDropdown = document.getElementById("translateDropdown");
  const langPills = document.querySelectorAll(".lang-pill");
  const langSelect = document.getElementById("allLanguagesSelect");
  const currentLangLabel = document.getElementById("currentLangLabel");

  if (translateBtn && translateDropdown) {
    translateBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      translateDropdown.classList.toggle("active");
      translateBtn.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!translateDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
        translateDropdown.classList.remove("active");
        translateBtn.classList.remove("active");
      }
    });
  }

  function setLanguage(langCode) {
    if (!langCode) return;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;

    const googCombo = document.querySelector(".goog-te-combo");
    if (googCombo) {
      googCombo.value = langCode;
      googCombo.dispatchEvent(new Event("change"));
    } else {
      setTimeout(() => {
        const retryCombo = document.querySelector(".goog-te-combo");
        if (retryCombo) {
          retryCombo.value = langCode;
          retryCombo.dispatchEvent(new Event("change"));
        } else {
          location.reload();
        }
      }, 500);
    }

    langPills.forEach((pill) => {
      pill.classList.toggle("active", pill.getAttribute("data-lang") === langCode);
    });
    if (langSelect) langSelect.value = langCode;
    if (currentLangLabel) {
      const names = {
        en: "English", hi: "हिन्दी", bn: "বাংলা", es: "Español", fr: "Français",
        de: "Deutsch", ru: "Русский", ja: "日本語", pt: "Português",
        gu: "ગુજરાતી", mr: "मराठी", ta: "தமிழ்", te: "తెలుగు", kn: "ಕನ್ನಡ", pa: "ਪੰਜਾਬੀ"
      };
      currentLangLabel.textContent = names[langCode] || langCode.toUpperCase();
    }
    if (translateDropdown) translateDropdown.classList.remove("active");
  }

  langPills.forEach((pill) => {
    pill.addEventListener("click", () => setLanguage(pill.getAttribute("data-lang")));
  });
    if (langSelect) {
      langSelect.addEventListener("change", (e) => setLanguage(e.target.value));
    }

    document.documentElement.classList.add("js-ready");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealEls = document.querySelectorAll(".hero-portrait, .gallery-item, .era, .voice, .ask-cta, .visualizer-card, .life-timeline-section");
    revealEls.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", (i % 6) * 90 + "ms");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 40) el.classList.add("is-in");
        else io.observe(el);
      });
    }
  });
