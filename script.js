/* ==========================================================================
   DATE MESSAGES - JAVASCRIPT LOGIC
   ========================================================================== */

(function () {
  'use strict';

  // --- Data & Constants ---
  const CAT_IMAGES = [
    'assets/no-1b7f3315-68b1-445c-85bb-113ce83db475.jpg',
    'assets/no-0e4dde77-15e5-471c-8a14-4cfc98bac459.jpg',
    'assets/no-27872038-5933-4153-9e9d-3667f04c17b5.jpg',
    'assets/no-832d1b48-b1fb-4b40-82f1-2ee140291cae.jpg',
    'assets/no-80c946fe-22e2-441c-802e-2ec306170933.jpg',
    'assets/no-b308d12c-9f64-49f4-a916-d0a4f76ef39f.jpg',
    'assets/no-8d8f476d-3965-49ae-9e53-9264dd2e5c80.jpg',
  ];

  const CAT_CAPTIONS = [
    'Are you sure about that?',
    'Excuse me??',
    'Did you just try to say no?!',
    "I don't think so.",
    'Try again, Jill.',
    'Wrong answer!',
    'Nope. Just… nope.',
  ];

  const DATE_LOCATIONS = [
    {
      id: 'balay-amani',
      name: 'Balay Amani',
      description: 'A peaceful rooftop getaway — just us and the view.',
      image: 'assets/place-balay-amani.jpg',
    },
    {
      id: 'the-crescent',
      name: 'The Crescent',
      description: 'Cozy cafe vibes, warm drinks, and good conversations.',
      image: 'assets/place-the-crescent.jpg',
    },
    {
      id: 'bku-resto',
      name: 'BKU Resto & Cafe',
      description: 'Great food, great company — the perfect combo.',
      image: 'assets/place-bku-resto.jpg',
    },
    {
      id: 'kinaiyahan',
      name: 'Kinaiyahan Forest Park',
      description: 'Nature, fresh air, and quality time together.',
      image: 'assets/place-kinaiyahan.jpg',
    },
  ];

  const NO_TAUNTS = [
    'Are you sure?',
    'Nice try!',
    'You almost got me!',
    'Nope!',
    'Think again, Jill.',
    'Too slow!',
    'Hehehe...',
    'Catch me if you can!',
  ];

  // --- State ---
  let currentPage = 'envelope';
  let muted = true;
  let selectedLocation = null;
  let selectedDate = '';
  let selectedTime = '';
  let countdownTimer = null;
  let catPopupTimeout = null;
  let floatingNoPos = null;
  let isEnvelopeOpening = false;

  // --- Audio ---
  const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  audio.loop = true;
  audio.volume = 0.3;

  // --- DOM Elements ---
  const backBtn = document.getElementById('back-btn');
  const musicBtn = document.getElementById('music-btn');
  const floatingHeartsContainer = document.getElementById('floating-hearts');
  const rosePetalsContainer = document.getElementById('rose-petals');
  const confettiContainer = document.getElementById('confetti-container');
  const sparkleContainer = document.getElementById('sparkle-container');

  const tauntWrapper = document.getElementById('taunt-wrapper');
  const tauntPill = document.getElementById('taunt-pill');
  const catPopupOverlay = document.getElementById('cat-popup-overlay');
  const catPopupCard = document.getElementById('cat-popup-card');
  const catPopupImg = document.getElementById('cat-popup-img');
  const catPopupCaption = document.getElementById('cat-popup-caption');
  const floatingNoBtn = document.getElementById('floating-no-btn');

  // Envelope page
  const envelopeBox = document.getElementById('envelope-box');
  const envelopePrompt = document.getElementById('envelope-prompt');

  // Question page
  const btnYes = document.getElementById('btn-yes');
  const btnNoInitial = document.getElementById('btn-no-initial');
  const questionFooterHint = document.getElementById('question-footer-hint');

  // Yes page
  const btnChooseDate = document.getElementById('btn-choose-date');

  // Location page
  const locationCards = document.querySelectorAll('.location-card');
  const btnLocationNext = document.getElementById('btn-location-next');
  const locationHint = document.getElementById('location-hint');

  // DateTime page
  const datetimeLocName = document.getElementById('datetime-location-name');
  const inputDate = document.getElementById('input-date');
  const inputTime = document.getElementById('input-time');
  const planPreviewBox = document.getElementById('plan-preview-box');
  const previewWhere = document.getElementById('preview-where');
  const previewWhen = document.getElementById('preview-when');
  const previewTime = document.getElementById('preview-time');
  const btnConfirmDate = document.getElementById('btn-confirm-date');

  // Final page
  const finalWhere = document.getElementById('final-where');
  const finalWhen = document.getElementById('final-when');
  const finalTime = document.getElementById('final-time');
  const countdownMsg = document.getElementById('countdown-msg');
  const countdownGrid = document.getElementById('countdown-grid');
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // --- SVG Helper ---
  function createHeartSvg(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`;
  }

  function createStarSvg(size, color) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
    </svg>`;
  }

  // --- Background Particle Systems ---
  function renderFloatingHearts(count) {
    floatingHeartsContainer.innerHTML = '';
    const sizes = [10, 14, 18, 22, 12, 16, 20];
    const colors = ['#ff4d6d', '#f48fb1', '#fda4af', '#fbc4d0', '#c9184a'];

    for (let i = 0; i < count; i++) {
      const heartEl = document.createElement('div');
      heartEl.className = 'floating-heart-item';
      const size = sizes[i % sizes.length];
      const color = colors[i % colors.length];
      const duration = 7 + Math.random() * 8;
      const delay = Math.random() * 12;
      const left = Math.random() * 100;

      heartEl.style.left = `${left}%`;
      heartEl.style.bottom = '-5%';
      heartEl.style.animationDuration = `${duration}s`;
      heartEl.style.animationDelay = `${delay}s`;
      heartEl.innerHTML = createHeartSvg(size, color);
      floatingHeartsContainer.appendChild(heartEl);
    }
  }

  function initRosePetals() {
    rosePetalsContainer.innerHTML = '';
    const count = 12;
    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.className = 'rose-petal-item';
      const size = 10 + Math.random() * 10;
      const duration = 9 + Math.random() * 10;
      const delay = Math.random() * 14;
      const left = 5 + Math.random() * 90;
      const top = -(5 + Math.random() * 10);
      const driftX = (Math.random() - 0.5) * 140;
      const spin = Math.random() * 360;

      petal.style.left = `${left}%`;
      petal.style.top = `${top}%`;
      petal.style.setProperty('--drift-x', `${driftX}px`);
      petal.style.setProperty('--spin', `${spin}deg`);
      petal.style.animationDuration = `${duration}s`;
      petal.style.animationDelay = `${delay}s`;
      petal.innerHTML = createHeartSvg(size, '#f48fb1');
      rosePetalsContainer.appendChild(petal);
    }
  }

  function triggerConfetti() {
    confettiContainer.innerHTML = '';
    confettiContainer.style.display = 'block';
    const pieces = 32;
    const colors = ['#ff4d6d', '#f48fb1', '#ffd6e0', '#ff9a3c', '#a78bfa', '#34d399'];

    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[i % colors.length];
      const left = Math.random() * 100;
      const duration = 2.5 + Math.random() * 2;
      const delay = Math.random() * 1.5;
      const driftX = (Math.random() - 0.5) * 160;
      const spin = Math.random() * 720;

      piece.style.left = `${left}%`;
      piece.style.top = '-5%';
      piece.style.backgroundColor = color;
      piece.style.setProperty('--drift-x', `${driftX}px`);
      piece.style.setProperty('--spin', `${spin}deg`);
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${delay}s`;
      confettiContainer.appendChild(piece);
    }
  }

  function spawnSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-burst';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.innerHTML = createStarSvg(20, '#ffd6e0');
    sparkleContainer.appendChild(sparkle);
    setTimeout(() => {
      if (sparkle.parentNode) sparkle.remove();
    }, 750);
  }

  // --- Audio / Interaction Handler ---
  function unmuteMusic() {
    if (muted) {
      muted = false;
      musicBtn.textContent = 'ON';
      audio.play().catch(() => {});
    }
  }

  function toggleMusic() {
    muted = !muted;
    musicBtn.textContent = muted ? 'OFF' : 'ON';
    if (muted) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  document.body.addEventListener('click', unmuteMusic, { once: true });
  document.body.addEventListener('touchstart', unmuteMusic, { once: true });

  // --- Page Navigation System ---
  function navigateTo(targetPage, direction = 'forward') {
    const oldPageEl = document.getElementById(`page-${currentPage}`);
    const newPageEl = document.getElementById(`page-${targetPage}`);

    if (!newPageEl || currentPage === targetPage) return;

    if (oldPageEl) {
      oldPageEl.classList.add(direction === 'forward' ? 'page-exit-left' : 'page-exit-right');
      setTimeout(() => {
        oldPageEl.classList.remove('active', 'page-exit-left', 'page-exit-right');
        oldPageEl.style.display = 'none';
      }, 350);
    }

    currentPage = targetPage;

    // Configure particle counts & specific page setups
    switch (targetPage) {
      case 'envelope':
        backBtn.style.display = 'none';
        tauntWrapper.style.display = 'none';
        floatingNoBtn.style.display = 'none';
        confettiContainer.style.display = 'none';
        renderFloatingHearts(16);
        break;

      case 'question':
        backBtn.style.display = 'flex';
        confettiContainer.style.display = 'none';
        renderFloatingHearts(14);
        resetQuestionState();
        break;

      case 'yes':
        backBtn.style.display = 'flex';
        tauntWrapper.style.display = 'none';
        floatingNoBtn.style.display = 'none';
        renderFloatingHearts(20);
        triggerConfetti();
        break;

      case 'location':
        backBtn.style.display = 'flex';
        tauntWrapper.style.display = 'none';
        floatingNoBtn.style.display = 'none';
        confettiContainer.style.display = 'none';
        renderFloatingHearts(8);
        break;

      case 'datetime':
        backBtn.style.display = 'flex';
        tauntWrapper.style.display = 'none';
        floatingNoBtn.style.display = 'none';
        confettiContainer.style.display = 'none';
        renderFloatingHearts(8);
        setupDateTimePage();
        break;

      case 'final':
        backBtn.style.display = 'flex';
        tauntWrapper.style.display = 'none';
        floatingNoBtn.style.display = 'none';
        renderFloatingHearts(20);
        triggerConfetti();
        setupFinalPage();
        break;
    }

    setTimeout(() => {
      newPageEl.style.display = 'flex';
      // force reflow
      void newPageEl.offsetWidth;
      newPageEl.classList.add('active');
    }, 20);
  }

  // --- Back Button Navigation ---
  backBtn.addEventListener('click', () => {
    switch (currentPage) {
      case 'question':
        navigateTo('envelope', 'backward');
        break;
      case 'yes':
        navigateTo('question', 'backward');
        break;
      case 'location':
        navigateTo('yes', 'backward');
        break;
      case 'datetime':
        navigateTo('location', 'backward');
        break;
      case 'final':
        if (countdownTimer) clearInterval(countdownTimer);
        navigateTo('datetime', 'backward');
        break;
    }
  });

  // --- Page 1: Envelope Logic ---
  envelopeBox.addEventListener('click', () => {
    if (isEnvelopeOpening) return;
    isEnvelopeOpening = true;
    envelopeBox.classList.add('opening');
    envelopePrompt.textContent = 'Opening…';

    for (let i = 0; i < 18; i++) {
      setTimeout(() => {
        const cx = window.innerWidth / 2 + (Math.random() - 0.5) * Math.min(window.innerWidth * 0.8, 280);
        const cy = window.innerHeight / 2 + (Math.random() - 0.5) * 180;
        spawnSparkle(cx, cy);
      }, i * 70);
    }

    setTimeout(() => {
      navigateTo('question', 'forward');
      isEnvelopeOpening = false;
      envelopeBox.classList.remove('opening');
      envelopePrompt.textContent = 'Tap the envelope to open';
    }, 2100);
  });

  // --- Page 2: Question & Dodging No Logic ---
  function resetQuestionState() {
    floatingNoPos = null;
    floatingNoBtn.style.display = 'none';
    btnNoInitial.style.display = 'inline-flex';
    tauntWrapper.style.display = 'none';
    questionFooterHint.textContent = 'Choose wisely';
  }

  function getSafeRandomCoordinates(currentX, currentY) {
    const btnW = window.innerWidth < 640 ? 100 : 112;
    const btnH = window.innerWidth < 640 ? 44 : 48;
    const minTop = 72;
    const minLeft = 16;
    const maxX = Math.max(minLeft + 10, window.innerWidth - btnW - 16);
    const maxY = Math.max(minTop + 10, window.innerHeight - btnH - 24);

    let best = {
      left: minLeft + Math.random() * (maxX - minLeft),
      top: minTop + Math.random() * (maxY - minTop),
    };
    let bestDist = 0;

    for (let i = 0; i < 12; i++) {
      const cx = minLeft + Math.random() * (maxX - minLeft);
      const cy = minTop + Math.random() * (maxY - minTop);
      const dist = (cx - currentX) ** 2 + (cy - currentY) ** 2;
      if (dist > bestDist) {
        bestDist = dist;
        best = { left: cx, top: cy };
      }
    }
    return best;
  }

  function dodgeNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let fromX = floatingNoPos ? floatingNoPos.left : window.innerWidth / 2;
    let fromY = floatingNoPos ? floatingNoPos.top : window.innerHeight / 2;

    if (!floatingNoPos) {
      const rect = btnNoInitial.getBoundingClientRect();
      fromX = rect.left;
      fromY = rect.top;
      btnNoInitial.style.display = 'none';
      floatingNoBtn.style.display = 'block';
    }

    floatingNoBtn.classList.add('blinking');

    setTimeout(() => {
      const newPos = getSafeRandomCoordinates(fromX, fromY);
      floatingNoPos = newPos;
      floatingNoBtn.style.left = `${newPos.left}px`;
      floatingNoBtn.style.top = `${newPos.top}px`;
      floatingNoBtn.classList.remove('blinking');
    }, 120);

    // Show random taunt
    const taunt = NO_TAUNTS[Math.floor(Math.random() * NO_TAUNTS.length)];
    tauntPill.textContent = taunt;
    tauntWrapper.style.display = 'flex';

    // Show random Cat popup
    const catIdx = Math.floor(Math.random() * CAT_IMAGES.length);
    showCatPopup(CAT_IMAGES[catIdx], CAT_CAPTIONS[catIdx]);

    questionFooterHint.textContent = 'The No button is hiding...';
  }

  function showCatPopup(src, caption) {
    if (catPopupTimeout) clearTimeout(catPopupTimeout);

    catPopupImg.src = src;
    catPopupCaption.textContent = caption;
    catPopupOverlay.style.display = 'flex';

    // trigger animation reflow
    catPopupCard.style.animation = 'none';
    void catPopupCard.offsetWidth;
    catPopupCard.style.animation = '';

    catPopupTimeout = setTimeout(() => {
      catPopupOverlay.style.display = 'none';
    }, 2000);
  }

  // Initial No button events
  ['pointerdown', 'mouseenter', 'touchstart'].forEach((evt) => {
    btnNoInitial.addEventListener(evt, dodgeNoButton);
    floatingNoBtn.addEventListener(evt, dodgeNoButton);
  });

  btnYes.addEventListener('click', () => {
    navigateTo('yes', 'forward');
  });

  btnChooseDate.addEventListener('click', () => {
    navigateTo('location', 'forward');
  });

  // --- Page 4: Location Logic ---
  locationCards.forEach((card) => {
    card.addEventListener('click', () => {
      const locId = card.getAttribute('data-id');
      selectedLocation = DATE_LOCATIONS.find((l) => l.id === locId) || null;

      locationCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      btnLocationNext.disabled = false;
      locationHint.style.display = 'none';
    });
  });

  btnLocationNext.addEventListener('click', () => {
    if (selectedLocation) {
      navigateTo('datetime', 'forward');
    }
  });

  // --- Page 5: Date & Time Logic ---
  function setupDateTimePage() {
    if (selectedLocation) {
      datetimeLocName.textContent = selectedLocation.name;
    }
    // Set minimum date to today
    const todayStr = new Date().toISOString().split('T')[0];
    inputDate.min = todayStr;

    validateDateTimeInputs();
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatDisplayTime(timeStr) {
    if (!timeStr) return '';
    const d = new Date(`2000-01-01T${timeStr}`);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  function validateDateTimeInputs() {
    selectedDate = inputDate.value;
    selectedTime = inputTime.value;

    const ready = Boolean(selectedDate && selectedTime);

    if (ready && selectedLocation) {
      previewWhere.textContent = selectedLocation.name;
      previewWhen.textContent = formatDisplayDate(selectedDate);
      previewTime.textContent = formatDisplayTime(selectedTime);
      planPreviewBox.style.display = 'block';
      btnConfirmDate.disabled = false;
    } else {
      planPreviewBox.style.display = 'none';
      btnConfirmDate.disabled = true;
    }
  }

  inputDate.addEventListener('input', validateDateTimeInputs);
  inputDate.addEventListener('change', validateDateTimeInputs);
  inputTime.addEventListener('input', validateDateTimeInputs);
  inputTime.addEventListener('change', validateDateTimeInputs);

  btnConfirmDate.addEventListener('click', () => {
    if (selectedDate && selectedTime && selectedLocation) {
      navigateTo('final', 'forward');
    }
  });

  // --- Page 6: Final Page & Countdown Logic ---
  function setupFinalPage() {
    if (!selectedLocation || !selectedDate || !selectedTime) return;

    finalWhere.textContent = selectedLocation.name;
    finalWhen.textContent = formatDisplayDate(selectedDate);
    finalTime.textContent = formatDisplayTime(selectedTime);

    updateCountdown();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    if (!selectedDate || !selectedTime) return;

    const targetTime = new Date(`${selectedDate}T${selectedTime}`).getTime();
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      countdownMsg.textContent = "It's time! See you now!";
      countdownGrid.style.display = 'none';
      return;
    }

    countdownMsg.textContent = 'Counting down to our date…';
    countdownGrid.style.display = 'flex';

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  // --- Initial Mount ---
  initRosePetals();
  renderFloatingHearts(16);
})();
