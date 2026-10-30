/**
 * GriefBuddy Prototype Application Controller
 * Handles Navigation, State Management, BEQ-24 Assessment,
 * Interactive AI Chat with Risk Detection, Grief Journey Map, and Community
 */

const AppState = {
  activeScreen: 's04', // default to Home for easy review, or s01 for flow
  topMode: 'mobile',
  user: {
    name: 'Alya',
    age: 17,
    relationship: 'Ibu',
    lossTime: '6 bulan lalu',
    communicationMode: 'comforting', // comforting | feedback | informative
    chatDisplayMode: 'mascot',      // mascot | text
    todayMood: 'sad',
    beqProfile: {
      guiltAnger: 'Rendah (Skor 8/25)',
      existentialNeed: 'Sedang (Skor 16/25)',
      preoccupation: 'Tinggi (Skor 22/25)',
      summary: 'Kondisi duka wajar pasca-kehilangan dengan kerinduan mendalam. Direkomendasikan pendampingan comforting & validasi emosi.'
    }
  },
  assessmentAnswers: {},
  // Challenge state (alur baru: chat -> challenge sosial / challenge jurnal)
  socialChallenge: { doneIds: [] },
  journalMood: null,
  journalEntries: [
    { date: '18 September', mood: '😢 Sedih', text: 'Tadi sore lihat tanaman bougenville ibu mekar. Rasanya campur aduk antara kangen dan bersyukur pernah disayang sebesar itu.' },
    { date: '08 September', mood: '😐 Netral', text: 'Mencoba jalan sore keliling komplek sambil dengerin musik favorit. Udara sore lumayan bikin kepala gak terlalu penat.' }
  ],
  chatHistory: [
    {
      sender: 'buddy',
      text: 'Halo Alya 💜 Aku di sini menemanimu. Bagaimana perasaanmu hari ini?',
      time: '14:20'
    },
    {
      sender: 'user',
      text: 'Hari ini aku tiba-tiba sedih banget waktu melihat foto lama ibu di lemari.',
      time: '14:22'
    },
    {
      sender: 'buddy',
      text: 'Aku dengar kamu, Alya. Sangat wajar dan manusiawi kalau melihat foto kenangan tiba-tiba menghadirkan rindu yang begitu dalam. Kamu tidak perlu terburu-buru menahannya. Mau bercerita apa yang paling kamu rindukan saat melihat foto itu?',
      time: '14:22'
    }
  ],
  journeySessions: [
    {
      id: 1,
      title: "Session 1: The Sadness",
      emotion: "Kesedihan mendalam",
      trigger: "Melihat foto lama keluarga",
      memory: "Liburan bersama ibu di pantai",
      need: "Ingin didengarkan tanpa dihakimi",
      coping: "Menulis surat kecil di jurnal & latihan napas pelan",
      date: "12 Ags 2026",
      status: "completed",
      x: 18,
      y: 72
    },
    {
      id: 2,
      title: "Session 2: Anger & Confusion",
      emotion: "Rasa bersalah & bingung",
      trigger: "Acara keluarga besar di sekolah",
      memory: "Masakan sup ayam buatan ibu",
      need: "Mencari ruang aman untuk meluapkan marah",
      coping: "Mengekspresikan emosi lewat tulisan tanpa sensor",
      date: "25 Ags 2026",
      status: "completed",
      x: 35,
      y: 42
    },
    {
      id: 3,
      title: "Session 3: First Steps in Coping",
      emotion: "Mulai sedikit lebih tenang",
      trigger: "Sore hari yang sunyi di kamar",
      memory: "Nasihat ibu tentang masa depan",
      need: "Membangun kembali rutinitas belajar kecil",
      coping: "Jalan santai 15 menit & mendengarkan lagu tenang",
      date: "08 Sep 2026",
      status: "completed",
      x: 54,
      y: 60
    },
    {
      id: 4,
      title: "Session 4: Reminiscing with Warmth",
      emotion: "Kerinduan dengan senyum tipis",
      trigger: "Melihat tanaman kesayangan ibu berbunga",
      memory: "Kebiasaan ibu menyiram tanaman setiap pagi",
      need: "Membagi cerita dengan teman sebaya yang senasib",
      coping: "Menyiram tanaman ibu & posting cerita di Peer Support",
      date: "18 Sep 2026",
      status: "completed",
      x: 72,
      y: 28
    },
    {
      id: 5,
      title: "Session 5: Moving Forward",
      emotion: "Mulai beradaptasi & ada ruang harapan",
      trigger: "Ajakan teman bergabung kembali di grup musik",
      memory: "Dukungan ibu terhadap hobi bernyanyi",
      need: "Menemukan arti baru tanpa melupakan ibu",
      coping: "Kembali berlatih musik sambil membawa kenangan ibu di hati",
      date: "Hari Ini",
      status: "current",
      isCurrent: true,
      x: 86,
      y: 52
    }
  ],
  communityPosts: [
    {
      id: 1,
      author: 'AwanBiru_17',
      tag: 'Kehilangan Ibu',
      time: '2 jam yang lalu',
      content: 'Hari ini aku tiba-tiba keinget ibu waktu nyium aroma sup ayam di kantin sekolah. Rasanya masih sering gak percaya kalau ibu udah gak ada di rumah... Tapi aku berusaha kuat.',
      reactions: { hug: 42, heart: 28, sprout: 19 },
      userReacted: { hug: true, heart: false, sprout: false },
      comments: [
        { author: 'LangitSenja', text: 'Peluk hangat buat kamu. Aku juga sering ngerasain hal yang sama kalau lewat tempat favorit ayahku. Nggak apa-apa kalau sedih.' },
        { author: 'BintangKecil', text: 'Semangat yaa, ibumu pasti tersenyum melihat kamu tetap berjuang hari ini 🌱' }
      ]
    },
    {
      id: 2,
      author: 'SahabatSunyi',
      tag: 'Kehilangan Ayah',
      time: '5 jam yang lalu',
      content: 'Bulan ini tepat 1 tahun ayah pergi. Dulu rasanya duniaku runtuh dan gak tahu mau ngapain. Sekarang aku udah mulai bisa ketawa lagi bareng temen-temen, meskipun rasa kangen itu tetap ada ruangnya.',
      reactions: { hug: 56, heart: 61, sprout: 38 },
      userReacted: { hug: false, heart: true, sprout: true },
      comments: [
        { author: 'Alya (Kamu)', text: 'Terima kasih ceritanya... Ini kasih harapan buat aku yang baru 6 bulan kehilangan.' }
      ]
    },
    {
      id: 3,
      author: 'RembulanPagi',
      tag: 'Kehilangan Saudara',
      time: 'Kemarin',
      content: 'Kamar kakak sekarang sepi banget. Setiap masuk kamar rasanya pengen ngobrol kayak dulu. Ada tips gak buat ngurangin rasa hampa ini?',
      reactions: { hug: 33, heart: 22, sprout: 15 },
      userReacted: { hug: false, heart: false, sprout: false },
      comments: [
        { author: 'LenteraHati', text: 'Coba tulis apa yang pengen kamu omongin ke dia di buku jurnal. Kadang ngebantu ngeluarin ganjalan di dada.' }
      ]
    }
  ]
};

// ==========================================================================
// NAVIGATION & VIEW CONTROLLER
// ==========================================================================

function navigateToScreen(screenId) {
  AppState.activeScreen = screenId;

  // Update screen panes
  document.querySelectorAll('.mobile-screen-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  const targetPane = document.getElementById(`screen-${screenId}`);
  if (targetPane) {
    targetPane.classList.add('active');
    // Scroll stage to top
    const stage = document.getElementById('screen-stage');
    if (stage) stage.scrollTop = 0;
  }

  // Bottom nav disembunyikan di splash, onboarding, asesmen, dan layar keselamatan
  const navBar = document.getElementById('app-bottom-nav');
  if (navBar) navBar.style.display = ['s01', 's02', 's03', 's11'].includes(screenId) ? 'none' : 'flex';

  // Update bottom nav bar highlight
  updateBottomNavHighlight(screenId);

  // Trigger screen-specific lifecycle hooks
  onScreenEntered(screenId);
}

function updateBottomNavHighlight(screenId) {
  const navTabs = document.querySelectorAll('.nav-tab-item');
  navTabs.forEach(tab => tab.classList.remove('active'));

  if (['s04'].includes(screenId)) {
    document.querySelector('.nav-tab-item[data-tab="home"]')?.classList.add('active');
  } else if (['s05'].includes(screenId)) {
    document.querySelector('.nav-tab-item[data-tab="chat"]')?.classList.add('active');
  } else if (['s07'].includes(screenId)) {
    document.querySelector('.nav-tab-item[data-tab="journey"]')?.classList.add('active');
  } else if (['s06', 's13'].includes(screenId)) {
    // Challenge dibuka dari chat, jadi tab Chat AI tetap menyala
    document.querySelector('.nav-tab-item[data-tab="chat"]')?.classList.add('active');
  } else if (['s08'].includes(screenId)) {
    document.querySelector('.nav-tab-item[data-tab="community"]')?.classList.add('active');
  } else if (['s12'].includes(screenId)) {
    document.querySelector('.nav-tab-item[data-tab="profile"]')?.classList.add('active');
  }
}

function refreshHome() {
  const el = (id) => document.getElementById(id);
  if (el('home-date')) el('home-date').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  if (el('home-social-progress')) el('home-social-progress').textContent = `${AppState.socialChallenge.doneIds.length} dari 4 selesai`;
  if (el('home-journal-count')) el('home-journal-count').textContent = `${AppState.journalEntries.length} catatan`;
  const cur = AppState.journeySessions.find(x => x.isCurrent) || AppState.journeySessions[AppState.journeySessions.length - 1];
  if (el('home-journey-text')) el('home-journey-text').textContent = `Sesi ${cur.id} dari ${AppState.journeySessions.length} • ${cur.title.split(': ')[1] || cur.title}`;
}

// Lifecycle hook per screen
function onScreenEntered(screenId) {
  if (screenId === 's01') {
    BuddyMascot.inject('buddy-splash-avatar', 'welcome', 170, true, 'Kamu tidak sendiri ♡');
  } else if (screenId === 's04') {
    // Determine state based on mood
    const moodState = AppState.user.todayMood === 'sad' ? 'sad' :
                     AppState.user.todayMood === 'very-sad' ? 'comforting' : 'happy';
    BuddyMascot.inject('buddy-home-avatar', moodState, 120, true);
    refreshHome();
  } else if (screenId === 's05') {
    BuddyMascot.inject('buddy-chat-mascot-box', 'listening', 130, false);
    renderChatMessages();
  } else if (screenId === 's06') {
    renderJournalHistory();
  } else if (screenId === 's13') {
    renderSocialChallenges();
  } else if (screenId === 's07') {
    renderJourneyMapSvg();
  } else if (screenId === 's08') {
    renderCommunityFeed();
  }
}

// ==========================================================================
// S03: ASSESSMENT (BEQ-24) LOGIC
// ==========================================================================

const assessmentQuestions = [
  {
    category: "Informasi Awal",
    title: "Siapakah sosok terkasih yang telah berpulang?",
    options: ["Orang Tua (Ibu)", "Orang Tua (Ayah)", "Saudara Kandung (Kakak/Adik)", "Lainnya"]
  },
  {
    category: "BEQ-24: Guilt / Blame / Anger",
    title: "Seberapa sering kamu merasa ada hal yang seharusnya bisa kamu ubah atau cegah?",
    options: ["Hampir tidak pernah", "Kadang-kadang", "Seringkali", "Hampir setiap saat"]
  },
  {
    category: "BEQ-24: Existential Loss & Emotional Needs",
    title: "Bagaimana rasanya menjalani rutinitas harian (sekolah / pertemanan) saat ini?",
    options: ["Masih bisa berjalan normal", "Sedikit berat tapi bisa dijalani", "Sering merasa hampa & sulit fokus", "Sangat berat dan kehilangan makna"]
  },
  {
    category: "BEQ-24: Preoccupation with Deceased",
    title: "Seberapa sering pikiranmu tertuju kepada kenangan bersama beliau setiap harinya?",
    options: ["Hanya saat melihat pemicu tertentu", "Beberapa kali sehari", "Sebagian besar waktu dalam sehari", "Terus-menerus mendominasi pikiran"]
  }
];

let currentAssessmentStep = 0;

function renderAssessmentStep() {
  const q = assessmentQuestions[currentAssessmentStep];
  const progressPercent = Math.round(((currentAssessmentStep + 1) / assessmentQuestions.length) * 100);
  
  const fillEl = document.getElementById('assess-progress-fill');
  const countEl = document.getElementById('assess-count-label');
  const cardEl = document.getElementById('assess-card-content');
  
  if (fillEl) fillEl.style.width = `${progressPercent}%`;
  if (countEl) countEl.textContent = `Langkah ${currentAssessmentStep + 1} dari ${assessmentQuestions.length}`;
  
  if (cardEl) {
    cardEl.innerHTML = `
      <span class="prompt-tag" style="color: var(--primary-dark)">${q.category}</span>
      <h3 class="assessment-q-title">${q.title}</h3>
      <div class="assessment-options">
        ${q.options.map((opt, idx) => `
          <button class="assess-opt-btn" onclick="selectAssessmentOption(${idx}, '${opt.replace(/'/g, "\\'")}')">
            <span style="font-weight: 700; color: var(--primary-lavender)">${String.fromCharCode(65 + idx)}.</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;
  }
}

function selectAssessmentOption(idx, optionText) {
  BuddyMascot.playTone('gentle');
  AppState.assessmentAnswers[currentAssessmentStep] = optionText;
  
  if (currentAssessmentStep < assessmentQuestions.length - 1) {
    currentAssessmentStep++;
    renderAssessmentStep();
  } else {
    // Show summary modal or jump to home
    BuddyMascot.playTone('cheer');
    showModal('Assessment Selesai! 🌱', `
      <div style="text-align: center; margin-bottom: 8px;">
        <img src="buddy-mascot.png" alt="Buddy" style="width: 72px; height: 72px; object-fit: contain;" />
      </div>
      <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 12px;">
        Terima kasih sudah berbagi dengan jujur, Alya. Grief Profile awalmu telah disesuaikan:
      </p>
      <div style="background: var(--primary-soft); padding: 12px; border-radius: 14px; font-size: 0.8rem; line-height: 1.5; color: var(--primary-deep); margin-bottom: 14px;">
        <strong>Kategori:</strong> Pendampingan Duka Transisi Remaja<br>
        <strong>Gaya Rekomendasi:</strong> Comforting & Validasi Emosional<br>
        <strong>Fokus Awal:</strong> Memberikan ruang aman & teknik regulasi napas.
      </div>
      <button class="btn-primary" onclick="closeModal(); navigateToScreen('s04')">Masuk ke Halaman Utama 💜</button>
    `);
  }
}

// ==========================================================================
// S04: HOME INTERACTIONS
// ==========================================================================

function setTodayMood(mood) {
  AppState.user.todayMood = mood;
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mood === mood);
  });

  BuddyMascot.playTone('gentle');

  // Update Buddy home mascot expression
  let buddyState = 'happy';
  let message = 'Aku siap menemanimu!';

  if (mood === 'very-sad') {
    buddyState = 'comforting';
    message = 'Aku memelukmu dari sini... Tidak apa-apa untuk menangis.';
  } else if (mood === 'sad') {
    buddyState = 'sad';
    message = 'Aku dengar kamu. Hari ini terasa berat ya? Kita lewati perlahan.';
  } else if (mood === 'neutral') {
    buddyState = 'listening';
    message = 'Aku mendengarkanmu. Mau nulis di jurnal atau ngobrol santai?';
  } else if (mood === 'good') {
    buddyState = 'happy';
    message = 'Senang melihatmu merasa cukup baik hari ini 🌱';
  } else if (mood === 'very-good') {
    buddyState = 'celebrating';
    message = 'Luar biasa! Nikmati perasaan damai ini ya ✨';
  }

  BuddyMascot.inject('buddy-home-avatar', buddyState, 120, true, message);
}

// ==========================================================================
// S05: AI CHAT INTERACTIONS & RISK DETECTION
// ==========================================================================

// Daftar kata kunci risiko tinggi (Crisis / Self-Harm Detection)
const RISK_KEYWORDS = [
  'bunuh diri',
  'suicide',
  'self harm',
  'self-harm',
  'menyakiti diri',
  'cutting',
  'loncat',
  'ingin mati',
  'mengakhiri hidup',
  'gak kuat lagi',
  'pengen nyusul',
  'cut myself'
];

function findMatchedRiskKeyword(rawText) {
  const lower = (rawText || '').toLowerCase();
  return RISK_KEYWORDS.find(keyword => lower.includes(keyword)) || null;
}

function checkLiveRiskInput(rawText) {
  const banner = document.getElementById('chat-live-risk-alert');
  if (!banner) return;
  const matched = findMatchedRiskKeyword(rawText);
  banner.style.display = matched ? 'block' : 'none';
}

function renderRiskAlertCard(matchedKeyword) {
  return `
    <div class="chat-risk-alert-box">
      <div class="chat-risk-alert-title">🚨 Peringatan Keselamatan & Krisis</div>
      <div class="chat-risk-alert-desc">
        Terdeteksi indikasi krisis${matchedKeyword ? ` (kata kunci: <strong>"${matchedKeyword}"</strong>)` : ''}. Kamu sangat berharga dan tidak harus menghadapi ini sendirian.
      </div>
      <div class="chat-risk-alert-actions">
        <a href="tel:119" class="chat-risk-hotline-btn">📞 Hubungi SEJIWA (119 Ext. 8)</a>
        <button class="chat-risk-screen-btn" onclick="navigateToScreen('s11')">🛡️ Buka Panduan Keselamatan</button>
      </div>
    </div>
  `;
}

function showRiskAlertModal(matchedKeyword = null) {
  showModal('🚨 Peringatan Keselamatan Utama', `
    <div style="background: #FDEDED; border: 1.5px solid #F5B7B1; border-radius: 16px; padding: 14px; display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
      <img src="buddy-mascot.png" alt="Buddy" style="width: 54px; height: 54px; object-fit: contain; flex-shrink: 0;" />
      <div style="font-size: 0.78rem; color: #78281F; line-height: 1.45;">
        <strong>Alya, keselamatanmu adalah yang paling utama.</strong><br>
        ${matchedKeyword ? `Sistem mendeteksi kata <strong>"${matchedKeyword}"</strong> pada pesanmu. ` : ''}Aku sangat peduli padamu dan ingin kamu tetap aman saat ini.
      </div>
    </div>

    <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 14px;">
      Jika kamu merasa ingin menyakiti diri atau berada dalam situasi darurat, segera hubungi layanan krisis 24 jam gratis di bawah ini atau bicaralah dengan orang yang kamu percaya:
    </p>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <a href="tel:119" class="hotline-btn" style="font-size: 0.86rem; padding: 11px;">
        📞 Panggil Hotline SEJIWA (119 Ext. 8)
      </a>
      <button class="btn-primary" onclick="closeModal(); navigateToScreen('s11')">
        🛡️ Buka Layar Keselamatan & Latihan Grounding
      </button>
      <button class="btn-secondary" onclick="closeModal(); navigateToScreen('s09')">
        📍 Lihat Bantuan Psikolog Terdekat
      </button>
    </div>
  `);
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = AppState.chatHistory.map(msg => `
    <div class="chat-msg ${msg.sender}">
      ${msg.sender === 'buddy' ? `<img src="buddy-mascot.png" alt="Buddy" class="chat-msg-avatar" />` : ''}
      <div class="chat-bubble ${msg.isRiskAlert ? 'risk-alert-bubble' : ''}">
        ${msg.text}
        ${msg.isRiskAlert ? renderRiskAlertCard(msg.matchedKeyword) : ''}
        ${msg.challenge ? renderChallengeCard(msg.challenge) : ''}
        <div style="font-size: 0.62rem; text-align: right; margin-top: 4px; opacity: 0.65;">
          ${msg.time}
        </div>
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function setChatMode(mode) {
  AppState.user.communicationMode = mode;
  document.querySelectorAll('.chat-mode-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.mode === mode);
  });
  BuddyMascot.playTone('gentle');
}

function toggleMascotInChat() {
  const box = document.getElementById('chat-mascot-preview-area');
  if (!box) return;
  const isHidden = box.style.display === 'none';
  box.style.display = isHidden ? 'flex' : 'none';
}

function sendChatMessage(overrideText = null) {
  const input = document.getElementById('chat-input-field');
  const text = overrideText || (input ? input.value.trim() : '');
  if (!text) return;

  if (input) input.value = '';
  checkLiveRiskInput('');

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Add user message
  AppState.chatHistory.push({
    sender: 'user',
    text: text,
    time: timeStr
  });
  renderChatMessages();
  BuddyMascot.playTone('gentle');

  // RISK DETECTION NLP ENGINE
  const matchedKeyword = findMatchedRiskKeyword(text);

  if (matchedKeyword) {
    // Trigger High Risk Protocol & Alert
    setTimeout(() => {
      AppState.chatHistory.push({
        sender: 'buddy',
        text: 'Alya, aku sangat peduli dan mendengarkan betapa beratnya rasa sakit yang kamu tanggung saat ini. Keselamatanmu adalah hal yang paling berharga. Aku ingin kamu mendapatkan perlindungan terbaik dari tenaga profesional atau orang tepercaya sekarang juga.',
        isRiskAlert: true,
        matchedKeyword: matchedKeyword,
        time: timeStr
      });
      renderChatMessages();
      BuddyMascot.inject('buddy-chat-mascot-box', 'comforting', 130, true, 'Aku di sini untuk keselamatanmu 🤍');

      // Tampilkan pop-up Alert Keselamatan
      showRiskAlertModal(matchedKeyword);
    }, 450);
    return;
  }

  // CHALLENGE ROUTING (alur baru)
  // "temen"/"orang lain" -> Challenge Sosial, "sendiri" -> Challenge Jurnal.
  // Risk detection di atas selalu diprioritaskan sebelum routing ini.
  const route = detectChallengeRoute(text);
  if (route) {
    setTimeout(() => {
      AppState.chatHistory.push({
        sender: 'buddy',
        text: CHALLENGE_REPLIES[route],
        challenge: route,
        time: timeStr
      });
      renderChatMessages();
      BuddyMascot.inject('buddy-chat-mascot-box', 'encouraging', 130, false);
      BuddyMascot.playTone('chime');
    }, 750);
    return;
  }

  // NORMAL CONVERSATIONAL AI SIMULATION BASED ON MODE
  setTimeout(() => {
    let aiResponse = '';
    let mascotReaction = 'listening';

    if (AppState.user.communicationMode === 'comforting') {
      aiResponse = `Aku ada di sini bersamamu, Alya. Perasaan rindu dan sedih seperti ini memang datang seperti ombak, kadang tenang, kadang menggulung tinggi. Tidak perlu merasa bersalah karena menangis. Mau tarik napas pelan-pelan bersama Buddy?`;
      mascotReaction = 'comforting';
    } else if (AppState.user.communicationMode === 'feedback') {
      aiResponse = `Dari ceritamu, sepertinya pemicunya muncul saat ada momen hening yang mengingatkanmu pada kebersamaan dulu. Ini adalah pola adaptasi yang wajar. Apakah kamu merasa terbantu jika kita catat kenangan ini ke dalam Grief Journey Map?`;
      mascotReaction = 'listening';
    } else if (AppState.user.communicationMode === 'informative') {
      aiResponse = `Menurut literatur psikologi kedukaan (seperti teori Dual Process Model), seseorang yang berduka secara alami akan bergantian antara fokus pada kehilangan (loss-oriented) dan fokus pada pemulihan (restoration-oriented). Apa yang kamu rasakan hari ini adalah bagian dari proses tersebut.`;
      mascotReaction = 'encouraging';
    }

    AppState.chatHistory.push({
      sender: 'buddy',
      text: aiResponse,
      time: timeStr
    });
    renderChatMessages();
    BuddyMascot.inject('buddy-chat-mascot-box', mascotReaction, 130, false);
    BuddyMascot.playTone('chime');
  }, 750);
}

// ==========================================================================
// CHALLENGE ROUTING (CHAT -> CHALLENGE SOSIAL / CHALLENGE JURNAL)
// ==========================================================================

const SOCIAL_KEYWORDS = /(temen|teman|orang lain)/;
const SOLITARY_KEYWORDS = /sendiri/; // juga mencakup "sendirian"

// Mengembalikan 'social' | 'journal' | 'both' | null
function detectChallengeRoute(rawText) {
  const t = (rawText || '').toLowerCase();
  const social = SOCIAL_KEYWORDS.test(t);
  const solitary = SOLITARY_KEYWORDS.test(t);
  if (social && solitary) return 'both'; // keduanya disebut: user yang memilih
  if (social) return 'social';
  if (solitary) return 'journal';
  return null;
}

const CHALLENGE_REPLIES = {
  social: 'Terima kasih sudah cerita, Alya 💜 Kadang pikiran berat terasa lebih ringan kalau kita ditemani orang lain, walau hanya hal kecil. Mau coba Challenge Sosial? Isinya kegiatan ringan bareng orang lain yang bisa membantu mengalihkan pikiran-pikiran beratmu.',
  journal: 'Aku dengar kamu, Alya 🤍 Saat merasa sendiri, menuliskan apa yang ada di kepala dan hati bisa membantu. Mau coba Challenge Jurnal? Kamu boleh menulis apa saja yang sedang kamu rasakan, tanpa harus rapi.',
  both: 'Aku dengar kamu, Alya 💜 Kamu menyebut soal sendiri dan soal orang lain sekaligus. Kamu boleh pilih yang paling pas untuk saat ini, dan keduanya bisa dicoba nanti.'
};

function renderChallengeCard(type) {
  const socialBtn = `
    <button class="challenge-cta social" onclick="startChallenge('social')">
      <span class="challenge-cta-icon">👥</span>
      <span><strong>Challenge Sosial</strong><br><small>Kegiatan ringan bareng orang lain</small></span>
    </button>`;
  const journalBtn = `
    <button class="challenge-cta journal" onclick="startChallenge('journal')">
      <span class="challenge-cta-icon">✍️</span>
      <span><strong>Challenge Jurnal</strong><br><small>Tulis apa yang sedang kamu rasakan</small></span>
    </button>`;
  if (type === 'social') return `<div class="challenge-card">${socialBtn}</div>`;
  if (type === 'journal') return `<div class="challenge-card">${journalBtn}</div>`;
  return `<div class="challenge-card">${socialBtn}${journalBtn}</div>`;
}

function startChallenge(type) {
  BuddyMascot.playTone('gentle');
  navigateToScreen(type === 'social' ? 's13' : 's06');
}

// ==========================================================================
// S13: CHALLENGE SOSIAL
// ==========================================================================

const socialChallenges = [
  { id: 1, icon: '💬', title: 'Sapa satu teman', duration: '5 menit',
    desc: 'Kirim pesan singkat ke satu teman. Tanya kabarnya atau bagikan hal receh hari ini. Tidak perlu membahas duka.',
    steps: ['Pilih satu teman yang membuatmu nyaman.', 'Kirim sapaan atau tanya kabarnya.', 'Baca balasannya dan balas sebisamu.'] },
  { id: 2, icon: '🚶', title: 'Jalan atau ngobrol bareng', duration: '20 menit',
    desc: 'Ajak teman atau anggota keluarga jalan sore, ngopi, atau makan bareng. Kehadiran orang lain membantu pikiran tidak berputar di tempat.',
    steps: ['Ajak satu orang yang kamu percaya.', 'Pilih tempat santai dan dekat.', 'Fokus pada obrolan ringan di sekitarmu.'] },
  { id: 3, icon: '🎵', title: 'Ikut kegiatan bareng', duration: '30–60 menit',
    desc: 'Gabung satu kegiatan bersama, misalnya latihan musik, olahraga, ekskul, atau belajar kelompok.',
    steps: ['Pilih kegiatan yang dulu kamu suka.', 'Gabung atau ajak teman untuk ikut.', 'Nikmati prosesnya, hasilnya tidak perlu sempurna.'] },
  { id: 4, icon: '🌷', title: 'Lakukan kebaikan kecil', duration: '10 menit',
    desc: 'Bantu orang lain dengan hal kecil, misalnya membantu teman mengerjakan tugas atau mengirim kata semangat. Memberi sering membuat hati sedikit lebih hangat.',
    steps: ['Pikirkan satu orang yang bisa kamu bantu.', 'Lakukan satu tindakan kecil untuknya.', 'Perhatikan perasaanmu sesudahnya.'] }
];

function renderSocialChallenges() {
  const list = document.getElementById('social-challenge-list');
  const fill = document.getElementById('social-progress-fill');
  const label = document.getElementById('social-progress-label');
  if (!list) return;

  const done = AppState.socialChallenge.doneIds;
  if (fill) fill.style.width = `${(done.length / socialChallenges.length) * 100}%`;
  if (label) label.textContent = `${done.length} dari ${socialChallenges.length} challenge selesai`;

  list.innerHTML = socialChallenges.map(c => {
    const isDone = done.includes(c.id);
    return `
      <div class="social-task-card ${isDone ? 'done' : ''}" onclick="openSocialChallenge(${c.id})">
        <div class="social-task-icon">${isDone ? '✅' : c.icon}</div>
        <div style="flex: 1;">
          <div class="social-task-title">${c.title}</div>
          <div class="social-task-desc">${c.desc}</div>
          <div class="social-task-meta">⏱ ${c.duration}</div>
        </div>
      </div>`;
  }).join('');
}

function openSocialChallenge(id) {
  const c = socialChallenges.find(x => x.id === id);
  if (!c) return;
  BuddyMascot.playTone('gentle');
  const isDone = AppState.socialChallenge.doneIds.includes(id);
  showModal(`${c.icon} ${c.title}`, `
    <p style="font-size: 0.82rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 10px;">${c.desc}</p>
    <ol style="font-size: 0.8rem; line-height: 1.6; color: var(--text-main); padding-left: 18px; margin-bottom: 14px;">
      ${c.steps.map(st => `<li>${st}</li>`).join('')}
    </ol>
    ${isDone
      ? `<button class="btn-secondary" onclick="closeModal()">Sudah selesai ✅ Tutup</button>`
      : `<button class="btn-primary" onclick="completeSocialChallenge(${id})">Sudah aku lakukan ✅</button>
         <button class="btn-secondary" style="margin-top: 8px;" onclick="closeModal()">Nanti dulu</button>`}
  `);
}

function completeSocialChallenge(id) {
  const c = socialChallenges.find(x => x.id === id);
  if (!c) return;
  if (!AppState.socialChallenge.doneIds.includes(id)) {
    AppState.socialChallenge.doneIds.push(id);
  }
  addToJourneyCoping(`Challenge sosial: ${c.title}`);
  BuddyMascot.playTone('cheer');
  renderSocialChallenges();

  showModal('Hebat, Alya! 🌱', `
    <p style="font-size: 0.84rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 12px;">
      Kamu sudah mencoba <strong>${c.title}</strong>. Bagaimana perasaanmu sekarang?
    </p>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button class="btn-secondary" onclick="socialFeelingReply('lighter')">Sedikit lebih ringan 🌤️</button>
      <button class="btn-secondary" onclick="socialFeelingReply('same')">Masih sama saja 🌥️</button>
      <button class="btn-secondary" onclick="socialFeelingReply('heavy')">Masih terasa berat 🌧️</button>
    </div>
  `);
}

function socialFeelingReply(feeling) {
  const replies = {
    lighter: 'Senang mendengarnya 💜 Langkah kecil seperti ini sudah berarti. Aku catat di Journey Map-mu.',
    same: 'Tidak apa-apa, tidak semua hari terasa berbeda. Kamu tetap sudah berani mencoba. Aku catat di Journey Map-mu.',
    heavy: 'Terima kasih sudah jujur 🤍 Kalau terasa berat, kamu bisa bercerita ke Buddy atau ke teman sebaya di komunitas. Kamu juga boleh bicara dengan psikolog kapan pun kamu siap.'
  };
  showModal('Terima kasih sudah berbagi 💜', `
    <p style="font-size: 0.84rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 14px;">${replies[feeling]}</p>
    ${feeling === 'heavy'
      ? `<button class="btn-primary" onclick="closeModal(); navigateToScreen('s05')">Ngobrol dengan Buddy 💬</button>
         <button class="btn-secondary" style="margin-top: 8px;" onclick="closeModal(); navigateToScreen('s08')">Ke Komunitas Sebaya 👥</button>`
      : `<button class="btn-primary" onclick="closeModal(); navigateToScreen('s07')">Lihat Journey Map 🗺️</button>
         <button class="btn-secondary" style="margin-top: 8px;" onclick="closeModal()">Lanjut challenge lain</button>`}
  `);
}

// Menambahkan catatan aktivitas ke sesi Journey Map yang sedang berjalan
function addToJourneyCoping(note) {
  const curr = AppState.journeySessions.find(s => s.isCurrent);
  if (curr && !curr.coping.includes(note)) {
    curr.coping += ` • ${note}`;
  }
}

// ==========================================================================
// S06: JOURNAL INTERACTIONS
// ==========================================================================

function setJournalMood(mood) {
  AppState.journalMood = mood;
  document.querySelectorAll('.journal-mood-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mood === mood);
  });
  BuddyMascot.playTone('gentle');
}

function renderJournalHistory() {
  const list = document.getElementById('journal-history-container');
  if (!list) return;
  list.innerHTML = AppState.journalEntries.map(e => `
    <div class="journal-entry-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--primary-dark)">${e.date} • ${e.mood}</span>
        <span style="font-size: 0.65rem; color: var(--text-muted)">Tersimpan terenkripsi</span>
      </div>
      <p style="font-size: 0.78rem; color: var(--text-main); line-height: 1.4;">"${e.text}"</p>
    </div>
  `).join('');
}

function saveJournalEntry() {
  const input = document.getElementById('journal-input-text');
  const text = input ? input.value.trim() : '';
  if (!text) {
    alert('Silakan tuliskan apa yang kamu rasakan terlebih dahulu ya 🌱');
    return;
  }

  const moodLabels = { 'very-sad': '😭 Sangat sedih', 'sad': '😢 Sedih', 'neutral': '😐 Netral', 'good': '🙂 Cukup baik', 'very-good': '😊 Baik' };
  const moodText = moodLabels[AppState.journalMood] || '😐 Tanpa mood';
  const now = new Date();
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

  AppState.journalEntries.unshift({
    date: `${String(now.getDate()).padStart(2, '0')} ${bulan[now.getMonth()]}`,
    mood: moodText,
    text: text.replace(/</g, '&lt;')
  });
  addToJourneyCoping('Challenge jurnal: menulis perasaan');

  BuddyMascot.playTone('cheer');
  showModal('Jurnal Tersimpan ✨', `
    <p style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 14px;">
      Terima kasih sudah menuliskan perasaanmu, Alya. Tulisanmu telah dienkripsi dan disimpan, dan dicatat pada <strong>Grief Journey Map</strong> milikmu.
    </p>
    <button class="btn-primary" onclick="closeModal(); navigateToScreen('s07')">Lihat Journey Map 🗺️</button>
  `);

  if (input) input.value = '';
  AppState.journalMood = null;
  document.querySelectorAll('.journal-mood-btn').forEach(btn => btn.classList.remove('selected'));
  const counter = document.getElementById('journal-word-count');
  if (counter) counter.textContent = '0 kata';
  renderJournalHistory();
}

function updateJournalWordCount() {
  const input = document.getElementById('journal-input-text');
  const counter = document.getElementById('journal-word-count');
  if (!input || !counter) return;
  const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
  counter.textContent = `${words} kata`;
}

// ==========================================================================
// S07: GRIEF JOURNEY MAP (ESSAY PAGE 16 SPEC)
// ==========================================================================

const JOURNEY_NODES = {
  1: { x: 70,  y: 385, weather: '⛈️' },
  2: { x: 255, y: 305, weather: '🌧️' },
  3: { x: 105, y: 225, weather: '⛅' },
  4: { x: 255, y: 145, weather: '🌤️' },
  5: { x: 120, y: 70,  weather: '☀️' }
};

function renderJourneyMapSvg() {
  const container = document.getElementById('journey-map-canvas');
  if (!container) return;

  const sessions = AppState.journeySessions.filter(s => JOURNEY_NODES[s.id]);
  if (!sessions.length) return;
  const current = sessions.find(s => s.isCurrent) || sessions[sessions.length - 1];
  if (!sessions.some(s => s.id === AppState.journeySelectedId)) AppState.journeySelectedId = current.id;
  const selectedId = AppState.journeySelectedId;

  const islands = sessions.map(s => {
    const n = JOURNEY_NODES[s.id];
    return `<ellipse cx="${n.x}" cy="${n.y + 4}" rx="66" ry="30" class="journey-island"/>`;
  }).join('');

  let segments = '';
  for (let k = 1; k < sessions.length; k++) {
    const a = JOURNEY_NODES[sessions[k - 1].id];
    const b = JOURNEY_NODES[sessions[k].id];
    const my = (a.y + b.y) / 2;
    const isBack = sessions[k].id === 3; // proses berduka tidak linear: sesi 3 sempat kembali ke fase sebelumnya
    segments += `<path d="M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}" class="journey-seg${isBack ? ' back' : ''}"/>`;
  }

  const nodes = sessions.map(s => {
    const n = JOURNEY_NODES[s.id];
    const isCur = s.id === current.id;
    const isSel = s.id === selectedId;
    const labelW = 134;
    const labelX = n.x > 180 ? n.x - 24 - labelW : n.x + 24;
    const name = s.title.split(': ')[1] || s.title;
    return `
      <g class="journey-node${isCur ? ' current' : ''}${isSel ? ' selected' : ''}" onclick="selectJourneySession(${s.id})">
        ${isCur ? `<circle cx="${n.x}" cy="${n.y}" r="18" class="journey-pulse"/>` : ''}
        ${isSel ? `<circle cx="${n.x}" cy="${n.y}" r="21" class="journey-ring"/>` : ''}
        <circle cx="${n.x}" cy="${n.y}" r="15" class="journey-dot"/>
        <text x="${n.x}" y="${n.y + 4.5}" text-anchor="middle" class="journey-num">${s.id}</text>
        <text x="${n.x}" y="${n.y - 24}" text-anchor="middle" font-size="15">${n.weather}</text>
        <rect x="${labelX}" y="${n.y - 16}" width="${labelW}" height="32" rx="10" class="journey-label-bg"/>
        <text x="${labelX + 10}" y="${n.y - 3}" class="journey-label-top">Sesi ${s.id}</text>
        <text x="${labelX + 10}" y="${n.y + 10}" class="journey-label-sub">${name}</text>
        ${isCur ? `<g transform="translate(${n.x - 40}, ${n.y - 62})"><rect width="80" height="20" rx="10" class="journey-here"/><text x="40" y="14" text-anchor="middle" class="journey-here-text">you are here</text></g>` : ''}
      </g>`;
  }).join('');

  container.innerHTML = `
    <svg class="map-terrain-svg" viewBox="0 0 360 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Peta perjalanan duka">
      ${islands}
      ${segments}
      ${nodes}
    </svg>`;

  updateJourneyDetailCard(sessions.find(s => s.id === selectedId) || current);
}

function updateJourneyDetailCard(session) {
  const card = document.getElementById('journey-active-node-card');
  if (!card || !session) return;
  card.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="prompt-tag">${session.title}</span>
      <span style="font-size: 0.72rem; color: var(--text-muted)">${session.date}</span>
    </div>
    <div style="font-size: 0.85rem; font-weight: 700; color: var(--primary-deep); margin: 2px 0;">Emosi: ${session.emotion}</div>
    <div style="display: grid; grid-template-columns: 1fr; gap: 4px; font-size: 0.76rem; color: var(--text-secondary); line-height: 1.45;">
      <div>🎯 <strong>Trigger:</strong> ${session.trigger}</div>
      <div>💭 <strong>Kenangan:</strong> ${session.memory}</div>
      <div>🌱 <strong>Kebutuhan:</strong> ${session.need}</div>
      <div>✨ <strong>Coping:</strong> ${session.coping}</div>
    </div>`;
}

function selectJourneySession(sessionId) {
  AppState.journeySelectedId = sessionId;
  BuddyMascot.playTone('gentle');
  renderJourneyMapSvg();
  const card = document.getElementById('journey-active-node-card');
  if (card && card.scrollIntoView) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ==========================================================================
// S08: COMMUNITY INTERACTIONS
// ==========================================================================

function renderCommunityFeed() {
  const feed = document.getElementById('community-feed-container');
  if (!feed) return;

  feed.innerHTML = AppState.communityPosts.map(p => `
    <div class="community-post-card">
      <div class="post-header">
        <div class="post-author">
          <div class="avatar-anonymous">🕊️</div>
          <div>
            <div class="author-name">${p.author}</div>
            <div style="font-size: 0.65rem; color: var(--text-muted)">${p.time}</div>
          </div>
        </div>
        <span class="post-tag-badge">${p.tag}</span>
      </div>

      <p class="post-content">${p.content}</p>

      <div class="post-actions-row">
        <div class="reaction-btn-group">
          <button class="reaction-btn ${p.userReacted.hug ? 'reacted' : ''}" onclick="togglePostReaction(${p.id}, 'hug')">
            🫂 Peluk (${p.reactions.hug})
          </button>
          <button class="reaction-btn ${p.userReacted.heart ? 'reacted' : ''}" onclick="togglePostReaction(${p.id}, 'heart')">
            🤍 Doa (${p.reactions.heart})
          </button>
          <button class="reaction-btn ${p.userReacted.sprout ? 'reacted' : ''}" onclick="togglePostReaction(${p.id}, 'sprout')">
            🌱 Semangat (${p.reactions.sprout})
          </button>
        </div>
        <button class="btn-secondary-link" style="font-size: 0.7rem; padding: 4px 8px;" onclick="openCommentModal(${p.id})">
          💬 ${p.comments.length}
        </button>
      </div>
    </div>
  `).join('');
}

function togglePostReaction(postId, type) {
  const post = AppState.communityPosts.find(p => p.id === postId);
  if (!post) return;

  if (post.userReacted[type]) {
    post.reactions[type]++;
    post.reactions[type] -= 2; // decrement
    post.userReacted[type] = false;
  } else {
    post.reactions[type]++;
    post.userReacted[type] = true;
    BuddyMascot.playTone('gentle');
  }

  renderCommunityFeed();
}

function createNewCommunityPost() {
  const text = prompt("Tuliskan ceritamu untuk sesama teman berduka (Aman & Anonim):");
  if (!text || !text.trim()) return;

  AppState.communityPosts.unshift({
    id: Date.now(),
    author: 'Alya (Kamu)',
    tag: 'Kehilangan Ibu',
    time: 'Baru saja',
    content: text.trim(),
    reactions: { hug: 1, heart: 1, sprout: 1 },
    userReacted: { hug: true, heart: false, sprout: false },
    comments: []
  });

  BuddyMascot.playTone('cheer');
  renderCommunityFeed();
}

function openCommentModal(postId) {
  const post = AppState.communityPosts.find(p => p.id === postId);
  if (!post) return;

  const commentsHtml = post.comments.map(c => `
    <div style="background: var(--bg-app); padding: 10px; border-radius: 12px; margin-bottom: 8px;">
      <strong style="font-size: 0.75rem; color: var(--primary-deep)">${c.author}</strong>
      <p style="font-size: 0.78rem; color: var(--text-main); margin-top: 3px;">${c.text}</p>
    </div>
  `).join('') || '<p style="font-size: 0.78rem; color: var(--text-muted)">Belum ada komentar. Jadilah yang pertama memberikan pelukan kata 🤍</p>';

  showModal(`Komentar Sebaya (${post.comments.length})`, `
    <div style="max-height: 240px; overflow-y: auto; margin-bottom: 14px;">
      ${commentsHtml}
    </div>
    <div style="display: flex; gap: 8px;">
      <input type="text" id="new-comment-input" placeholder="Tuliskan kata hangat..." class="chat-text-input" style="font-size: 0.78rem;">
      <button class="chat-send-btn" onclick="submitComment(${postId})">➤</button>
    </div>
  `);
}

function submitComment(postId) {
  const input = document.getElementById('new-comment-input');
  if (!input || !input.value.trim()) return;

  const post = AppState.communityPosts.find(p => p.id === postId);
  if (post) {
    post.comments.push({
      author: 'Alya (Kamu)',
      text: input.value.trim()
    });
    BuddyMascot.playTone('gentle');
    renderCommunityFeed();
    closeModal();
  }
}

// ==========================================================================
// S10: PROFESSIONAL CONSULTATION BOOKING & CONSENT
// ==========================================================================

function openConsultationModal() {
  showModal('Buat Jadwal Konsultasi', `
    <div style="text-align: center; margin-bottom: 12px;">
      <div class="psychologist-avatar" style="width: 58px; height: 58px; margin: 0 auto 8px; font-size: 1.8rem;">👩‍⚕️</div>
      <h3 style="font-family: var(--font-heading); font-size: 1rem; color: var(--primary-deep)">Dra. Rismayanti, M.Psi.</h3>
      <p style="font-size: 0.72rem; color: var(--text-muted)">Psikolog Klinis Anak & Remaja • SIP: 440/128/PSI/2024</p>
    </div>

    <div style="background: var(--bg-app); padding: 12px; border-radius: 14px; font-size: 0.78rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 14px;">
      📍 <strong>Lokasi:</strong> Klinik Psikologi UB, Kota Malang (1.2 km)<br>
      📅 <strong>Pilihan Jadwal:</strong> Sabtu, 26 Sep 2026 (10:00 WIB)<br>
      💻 <strong>Format:</strong> Tatap Muka / Sesi Daring
    </div>

    <div class="consent-box" style="margin: 0 0 16px;">
      <input type="checkbox" id="prof-consent-check" checked>
      <label for="prof-consent-check" style="font-size: 0.74rem;">
        Saya menyetujui ringkasan Grief Profile & riwayat asesmen saya dibagikan secara aman kepada psikolog klinis ini untuk keperluan pendampingan.
      </label>
    </div>

    <button class="btn-primary" onclick="confirmConsultation()">Konfirmasi & Dapatkan Tiket Konsultasi 💜</button>
  `);
}

function confirmConsultation() {
  const check = document.getElementById('prof-consent-check');
  if (check && !check.checked) {
    alert('Mohon centang persetujuan berbagi data untuk melanjutkan.');
    return;
  }

  BuddyMascot.playTone('cheer');
  showModal('Jadwal Berhasil Dibuat! 🎉', `
    <div style="text-align: center; padding: 10px 0;">
      <div style="font-size: 2.5rem; margin-bottom: 10px;">💌</div>
      <h3 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--primary-deep); margin-bottom: 8px;">Tiket Terkirim ke Psikolog</h3>
      <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 16px;">
        Kamu telah mengambil langkah yang sangat berani untuk merawat dirimu. Pengingat sesi telah disimpan di kalender akunmu.
      </p>
      <button class="btn-primary" onclick="closeModal(); navigateToScreen('s04')">Kembali ke Beranda</button>
    </div>
  `);
}

// ==========================================================================
// MODAL CONTROLLER
// ==========================================================================

function showModal(title, bodyHtml) {
  const overlay = document.getElementById('proto-modal');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.innerHTML = bodyHtml;
  if (overlay) overlay.classList.add('active');
}

function closeModal() {
  const overlay = document.getElementById('proto-modal');
  if (overlay) overlay.classList.remove('active');
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  navigateToScreen('s01');
  renderAssessmentStep();
});
