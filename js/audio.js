/* ============================================================
   HUMAN VOICE AUDIO NARRATOR — Srila Prabhupada Archive
   Uses Web Speech API tuned with Natural / Neural Voice Selection,
   warm human-like pitch & rate defaults, and interactive controls.
   ============================================================ */

class HumanAudioPlayer {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.rate = 0.92;   // Natural, calm human pacing
    this.pitch = 0.98;  // Warm, natural human tone
    this.isPlaying = false;
    this.activeButton = null;

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;

      // Priority list for natural, high-quality human-sounding neural voices
      const preferredKeywords = [
        "natural", "neural", "online", "enhanced", "premium",
        "guy", "christopher", "ryan", "sonia", "jenny", "oliver", "daniel",
        "google uk english male", "google us english", "google"
      ];

      let bestVoice = null;

      // 1. Try finding a preferred natural English voice
      for (const keyword of preferredKeywords) {
        bestVoice = voices.find(
          (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes(keyword)
        );
        if (bestVoice) break;
      }

      // 2. Fallback to any English voice
      if (!bestVoice) {
        bestVoice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
      }

      this.selectedVoice = bestVoice;
      this.populateVoiceSelects(voices);
    };

    loadVoices();
    if (typeof this.synth.onvoiceschanged !== "undefined") {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  populateVoiceSelects(voices) {
    const selects = document.querySelectorAll(".human-voice-select");
    selects.forEach((select) => {
      const currentVal = select.value;
      select.innerHTML = "";

      const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
      const listToDisplay = englishVoices.length > 0 ? englishVoices : voices;

      listToDisplay.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        
        let label = voice.name;
        if (
          voice.name.toLowerCase().includes("natural") ||
          voice.name.toLowerCase().includes("neural") ||
          voice.name.toLowerCase().includes("enhanced")
        ) {
          label += " ✨ (Natural Human)";
        }

        option.textContent = label;
        if (this.selectedVoice && voice.name === this.selectedVoice.name) {
          option.selected = true;
        }
        select.appendChild(option);
      });

      if (currentVal) select.value = currentVal;

      select.onchange = (e) => {
        const chosen = voices.find((v) => v.name === e.target.value);
        if (chosen) {
          this.selectedVoice = chosen;
          if (this.isPlaying) {
            this.stop();
          }
        }
      };
    });
  }

  speak(text, buttonEl = null) {
    if (!this.synth) {
      alert("Audio narration is not supported by your browser.");
      return;
    }

    if (this.isPlaying) {
      this.stop();
      if (this.activeButton === buttonEl) {
        return; // Toggled off
      }
    }

    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    if (!cleanText) return;

    this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.pitch = this.pitch;

    if (this.selectedVoice) {
      this.currentUtterance.voice = this.selectedVoice;
    }

    if (buttonEl) {
      this.activeButton = buttonEl;
      buttonEl.classList.add("playing");
      const label = buttonEl.querySelector(".audio-btn-label");
      if (label) label.textContent = "Pause Narration";
    }

    this.currentUtterance.onend = () => {
      this.resetActiveState();
    };

    this.currentUtterance.onerror = (err) => {
      console.warn("Speech synthesis error:", err);
      this.resetActiveState();
    };

    this.isPlaying = true;
    this.synth.speak(this.currentUtterance);

    this.updateGlobalIndicator(cleanText);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.resetActiveState();
  }

  resetActiveState() {
    if (this.activeButton) {
      this.activeButton.classList.remove("playing");
      const label = this.activeButton.querySelector(".audio-btn-label");
      if (label) label.textContent = "Listen";
      this.activeButton = null;
    }
    this.isPlaying = false;
    this.hideGlobalIndicator();
  }

  updateGlobalIndicator(text) {
    let bar = document.getElementById("audioPlayingBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "audioPlayingBar";
      bar.className = "audio-playing-bar";
      bar.innerHTML = `
        <div class="wrap audio-bar-content">
          <div class="audio-bar-info">
            <span class="audio-pulse-icon">🔊</span>
            <span class="audio-bar-text">Narrating in human-like voice…</span>
          </div>
          <button class="audio-bar-stop" id="audioBarStopBtn">Stop Audio ⏹</button>
        </div>
      `;
      document.body.appendChild(bar);

      document.getElementById("audioBarStopBtn").onclick = () => this.stop();
    }
    const textEl = bar.querySelector(".audio-bar-text");
    if (textEl) {
      textEl.textContent = `Narrating: "${text.length > 50 ? text.substring(0, 50) + "…" : text}"`;
    }
    bar.classList.add("visible");
  }

  hideGlobalIndicator() {
    const bar = document.getElementById("audioPlayingBar");
    if (bar) {
      bar.classList.remove("visible");
    }
  }
}

// Global instance
window.humanAudio = new HumanAudioPlayer();

// Global helper to trigger speak from inline onclick
function speakText(text, btn) {
  if (window.humanAudio) {
    window.humanAudio.speak(text, btn);
  }
}
