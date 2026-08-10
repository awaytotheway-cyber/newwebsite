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
    return `No backend is connected yet. When one is, I'll answer "${question}" ` +
      `using the RAG pipeline over Srila Prabhupada's life record. Set RAG_API_ENDPOINT ` +
      `in js/config.js to connect it.`;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return data.answer || "The archive didn't return an answer for that.";
  } catch (err) {
    console.error("queryArchive failed:", err);
    return "The archive couldn't be reached just now. Please try again shortly.";
  }
}

function appendMessage(role, text, pending = false) {
  const log = document.getElementById("chatLog");
  const msg = document.createElement("div");
  msg.className = `msg from-${role}${pending ? " pending" : ""}`;
  
  let audioHtml = "";
  if (role === "archive" && !pending) {
    audioHtml = `<button type="button" class="audio-narration-btn" style="margin-top:10px;" onclick="speakText(this.previousElementSibling.innerText, this)"><span>🔊</span> <span class="audio-btn-label">Listen</span></button>`;
  }

  msg.innerHTML = `
    <span class="label">${role === "visitor" ? "You" : "The Archive"}</span>
    <div class="bubble">${escapeHtml(text)}</div>
    ${audioHtml}
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

  const pendingMsg = appendMessage("archive", "Consulting the archive…", true);

  const answer = await queryArchive(question);

  pendingMsg.remove();
  appendMessage("archive", answer);
  sendBtn.disabled = false;
  input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const statusDot = document.getElementById("statusDot");
  const chips = document.querySelectorAll(".chip");

  const connected = Boolean(window.SITE_CONFIG && window.SITE_CONFIG.RAG_API_ENDPOINT);
  if (statusDot) {
    statusDot.classList.toggle("ready", connected);
    statusDot.title = connected ? "Backend connected" : "Backend not connected yet";
  }

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

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.textContent;
      handleAsk();
    });
  });
});
