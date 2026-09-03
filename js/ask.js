/* ============================================================
   ASK THE ARCHIVE — chat logic
   ------------------------------------------------------------
   The only function you need to touch for RAG integration is
   queryArchive(question) below. Right now it calls whatever
   endpoint is set in js/config.js (window.SITE_CONFIG.RAG_API_ENDPOINT).
   If that's empty, it returns a clear placeholder instead of
   pretending to have an answer.

   Expected backend contract (adjust to match your pipeline):
     POST { question: string }  →  { answer: string }
   ============================================================ */

async function queryArchive(question) {
  const endpoint = window.SITE_CONFIG && window.SITE_CONFIG.RAG_API_ENDPOINT;

  if (!endpoint) {
    return `The archive is not yet connected. Once a backend is configured, I will answer "${question}" using the full record of Srila Prabhupada's life.`;
  }

  // 30-second timeout so the UI never hangs indefinitely
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    // --- Flexible response parsing for n8n webhook outputs ---
    const contentType = response.headers.get("content-type") || "";

    // If n8n returns plain text instead of JSON
    if (!contentType.includes("application/json")) {
      const text = (await response.text()).trim();
      return text || "The archive didn't return an answer for that.";
    }

    let data = await response.json();

    // n8n sometimes wraps the result in an array
    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    // Try every common n8n output field in priority order
    const answer =
      data.answer ||          // custom Respond-to-Webhook body
      data.output ||          // AI Agent / Chain node
      data.text ||            // Chat model / LLM node
      data.response ||        // generic alias
      data.message ||         // some custom setups
      data.result ||          // another common alias
      (typeof data === "string" ? data : null);

    if (answer) {
      return typeof answer === "string" ? answer : JSON.stringify(answer);
    }

    // Last resort: if none of the known keys matched, stringify the whole object
    console.warn("queryArchive: unexpected response shape", data);
    return typeof data === "object"
      ? JSON.stringify(data)
      : "The archive didn't return an answer for that.";

  } catch (err) {
    clearTimeout(timeout);
    console.error("queryArchive failed:", err);

    if (err.name === "AbortError") {
      return "The archive is taking too long to respond. Please try again in a moment.";
    }
    if (err.message && err.message.includes("Failed to fetch")) {
      return "Could not reach the archive — this may be a network or CORS issue. " +
        "Check the browser console for details.";
    }
    return "The archive couldn't be reached just now. Please try again shortly.";
  }
}

function appendMessage(role, text, pending = false) {
  const log = document.getElementById("chatLog");
  const msg = document.createElement("div");
  msg.className = `msg from-${role}${pending ? " pending" : ""}`;

  const bubbleContent = pending
    ? `<div class="loader-spinner"><div class="inner one"></div><div class="inner two"></div><div class="inner three"></div></div>`
    : escapeHtml(text);

  msg.innerHTML = `
    <span class="label">${role === "visitor" ? "You" : "The Archive"}</span>
    <div class="bubble${pending ? ' bubble--loading' : ''}">${bubbleContent}</div>
  `;
  log.appendChild(msg);
  log.scrollTop = log.scrollHeight;
  return msg;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function handleAsk() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const question = input.value.trim();
  if (!question) return;

  appendMessage("visitor", question);
  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;

  const pendingMsg = appendMessage("archive", "", true);

  const answer = await queryArchive(question);

  pendingMsg.remove();
  appendMessage("archive", answer);
  sendBtn.disabled = false;
  input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const micBtn = document.getElementById("chatMic");

  sendBtn.addEventListener("click", handleAsk);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  });

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!micBtn) return;
  if (!SpeechRecognition) {
    micBtn.hidden = true;
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = (document.documentElement.lang || "en-IN");
  recognition.interimResults = true;
  recognition.continuous = false;
  let listening = false;
  let baseText = "";

  function setListening(on) {
    listening = on;
    micBtn.classList.toggle("listening", on);
    micBtn.setAttribute("aria-pressed", String(on));
    micBtn.setAttribute("aria-label", on ? "Stop listening" : "Speak your question");
  }

  recognition.onresult = (event) => {
    let finalText = "";
    let interim = "";
    for (let i = 0; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += piece;
      else interim += piece;
    }
    const spoken = (finalText || interim).trim();
    input.value = [baseText, spoken].filter(Boolean).join(" ").trim();
    input.dispatchEvent(new Event("input"));
  };
  recognition.onerror = () => setListening(false);
  recognition.onend = () => setListening(false);

  micBtn.addEventListener("click", () => {
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    baseText = input.value.trim();
    try {
      recognition.start();
      setListening(true);
    } catch (err) {
      setListening(false);
    }
  });
});
