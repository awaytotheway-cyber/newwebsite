/* ============================================================
   SRILA PRABHUPADA'S WORLD TRAVEL TIMELINE (1896–1977)
   ------------------------------------------------------------
   Single Source of Truth: 96 Sourced International Journeys (1965–1977)
   plus Full 1896–1977 Life Record.
   Calibrated for Golden Relief World Map (1000x588 resolution).
   ============================================================ */

// 1. EXACT DATASET (Provided sourced records, 1965–1977)
const TRAVEL_DATA = [
  {"year": 1965, "date": "Aug 13", "place": "India"},
  {"year": 1965, "date": "Sep 19", "place": "USA"},
  {"year": 1967, "date": "Jul 25", "place": "India"},
  {"year": 1967, "date": "Dec 14", "place": "USA"},
  {"year": 1968, "date": "Jun 3", "place": "Canada"},
  {"year": 1968, "date": "Aug 31", "place": "USA"},
  {"year": 1968, "date": "Oct 23", "place": "Canada"},
  {"year": 1968, "date": "Oct 27", "place": "USA"},
  {"year": 1969, "date": "Mar 5", "place": "USA (Hawaii)"},
  {"year": 1969, "date": "Aug 25", "place": "Germany"},
  {"year": 1969, "date": "Sep 11", "place": "United Kingdom"},
  {"year": 1969, "date": "Dec 21", "place": "USA"},
  {"year": 1970, "date": "Aug 9", "place": "USA (Hawaii)"},
  {"year": 1970, "date": "Aug 14", "place": "Japan"},
  {"year": 1970, "date": "Aug 29", "place": "India"},
  {"year": 1971, "date": "May 3", "place": "Malaysia"},
  {"year": 1971, "date": "May 9", "place": "Australia"},
  {"year": 1971, "date": "May 16", "place": "India"},
  {"year": 1971, "date": "Jun 20", "place": "USSR"},
  {"year": 1971, "date": "Jun 25", "place": "France"},
  {"year": 1971, "date": "Jun 26", "place": "USA"},
  {"year": 1971, "date": "Aug 3", "place": "United Kingdom"},
  {"year": 1971, "date": "Sep 10", "place": "Kenya"},
  {"year": 1971, "date": "Oct 19", "place": "India"},
  {"year": 1972, "date": "Jan 24", "place": "Kenya"},
  {"year": 1972, "date": "Feb 3", "place": "India"},
  {"year": 1972, "date": "Mar 31", "place": "Australia"},
  {"year": 1972, "date": "Apr 14", "place": "New Zealand"},
  {"year": 1972, "date": "Apr 19", "place": "Hong Kong"},
  {"year": 1972, "date": "Apr 20", "place": "Japan"},
  {"year": 1972, "date": "May 6", "place": "USA (Hawaii)"},
  {"year": 1972, "date": "Jun 2", "place": "Mexico"},
  {"year": 1972, "date": "Jun 7", "place": "USA"},
  {"year": 1972, "date": "Jul 11", "place": "United Kingdom"},
  {"year": 1972, "date": "Jul 20", "place": "France"},
  {"year": 1972, "date": "Jul 26", "place": "Netherlands"},
  {"year": 1972, "date": "Jul 30", "place": "United Kingdom"},
  {"year": 1972, "date": "Aug 10", "place": "USA"},
  {"year": 1972, "date": "Oct 8", "place": "USA (Hawaii)"},
  {"year": 1972, "date": "Oct 11", "place": "Philippines"},
  {"year": 1972, "date": "Oct 14", "place": "India"},
  {"year": 1973, "date": "Feb 8", "place": "Australia"},
  {"year": 1973, "date": "Feb 19", "place": "New Zealand"},
  {"year": 1973, "date": "Feb 25", "place": "Indonesia"},
  {"year": 1973, "date": "Mar 2", "place": "India"},
  {"year": 1973, "date": "Apr 2", "place": "Germany"},
  {"year": 1973, "date": "Apr 5", "place": "USA"},
  {"year": 1973, "date": "May 24", "place": "United Kingdom"},
  {"year": 1973, "date": "Jun 1", "place": "India"},
  {"year": 1973, "date": "Jul 7", "place": "United Kingdom"},
  {"year": 1973, "date": "Aug 9", "place": "France"},
  {"year": 1973, "date": "Aug 15", "place": "United Kingdom"},
  {"year": 1973, "date": "Sep 5", "place": "Sweden"},
  {"year": 1973, "date": "Sep 11", "place": "United Kingdom"},
  {"year": 1973, "date": "Sep 15", "place": "India"},
  {"year": 1973, "date": "Nov 23", "place": "United Kingdom"},
  {"year": 1973, "date": "Nov 29", "place": "USA"},
  {"year": 1974, "date": "Jan 14", "place": "USA (Hawaii)"},
  {"year": 1974, "date": "Jan 28", "place": "Japan"},
  {"year": 1974, "date": "Jan 31", "place": "Hong Kong"},
  {"year": 1974, "date": "Feb 3", "place": "India"},
  {"year": 1974, "date": "May 23", "place": "Italy"},
  {"year": 1974, "date": "May 30", "place": "Switzerland"},
  {"year": 1974, "date": "Jun 8", "place": "France"},
  {"year": 1974, "date": "Jun 16", "place": "Germany"},
  {"year": 1974, "date": "Jun 23", "place": "Australia"},
  {"year": 1974, "date": "Jul 3", "place": "USA (Hawaii)"},
  {"year": 1974, "date": "Jul 26", "place": "India"},
  {"year": 1975, "date": "Jan 25", "place": "Hong Kong"},
  {"year": 1975, "date": "Jan 27", "place": "Japan"},
  {"year": 1975, "date": "Jan 29", "place": "USA (Hawaii)"},
  {"year": 1975, "date": "Feb 11", "place": "Mexico"},
  {"year": 1975, "date": "Feb 19", "place": "Venezuela"},
  {"year": 1975, "date": "Feb 25", "place": "USA"},
  {"year": 1975, "date": "Mar 8", "place": "United Kingdom"},
  {"year": 1975, "date": "Mar 13", "place": "Iran"},
  {"year": 1975, "date": "Mar 16", "place": "India"},
  {"year": 1975, "date": "May 6", "place": "Australia"},
  {"year": 1975, "date": "May 23", "place": "Fiji"},
  {"year": 1975, "date": "May 25", "place": "USA (Hawaii)"},
  {"year": 1975, "date": "Aug 7", "place": "Canada"},
  {"year": 1975, "date": "Aug 11", "place": "France"},
  {"year": 1975, "date": "Aug 12", "place": "United Kingdom"},
  {"year": 1975, "date": "Aug 14", "place": "India"},
  {"year": 1975, "date": "Oct 1", "place": "Mauritius"},
  {"year": 1975, "date": "Oct 5", "place": "South Africa"},
  {"year": 1975, "date": "Oct 24", "place": "Mauritius"},
  {"year": 1975, "date": "Oct 26", "place": "Kenya"},
  {"year": 1975, "date": "Nov 2", "place": "India"},
  {"year": 1976, "date": "Apr 19", "place": "Australia"},
  {"year": 1976, "date": "Apr 27", "place": "New Zealand"},
  {"year": 1976, "date": "Apr 28", "place": "Fiji"},
  {"year": 1976, "date": "May 3", "place": "USA (Hawaii)"},
  {"year": 1976, "date": "Jun 16", "place": "Canada"},
  {"year": 1976, "date": "Jun 21", "place": "USA"},
  {"year": 1976, "date": "Jul 21", "place": "United Kingdom"},
  {"year": 1976, "date": "Jul 28", "place": "France"},
  {"year": 1976, "date": "Aug 7", "place": "Iran"},
  {"year": 1976, "date": "Aug 13", "place": "India"},
  {"year": 1977, "date": "Aug 27", "place": "United Kingdom"},
  {"year": 1977, "date": "Sep 14", "place": "India"}
];

// 2. CALIBRATED PIXEL COORDINATES (Matching 1000x588 Golden Relief Map)
const LOCATION_COORDINATES = {
  "India": { x: 715, y: 335, country: "India" },
  "USA": { x: 235, y: 255, country: "USA" },
  "USA (Hawaii)": { x: 70, y: 340, country: "USA" },
  "Canada": { x: 230, y: 175, country: "Canada" },
  "Germany": { x: 515, y: 195, country: "Germany" },
  "United Kingdom": { x: 470, y: 180, country: "United Kingdom" },
  "Japan": { x: 880, y: 265, country: "Japan" },
  "Malaysia": { x: 775, y: 410, country: "Malaysia" },
  "Australia": { x: 865, y: 475, country: "Australia" },
  "USSR": { x: 600, y: 170, country: "USSR" },
  "France": { x: 490, y: 215, country: "France" },
  "Kenya": { x: 590, y: 435, country: "Kenya" },
  "New Zealand": { x: 965, y: 525, country: "New Zealand" },
  "Hong Kong": { x: 810, y: 330, country: "Hong Kong" },
  "Mexico": { x: 210, y: 335, country: "Mexico" },
  "Netherlands": { x: 498, y: 190, country: "Netherlands" },
  "Philippines": { x: 830, y: 370, country: "Philippines" },
  "Indonesia": { x: 810, y: 435, country: "Indonesia" },
  "Italy": { x: 520, y: 230, country: "Italy" },
  "Switzerland": { x: 510, y: 210, country: "Switzerland" },
  "Venezuela": { x: 305, y: 385, country: "Venezuela" },
  "Iran": { x: 635, y: 285, country: "Iran" },
  "Fiji": { x: 980, y: 460, country: "Fiji" },
  "Mauritius": { x: 650, y: 500, country: "Mauritius" },
  "South Africa": { x: 555, y: 515, country: "South Africa" },
  "Sweden": { x: 530, y: 140, country: "Sweden" }
};

// Helper for location coordinates
function getLocationCanvasPos(placeName) {
  const loc = LOCATION_COORDINATES[placeName];
  if (!loc) return { x: 500, y: 294 };
  return { x: loc.x, y: loc.y };
}

// 3. COUNTRY LIST & TOTAL TARGET VISIT COUNTS
const COUNTRY_STATS_DATA = [
  { key: "USA", name: "USA", total: 17, subtext: "incl. Hawaii (9)" },
  { key: "India", name: "India", total: 16, subtext: "Motherland" },
  { key: "United Kingdom", name: "United Kingdom", total: 13, subtext: "Bhaktivedanta Manor" },
  { key: "Australia", name: "Australia", total: 6, subtext: "Sydney & Melbourne" },
  { key: "France", name: "France", total: 6, subtext: "Paris Preaching" },
  { key: "Canada", name: "Canada", total: 4, subtext: "Montreal & Vancouver" },
  { key: "Hong Kong", name: "Hong Kong", total: 4, subtext: "Asia Mission" },
  { key: "Japan", name: "Japan", total: 4, subtext: "Tokyo Center" },
  { key: "Germany", name: "Germany", total: 3, subtext: "Hamburg & Frankfurt" },
  { key: "Kenya", name: "Kenya", total: 3, subtext: "Nairobi Preaching" },
  { key: "New Zealand", name: "New Zealand", total: 3, subtext: "Auckland" },
  { key: "Fiji", name: "Fiji", total: 2, subtext: "Suva" },
  { key: "Iran", name: "Iran", total: 2, subtext: "Tehran" },
  { key: "Mauritius", name: "Mauritius", total: 2, subtext: "Port Louis" },
  { key: "Mexico", name: "Mexico", total: 2, subtext: "Mexico City" },
  { key: "Indonesia", name: "Indonesia", total: 1, subtext: "Jakarta" },
  { key: "Italy", name: "Italy", total: 1, subtext: "Rome" },
  { key: "Malaysia", name: "Malaysia", total: 1, subtext: "Kuala Lumpur" },
  { key: "Netherlands", name: "Netherlands", total: 1, subtext: "Amsterdam" },
  { key: "Philippines", name: "Philippines", total: 1, subtext: "Manila" },
  { key: "South Africa", name: "South Africa", total: 1, subtext: "Durban" },
  { key: "Sweden", name: "Sweden", total: 1, subtext: "Stockholm" },
  { key: "Switzerland", name: "Switzerland", total: 1, subtext: "Geneva" },
  { key: "USSR", name: "USSR", total: 1, subtext: "Moscow (1971)" },
  { key: "Venezuela", name: "Venezuela", total: 1, subtext: "Caracas" }
];

// Historical milestones for landmark pre-travel years (1896–1964)
const HISTORICAL_YEAR_MILESTONES = {
  1896: "Born Abhay Charan De on September 1 in Tollygunge, Kolkata to Gour Mohan De and Rajani Devi.",
  1918: "Married Radharani Devi in Kolkata. Raised a family while managing pharmaceutical endeavors.",
  1922: "First met his spiritual master, Srila Bhaktisiddhanta Sarasvati Thakura, who asked him to preach in English.",
  1933: "Received formal diksha initiation in Allahabad as Abhay Charanaravinda Das.",
  1936: "Received final letter from Bhaktisiddhanta Sarasvati renewing the charge to preach in the West.",
  1944: "Founded Back to Godhead magazine in Delhi/Kolkata, writing and printing it single-handedly.",
  1948: "Formulated 'Mission 146' and appealed to national leaders to base governance on Bhagavad-gita.",
  1953: "Founded the League of Devotees in Jhansi, initiating his first disciple, Acharya Prabhakar.",
  1956: "Moved to Vrindavan, taking residence at the historic Sri Sri Radha-Damodara Temple.",
  1959: "Accepted Sannyasa (renounced order of life) in Mathura, becoming A.C. Bhaktivedanta Swami.",
  1962: "Published Volume 1 of Srimad-Bhagavatam First Canto from Delhi/Vrindavan.",
  1964: "Completed three volumes of Srimad-Bhagavatam First Canto, preparing for his voyage to America."
};

// 4. ANIMATION STATE VARIABLES
let currentIndex = 0;
let isPlaying = false;
let playbackSpeed = 1.0;
let lastTimestamp = 0;
let animFrameId = null;

// DOM References
let canvas, ctx;
let playPauseBtn, playIcon, playText, replayBtn, scrubberSlider, scrubberCurrentDate;
let timeReadout, bannerText, countryCountersGrid, lifeTimelineContainer;

// 5. INITIALIZATION ON DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", () => {
  initDOMReferences();
  initCountryCountersUI();
  initLifeTimelineUI();
  initCanvas();
  bindEvents();

  // Render initial state (Index 0)
  updateState(0);
});

function initDOMReferences() {
  canvas = document.getElementById("travelCanvas");
  if (canvas) ctx = canvas.getContext("2d");

  playPauseBtn = document.getElementById("playPauseBtn");
  playIcon = document.getElementById("playIcon");
  playText = document.getElementById("playText");
  replayBtn = document.getElementById("replayBtn");
  scrubberSlider = document.getElementById("timelineScrubber");
  scrubberCurrentDate = document.getElementById("scrubberCurrentDate");
  timeReadout = document.getElementById("timeReadout");
  bannerText = document.getElementById("bannerText");
  countryCountersGrid = document.getElementById("countryCountersGrid");
  lifeTimelineContainer = document.getElementById("lifeTimelineContainer");
}

// 6. COUNTRY COUNTERS UI GENERATION
function initCountryCountersUI() {
  if (!countryCountersGrid) return;
  countryCountersGrid.innerHTML = "";

  COUNTRY_STATS_DATA.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-counter-card";
    card.id = `counter-card-${country.key.replace(/[^a-zA-Z0-9]/g, "-")}`;
    card.innerHTML = `
      <div class="card-top">
        <span class="country-name">${country.name}</span>
        <span class="visit-tally" id="tally-${country.key.replace(/[^a-zA-Z0-9]/g, "-")}">0 / ${country.total}</span>
      </div>
      <div class="counter-progress-bar">
        <div class="counter-progress-fill" id="fill-${country.key.replace(/[^a-zA-Z0-9]/g, "-")}" style="width: 0%"></div>
      </div>
      <div class="card-subtext">${country.subtext}</div>
    `;
    countryCountersGrid.appendChild(card);
  });
}

// 7. LIFE TIMELINE GRID (1896 – 1977)
function initLifeTimelineUI() {
  if (!lifeTimelineContainer) return;
  lifeTimelineContainer.innerHTML = "";

  // Group events by year
  const eventsByYear = {};
  TRAVEL_DATA.forEach((evt) => {
    if (!eventsByYear[evt.year]) eventsByYear[evt.year] = [];
    eventsByYear[evt.year].push(evt);
  });

  // Render every year from 1896 to 1977
  for (let yr = 1896; yr <= 1977; yr++) {
    const travels = eventsByYear[yr] || [];
    const hasTravel = travels.length > 0;
    const milestoneText = HISTORICAL_YEAR_MILESTONES[yr];

    const decadeClass = `${Math.floor(yr / 10)}0s`;

    const yearCard = document.createElement("div");
    yearCard.className = `life-year-card ${hasTravel ? "has-travel" : "no-travel"}`;
    yearCard.setAttribute("data-decade", decadeClass);
    yearCard.setAttribute("data-year", yr);

    let badgeLabel = hasTravel ? `${travels.length} ${travels.length === 1 ? "Visit" : "Visits"}` : "No Travel";
    if (yr === 1896) badgeLabel = "Birth in Kolkata";
    if (yr === 1977) badgeLabel = "1977 Disappearance";

    let bodyHTML = "";
    if (hasTravel) {
      bodyHTML = `
        <div class="travel-events-list">
          ${travels
            .map((t) => {
              const globalIdx = TRAVEL_DATA.findIndex((x) => x.year === t.year && x.date === t.date && x.place === t.place);
              return `
                <div class="travel-event-item">
                  <div class="event-date-pill">📅 ${t.date}, ${t.year}</div>
                  <div class="event-place-name">📍 ${t.place}</div>
                  <button type="button" class="jump-map-btn" onclick="jumpToTravelEvent(${globalIdx})">Focus on Map →</button>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    } else {
      let note = "No international travel recorded for this year in this dataset.";
      if (milestoneText) {
        note = `<strong>Historical Milestone:</strong> ${milestoneText}<br><span class="no-travel-subnote">No international travel recorded for this year in this dataset.</span>`;
      }
      bodyHTML = `
        <div class="no-travel-box">
          <p class="no-travel-note">${note}</p>
        </div>
      `;
    }

    yearCard.innerHTML = `
      <div class="life-year-header" onclick="toggleYearAccordion(this)">
        <div class="year-number-group">
          <span class="year-digit">${yr}</span>
          <span class="year-badge ${hasTravel ? "badge-gold" : "badge-dim"}">${badgeLabel}</span>
        </div>
        <span class="accordion-chevron">▼</span>
      </div>
      <div class="life-year-body">
        ${bodyHTML}
      </div>
    `;

    lifeTimelineContainer.appendChild(yearCard);
  }

  // Decade Filter Event Listeners
  const decadeTabs = document.querySelectorAll(".decade-tab");
  decadeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      decadeTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const decade = tab.getAttribute("data-decade");
      const cards = document.querySelectorAll(".life-year-card");

      cards.forEach((card) => {
        if (decade === "all" || card.getAttribute("data-decade") === decade) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// Accordion Toggle
window.toggleYearAccordion = function (headerEl) {
  const card = headerEl.parentElement;
  const isOpen = card.classList.contains("open");

  document.querySelectorAll(".life-year-card.open").forEach((c) => {
    if (c !== card) c.classList.remove("open");
  });

  if (isOpen) {
    card.classList.remove("open");
  } else {
    card.classList.add("open");
  }
};

// Jump directly to event from life timeline
window.jumpToTravelEvent = function (index) {
  if (index < 0 || index >= TRAVEL_DATA.length) return;
  pauseAnimation();
  updateState(index);
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
};

// 8. CANVAS SETUP & EVENT BINDING
function initCanvas() {
  if (!canvas) return;
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
  if (!canvas) return;
  // Resolution matched to image aspect ratio (1000x588)
  canvas.width = 1000;
  canvas.height = 588;
  drawFrame();
}

function bindEvents() {
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", togglePlayPause);
  }
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      pauseAnimation();
      updateState(0);
      playAnimation();
    });
  }
  if (scrubberSlider) {
    scrubberSlider.addEventListener("input", (e) => {
      pauseAnimation();
      const val = parseFloat(e.target.value);
      updateState(val);
    });
  }

  // Speed controls
  const speedBtns = document.querySelectorAll(".speed-btn");
  speedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      speedBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      playbackSpeed = parseFloat(btn.getAttribute("data-speed")) || 1.0;
    });
  });
}

// 9. ANIMATION LOOP & CONTROLS
function togglePlayPause() {
  if (isPlaying) {
    pauseAnimation();
  } else {
    if (currentIndex >= TRAVEL_DATA.length - 1) {
      currentIndex = 0; // restart if at end
    }
    playAnimation();
  }
}

function playAnimation() {
  if (isPlaying) return;
  isPlaying = true;
  if (playIcon) playIcon.textContent = "⏸";
  if (playText) playText.textContent = "Pause Journey";
  lastTimestamp = performance.now();
  animFrameId = requestAnimationFrame(animationStep);
}

function pauseAnimation() {
  isPlaying = false;
  if (playIcon) playIcon.textContent = "▶";
  if (playText) playText.textContent = "Play Journey";
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

function animationStep(timestamp) {
  if (!isPlaying) return;
  const dt = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // Progress index at speed rate
  currentIndex += dt * 0.55 * playbackSpeed;

  if (currentIndex >= TRAVEL_DATA.length - 1) {
    currentIndex = TRAVEL_DATA.length - 1;
    updateState(currentIndex);
    pauseAnimation();
    return;
  }

  updateState(currentIndex);
  animFrameId = requestAnimationFrame(animationStep);
}

// 10. UPDATE STATE & RENDER
function updateState(idxFloat) {
  currentIndex = Math.max(0, Math.min(idxFloat, TRAVEL_DATA.length - 1));
  const currentIntIdx = Math.floor(currentIndex);
  const currentEvt = TRAVEL_DATA[currentIntIdx];

  // Update Scrubber
  if (scrubberSlider) scrubberSlider.value = currentIndex;
  if (scrubberCurrentDate) scrubberCurrentDate.textContent = `${currentEvt.date}, ${currentEvt.year}`;

  // Update Time Readout data-month and data-year
  if (timeReadout) {
    const monthStr = currentEvt.date.split(" ")[0].toUpperCase();
    timeReadout.setAttribute("data-month", monthStr);
    timeReadout.setAttribute("data-year", String(currentEvt.year));
  }

  // Update Banner Text
  if (bannerText) {
    bannerText.textContent = `Journey ${currentIntIdx + 1} of 96 — ${currentEvt.date}, ${currentEvt.year}: ${currentEvt.place}`;
  }

  // Update Country Counters
  updateCounters(currentIntIdx);

  // Render Canvas
  drawFrame();
}

// Update Live Country Visit Counters
function updateCounters(upToIdx) {
  const counts = {};
  COUNTRY_STATS_DATA.forEach((c) => (counts[c.key] = 0));

  for (let i = 0; i <= upToIdx; i++) {
    const place = TRAVEL_DATA[i].place;
    const countryKey = LOCATION_COORDINATES[place]?.country || place;
    if (counts[countryKey] !== undefined) {
      counts[countryKey]++;
    }
  }

  const activePlace = TRAVEL_DATA[upToIdx].place;
  const activeCountry = LOCATION_COORDINATES[activePlace]?.country || activePlace;

  COUNTRY_STATS_DATA.forEach((country) => {
    const keySlug = country.key.replace(/[^a-zA-Z0-9]/g, "-");
    const tallyEl = document.getElementById(`tally-${keySlug}`);
    const fillEl = document.getElementById(`fill-${keySlug}`);
    const cardEl = document.getElementById(`counter-card-${keySlug}`);

    const count = counts[country.key] || 0;
    if (tallyEl) tallyEl.textContent = `${count} / ${country.total}`;
    if (fillEl) {
      const pct = Math.min(100, (count / country.total) * 100);
      fillEl.style.width = `${pct}%`;
    }

    if (cardEl) {
      if (country.key === activeCountry && count > 0) {
        cardEl.classList.add("active-pulse");
      } else {
        cardEl.classList.remove("active-pulse");
      }
    }
  });
}

// 11. CANVAS DRAW FRAME
function drawFrame() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const currentIntIdx = Math.floor(currentIndex);
  const activeProgress = currentIndex - currentIntIdx;

  // 1. Draw Flight Route Arcs for completed steps
  for (let i = 1; i <= currentIntIdx; i++) {
    const prevPlace = TRAVEL_DATA[i - 1].place;
    const currPlace = TRAVEL_DATA[i].place;

    const pt1 = getLocationCanvasPos(prevPlace);
    const pt2 = getLocationCanvasPos(currPlace);

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);

    // Curved control point for arc
    const midX = (pt1.x + pt2.x) / 2;
    const dist = Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y);
    const midY = (pt1.y + pt2.y) / 2 - Math.min(90, dist * 0.25);

    ctx.quadraticCurveTo(midX, midY, pt2.x, pt2.y);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.45)";
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  // Draw active in-flight arc
  if (currentIntIdx < TRAVEL_DATA.length - 1 && activeProgress > 0) {
    const pt1 = getLocationCanvasPos(TRAVEL_DATA[currentIntIdx].place);
    const pt2 = getLocationCanvasPos(TRAVEL_DATA[currentIntIdx + 1].place);

    const midX = (pt1.x + pt2.x) / 2;
    const dist = Math.hypot(pt2.x - pt1.x, pt2.y - pt1.y);
    const midY = (pt1.y + pt2.y) / 2 - Math.min(90, dist * 0.25);

    // Quadratic curve point interpolation
    const t = activeProgress;
    const currX = (1 - t) * (1 - t) * pt1.x + 2 * (1 - t) * t * midX + t * t * pt2.x;
    const currY = (1 - t) * (1 - t) * pt1.y + 2 * (1 - t) * t * midY + t * t * pt2.y;

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.quadraticCurveTo(midX, midY, currX, currY);
    ctx.strokeStyle = "rgba(255, 235, 150, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // Moving golden spark dot
    ctx.beginPath();
    ctx.arc(currX, currY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 2. Draw Settled Pins for visited locations up to currentIntIdx
  const visitedPlacesSet = new Set();
  for (let i = 0; i <= currentIntIdx; i++) {
    visitedPlacesSet.add(TRAVEL_DATA[i].place);
  }

  visitedPlacesSet.forEach((placeKey) => {
    const pt = getLocationCanvasPos(placeKey);

    // Settled pin dot with outer glow ring
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "rgba(255, 215, 0, 0.6)";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#100f18";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  // 3. Draw Active Location Marker ("Detonation" & Pulsing Ring)
  const activeEvt = TRAVEL_DATA[currentIntIdx];
  const pt = getLocationCanvasPos(activeEvt.place);

  // Pulsing outer ring
  const pulseRadius = 7 + Math.sin(performance.now() * 0.008) * 7;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, Math.max(5, pulseRadius + 6), 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 235, 150, 0.9)";
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Inner glowing core
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "#ffd700";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Floating Tooltip Tag (Place + Date)
  drawTooltipTag(ctx, pt.x, pt.y, `${activeEvt.place} (${activeEvt.date})`);
}

// Draw Floating Tooltip Label on Map Canvas
function drawTooltipTag(ctx, x, y, text) {
  ctx.font = "600 11.5px 'IBM Plex Mono', monospace";
  const textWidth = ctx.measureText(text).width;
  const paddingX = 10;
  const paddingY = 6;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 24;

  // Offset box above marker
  let boxX = x - boxWidth / 2;
  let boxY = y - 38;

  // Boundary clamping
  boxX = Math.max(10, Math.min(boxX, canvas.width - boxWidth - 10));
  boxY = Math.max(10, boxY);

  // Background Box (Dark parchment with brass border)
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
  } else {
    ctx.rect(boxX, boxY, boxWidth, boxHeight);
  }
  ctx.fillStyle = "rgba(16, 14, 26, 0.94)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 215, 0, 0.85)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Pointer Stem
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x - 4, boxY + boxHeight);
  ctx.lineTo(x + 4, boxY + boxHeight);
  ctx.closePath();
  ctx.fillStyle = "rgba(255, 215, 0, 0.85)";
  ctx.fill();

  // Text
  ctx.fillStyle = "#ffe699";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, boxX + boxWidth / 2, boxY + boxHeight / 2 + 1);
}
