/* ============================================================
   SITE CONFIG — public, browser-visible settings only.
   ------------------------------------------------------------
   This file ships to every visitor's browser, so put ONLY your
   public API endpoint here — never a secret key. Your actual
   RAG pipeline (API keys, vector DB credentials, etc.) should
   live server-side and read from the .env file at the project
   root. See README.md → "Connecting your RAG pipeline".
   ============================================================ */

window.SITE_CONFIG = {
  // POST { session_id, chatInput } — AI Agent chat webhook
  RAG_API_ENDPOINT: "https://prabhupadarchives.pikapod.net/webhook/dac33c95-5aaf-4900-94fe-4b3b31b6e1b9",

  // GET ?session_id=… → { messages: [{ role, content }] }
  RAG_HISTORY_ENDPOINT: "https://prabhupadarchives.pikapod.net/webhook/3241a771-1cb1-42d7-a9dd-18ac2cf1ec63",

  // ── Supabase (for Notes + Google Auth) ──────────────────────────
  // Follow the setup guide in the implementation plan to get these values.
  // Leave both as "" and the Notes feature will use localStorage instead.
  SUPABASE_URL:      "jpfzewkwmhdtuffrvdat.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnpld2t3bWhkdHVmZnJ2ZGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzQ2ODcsImV4cCI6MjEwMzkxMDY4N30.whrxv3QX6kavl-vnwu7HApDy0kh2aBa4YMBxmE5T6aQ"
};
