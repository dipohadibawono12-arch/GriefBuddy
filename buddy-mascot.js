/**
 * GriefBuddy — 3D Volumetric Buddy Mascot Engine
 * Multi-plane 3D parallax rig (preserve-3d) with extruded 3D volume layers,
 * independent 3D pop-out heart & swaying 3D sprout, dynamic specular lighting,
 * 3D floor pedestal shadow, and synchronized 3D animations.
 */

const BuddyMascot = {
  imageSrc: 'buddy-mascot.png',
  heartLayerSrc: 'buddy-heart-3d.png',
  sproutLayerSrc: 'buddy-sprout-3d.png',
  trickIndex: 0,

  // Sound synthesizer using Web Audio API for cute interactive feedback
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
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.11); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.22); // G5
        gain.gain.setValueAtTime(0.11, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'gentle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'cheer') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.09);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3);
        gain.gain.setValueAtTime(0.13, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      } else if (type === 'boop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.14);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      // Audio might be blocked before first user gesture
    }
  },

  // Descriptions, 3D animation classes & ambient particles for the 8 PRD states
  states: {
    welcome: {
      name: "👋 Welcome",
      badge: "💜",
      animClass: "anim-3d-waddle",
      particles: ["💗", "✨", "🌱"],
      desc: "Menyapa pengguna dengan hangat dan ramah saat pertama kali membuka aplikasi.",
      bubble: "Halo! Aku Buddy. Aku di sini untuk menemanimu hari ini."
    },
    happy: {
      name: "😊 Happy / Tersenyum",
      badge: "🌱",
      animClass: "anim-3d-waddle",
      particles: ["🌸", "✨", "💗"],
      desc: "Menunjukkan kehangatan lembut ketika pengguna merasa nyaman.",
      bubble: "Senang bisa mendampingimu hari ini 🌱"
    },
    listening: {
      name: "🤍 Listening / Mendengarkan",
      badge: "🤍",
      animClass: "anim-3d-tilt",
      particles: ["💭", "🤍", "✨"],
      desc: "Fokus mendengarkan cerita pengguna tanpa menghakimi.",
      bubble: "Aku mendengarkanmu dengan sungguh-sungguh... Ceritakan apa saja."
    },
    sad: {
      name: "😢 Sad / Empathetic",
      badge: "💧",
      animClass: "anim-3d-empathetic",
      particles: ["💧", "🫂", "🤍"],
      desc: "Menunjukkan empati mendalam saat pengguna sedang sedih, tidak memaksakan keceriaan.",
      bubble: "Tidak apa-apa kalau hari ini terasa sangat berat. Aku tetap di sini."
    },
    encouraging: {
      name: "🌱 Encouraging / Tumbuh",
      badge: "🌿",
      animClass: "anim-3d-hop",
      particles: ["🌱", "✨", "🍀"],
      desc: "Mengingatkan harapan kecil dan proses pemulihan yang berangsur-angsur.",
      bubble: "Setiap langkah kecilmu sangat berharga. Kita jalan bersama ya."
    },
    resting: {
      name: "😴 Resting / Istirahat",
      badge: "💤",
      animClass: "anim-3d-sleepy",
      particles: ["💤", "🌙", "✨"],
      desc: "Menemani pengguna untuk menenangkan diri dan istirahat sejenak.",
      bubble: "Tarik napas perlahan... Istirahatlah sejenak jika lelah."
    },
    celebrating: {
      name: "✨ Celebrating / Tetap Kuat",
      badge: "✨",
      animClass: "anim-3d-dance",
      particles: ["🎉", "✨", "💖"],
      desc: "Mengapresiasi pencapaian dan keberanian pengguna melewati masa sulit.",
      bubble: "Kamu sudah melangkah sejauh ini! Aku bangga padamu! ✨"
    },
    comforting: {
      name: "🫂 Comforting / Pelukan Hangat",
      badge: "🫂",
      animClass: "anim-3d-hug",
      particles: ["💗", "🫂", "💜"],
      desc: "Mendekap hati untuk memberikan rasa aman dan tidak sendirian.",
      bubble: "Kamu tidak harus melewati semuanya sendirian. Ada aku di sini."
    }
  },

  /**
   * Generates multi-plane 3D markup for Buddy Mascot
   */
  render(stateName = 'welcome', size = 180, showBubble = false, customBubble = null) {
    const s = this.states[stateName] || this.states.welcome;
    const bubbleText = customBubble !== null ? customBubble : s.bubble;
    const animClass = s.animClass || 'anim-3d-waddle';
    const [p1, p2, p3] = s.particles || ['💗', '✨', '🌱'];

    return `
      <div
        class="buddy-container"
        data-state="${stateName}"
        onclick="BuddyMascot.onTap(this, '${stateName}')"
        onmousemove="BuddyMascot.onPointerMove(event, this)"
        onmouseleave="BuddyMascot.onPointerLeave(this)"
      >
        ${showBubble ? `<div class="buddy-speech-bubble">${bubbleText}</div>` : ''}

        <div class="buddy-stage buddy-stage-3d" style="width: ${size}px; height: ${size}px;">
          <!-- 3D Floor Pedestal & Synchronized Shadow -->
          <div class="buddy-3d-pedestal"></div>
          <div class="buddy-ground-shadow"></div>

          <!-- Dynamic Burst Layer for Clicks/Petting -->
          <div class="buddy-burst-layer" aria-hidden="true"></div>

          <!-- Multi-Plane 3D Articulated Rig -->
          <div class="buddy-avatar-wrap buddy-rig-3d ${animClass}" style="width: ${size}px; height: ${size}px;">
            <!-- Plane -3 (Z: -26px): 3D Volumetric Back Halo -->
            <div class="buddy-aura buddy-aura-${stateName}"></div>

            <!-- Plane -2 (Z: -11px) & Plane -1 (Z: -5px): 3D Extruded Body Thickness -->
            <img
              src="${this.imageSrc}"
              alt=""
              aria-hidden="true"
              class="buddy-3d-extrude buddy-3d-extrude-back"
              width="${size}"
              height="${size}"
              draggable="false"
            />
            <img
              src="${this.imageSrc}"
              alt=""
              aria-hidden="true"
              class="buddy-3d-extrude buddy-3d-extrude-mid"
              width="${size}"
              height="${size}"
              draggable="false"
            />

            <!-- Plane 0 (Z: 0px): Main 3D Volumetric Shaded Character -->
            <img
              src="${this.imageSrc}"
              alt="Buddy Mascot (${s.name})"
              class="buddy-avatar-img buddy-state-${stateName}"
              width="${size}"
              height="${size}"
              draggable="false"
            />

            <!-- Plane +1 (Z: +14px): Independent 3D Swaying Sprout on Head -->
            <img
              src="${this.sproutLayerSrc}"
              alt=""
              aria-hidden="true"
              class="buddy-3d-sprout-layer"
              width="${size}"
              height="${size}"
              draggable="false"
              onerror="this.style.display='none'"
            />

            <!-- Plane +2 (Z: +22px): Independent 3D Pop-Out Pulsing Pink Heart -->
            <img
              src="${this.heartLayerSrc}"
              alt=""
              aria-hidden="true"
              class="buddy-3d-heart-layer"
              width="${size}"
              height="${size}"
              draggable="false"
              onerror="this.style.display='none'"
            />

            <!-- Plane +3 (Z: +30px): 3D Specular Rim Glint, Rosy Cheeks & Eye Sparkles -->
            <div class="buddy-live-fx buddy-3d-front-fx" aria-hidden="true">
              <div class="buddy-3d-specular-dome"></div>
              <span class="buddy-cheek cheek-left"></span>
              <span class="buddy-cheek cheek-right"></span>
              <span class="buddy-heart-glow"></span>
              <span class="buddy-eye-sparkle sparkle-left">✦</span>
              <span class="buddy-eye-sparkle sparkle-right">✦</span>
            </div>

            <!-- Plane +4 (Z: +36px): 3D Orbiting Ambient Particles & State Badge -->
            <div class="buddy-ambient-particles" aria-hidden="true">
              <span class="ambient-floater floater-1">${p1}</span>
              <span class="ambient-floater floater-2">${p2}</span>
              <span class="ambient-floater floater-3">${p3}</span>
            </div>

            <span class="buddy-state-badge" title="${s.name}">${s.badge}</span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * True 3D Perspective Rotation & Specular Light Tracking on Pointer Move
   */
  onPointerMove(event, containerEl) {
    const stage = containerEl?.querySelector('.buddy-stage-3d');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotY = (relX * 26).toFixed(2);
    const rotX = (-relY * 20).toFixed(2);
    const liftY = (relY * -6).toFixed(2);
    stage.style.transform = `perspective(720px) translateY(${liftY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    stage.style.setProperty('--light-x', `${(50 + relX * 45).toFixed(1)}%`);
    stage.style.setProperty('--light-y', `${(35 + relY * 45).toFixed(1)}%`);
  },

  onPointerLeave(containerEl) {
    const stage = containerEl?.querySelector('.buddy-stage-3d');
    if (stage) {
      stage.style.transform = '';
      stage.style.removeProperty('--light-x');
      stage.style.removeProperty('--light-y');
    }
  },

  /**
   * Interactive 3D reaction when user taps/clicks Buddy
   */
  onTap(containerOrState, maybeState) {
    const containerEl = typeof containerOrState === 'object' && containerOrState !== null
      ? containerOrState
      : document.querySelector('.buddy-container');

    const tricks = [
      {
        cls: 'trick-boop-jump',
        tone: 'boop',
        particles: ['💗', '✨', '🌸', '💜', '🌱'],
        msg: 'Hihi, geli! Aku senang kamu menyapaku ♡'
      },
      {
        cls: 'trick-jelly-wiggle',
        tone: 'cheer',
        particles: ['🎶', '💜', '✨', '🌷', '💗'],
        msg: 'Goyang 3D semangat dulu biar harimu makin hangat! 🎶'
      },
      {
        cls: 'trick-love-hug',
        tone: 'gentle',
        particles: ['🫂', '💗', '🤍', '💖', '🌸'],
        msg: 'Peluk hangat dari Buddy untukmu! Kamu hebat hari ini 🫂'
      },
      {
        cls: 'trick-happy-spin',
        tone: 'chime',
        particles: ['✨', '🌟', '🌱', '💜', '🎉'],
        msg: 'Putaran bahagia 3D! Satu langkah kecil hari ini sangat berarti 🌱✨'
      }
    ];

    const trick = tricks[this.trickIndex % tricks.length];
    this.trickIndex++;

    this.playTone(trick.tone);
    this.triggerTrick(containerEl, trick.cls, trick.particles, trick.msg);
  },

  /**
   * Triggers a specific named 3D animation trick on Buddy
   */
  performAction(actionType = 'pet', targetContainerId = null) {
    const root = targetContainerId
      ? document.getElementById(targetContainerId)?.querySelector('.buddy-container')
      : document.querySelector('.mobile-screen-pane.active .buddy-container') || document.querySelector('.buddy-container');

    const actionMap = {
      pet: {
        cls: 'trick-jelly-wiggle',
        tone: 'boop',
        particles: ['🤚', '💗', '🌸', '✨', '😊'],
        msg: 'Purrr~ Terima kasih sudah mengelus kepalaku! Rasanya hangat sekali 💜'
      },
      hug: {
        cls: 'trick-love-hug',
        tone: 'gentle',
        particles: ['🫂', '💖', '🤍', '💗', '🌸'],
        msg: 'Pelukan erat untukmu! Kamu tidak pernah sendirian melewati ini 🫂🤍'
      },
      dance: {
        cls: 'trick-happy-spin',
        tone: 'cheer',
        particles: ['🎶', '✨', '🌟', '🎉', '💜'],
        msg: 'Yey! Ayo berputar dan goyang 3D bersama Buddy! 🎶✨'
      },
      cheer: {
        cls: 'trick-boop-jump',
        tone: 'chime',
        particles: ['🌱', '✨', '💪', '🌿', '💛'],
        msg: 'Tunas di kepalaku tumbuh setiap kali kamu bertahan hari ini! Semangat ya 🌱'
      }
    };

    const act = actionMap[actionType] || actionMap.pet;
    this.playTone(act.tone);
    this.triggerTrick(root, act.cls, act.particles, act.msg);
  },

  triggerTrick(containerEl, trickClass, particleList, bubbleMessage) {
    if (!containerEl) return;

    const wrap = containerEl.querySelector('.buddy-avatar-wrap');
    if (wrap) {
      wrap.classList.remove('trick-boop-jump', 'trick-jelly-wiggle', 'trick-love-hug', 'trick-happy-spin');
      void wrap.offsetWidth; // reflow
      wrap.classList.add(trickClass);
      setTimeout(() => {
        wrap.classList.remove(trickClass);
      }, 1050);
    }

    // Spawn burst particles
    const burstLayer = containerEl.querySelector('.buddy-burst-layer');
    if (burstLayer) {
      burstLayer.innerHTML = '';
      const count = 8;
      for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'buddy-burst-particle';
        span.textContent = particleList[i % particleList.length];
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const dist = 56 + Math.random() * 30;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - 18;
        span.style.setProperty('--tx', `${tx.toFixed(1)}px`);
        span.style.setProperty('--ty', `${ty.toFixed(1)}px`);
        burstLayer.appendChild(span);
      }
      setTimeout(() => {
        if (burstLayer) burstLayer.innerHTML = '';
      }, 1000);
    }

    // Update speech bubble
    const bubbleEl = containerEl.querySelector('.buddy-speech-bubble') || document.querySelector('.mobile-screen-pane.active .buddy-speech-bubble');
    if (bubbleEl && bubbleMessage) {
      bubbleEl.textContent = bubbleMessage;
      bubbleEl.style.animation = 'none';
      void bubbleEl.offsetHeight;
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
