/**
 * GriefBuddy — Buddy Mascot Engine
 * Uses official Buddy Mascot illustration (buddy-mascot.png) with emotion states,
 * interactive animations, and Web Audio feedback.
 * Conforms to PRD F09 & Brawijaya Essay Mascot Character Sheet
 */

const BuddyMascot = {
  imageSrc: 'buddy-mascot.png',

  // Sound synthesizer using Web Audio API for interactive feedback
  playTone(type = 'chime') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'gentle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'cheer') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      }
    } catch (e) {
      // Audio might be blocked before first user gesture
    }
  },

  // Descriptions & default speech for the 8 PRD states
  states: {
    welcome: {
      name: "👋 Welcome",
      badge: "💜",
      animClass: "anim-breathe",
      desc: "Menyapa pengguna dengan hangat dan ramah saat pertama kali membuka aplikasi.",
      bubble: "Halo! Aku Buddy. Aku di sini untuk menemanimu hari ini."
    },
    happy: {
      name: "😊 Happy / Tersenyum",
      badge: "🌱",
      animClass: "anim-breathe",
      desc: "Menunjukkan kehangatan lembut ketika pengguna merasa nyaman.",
      bubble: "Senang bisa mendampingimu hari ini 🌱"
    },
    listening: {
      name: "🤍 Listening / Mendengarkan",
      badge: "🤍",
      animClass: "anim-breathe",
      desc: "Fokus mendengarkan cerita pengguna tanpa menghakimi.",
      bubble: "Aku mendengarkanmu dengan sungguh-sungguh... Ceritakan apa saja."
    },
    sad: {
      name: "😢 Sad / Empathetic",
      badge: "💧",
      animClass: "anim-breathe-slow",
      desc: "Menunjukkan empati mendalam saat pengguna sedang sedih, tidak memaksakan keceriaan.",
      bubble: "Tidak apa-apa kalau hari ini terasa sangat berat. Aku tetap di sini."
    },
    encouraging: {
      name: "🌱 Encouraging / Tumbuh",
      badge: "🌿",
      animClass: "anim-breathe",
      desc: "Mengingatkan harapan kecil dan proses pemulihan yang berangsur-angsur.",
      bubble: "Setiap langkah kecilmu sangat berharga. Kita jalan bersama ya."
    },
    resting: {
      name: "😴 Resting / Istirahat",
      badge: "💤",
      animClass: "anim-breathe-slow",
      desc: "Menemani pengguna untuk menenangkan diri dan istirahat sejenak.",
      bubble: "Tarik napas perlahan... Istirahatlah sejenak jika lelah."
    },
    celebrating: {
      name: "✨ Celebrating / Tetap Kuat",
      badge: "✨",
      animClass: "anim-cheer",
      desc: "Mengapresiasi pencapaian dan keberanian pengguna melewati masa sulit.",
      bubble: "Kamu sudah melangkah sejauh ini! Aku bangga padamu! ✨"
    },
    comforting: {
      name: "🫂 Comforting / Pelukan Hangat",
      badge: "🫂",
      animClass: "anim-breathe",
      desc: "Mendekap hati untuk memberikan rasa aman dan tidak sendirian.",
      bubble: "Kamu tidak harus melewati semuanya sendirian. Ada aku di sini."
    }
  },

  /**
   * Generates markup for Buddy Mascot using the official illustration
   * @param {string} stateName - welcome, happy, listening, sad, encouraging, resting, celebrating, comforting
   * @param {number} size - width/height in px
   * @param {boolean} showBubble - whether to render the speech bubble
   * @param {string} customBubble - optional override text for bubble
   */
  render(stateName = 'welcome', size = 180, showBubble = false, customBubble = null) {
    const s = this.states[stateName] || this.states.welcome;
    const bubbleText = customBubble !== null ? customBubble : s.bubble;
    const animClass = s.animClass || 'anim-breathe';

    return `
      <div class="buddy-container" data-state="${stateName}" onclick="BuddyMascot.playTone('chime'); BuddyMascot.onTap('${stateName}')">
        ${showBubble ? `<div class="buddy-speech-bubble">${bubbleText}</div>` : ''}
        <div class="buddy-avatar-wrap ${animClass}" style="width: ${size}px; height: ${size}px;">
          <img
            src="${this.imageSrc}"
            alt="Buddy Mascot (${s.name})"
            class="buddy-avatar-img buddy-state-${stateName}"
            width="${size}"
            height="${size}"
            draggable="false"
          />
          <span class="buddy-state-badge" title="${s.name}">${s.badge}</span>
        </div>
      </div>
    `;
  },

  // Reaction when user clicks on Buddy
  onTap(currentState) {
    const bubbles = [
      "Aku di sini bersamamu ♡",
      "Kamu tidak sendiri.",
      "Tarik napas perlahan... kamu hebat!",
      "Hari ini satu langkah kecil, ya? 🌱",
      "Perasaanmu valid dan didengar di sini."
    ];
    const randomMsg = bubbles[Math.floor(Math.random() * bubbles.length)];
    
    // Update speech bubble if element exists
    const bubbleEl = document.querySelector('.buddy-speech-bubble');
    if (bubbleEl) {
      bubbleEl.textContent = randomMsg;
      bubbleEl.style.animation = 'none';
      bubbleEl.offsetHeight; /* trigger reflow */
      bubbleEl.style.animation = 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  },

  /**
   * Helper to inject Buddy directly into a container
   */
  inject(containerId, stateName = 'welcome', size = 180, showBubble = true, customBubble = null) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = this.render(stateName, size, showBubble, customBubble);
  }
};
