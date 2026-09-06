/* ============================================================
   ASK THE ARCHIVE — chat logic
   ------------------------------------------------------------
   POST { session_id, chatInput }  →  { answer | output | text }
   GET  RAG_HISTORY_ENDPOINT?session_id=…  →  { messages: [{ role, content }] }
   ============================================================ */

const SESSION_KEY = "sp_session_id";

function fallbackUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getOrCreateSessionId() {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : fallbackUuid();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch (err) {
    return (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : fallbackUuid();
  }
}

function historyEndpoint() {
  return (window.SITE_CONFIG && window.SITE_CONFIG.RAG_HISTORY_ENDPOINT) || "";
}

function spinnerHtml() {
  return '<div class="loader-spinner" aria-hidden="true"><div class="inner one"></div><div class="inner two"></div><div class="inner three"></div></div>';
}

function setChatStatus(kind, text) {
  const log = document.getElementById("chatLog");
  let el = document.getElementById("chatStatus");
  if (!text) {
    if (el) el.remove();
    return null;
  }
  if (!log) return null;
  if (!el) {
    el = document.createElement("div");
    el.id = "chatStatus";
    log.appendChild(el);
  }
  el.className = "chat-status" + (kind ? " chat-status--" + kind : "");
  el.setAttribute("role", "status");
  el.innerHTML = (kind === "loading" ? spinnerHtml() : "") +
    "<p>" + escapeHtml(text) + "</p>";
  log.scrollTop = log.scrollHeight;
  return el;
}

function showChatInput() {
  const inputBar = document.getElementById("chatInputBar") ||
    document.querySelector(".chat-input-sticky");
  if (inputBar) inputBar.hidden = false;
}

function normalizeHistory(data) {
  if (!data) return [];
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return [];
    try {
      data = JSON.parse(trimmed);
    } catch (err) {
      return [];
    }
  }
  if (Array.isArray(data)) {
    if (data.length === 1 && data[0] && data[0].messages) data = data[0].messages;
  } else if (data.messages) {
    data = data.messages;
  } else {
    return [];
  }
  if (!Array.isArray(data)) return [];

  return data.reduce(function (acc, item) {
    if (!item || typeof item !== "object") return acc;
    const text = String(item.content || item.text || item.message || "").trim();
    if (!text) return acc;
    const roleRaw = String(item.role || "").toLowerCase();
    const role = (roleRaw === "user" || roleRaw === "visitor" || roleRaw === "human")
      ? "visitor"
      : "archive";
    acc.push({ role: role, text: text });
    return acc;
  }, []);
}

async function loadChatHistory(sessionId) {
  const endpoint = historyEndpoint();
  if (!endpoint || !sessionId) return;

  setChatStatus("loading", "Loading your conversation…");

  const controller = new AbortController();
  const timeout = setTimeout(function () { controller.abort(); }, 12000);

  try {
    const url = endpoint + (endpoint.indexOf("?") >= 0 ? "&" : "?") +
      "session_id=" + encodeURIComponent(sessionId);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      setChatStatus("error", "Couldn't restore earlier messages. You can still ask.");
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const messages = normalizeHistory(data);
    setChatStatus("", "");
    messages.forEach(function (m) {
      appendMessage(m.role, m.text);
    });
  } catch (err) {
    clearTimeout(timeout);
    setChatStatus("error", "Couldn't restore earlier messages. You can still ask.");
  }
}

async function queryArchive(question, sessionId) {
  const endpoint = window.SITE_CONFIG && window.SITE_CONFIG.RAG_API_ENDPOINT;

  if (!endpoint) {
    return `The archive is not yet connected. Once a backend is configured, I will answer "${question}" using the full record of Srila Prabhupada's life.`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        chatInput: question,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = (await response.text()).trim();
      return text || "The archive didn't return an answer for that.";
    }

    let data = await response.json();

    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    const answer =
      data.answer ||
      data.output ||
      data.text ||
      data.response ||
      data.message ||
      data.result ||
      (typeof data === "string" ? data : null);

    if (answer) {
      return typeof answer === "string" ? answer : JSON.stringify(answer);
    }

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
    ? spinnerHtml()
    : escapeHtml(text);

  msg.innerHTML = `
    <span class="label">${role === "visitor" ? "You" : "The Archive"}</span>
    <div class="bubble${pending ? " bubble--loading" : ""}">${bubbleContent}</div>
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

function hasChatMessages() {
  return !!document.querySelector("#chatLog .msg");
}

function resetChatSession() {
  if (!hasChatMessages() && !document.getElementById("chatStatus")) {
    return;
  }
  if (!window.confirm("Clear this conversation? A new anonymous session will start.")) {
    return;
  }
  try {
    var id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : fallbackUuid();
    localStorage.setItem(SESSION_KEY, id);
  } catch (err) {}
  document.querySelectorAll("#chatLog .msg, #chatStatus").forEach(function (el) {
    el.remove();
  });
}

async function handleAsk() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const question = input.value.trim();
  if (!question) return;

  setChatStatus("", "");
  appendMessage("visitor", question);
  input.value = "";
  input.style.height = "auto";
  sendBtn.disabled = true;

  const pendingMsg = appendMessage("archive", "", true);
  const sessionId = getOrCreateSessionId();
  const answer = await queryArchive(question, sessionId);

  pendingMsg.remove();
  appendMessage("archive", answer);
  sendBtn.disabled = false;
  input.focus();
}

document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const micBtn = document.getElementById("chatMic");
  const sessionId = getOrCreateSessionId();

  await loadChatHistory(sessionId);
  showChatInput();

  const clearBtn = document.getElementById("clearChatBtn");
  if (clearBtn) clearBtn.addEventListener("click", resetChatSession);

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
