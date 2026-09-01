/* Shared behavior across all pages: mobile nav toggle & Google Translate integration. */

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google_translate_element');
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Navigation Toggle ---
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // --- Google Translate Dropdown & Pill Button Integration ---
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
    
    // Set cookie for Google Translate persistence across navigation
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;

    // Trigger google translate select if loaded
    const googCombo = document.querySelector(".goog-te-combo");
    if (googCombo) {
      googCombo.value = langCode;
      googCombo.dispatchEvent(new Event("change"));
    } else {
      // If element not ready yet, reload or retry after short delay
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

    // Highlight active pill button
    langPills.forEach(pill => {
      if (pill.getAttribute("data-lang") === langCode) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });

    if (langSelect) {
      langSelect.value = langCode;
    }

    if (currentLangLabel) {
      const names = {
        'en': 'English',
        'hi': 'हिन्दी',
        'bn': 'বাংলা',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'ru': 'Русский',
        'ja': '日本語',
        'pt': 'Português',
        'gu': 'ગુજરાતી',
        'mr': 'मराठी',
        'ta': 'தமிழ்',
        'te': 'తెలుగు',
        'kn': 'ಕನ್ನಡ',
        'pa': 'ਪੰਜਾਬੀ'
      };
      currentLangLabel.textContent = names[langCode] || langCode.toUpperCase();
    }

    if (translateDropdown) {
      translateDropdown.classList.remove("active");
    }
  }

  langPills.forEach(pill => {
    pill.addEventListener("click", () => {
      const lang = pill.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      setLanguage(e.target.value);
    });
  }
});

