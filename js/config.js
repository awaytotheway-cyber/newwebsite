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
  // The URL of your RAG backend's query endpoint.
  // Example: "https://your-rag-service.com/api/query"
  RAG_API_ENDPOINT:"https://prabhupadarchives.pikapod.net/webhook/dac33c95-5aaf-4900-94fe-4b3b31b6e1b9",
};
