/* ============================================================
   TIMELINE DATA — Srila Prabhupada (A.C. Bhaktivedanta Swami), 1896–1977
   ------------------------------------------------------------
   Sourced and paraphrased from ISKCON's own archival timeline
   (srimayapurdhama.com/srilaprabhupada/timeline) and standard
   biographical references. Add photos into assets/images/ with
   the filenames below, or add new entries the same way — the
   page renders and animates itself from this array.
   ============================================================ */

const TIMELINE_EVENTS = [
  {
    year: "1896",
    title: "Born in Calcutta",
    text: "Born Abhay Charan De on 1 September, in Tollygunge, Calcutta, to Gour Mohan De and Rajani Devi — a devout Vaishnava family that raised him around temple worship from early childhood.",
  },
  {
    year: "1918",
    title: "Marriage and Family Life",
    text: "Married Radharani Devi. He would go on to work in the pharmaceutical business and raise a family, all the while carrying a private commitment to spiritual life.",
    image: "timeline-01.jpg",
  },
  {
    year: "1922",
    title: "Meeting His Spiritual Master",
    text: "Met Srila Bhaktisiddhanta Sarasvati Thakura in Calcutta. At their very first meeting, Bhaktisiddhanta asked him to bring the teachings of Krishna consciousness to the English-speaking world — an instruction that would define the rest of his life.",
  },
  {
    year: "1933",
    title: "Formal Initiation in Allahabad",
    text: "Accepted formal initiation (diksha) from Bhaktisiddhanta Sarasvati, becoming his formal disciple over a decade after their first meeting.",
  },
  {
    year: "1936",
    title: "A Final Instruction",
    text: "Weeks before his spiritual master's passing, he wrote asking how he could serve him. The reply, dated just before Bhaktisiddhanta's disappearance on 31 December, renewed the same charge given in 1922: preach in English.",
  },
  {
    year: "1944",
    title: "Founded Back to Godhead",
    text: "Started the magazine Back to Godhead single-handedly — writing, editing, and publishing it himself in the years before he traveled to the West, to bring Krishna consciousness to English readers in print.",
  },
  {
    year: "1953–56",
    title: "The League of Devotees",
    text: "Initiated his first disciple and incorporated the League of Devotees in Jhansi in 1953, then moved to Vrindavana in 1956 to continue his writing and preparation.",
  },
  {
    year: "1959",
    title: "Accepted the Renounced Order",
    text: "Took sannyasa, the formal renounced order of life, in Mathura — after nearly a decade spent writing and preaching as a vanaprastha, having already stepped back from family and business life.",
  },
  {
    year: "1962–65",
    title: "Publishing Srimad-Bhagavatam",
    text: "Published the first three volumes of Srimad-Bhagavatam, Canto One — translated and annotated single-handedly, funded initially by his own modest means and a small loan.",
    image: "timeline-04.jpg",
  },
  {
    year: "1965",
    title: "The Voyage to America",
    text: "At age 69, sailed from Calcutta to Boston aboard the cargo ship Jaladuta, arriving on 17 September with almost no money and no contacts — suffering two heart attacks during the crossing.",
  },
  {
    year: "1966",
    title: "A Storefront on Second Avenue",
    text: "Rented a small storefront in New York's Lower East Side — formerly a shop called \"Matchless Gifts\" — and on 13 July incorporated the International Society for Krishna Consciousness (ISKCON). That October, he led the first outdoor kirtana in the West, at Tompkins Square Park.",
    image: "timeline-05.jpg",
  },
  {
    year: "1967",
    title: "The First Ratha-Yatra in the West",
    text: "Organized the first Ratha-yatra festival outside India, in San Francisco — a public procession and celebration that would become an annual tradition carried on by his students worldwide.",
  },
  {
    year: "1968",
    title: "Bhagavad-gita As It Is",
    text: "Published Bhagavad-gita As It Is through Macmillan, bringing his translation and commentary on the Gita to a mainstream Western audience for the first time.",
  },
  {
    year: "1970",
    title: "Establishing the GBC",
    text: "Founded the Governing Body Commission to oversee ISKCON's growing number of temples worldwide, formalizing how the movement he'd started from a single storefront would be managed as it expanded.",
  },
  {
    year: "1972",
    title: "The Bhaktivedanta Book Trust",
    text: "Established the Bhaktivedanta Book Trust to fund and manage the printing of his books at scale, and performed the ground-breaking ceremony for the temple at Mayapur, birthplace of Sri Chaitanya Mahaprabhu.",
  },
  {
    year: "1973",
    title: "Bhaktivedanta Manor, England",
    text: "Received a manor house in Hertfordshire, England — donated by former Beatle George Harrison, who had become a friend and supporter — which became Bhaktivedanta Manor, a center still active today.",
    image: "timeline-06.jpg",
  },
  {
    year: "1975",
    title: "Caitanya-caritamrta and Krishna-Balarama Temple",
    text: "Published Sri Caitanya-caritamrta, which he described as the postgraduate study of Krishna consciousness, and inaugurated the Krishna-Balarama Temple in Vrindavana.",
  },
  {
    year: "1976–77",
    title: "Final Years of Travel",
    text: "Continued traveling and teaching across six continents even as his health declined, returning often to Mayapur — the movement he'd started alone in 1966 had grown to over 100 centers worldwide.",
    image: "timeline-07.jpg",
  },
  {
    year: "1977",
    title: "Passing in Vrindavana",
    text: "Passed away in Vrindavana on 14 November, at age 81, days after establishing a trust to preserve the holy places connected to Chaitanya Mahaprabhu. Asked once what would happen to his movement after his death, he had answered simply: he would live on through his books.",
    image: "timeline-08.jpg",
  },
];

const TIMELINE_3D = {
  helixTurns: 1.65,
  scrollVhPerEvent: 68,
  radiusDesktop: 300,
  radiusMobile: 180,
  pitchDesktop: 440,
  pitchMobile: 360,
  smoothFactor: 0.1,
};

function isSafeImageName(name) {
  return typeof name === "string" && /^[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(name);
}

function createFlameNode() {
  const node = document.createElement("div");
  node.className = "timeline-3d-node";
  node.innerHTML =
    '<svg class="flame" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M10 1C10 1 3 9 3 16C3 20.97 6.13 25 10 25C13.87 25 17 20.97 17 16C17 12.8 15.5 10.2 14 8C14.3 10 13.2 11.5 11.7 12C12.6 8.5 11.8 4.5 10 1Z"/>' +
    "</svg>";
  return node;
}

function createTimelineImage(imageName) {
  const thumb = document.createElement("div");
  thumb.className = "timeline-3d-thumb";

  const img = document.createElement("img");
  img.src = "assets/images/" + encodeURIComponent(imageName);
  img.alt = "";

  const fallback = document.createElement("div");
  fallback.hidden = true;
  fallback.className = "placeholder-mark";
  fallback.innerHTML =
    '<svg class="flame" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M10 1C10 1 3 9 3 16C3 20.97 6.13 25 10 25C13.87 25 17 20.97 17 16C17 12.8 15.5 10.2 14 8C14.3 10 13.2 11.5 11.7 12C12.6 8.5 11.8 4.5 10 1Z"/>' +
    '</svg>';

  img.addEventListener("error", () => {
    img.hidden = true;
    fallback.hidden = false;
  });

  thumb.appendChild(img);
  thumb.appendChild(fallback);
  return thumb;
}

function createTimelineEntry(event, index) {
  const article = document.createElement("article");
  article.className = "timeline-3d-entry";
  article.dataset.index = String(index);

  article.appendChild(createFlameNode());

  const year = document.createElement("div");
  year.className = "timeline-3d-year";
  year.textContent = event.year;
  article.appendChild(year);

  const title = document.createElement("h3");
  title.textContent = event.title;
  article.appendChild(title);

  const text = document.createElement("p");
  text.textContent = event.text;
  article.appendChild(text);

  const audioBtn = document.createElement("button");
  audioBtn.type = "button";
  audioBtn.className = "audio-narration-btn";
  audioBtn.style.marginTop = "12px";
  audioBtn.innerHTML = '<span>🔊</span> <span class="audio-btn-label">Listen</span>';
  audioBtn.onclick = () => {
    if (window.humanAudio) {
      window.humanAudio.speak(`${event.year}. ${event.title}. ${event.text}`, audioBtn);
    }
  };
  article.appendChild(audioBtn);

  if (event.image && isSafeImageName(event.image)) {
    article.appendChild(createTimelineImage(event.image));
  }

  return article;
}

function createFallbackEntry(event) {
  const entry = document.createElement("div");
  entry.className = "timeline-fallback-entry";

  const node = document.createElement("div");
  node.className = "timeline-fallback-node";
  node.innerHTML =
    '<svg class="flame" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M10 1C10 1 3 9 3 16C3 20.97 6.13 25 10 25C13.87 25 17 20.97 17 16C17 12.8 15.5 10.2 14 8C14.3 10 13.2 11.5 11.7 12C12.6 8.5 11.8 4.5 10 1Z"/>' +
    "</svg>";
  entry.appendChild(node);

  const year = document.createElement("div");
  year.className = "timeline-fallback-year";
  year.textContent = event.year;
  entry.appendChild(year);

  const title = document.createElement("h3");
  title.textContent = event.title;
  entry.appendChild(title);

  const text = document.createElement("p");
  text.textContent = event.text;
  entry.appendChild(text);

  if (event.image && isSafeImageName(event.image)) {
    entry.appendChild(createTimelineImage(event.image));
  }

  return entry;
}

function getLayoutMetrics() {
  const mobile = window.matchMedia("(max-width: 760px)").matches;
  return {
    radius: mobile ? TIMELINE_3D.radiusMobile : TIMELINE_3D.radiusDesktop,
    pitch: mobile ? TIMELINE_3D.pitchMobile : TIMELINE_3D.pitchDesktop,
  };
}

function positionHelixEntries(entries) {
  const count = entries.length;
  if (count === 0) return;

  const { radius, pitch } = getLayoutMetrics();
  const turns = TIMELINE_3D.helixTurns;
  const denom = Math.max(count - 1, 1);

  entries.forEach((entry, index) => {
    const angle = (index / denom) * turns * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = index * pitch;
    const rotateY = -(angle * 180) / Math.PI;

    entry.style.transform =
      "translate3d(" + x + "px, " + y + "px, " + z + "px) rotateY(" + rotateY + "deg)";
  });
}

function renderTimeline3D() {
  const section = document.getElementById("timeline3d");
  const container = document.getElementById("entries");
  const world = document.getElementById("timelineWorld");
  if (!section || !container || !world) return;

  section.classList.add("is-3d");
  container.replaceChildren();

  const fragment = document.createDocumentFragment();
  TIMELINE_EVENTS.forEach((event, index) => {
    fragment.appendChild(createTimelineEntry(event, index));
  });
  container.appendChild(fragment);

  const scrollHeight = TIMELINE_EVENTS.length * TIMELINE_3D.scrollVhPerEvent + 100;
  section.style.setProperty("--timeline-scroll-height", scrollHeight + "vh");

  const entries = container.querySelectorAll(".timeline-3d-entry");
  positionHelixEntries(entries);

  bindTimeline3DScroll(section, world, entries, () => positionHelixEntries(entries));
}

function renderTimelineFallback() {
  const section = document.getElementById("timeline3d");
  const container = document.getElementById("entries");
  const viewport = document.getElementById("timelineViewport");
  const hud = section ? section.querySelector(".timeline-3d-hud") : null;
  if (!section || !container) return;

  section.classList.add("is-fallback");
  section.style.removeProperty("--timeline-scroll-height");
  if (viewport) viewport.classList.add("timeline-fallback-viewport");
  if (hud) hud.hidden = true;

  container.className = "timeline-fallback-list";
  container.replaceChildren();

  const line = document.createElement("div");
  line.className = "timeline-fallback-line";
  line.setAttribute("aria-hidden", "true");
  const progress = document.createElement("div");
  progress.className = "timeline-fallback-progress";
  progress.id = "timelineFallbackProgress";
  line.appendChild(progress);
  container.appendChild(line);

  const list = document.createElement("div");
  list.className = "timeline-fallback-entries";

  const fragment = document.createDocumentFragment();
  TIMELINE_EVENTS.forEach((event) => {
    fragment.appendChild(createFallbackEntry(event));
  });
  list.appendChild(fragment);
  container.appendChild(list);

  observeFallbackEntries(list);
  bindFallbackProgress(section, progress);
}

function bindTimeline3DScroll(section, world, entries, repositionEntries) {
  const progressBar = document.getElementById("timelineProgressBar");
  const progressWrap = document.getElementById("timelineProgressWrap");
  const activeYear = document.getElementById("timelineActiveYear");
  const hint = document.getElementById("timelineHint");
  const count = entries.length;
  let targetProgress = 0;
  let smoothProgress = 0;
  let lastActiveIndex = -1;
  let rafId = 0;

  document.documentElement.classList.add("timeline-scroll");

  function readScrollProgress() {
    const rect = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 1));
    return scrollable > 0 ? scrolled / scrollable : 0;
  }

  function applyScene(progress) {
    const floatIndex = progress * Math.max(count - 1, 0);
    const activeIndex = Math.round(floatIndex);
    const { pitch } = getLayoutMetrics();
    const lift = floatIndex * pitch;
    const spin = progress * TIMELINE_3D.helixTurns * 360;
    const focusY = window.innerHeight * 0.38;

    world.style.transform =
      "translate3d(0, " +
      (focusY - lift) +
      "px, -420px) rotateX(10deg) rotateY(" +
      spin +
      "deg)";

    entries.forEach((entry, index) => {
      const distance = Math.abs(index - floatIndex);
      entry.style.opacity = String(Math.max(0.28, 1 - distance * 0.34));
      entry.classList.toggle("is-active", distance < 0.5);
    });

    if (progressBar) {
      progressBar.style.width = progress * 100 + "%";
    }
    if (progressWrap) {
      progressWrap.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    }
    if (activeYear && TIMELINE_EVENTS[activeIndex] && activeIndex !== lastActiveIndex) {
      lastActiveIndex = activeIndex;
      activeYear.textContent =
        TIMELINE_EVENTS[activeIndex].year + " — " + TIMELINE_EVENTS[activeIndex].title;
    }
    if (hint) {
      hint.hidden = progress > 0.04;
    }
  }

  function tick() {
    const delta = targetProgress - smoothProgress;
    if (Math.abs(delta) > 0.0004) {
      smoothProgress += delta * TIMELINE_3D.smoothFactor;
    } else {
      smoothProgress = targetProgress;
    }
    applyScene(smoothProgress);
    rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    targetProgress = readScrollProgress();
  }

  function onResize() {
    repositionEntries();
    targetProgress = readScrollProgress();
    smoothProgress = targetProgress;
    applyScene(smoothProgress);
  }

  targetProgress = readScrollProgress();
  smoothProgress = targetProgress;
  applyScene(smoothProgress);
  rafId = requestAnimationFrame(tick);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    document.documentElement.classList.remove("timeline-scroll");
  };
}

function observeFallbackEntries(list) {
  const entries = list.querySelectorAll(".timeline-fallback-entry");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    entries.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (obs) => {
      obs.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.3 }
  );

  entries.forEach((el) => observer.observe(el));
}

function bindFallbackProgress(section, progress) {
  function updateProgress() {
    if (!progress) return;
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight;
    const scrolled = Math.min(Math.max(window.innerHeight - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    progress.style.height = pct + "%";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    renderTimelineFallback();
  } else {
    renderTimeline3D();
  }
});
