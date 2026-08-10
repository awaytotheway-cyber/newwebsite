# The Srila Prabhupada Archive

A three-page living archive for the life of Srila Prabhupada (A.C. Bhaktivedanta
Swami), founder of ISKCON: a landing page, a year-by-year timeline, and a chat
page ready to connect to your RAG pipeline.

The timeline is pre-filled with real, sourced biographical events (see
"Sources" below) and your uploaded photographs are already placed throughout
the site.

No build step, no framework, no paid tools — plain HTML, CSS, and JS that
runs by just opening the files or hosting them anywhere for free.

## What's here

```
index.html          Landing page — hero, life eras, photo wall, voices, CTA
timeline.html        The timeline (content pulled from js/timeline.js)
ask.html             Chat page for "Ask the Archive"
css/style.css         All styling — one design system for every page
js/main.js            Shared behavior (mobile nav menu)
js/timeline.js        ← EDIT THIS to add/change timeline events
js/ask.js              Chat logic + the RAG integration point
js/config.js           Public config — set your backend URL here
.env.example           Template for your RAG backend's own secrets
assets/images/          Drop your photos in here (see below)
```

## Sources

The 19 timeline events already in `js/timeline.js` are paraphrased from
ISKCON's own archival timeline (srimayapurdhama.com/srilaprabhupada/timeline)
and standard biographical references (Wikipedia, Britannica, the ISKCON GBC
biography). For deeper, primary-source material — his own lectures, letters,
and conversations, organized by date — see [vedabase.io](https://vedabase.io),
the official archive of his books and recorded talks. That's also the
strongest source to pull from if you want to expand the timeline further or
feed real primary material into your RAG pipeline.

Your six uploaded photographs are already placed: the close-up portrait is
the hero and one gallery frame, and the rest are spread across the gallery
and matched to relevant timeline entries (the family photo on 1918, the
kirtana photo on the Bhagavatam years, the group of devotees on the 1966
storefront era, the George Harrison photo on 1973, and so on). Swap any of
them out any time by replacing the file at the same filename.

## 1. Adding real content

**Timeline events** — open `js/timeline.js`. There's one array,
`TIMELINE_EVENTS`, near the top. Each entry is:

```js
{
  year: "1968",
  title: "The Gathering at ...",
  text: "One to three sentences about what happened.",
  image: "timeline-02.jpg"   // optional
}
```

Add, remove, or reorder entries freely — the page (nodes, animations, scroll
progress line) rebuilds itself from this list automatically.

**Landing page copy** — open `index.html` and search for `PLACEHOLDER` or
text in `[BRACKETS]`. Replace the hero line, the three "eras," and the
devotee quotes with the real ones (or delete the Voices section if you don't
have real quotes yet).

## 2. Adding photographs

Every photo slot on the site already has a filename it's looking for, and
gracefully shows an empty frame (not a broken-image icon) until that file
exists. Just drop images into `assets/images/` with these exact names:

| Where | Filename |
|---|---|
| Hero portrait | `portrait-main.jpg` |
| Photo wall (6 frames) | `photo-01.jpg` through `photo-06.jpg` |
| Timeline thumbnails | `timeline-01.jpg` through `timeline-05.jpg` (matched by the `image` field in `js/timeline.js`) |

Any image format works if you rename it to match (`.jpg`, `.png`, etc. — just
update the extension in the `<img src>` or the `image` field to match). No
resizing needed; the frames crop to fit automatically. Once you have real
photos, feel free to send me a batch and I'll help place, crop, and blend
them into the design — including adding more frames if you have more than
six.

## 3. Connecting your RAG pipeline

The frontend never touches your API keys — only a public URL. The flow:

1. Build/host your RAG backend however you like (it should accept a
   question and return an answer — see the contract in `js/ask.js`).
2. Copy `.env.example` to `.env` on your **backend**, fill in your real
   keys (`RAG_API_KEY`, `VECTOR_DB_URL`, etc.), and keep that file private —
   never put it in this frontend project or commit it anywhere public.
3. Open `js/config.js` and set:
   ```js
   window.SITE_CONFIG = {
     RAG_API_ENDPOINT: "https://your-backend.com/api/query"
   };
   ```
4. That's it — `ask.html` will start sending real questions to your backend
   and showing real answers. The status dot next to "The Archive" in the
   chat header turns green once an endpoint is set.

Expected request/response shape (change `js/ask.js` if yours differs):
```
POST { "question": "What happened in 1968?" }
→   { "answer": "..." }
```

## 4. Previewing it

Just double-click `index.html` to open it in a browser — everything works
with no server needed, except the live RAG connection in step 3.

## 5. Hosting it for free

Once you're happy with it:
- **Netlify** or **Vercel**: drag the whole folder onto their dashboard, or
  connect a GitHub repo — both give you a free live URL in under a minute.
- **GitHub Pages**: push this folder to a repo, enable Pages in Settings —
  free, and works great for a static site like this.

None of these require a paid plan for a site like this.
