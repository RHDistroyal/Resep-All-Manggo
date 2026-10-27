/**
 * RESEP ALL MANGGO - Interactive Digital Recipe Book & Gastronomy Engine
 * Concept: Authentic 3D Digital Cookbook & Restaurant Menu Experience
 */

(function () {
  'use strict';

  // Category mapping helper
  const CATEGORY_MAP = {
    'Olahan Simpel & Harian': 'simpel',
    'Minuman Kekinian & Segar': 'minuman',
    'Resep Daerah & Nusantara': 'nusantara',
    'Hidangan Asia': 'asia',
    'Hidangan Barat & Latin': 'barat',
    'Pastry & Dessert Internasional': 'pastry',
    'simpel': 'simpel',
    'minuman': 'minuman',
    'nusantara': 'nusantara',
    'asia': 'asia',
    'barat': 'barat',
    'pastry': 'pastry'
  };

  const CATEGORY_LABELS = {
    'simpel': 'Olahan Simpel & Kilat',
    'minuman': 'Minuman Kafe & Segar',
    'nusantara': 'Sambal & Nusantara',
    'asia': 'Street Food & Kuliner Asia',
    'barat': 'Western & Latin',
    'pastry': 'Pastry & Dessert Mewah'
  };

  const CATEGORY_IMAGES = {
    'minuman': 'assets/images/cat-minuman.jpg',
    'nusantara': 'assets/images/cat-nusantara.jpg',
    'asia': 'assets/images/cat-asia.jpg',
    'pastry': 'assets/images/cat-pastry.jpg',
    'simpel': 'assets/images/cat-simpel.jpg',
    'barat': 'assets/images/cat-barat.jpg'
  };

  function getCategoryKey(cat) {
    if (!cat) return 'simpel';
    if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
    const lower = cat.toLowerCase();
    if (lower.includes('simpel') || lower.includes('harian') || lower.includes('kilat')) return 'simpel';
    if (lower.includes('minum') || lower.includes('jus') || lower.includes('shake')) return 'minuman';
    if (lower.includes('nusantara') || lower.includes('daerah') || lower.includes('sambal')) return 'nusantara';
    if (lower.includes('asia') || lower.includes('thai') || lower.includes('filipina')) return 'asia';
    if (lower.includes('barat') || lower.includes('latin') || lower.includes('meksiko')) return 'barat';
    if (lower.includes('pastry') || lower.includes('bakery') || lower.includes('dessert') || lower.includes('kue')) return 'pastry';
    return 'simpel';
  }

  function normalizeRecipe(r, index) {
    const catKey = r.categoryKey || getCategoryKey(r.category);
    return {
      index: index,
      id: r.id || `recipe-${index}`,
      title: r.title || r.name || 'Resep Olahan Mangga',
      desc: r.desc || r.summary || 'Resep lezat olahan mangga dengan takaran presisi dan bahan segar.',
      category: r.category || 'Olahan Simpel & Harian',
      categoryKey: catKey,
      categoryLabel: CATEGORY_LABELS[catKey] || 'Olahan Mangga',
      image: r.image || CATEGORY_IMAGES[catKey] || 'assets/images/cat-minuman.jpg',
      prepTime: r.prepTime || '10 menit',
      cookTime: r.cookTime || '15 menit',
      totalMinutes: typeof r.totalMinutes === 'number' ? r.totalMinutes : 15,
      servings: r.servings || 2,
      difficulty: r.difficulty || 'Mudah',
      calories: r.calories || '165 kkal',
      mangoType: r.mangoType || 'Harum Manis Matang',
      tips: r.tips || r.chefTips || 'Pilih mangga berkualitas matang pohon untuk hasil rasa terbaik.',
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      steps: Array.isArray(r.steps) ? r.steps : [],
      // Book page numbers (Cover is 0; Guide is 1-2; TOC is 3-4; Recipes start at page 5)
      pageLeft: (index * 2) + 5,
      pageRight: (index * 2) + 6,
      spreadIndex: index + 3 // 0 = Cover, 1 = Guide, 2 = TOC, 3..202 = Recipes
    };
  }

  // Application State
  const state = {
    allRecipes: [],
    currentSpread: 0, // 0 = Cover, 1 = Guide, 2 = TOC, 3..202 = Recipes
    totalSpreads: 203,
    currentMultiplier: 1,
    checkedSteps: new Set(),
    bookmarks: JSON.parse(localStorage.getItem('mango_book_bookmarks') || '[]'),
    shoppingList: JSON.parse(localStorage.getItem('mango_book_shopping') || '[]'),
    soundEnabled: localStorage.getItem('mango_sound') !== 'false',
    theme: localStorage.getItem('mango_theme') || 'light',
    timer: {
      interval: null,
      remainingSeconds: 0,
      isRunning: false
    },
    cookMode: {
      currentRecipe: null,
      currentStepIdx: 0,
      timerInterval: null,
      remainingSeconds: 0,
      isRunning: false,
      wakeLock: null
    }
  };

  // DOM Elements Cache
  const DOM = {};

  function initDOMElements() {
    DOM.recipeBook = document.getElementById('recipeBook');
    DOM.bookCoverView = document.getElementById('bookCoverView');
    DOM.bookSpreadView = document.getElementById('bookSpreadView');
    DOM.pageLeftContent = document.getElementById('pageLeftContent');
    DOM.pageRightContent = document.getElementById('pageRightContent');
    DOM.pageLeftNumber = document.getElementById('pageLeftNumber');
    DOM.pageRightNumber = document.getElementById('pageRightNumber');
    DOM.pageLeftFooterTitle = document.getElementById('pageLeftFooterTitle');
    DOM.pageRightFooterTitle = document.getElementById('pageRightFooterTitle');

    // 3D Paper Leaf Flipper
    DOM.bookPageFlipper = document.getElementById('bookPageFlipper');
    DOM.flipperFrontFace = document.getElementById('flipperFrontFace');
    DOM.flipperBackFace = document.getElementById('flipperBackFace');

    // Controls
    DOM.btnOpenCover = document.getElementById('btnOpenCover');
    DOM.brandCoverBtn = document.getElementById('brandCoverBtn');
    DOM.coverJumpTocBtn = document.getElementById('coverJumpTocBtn');
    DOM.coverRandomBtn = document.getElementById('coverRandomBtn');

    DOM.prevCornerClick = document.getElementById('prevCornerClick');
    DOM.nextCornerClick = document.getElementById('nextCornerClick');

    DOM.dockPrevBtn = document.getElementById('dockPrevBtn');
    DOM.dockNextBtn = document.getElementById('dockNextBtn');
    DOM.dockSpreadLabel = document.getElementById('dockSpreadLabel');
    DOM.dockQuickTocBtn = document.getElementById('dockQuickTocBtn');

    // Search
    DOM.globalBookSearch = document.getElementById('globalBookSearch');
    DOM.clearSearchBtn = document.getElementById('clearSearchBtn');
    DOM.searchQuickResults = document.getElementById('searchQuickResults');
    DOM.mobileBookSearch = document.getElementById('mobileBookSearch');
    DOM.mobileClearSearchBtn = document.getElementById('mobileClearSearchBtn');

    // Drawers
    DOM.btnToggleToc = document.getElementById('btnToggleToc');
    DOM.tocDrawerOverlay = document.getElementById('tocDrawerOverlay');
    DOM.closeTocDrawerBtn = document.getElementById('closeTocDrawerBtn');
    DOM.tocListContainer = document.getElementById('tocListContainer');
    DOM.tocSearchInput = document.getElementById('tocSearchInput');

    DOM.btnToggleBookmarks = document.getElementById('btnToggleBookmarks');
    DOM.bookmarksDrawerOverlay = document.getElementById('bookmarksDrawerOverlay');
    DOM.closeBookmarksDrawerBtn = document.getElementById('closeBookmarksDrawerBtn');
    DOM.bookmarksListContainer = document.getElementById('bookmarksListContainer');
    DOM.bookmarkCountBadge = document.getElementById('bookmarkCountBadge');

    DOM.btnToggleShopping = document.getElementById('btnToggleShopping');
    DOM.shoppingDrawerOverlay = document.getElementById('shoppingDrawerOverlay');
    DOM.closeShoppingDrawerBtn = document.getElementById('closeShoppingDrawerBtn');
    DOM.shoppingItemsList = document.getElementById('shoppingItemsList');
    DOM.shoppingCountBadge = document.getElementById('shoppingCountBadge');
    DOM.shareShoppingWhatsappBtn = document.getElementById('shareShoppingWhatsappBtn');
    DOM.clearShoppingListBtn = document.getElementById('clearShoppingListBtn');

    // Audio & Theme
    DOM.btnToggleSound = document.getElementById('btnToggleSound');
    DOM.btnToggleTheme = document.getElementById('btnToggleTheme');
    DOM.toastContainer = document.getElementById('toastContainer');

    // Cook Mode
    DOM.cookModeOverlay = document.getElementById('cookModeOverlay');
    DOM.closeCookModeBtn = document.getElementById('closeCookModeBtn');
    DOM.cookModeDishTitle = document.getElementById('cookModeDishTitle');
    DOM.cookProgressFill = document.getElementById('cookProgressFill');
    DOM.cookStepCounter = document.getElementById('cookStepCounter');
    DOM.cookStepInstruction = document.getElementById('cookStepInstruction');
    DOM.cookPrevStepBtn = document.getElementById('cookPrevStepBtn');
    DOM.cookNextStepBtn = document.getElementById('cookNextStepBtn');
    DOM.btnSpeakStep = document.getElementById('btnSpeakStep');
    DOM.speakBtnText = document.getElementById('speakBtnText');
    DOM.btnStepTimer = document.getElementById('btnStepTimer');
    DOM.stepTimerBtnText = document.getElementById('stepTimerBtnText');
    DOM.stepActiveTimerCard = document.getElementById('stepActiveTimerCard');
    DOM.stepTimerDisplay = document.getElementById('stepTimerDisplay');
    DOM.btnStepTimerPause = document.getElementById('btnStepTimerPause');
    DOM.btnStepTimerReset = document.getElementById('btnStepTimerReset');
    DOM.wakeLockStatus = document.getElementById('wakeLockStatus');
    DOM.btnToggleCookIngredients = document.getElementById('btnToggleCookIngredients');
    DOM.cookIngredientsSheet = document.getElementById('cookIngredientsSheet');
    DOM.closeCookIngredientsSheet = document.getElementById('closeCookIngredientsSheet');
    DOM.cookSheetIngredientsList = document.getElementById('cookSheetIngredientsList');
  }

  // ===================================================================
  // SYNTHESIZED PAPER FLIP AUDIO (WEB AUDIO API - ZERO EXTERNAL ASSETS)
  // ===================================================================
  let audioCtx = null;
  function playPageFlipSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const dur = 0.14;
      const bufferSize = audioCtx.sampleRate * dur;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft pinkish white noise for paper rustle
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.18;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 850;
      filter.Q.value = 1.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      // AudioContext unavailable or blocked
    }
  }

  function playChimeSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {}
  }

  // ===================================================================
  // INITIALIZATION & RECIPES LOADING
  // ===================================================================
  function init() {
    initDOMElements();
    applyTheme(state.theme);
    updateSoundUI();
    updateBadgeCounts();

    if (window.MANGO_RECIPES && Array.isArray(window.MANGO_RECIPES)) {
      state.allRecipes = window.MANGO_RECIPES.map(normalizeRecipe);
      finalizeSetup();
    } else {
      fetch('data/recipes.json')
        .then(res => res.json())
        .then(data => {
          state.allRecipes = data.map(normalizeRecipe);
          finalizeSetup();
        })
        .catch(err => {
          console.error('Gagal memuat resep:', err);
          showToast('Gagal memuat data resep mangga.');
        });
    }
  }

  function finalizeSetup() {
    state.totalSpreads = state.allRecipes.length + 3; // Cover(0) + Guide(1) + TOC(2) + 200 Recipes
    populateTableOfContentsDrawer();
    setupEventListeners();
    goToSpread(0, false); // Start at Cover
  }

  // ===================================================================
  // 3D SPREAD NAVIGATION & BOOK FLIP ENGINE
  // ===================================================================
  function goToSpread(spreadIdx, withSound = true, direction = null) {
    if (spreadIdx < 0) spreadIdx = 0;
    if (spreadIdx >= state.totalSpreads) spreadIdx = state.totalSpreads - 1;
    if (spreadIdx === state.currentSpread && DOM.bookSpreadView.classList.contains('is-open')) return;
    if (state.isFlipping) return;

    const oldSpread = state.currentSpread;
    const isNext = direction ? (direction === 'next') : (spreadIdx > oldSpread);

    // Case 1: Opening Cover: 0 -> >=1
    if (oldSpread === 0 && spreadIdx > 0) {
      state.isFlipping = true;
      if (withSound) playPageFlipSound();
      
      DOM.bookCoverView.classList.remove('swing-close');
      DOM.bookCoverView.classList.add('swing-open');

      setTimeout(() => {
        if (DOM.recipeBook) DOM.recipeBook.classList.add('is-book-open');
        DOM.bookSpreadView.classList.add('is-open');
        DOM.bookSpreadView.style.display = '';
        renderSpreadContent(spreadIdx);
        state.currentSpread = spreadIdx;
        updateDockControls();
      }, 350);

      setTimeout(() => {
        DOM.bookCoverView.style.display = 'none';
        DOM.bookCoverView.classList.remove('swing-open');
        state.isFlipping = false;
      }, 780);
      return;
    }

    // Case 2: Closing Book to Cover: >=1 -> 0
    if (oldSpread > 0 && spreadIdx === 0) {
      state.isFlipping = true;
      if (withSound) playPageFlipSound();

      DOM.bookCoverView.style.display = 'flex';
      DOM.bookCoverView.classList.remove('swing-open');
      DOM.bookCoverView.classList.add('swing-close');

      setTimeout(() => {
        if (DOM.recipeBook) DOM.recipeBook.classList.remove('is-book-open');
        DOM.bookSpreadView.classList.remove('is-open');
        DOM.bookSpreadView.style.display = 'none';
        state.currentSpread = 0;
        updateDockControls();
      }, 350);

      setTimeout(() => {
        DOM.bookCoverView.classList.remove('swing-close');
        state.isFlipping = false;
      }, 700);
      return;
    }

    // Ensure is-book-open is on if spreadIdx >= 1
    if (spreadIdx > 0 && DOM.recipeBook) {
      DOM.recipeBook.classList.add('is-book-open');
    } else if (spreadIdx === 0 && DOM.recipeBook) {
      DOM.recipeBook.classList.remove('is-book-open');
    }

    // Case 3: Flipping Between Spreads (>=1 -> >=1)
    state.currentMultiplier = 1;
    state.checkedSteps.clear();

    const isMobile = window.innerWidth <= 860;

    if (isMobile) {
      state.isFlipping = true;
      if (withSound) playPageFlipSound();

      const curlClass = isNext ? 'mobile-page-curl-next' : 'mobile-page-curl-prev';
      DOM.bookSpreadView.classList.remove('mobile-page-curl-next', 'mobile-page-curl-prev');
      void DOM.bookSpreadView.offsetWidth; // trigger reflow
      DOM.bookSpreadView.classList.add(curlClass);

      setTimeout(() => {
        renderSpreadContent(spreadIdx);
        state.currentSpread = spreadIdx;
        updateDockControls();
      }, 180);

      setTimeout(() => {
        DOM.bookSpreadView.classList.remove(curlClass);
        state.isFlipping = false;
      }, 480);
    } else {
      // Desktop 3D Leaf Flip
      if (DOM.bookPageFlipper && DOM.flipperFrontFace && DOM.flipperBackFace) {
        state.isFlipping = true;
        if (withSound) playPageFlipSound();

        if (isNext) {
          DOM.flipperFrontFace.innerHTML = DOM.pageRightContent.innerHTML;
          DOM.bookPageFlipper.className = 'book-page-leaf-flipper flip-leaf-next';
          DOM.bookPageFlipper.style.display = 'block';

          // Update underlying page
          renderSpreadContent(spreadIdx);
          state.currentSpread = spreadIdx;
          updateDockControls();

          setTimeout(() => {
            DOM.bookPageFlipper.style.display = 'none';
            DOM.bookPageFlipper.className = 'book-page-leaf-flipper';
            DOM.flipperFrontFace.innerHTML = '';
            state.isFlipping = false;
          }, 540);
        } else {
          DOM.flipperBackFace.innerHTML = DOM.pageLeftContent.innerHTML;
          DOM.bookPageFlipper.className = 'book-page-leaf-flipper flip-leaf-prev';
          DOM.bookPageFlipper.style.display = 'block';

          renderSpreadContent(spreadIdx);
          state.currentSpread = spreadIdx;
          updateDockControls();

          setTimeout(() => {
            DOM.bookPageFlipper.style.display = 'none';
            DOM.bookPageFlipper.className = 'book-page-leaf-flipper';
            DOM.flipperBackFace.innerHTML = '';
            state.isFlipping = false;
          }, 540);
        }
      } else {
        if (withSound) playPageFlipSound();
        renderSpreadContent(spreadIdx);
        state.currentSpread = spreadIdx;
        updateDockControls();
      }
    }

    // Scroll book into view smoothly if needed
    const bookStage = document.getElementById('bookStage');
    if (bookStage && window.scrollY > 150) {
      bookStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderSpreadContent(spreadIdx) {
    if (spreadIdx === 1) {
      renderMaturityGuideSpread();
      if (DOM.dockSpreadLabel) DOM.dockSpreadLabel.textContent = 'Halaman 1 - 2: Panduan Kematangan & Prolog';
    } else if (spreadIdx === 2) {
      renderTableOfContentsSpread();
      if (DOM.dockSpreadLabel) DOM.dockSpreadLabel.textContent = 'Halaman 3 - 4: Daftar Isi 200 Resep';
    } else {
      const recipeIdx = spreadIdx - 3;
      const recipe = state.allRecipes[recipeIdx];
      if (recipe) {
        renderRecipeSpread(recipe);
        if (DOM.dockSpreadLabel) {
          DOM.dockSpreadLabel.textContent = `Halaman ${recipe.pageLeft} - ${recipe.pageRight}: ${recipe.title}`;
        }
      }
    }
  }

  function updateDockControls() {
    if (DOM.dockPrevBtn) DOM.dockPrevBtn.disabled = state.currentSpread === 0;
    if (DOM.dockNextBtn) DOM.dockNextBtn.disabled = state.currentSpread === state.totalSpreads - 1;
    if (state.currentSpread === 0 && DOM.dockSpreadLabel) {
      DOM.dockSpreadLabel.textContent = 'Sampul Depan Buku';
    }
  }

  function nextSpread() {
    if (state.currentSpread < state.totalSpreads - 1) {
      goToSpread(state.currentSpread + 1, true, 'next');
    }
  }

  function prevSpread() {
    if (state.currentSpread > 0) {
      goToSpread(state.currentSpread - 1, true, 'prev');
    }
  }

  function jumpToRecipe(recipeIdOrIndex) {
    let recipe;
    if (typeof recipeIdOrIndex === 'number') {
      recipe = state.allRecipes[recipeIdOrIndex];
    } else {
      recipe = state.allRecipes.find(r => r.id === recipeIdOrIndex);
    }
    if (recipe) {
      closeAllDrawers();
      goToSpread(recipe.spreadIndex, true, recipe.spreadIndex > state.currentSpread ? 'next' : 'prev');
    }
  }

  // ===================================================================
  // SPREAD 1: MANGO MATURITY SPECTRUM & OVERVIEW (HALAMAN 1 & 2)
  // ===================================================================
  function renderMaturityGuideSpread() {
    // Left Page: Maturity Spectrum Guide
    DOM.pageLeftNumber.textContent = '1';
    DOM.pageLeftFooterTitle.textContent = 'Panduan Gastronomi Mangga';

    DOM.pageLeftContent.innerHTML = `
      <div class="spread-header-banner">
        <span class="spread-pre-title">BAB PENDAHULUAN • HALAMAN 1</span>
        <h2 class="spread-main-title">Spektrum Kematangan & Rasa Mangga</h2>
      </div>

      <p class="spread-lead-text">
        Kunci kesempurnaan olahan mangga bermula dari memilih fase kematangan yang presisi. Setiap tingkat kematangan memiliki kadar pektin, tingkat keasaman, serat, dan profil aroma unik untuk tujuan kuliner tertentu:
      </p>

      <div class="maturity-grid">
        <div class="maturity-card tier-mentah">
          <div class="maturity-card-header">
            <h3 class="maturity-name">1. Mangga Mentah / Muda</h3>
            <span class="maturity-tag">Tart & Ultra-Crisp</span>
          </div>
          <p class="maturity-profile">Daging buah putih kehijauan, tekstur berderak renyah, kadar pektin tinggi dengan keasaman menyegarkan lidah.</p>
          <div class="maturity-best-for"><strong>Olahan Terbaik:</strong> Sambal Pencit Madura, Rujak Serut, Asinan Betawi, Gulai Ikan Asam Pedas, & Manisan Kering.</div>
        </div>

        <div class="maturity-card tier-mengkal">
          <div class="maturity-card-header">
            <h3 class="maturity-name">2. Mangga Mengkal / Half-Ripe</h3>
            <span class="maturity-tag">Crunchy & Semi-Sweet</span>
          </div>
          <p class="maturity-profile">Warna mulai kekuningan, tekstur masih padat kokoh namun mulai memancarkan aroma manis tropis lembut.</p>
          <div class="maturity-best-for"><strong>Olahan Terbaik:</strong> Som Tum Thai (Salad Mangga Bangkok), Mango Chutney India, Acar Mangga Segar, & Tumisan Pedas.</div>
        </div>

        <div class="maturity-card tier-matang">
          <div class="maturity-card-header">
            <h3 class="maturity-name">3. Mangga Matang Sempurna</h3>
            <span class="maturity-tag">Sweet & Velvety</span>
          </div>
          <p class="maturity-profile">Warna kuning keemasan, aroma harum semerbak, daging buah pulen, lembut lumer di mulut tanpa serat kasar.</p>
          <div class="maturity-best-for"><strong>Olahan Terbaik:</strong> Khao Niew Mamuang (Mango Sticky Rice), King Mango Thai, Mango Sago, Mille Crepes, Tartlet, & Cheesecake.</div>
        </div>

        <div class="maturity-card tier-overripe">
          <div class="maturity-card-header">
            <h3 class="maturity-name">4. Mangga Sangat Matang</h3>
            <span class="maturity-tag">Juicy & Sweet Elixir</span>
          </div>
          <p class="maturity-profile">Sangat lembut berair, manis pekat alami berkonsentrasi tinggi. Sangat mudah dilumatkan tanpa perlu gula tambahan.</p>
          <div class="maturity-best-for"><strong>Olahan Terbaik:</strong> Puree Mangga, Selai Rumahan (Jam), Sirup Mocktail & Mojito, Es Krim Sorbet, & Saus Vla Dessert.</div>
        </div>
      </div>
    `;

    // Right Page: Book Overview & Recipe Chapters
    DOM.pageRightNumber.textContent = '2';
    DOM.pageRightFooterTitle.textContent = 'Kisi-Kisi 200 Resep';

    DOM.pageRightContent.innerHTML = `
      <div class="spread-header-banner">
        <span class="spread-pre-title">PANDUAN PEMBACA • HALAMAN 2</span>
        <h2 class="spread-main-title">Kisi-Kisi Ensiklopedia 200 Resep</h2>
      </div>

      <div class="book-overview-box">
        <h3 class="overview-heading">Tentang Buku Resep Ini</h3>
        <p class="overview-desc">
          Buku ini menghimpun 200 resep teruji dari dapur komunitas Cookpad Indonesia. Dirancang layaknya buku menu restoran bintang lima, setiap resep disajikan dalam dua halaman terbuka yang menyandingkan visual hidangan, takaran gram presisi, fitur kalkulator porsi, dan timer dapur interaktif.
        </p>
      </div>

      <div class="chapters-list">
        <div class="chapter-item">
          <span class="chapter-num">I</span>
          <div>
            <div class="chapter-title">Minuman Kafe & Segar (25 Resep)</div>
            <div class="chapter-desc">King Mango Thai, Yakult Blizz, Mango Mojito, Smoothie Bowl, Es Serut Mangga.</div>
          </div>
        </div>

        <div class="chapter-item">
          <span class="chapter-num">II</span>
          <div>
            <div class="chapter-title">Sambal & Masakan Nusantara (50 Resep)</div>
            <div class="chapter-desc">Sambal Pencit Jawa Timur, Gulai Ikan Mangga, Ikan Bakar Saus Mangga, Rujak Serut.</div>
          </div>
        </div>

        <div class="chapter-item">
          <span class="chapter-num">III</span>
          <div>
            <div class="chapter-title">Street Food & Autentik Asia (30 Resep)</div>
            <div class="chapter-desc">Khao Niew Mamuang Bangkok, Mango Float Filipina, Som Tum, Kulfi Mangga India.</div>
          </div>
        </div>

        <div class="chapter-item">
          <span class="chapter-num">IV</span>
          <div>
            <div class="chapter-title">Pastry, Bakery & Dessert Mewah (50 Resep)</div>
            <div class="chapter-desc">Mango Cheesecake, Mille Crepes Paris, Panna Cotta, Tartlet, Sorbet & Souffle.</div>
          </div>
        </div>

        <div class="chapter-item">
          <span class="chapter-num">V</span>
          <div>
            <div class="chapter-title">Olahan Kilat & Western (45 Resep)</div>
            <div class="chapter-desc">Salsa Mangga Meksiko, Chutney, Puding Kilat & Santapan Praktis Harian.</div>
          </div>
        </div>
      </div>

      <div style="text-align: right; margin-top: 10px;">
        <button type="button" class="btn-dock-action btn-primary" onclick="window.goToSpread(2)">
          <span>Buka Daftar Isi (Halaman 3) &rarr;</span>
        </button>
      </div>
    `;
  }

  // ===================================================================
  // SPREAD 2: TABLE OF CONTENTS (HALAMAN 3 & 4)
  // ===================================================================
  function renderTableOfContentsSpread() {
    DOM.pageLeftNumber.textContent = '3';
    DOM.pageLeftFooterTitle.textContent = 'Daftar Isi Bagian 1';
    DOM.pageRightNumber.textContent = '4';
    DOM.pageRightFooterTitle.textContent = 'Daftar Isi Bagian 2';

    // Split top 100 on left, next 100 on right (or categorized view)
    const recipesHalf1 = state.allRecipes.slice(0, 15);
    const recipesHalf2 = state.allRecipes.slice(15, 30);

    const renderList = (list) => {
      return list.map(r => `
        <div class="toc-entry-row" onclick="window.jumpToRecipe('${r.id}')" title="Buka ${escapeHTML(r.title)} (Hal. ${r.pageLeft})">
          <span class="toc-entry-title">${escapeHTML(r.title)}</span>
          <span class="toc-entry-dots"></span>
          <span class="toc-entry-page">Hal. ${r.pageLeft}</span>
        </div>
      `).join('');
    };

    DOM.pageLeftContent.innerHTML = `
      <div class="spread-header-banner">
        <span class="spread-pre-title">DAFTAR ISI RESEP • HALAMAN 3</span>
        <h2 class="spread-main-title">Koleksi Menu Pilihan</h2>
      </div>
      <p class="spread-lead-text">Klik judul resep mana pun untuk langsung membalik halaman buku ke resep tersebut:</p>
      
      <div class="toc-page-columns">
        ${renderList(recipesHalf1)}
      </div>
    `;

    DOM.pageRightContent.innerHTML = `
      <div class="spread-header-banner">
        <span class="spread-pre-title">DAFTAR ISI RESEP • HALAMAN 4</span>
        <h2 class="spread-main-title">Eksplorasi Kuliner Lengkap</h2>
      </div>

      <div class="toc-page-columns">
        ${renderList(recipesHalf2)}
      </div>

      <div style="background: var(--page-bg-accent); padding: 14px 16px; border-radius: 8px; border: 1px solid var(--page-border); margin-top: 18px; text-align: center;">
        <p style="font-size: 0.82rem; color: var(--text-ink-body); margin-bottom: 8px;">
          Ingin melihat daftar lengkap 200 resep dengan filter bab & pencarian instan?
        </p>
        <button type="button" class="btn-dock-action btn-primary" onclick="window.openTocDrawer()">
          <span>Buka Panel 200 Daftar Isi &rarr;</span>
        </button>
      </div>
    `;
  }

  // ===================================================================
  // SPREAD 3+: RECIPE SPREAD (MICHELIN MENU & FLIPHTML5 GOURMET POSTER STYLE)
  // ===================================================================
  function renderRecipeSpread(recipe) {
    state.cookMode.currentRecipe = recipe;
    const isBookmarked = state.bookmarks.includes(recipe.id);

    // Left Page: Gastronomy Editorial Showcase (Un-cropped Food Poster + Specs)
    DOM.pageLeftNumber.textContent = String(recipe.pageLeft);
    DOM.pageLeftFooterTitle.textContent = `${recipe.categoryLabel} • Resep Teruji`;

    DOM.pageLeftContent.innerHTML = `
      <div class="recipe-page-left">
        <div class="recipe-meta-top">
          <span class="recipe-chapter-badge">${recipe.categoryLabel}</span>
          <span class="recipe-leaf-decor">❦</span>
        </div>

        <h2 class="recipe-poster-title">${escapeHTML(recipe.title)}</h2>

        <!-- The Hero Culinary Food Poster (Never Cropped, Ambient Glow Backdrop) -->
        <div class="recipe-food-poster" onclick="window.openPosterLightbox('${escapeHTML(recipe.image)}', '${escapeHTML(recipe.title)}')" title="Klik untuk melihat poster resolusi penuh">
          <div class="poster-ambient-backdrop" style="background-image: url('${recipe.image}');"></div>
          <div class="poster-editorial-overlay"></div>
          <img src="${recipe.image}" alt="${escapeHTML(recipe.title)}" class="poster-main-photo" onerror="this.src='${CATEGORY_IMAGES[recipe.categoryKey] || 'assets/images/cat-minuman.jpg'}'" loading="lazy">
          
          <div class="poster-floating-top">
            <span class="poster-badge-variety">${escapeHTML(recipe.mangoType)}</span>
            <span class="poster-badge-zoom" title="Perbesar Poster HD">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              HD
            </span>
          </div>

          <div class="poster-floating-bottom">
            <span class="poster-pill-stat">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${recipe.totalMinutes} Menit • ${recipe.difficulty}
            </span>
            <span class="poster-pill-verified">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Resep Teruji
            </span>
          </div>

          <div class="poster-corner top-l"></div>
          <div class="poster-corner top-r"></div>
          <div class="poster-corner btm-l"></div>
          <div class="poster-corner btm-r"></div>
        </div>

        <p class="recipe-tasting-quote"><span class="book-drop-cap">${recipe.desc.charAt(0)}</span>${escapeHTML(recipe.desc.slice(1))}</p>

        <div class="book-specs-row">
          <div class="book-spec-cell">
            <span class="spec-cell-label">Persiapan</span>
            <strong class="spec-cell-val">${recipe.prepTime}</strong>
          </div>
          <div class="book-spec-cell">
            <span class="spec-cell-label">Memasak</span>
            <strong class="spec-cell-val">${recipe.cookTime}</strong>
          </div>
          <div class="book-spec-cell">
            <span class="spec-cell-label">Kalori</span>
            <strong class="spec-cell-val">${recipe.calories}</strong>
          </div>
          <div class="book-spec-cell">
            <span class="spec-cell-label">Kematangan</span>
            <strong class="spec-cell-val">${recipe.mangoType}</strong>
          </div>
        </div>
      </div>
    `;

    // Right Page: The Culinary Workshop (Ingredients + Scaler + Steps + Timers + Chef Tips + Actions)
    DOM.pageRightNumber.textContent = String(recipe.pageRight);
    DOM.pageRightFooterTitle.textContent = `Panduan Dapur & Eksekusi Resep`;

    // Calculate Ingredients based on multiplier
    const ingredientsHTML = recipe.ingredients.map(ing => {
      let displayAmount = ing.amount;
      if (typeof ing.amount === 'number') {
        const scaled = ing.amount * state.currentMultiplier;
        displayAmount = (Math.round(scaled * 10) / 10).toString();
      }
      return `
        <label class="ingredient-row">
          <input type="checkbox" class="ing-check-input" onchange="window.toggleIngCheck(this)">
          <span class="ing-measure">${displayAmount} ${ing.unit || ''}</span>
          <span class="ing-name">${escapeHTML(ing.name)}</span>
          ${ing.notes ? `<span class="ing-notes">(${escapeHTML(ing.notes)})</span>` : ''}
        </label>
      `;
    }).join('');

    // Render Steps with timer buttons
    const stepsHTML = recipe.steps.map((step, idx) => {
      const match = step.match(/(\d+)\s*(?:menit|mnt)/i);
      let timerBtn = '';
      if (match && match[1]) {
        const mins = parseInt(match[1], 10);
        timerBtn = `
          <button type="button" class="step-timer-badge-btn" onclick="window.startTimerPreset(${mins})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Pasang Timer ${mins} Menit
          </button>
        `;
      }
      return `
        <div class="book-step-item">
          <span class="book-step-badge">${idx + 1}</span>
          <div class="book-step-text">
            <p>${escapeHTML(step)}</p>
            ${timerBtn}
          </div>
        </div>
      `;
    }).join('');

    DOM.pageRightContent.innerHTML = `
      <div class="recipe-page-right">
        <!-- Section 1: Ingredients with Servings Scaler -->
        <div class="book-ingredients-box">
          <div class="ingredients-box-header">
            <h3 class="box-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg>
              Bahan & Takaran Presisi
            </h3>
            <div class="servings-stepper">
              <span style="font-size: 0.72rem; color: var(--text-ink-muted); margin-right: 4px;">Porsi:</span>
              <button type="button" class="step-multiplier-btn ${state.currentMultiplier === 0.5 ? 'active' : ''}" onclick="window.setScale(0.5)">0.5x</button>
              <button type="button" class="step-multiplier-btn ${state.currentMultiplier === 1 ? 'active' : ''}" onclick="window.setScale(1)">1x</button>
              <button type="button" class="step-multiplier-btn ${state.currentMultiplier === 2 ? 'active' : ''}" onclick="window.setScale(2)">2x</button>
              <button type="button" class="step-multiplier-btn ${state.currentMultiplier === 3 ? 'active' : ''}" onclick="window.setScale(3)">3x</button>
            </div>
          </div>
          <div class="book-ingredients-grid">
            ${ingredientsHTML}
          </div>
        </div>

        <!-- Section 2: Cooking Steps with Timers -->
        <div class="cooking-steps-section">
          <div class="cooking-steps-header">
            <h3 class="box-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Langkah-Langkah Pembuatan
            </h3>
          </div>
          <div class="book-steps-list">
            ${stepsHTML}
          </div>
        </div>

        <!-- Section 3: Chef Secret Tips -->
        <div class="book-chef-tips-box">
          <div class="tips-header-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <strong>Tips Rahasia Koki</strong>
          </div>
          <p class="tips-body-text">${escapeHTML(recipe.tips)}</p>
        </div>

        <!-- Section 4: Action Buttons -->
        <div class="book-recipe-actions">
          <button type="button" class="btn-book-action btn-cook-handsfree" onclick="window.launchCookMode()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Mode Memasak Hands-Free</span>
          </button>

          <button type="button" class="btn-book-action btn-bookmark-recipe ${isBookmarked ? 'is-bookmarked' : ''}" onclick="window.toggleBookmarkCurrent()" title="${isBookmarked ? 'Lepas tanda buku' : 'Tandai resep ini'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span>${isBookmarked ? 'Ditandai' : 'Tandai'}</span>
          </button>

          <button type="button" class="btn-book-action btn-add-shopping" onclick="window.addCurrentRecipeToShopping()" title="Masukkan bahan ke daftar belanja">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg>
            <span>Beli Bahan</span>
          </button>
        </div>
      </div>
    `;
  }

  // Window helper functions for inline clicks
  window.goToSpread = goToSpread;
  window.jumpToRecipe = jumpToRecipe;
  window.setScale = function (multiplier) {
    state.currentMultiplier = multiplier;
    const recipeIdx = state.currentSpread - 3;
    if (recipeIdx >= 0 && state.allRecipes[recipeIdx]) {
      renderRecipeSpread(state.allRecipes[recipeIdx]);
    }
  };

  window.toggleIngCheck = function (checkbox) {
    const row = checkbox.closest('.ingredient-row');
    if (row) {
      if (checkbox.checked) row.classList.add('is-checked');
      else row.classList.remove('is-checked');
    }
  };

  window.openPosterLightbox = function (imgSrc, title) {
    const overlay = document.getElementById('posterLightboxOverlay');
    const img = document.getElementById('lightboxPosterImg');
    const titleEl = document.getElementById('lightboxPosterTitle');
    if (overlay && img && titleEl) {
      img.src = imgSrc;
      titleEl.textContent = title;
      overlay.classList.add('is-active');
    }
  };

  window.closePosterLightbox = function (e) {
    if (e && e.target && e.target.classList && !e.target.classList.contains('poster-lightbox-overlay') && !e.target.classList.contains('poster-lightbox-close')) {
      return;
    }
    const overlay = document.getElementById('posterLightboxOverlay');
    if (overlay) overlay.classList.remove('is-active');
  };

  // ===================================================================
  // TABLE OF CONTENTS DRAWER (200 RECIPES LIST)
  // ===================================================================
  function populateTableOfContentsDrawer(filterCategory = 'all', searchQuery = '') {
    if (!DOM.tocListContainer) return;
    DOM.tocListContainer.innerHTML = '';

    let list = state.allRecipes;
    if (filterCategory !== 'all') {
      list = list.filter(r => r.categoryKey === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      DOM.tocListContainer.innerHTML = `
        <div style="grid-column: span 2; padding: 30px; text-align: center; color: var(--text-ink-muted);">
          Resep tidak ditemukan di daftar isi.
        </div>
      `;
      return;
    }

    list.forEach(r => {
      const item = document.createElement('div');
      item.className = 'toc-entry-row';
      item.innerHTML = `
        <span class="toc-entry-title">${escapeHTML(r.title)}</span>
        <span class="toc-entry-dots"></span>
        <span class="toc-entry-page">Hal. ${r.pageLeft}</span>
      `;
      item.addEventListener('click', () => {
        closeAllDrawers();
        goToSpread(r.spreadIndex);
      });
      DOM.tocListContainer.appendChild(item);
    });
  }

  function openTocDrawer() {
    closeAllDrawers();
    if (DOM.tocDrawerOverlay) {
      DOM.tocDrawerOverlay.classList.add('is-open');
      DOM.tocDrawerOverlay.setAttribute('aria-hidden', 'false');
    }
  }
  window.openTocDrawer = openTocDrawer;

  // ===================================================================
  // BOOKMARK / FAVORITES SYSTEM
  // ===================================================================
  function toggleBookmark(recipeId) {
    const idx = state.bookmarks.indexOf(recipeId);
    if (idx > -1) {
      state.bookmarks.splice(idx, 1);
      showToast('Tanda buku dilepas.');
    } else {
      state.bookmarks.push(recipeId);
      showToast('Resep ditandai dengan pembatas buku.');
    }
    localStorage.setItem('mango_book_bookmarks', JSON.stringify(state.bookmarks));
    updateBadgeCounts();

    // Re-render current spread if looking at recipe
    const currentRecipeIdx = state.currentSpread - 3;
    if (currentRecipeIdx >= 0 && state.allRecipes[currentRecipeIdx]) {
      renderRecipeSpread(state.allRecipes[currentRecipeIdx]);
    }
  }

  window.toggleBookmarkCurrent = function () {
    const recipeIdx = state.currentSpread - 3;
    if (recipeIdx >= 0 && state.allRecipes[recipeIdx]) {
      toggleBookmark(state.allRecipes[recipeIdx].id);
    }
  };

  function openBookmarksDrawer() {
    closeAllDrawers();
    if (!DOM.bookmarksListContainer) return;
    DOM.bookmarksListContainer.innerHTML = '';

    if (state.bookmarks.length === 0) {
      DOM.bookmarksListContainer.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: var(--text-ink-muted);">
          <p style="font-size: 0.95rem; margin-bottom: 6px;">Belum ada resep yang ditandai.</p>
          <small>Gunakan tombol 'Tandai' pada halaman resep mana pun untuk menyimpannya.</small>
        </div>
      `;
    } else {
      state.bookmarks.forEach(id => {
        const r = state.allRecipes.find(item => item.id === id);
        if (!r) return;
        const row = document.createElement('div');
        row.className = 'toc-entry-row';
        row.innerHTML = `
          <span class="toc-entry-title">${escapeHTML(r.title)}</span>
          <span class="toc-entry-dots"></span>
          <span class="toc-entry-page">Hal. ${r.pageLeft}</span>
        `;
        row.addEventListener('click', () => {
          closeAllDrawers();
          goToSpread(r.spreadIndex);
        });
        DOM.bookmarksListContainer.appendChild(row);
      });
    }

    if (DOM.bookmarksDrawerOverlay) {
      DOM.bookmarksDrawerOverlay.classList.add('is-open');
      DOM.bookmarksDrawerOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  // ===================================================================
  // SHOPPING LIST SYSTEM
  // ===================================================================
  window.addCurrentRecipeToShopping = function () {
    const recipeIdx = state.currentSpread - 3;
    if (recipeIdx < 0 || !state.allRecipes[recipeIdx]) return;
    const r = state.allRecipes[recipeIdx];

    r.ingredients.forEach(ing => {
      let displayAmount = ing.amount;
      if (typeof ing.amount === 'number') {
        const scaled = ing.amount * state.currentMultiplier;
        displayAmount = (Math.round(scaled * 10) / 10).toString();
      }
      const text = `${displayAmount} ${ing.unit || ''} ${ing.name} (${r.title})`;
      if (!state.shoppingList.some(item => item.text === text)) {
        state.shoppingList.push({ text: text, checked: false });
      }
    });

    localStorage.setItem('mango_book_shopping', JSON.stringify(state.shoppingList));
    updateBadgeCounts();
    showToast('Bahan resep ditambahkan ke Daftar Belanja!');
  };

  function openShoppingDrawer() {
    closeAllDrawers();
    if (!DOM.shoppingItemsList) return;
    DOM.shoppingItemsList.innerHTML = '';

    if (state.shoppingList.length === 0) {
      DOM.shoppingItemsList.innerHTML = `
        <li style="padding: 30px; text-align: center; color: var(--text-ink-muted);">
          Daftar belanja masih kosong. Klik 'Beli Bahan' di halaman resep untuk mencatatnya.
        </li>
      `;
    } else {
      state.shoppingList.forEach((item, idx) => {
        const li = document.createElement('li');
        li.style.cssText = 'display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--page-border);font-size:0.86rem;';
        li.innerHTML = `
          <input type="checkbox" id="shopItem-${idx}" ${item.checked ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--mango-primary);cursor:pointer;">
          <label for="shopItem-${idx}" style="flex:1;cursor:pointer;${item.checked ? 'text-decoration:line-through;color:var(--text-ink-light);' : ''}">${escapeHTML(item.text)}</label>
          <button type="button" style="background:transparent;border:none;color:var(--text-ink-muted);font-size:1.2rem;cursor:pointer;">&times;</button>
        `;

        const checkbox = li.querySelector('input');
        checkbox.addEventListener('change', () => {
          item.checked = checkbox.checked;
          localStorage.setItem('mango_book_shopping', JSON.stringify(state.shoppingList));
          openShoppingDrawer();
        });

        const delBtn = li.querySelector('button');
        delBtn.addEventListener('click', () => {
          state.shoppingList.splice(idx, 1);
          localStorage.setItem('mango_book_shopping', JSON.stringify(state.shoppingList));
          updateBadgeCounts();
          openShoppingDrawer();
        });

        DOM.shoppingItemsList.appendChild(li);
      });
    }

    if (DOM.shoppingDrawerOverlay) {
      DOM.shoppingDrawerOverlay.classList.add('is-open');
      DOM.shoppingDrawerOverlay.setAttribute('aria-hidden', 'false');
    }
  }

  function shareShoppingViaWhatsApp() {
    if (state.shoppingList.length === 0) {
      showToast('Daftar belanja masih kosong.');
      return;
    }
    let text = '*DAFTAR BELANJA RESEP ALL MANGGO*\n\n';
    state.shoppingList.forEach((item, idx) => {
      text += `${idx + 1}. ${item.checked ? '[v] ' : '[ ] '} ${item.text}\n`;
    });
    text += '\n_Dibuat dengan Buku Resep All Manggo_';
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function clearShoppingList() {
    if (confirm('Yakin ingin mengosongkan seluruh daftar belanja?')) {
      state.shoppingList = [];
      localStorage.setItem('mango_book_shopping', JSON.stringify(state.shoppingList));
      updateBadgeCounts();
      openShoppingDrawer();
      showToast('Daftar belanja telah dikosongkan.');
    }
  }

  function updateBadgeCounts() {
    const bCount = state.bookmarks.length;
    if (DOM.bookmarkCountBadge) DOM.bookmarkCountBadge.textContent = bCount;

    const sCount = state.shoppingList.length;
    if (DOM.shoppingCountBadge) DOM.shoppingCountBadge.textContent = sCount;
  }

  function closeAllDrawers() {
    if (DOM.tocDrawerOverlay) DOM.tocDrawerOverlay.classList.remove('is-open');
    if (DOM.bookmarksDrawerOverlay) DOM.bookmarksDrawerOverlay.classList.remove('is-open');
    if (DOM.shoppingDrawerOverlay) DOM.shoppingDrawerOverlay.classList.remove('is-open');
    if (DOM.searchQuickResults) DOM.searchQuickResults.style.display = 'none';
  }

  // ===================================================================
  // KITCHEN TIMER ON RECIPE PAGE
  // ===================================================================
  window.startTimerPreset = function (minutes) {
    if (state.timer.interval) clearInterval(state.timer.interval);
    state.timer.remainingSeconds = minutes * 60;
    state.timer.isRunning = true;
    playPageFlipSound();
    showToast(`Timer dapur ${minutes} menit dimulai!`);

    state.timer.interval = setInterval(() => {
      if (state.timer.remainingSeconds > 0) {
        state.timer.remainingSeconds--;
      } else {
        clearInterval(state.timer.interval);
        state.timer.isRunning = false;
        playChimeSound();
        showToast('Waktu memasak langkah ini telah selesai!');
      }
    }, 1000);
  };

  // ===================================================================
  // HANDS-FREE COOK MODE OVERLAY
  // ===================================================================
  window.launchCookMode = async function () {
    const r = state.cookMode.currentRecipe;
    if (!r) return;

    state.cookMode.currentStepIdx = 0;
    if (DOM.cookModeDishTitle) DOM.cookModeDishTitle.textContent = r.title;

    if ('wakeLock' in navigator) {
      try {
        state.cookMode.wakeLock = await navigator.wakeLock.request('screen');
        if (DOM.wakeLockStatus) DOM.wakeLockStatus.style.display = 'inline-flex';
      } catch (err) {}
    }

    renderCookModeStep();
    populateCookIngredientsSheet();

    if (DOM.cookModeOverlay) {
      DOM.cookModeOverlay.classList.add('is-active');
      DOM.cookModeOverlay.setAttribute('aria-hidden', 'false');
    }
  };

  function renderCookModeStep() {
    const r = state.cookMode.currentRecipe;
    if (!r || !r.steps) return;

    const total = r.steps.length;
    const idx = state.cookMode.currentStepIdx;

    if (DOM.cookStepCounter) DOM.cookStepCounter.textContent = `Langkah ${idx + 1} dari ${total}`;
    if (DOM.cookProgressFill) DOM.cookProgressFill.style.width = `${((idx + 1) / total) * 100}%`;
    if (DOM.cookStepInstruction) DOM.cookStepInstruction.textContent = r.steps[idx];

    if (DOM.cookPrevStepBtn) {
      DOM.cookPrevStepBtn.disabled = idx === 0;
      DOM.cookPrevStepBtn.style.opacity = idx === 0 ? '0.4' : '1';
    }
    if (DOM.cookNextStepBtn) {
      DOM.cookNextStepBtn.innerHTML = idx === total - 1
        ? `<span>Selesai Memasak</span>`
        : `<span>Langkah Berikutnya</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    }
  }

  function closeCookMode() {
    if (state.cookMode.wakeLock) {
      state.cookMode.wakeLock.release().catch(() => {});
      state.cookMode.wakeLock = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (state.cookMode.timerInterval) {
      clearInterval(state.cookMode.timerInterval);
    }
    if (DOM.cookModeOverlay) {
      DOM.cookModeOverlay.classList.remove('is-active');
      DOM.cookModeOverlay.setAttribute('aria-hidden', 'true');
    }
  }

  function populateCookIngredientsSheet() {
    if (!state.cookMode.currentRecipe || !DOM.cookSheetIngredientsList) return;
    DOM.cookSheetIngredientsList.innerHTML = '';
    state.cookMode.currentRecipe.ingredients.forEach((ing, i) => {
      const li = document.createElement('li');
      li.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:0.9rem;padding:6px 0;border-bottom:1px solid var(--page-border);';
      li.innerHTML = `
        <input type="checkbox" id="cIng-${i}" style="width:18px;height:18px;accent-color:var(--mango-primary);cursor:pointer;">
        <label for="cIng-${i}" style="flex:1;cursor:pointer;"><strong>${ing.amount || ''} ${ing.unit || ''}</strong> ${escapeHTML(ing.name)}</label>
      `;
      DOM.cookSheetIngredientsList.appendChild(li);
    });
  }

  // ===================================================================
  // SEARCH SYSTEM (AUTOCOMPLETE & QUICK JUMP)
  // ===================================================================
  function handleSearchInput(query) {
    if (!query || query.trim().length === 0) {
      if (DOM.searchQuickResults) DOM.searchQuickResults.style.display = 'none';
      if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';
      return;
    }

    if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'block';
    const q = query.toLowerCase().trim();
    const matches = state.allRecipes.filter(r => r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)).slice(0, 8);

    if (!DOM.searchQuickResults) return;
    DOM.searchQuickResults.innerHTML = '';

    if (matches.length === 0) {
      DOM.searchQuickResults.innerHTML = `
        <div style="padding: 12px; text-align: center; color: var(--book-gold); font-size: 0.82rem;">
          Resep tidak ditemukan. Coba kata kunci lain.
        </div>
      `;
    } else {
      matches.forEach(r => {
        const row = document.createElement('div');
        row.className = 'search-result-row';
        row.innerHTML = `
          <img src="${r.image}" class="search-result-thumb" alt="${escapeHTML(r.title)}">
          <div class="search-result-info">
            <div class="search-result-title">${escapeHTML(r.title)}</div>
            <div class="search-result-meta">${r.categoryLabel} • ${r.totalMinutes} mnt</div>
          </div>
          <span class="search-result-page-badge">Hal. ${r.pageLeft}</span>
        `;
        row.addEventListener('click', () => {
          DOM.searchQuickResults.style.display = 'none';
          if (DOM.globalBookSearch) DOM.globalBookSearch.value = '';
          goToSpread(r.spreadIndex);
        });
        DOM.searchQuickResults.appendChild(row);
      });
    }

    DOM.searchQuickResults.style.display = 'block';
  }

  // ===================================================================
  // THEME & SOUND CONTROLS
  // ===================================================================
  function applyTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('mango_theme', themeName);

    const sunSvg = document.querySelector('.sun-svg');
    const moonSvg = document.querySelector('.moon-svg');
    if (sunSvg && moonSvg) {
      sunSvg.style.display = themeName === 'dark' ? 'block' : 'none';
      moonSvg.style.display = themeName === 'dark' ? 'none' : 'block';
    }
  }

  function updateSoundUI() {
    const onSvg = document.querySelector('.sound-on-svg');
    const offSvg = document.querySelector('.sound-off-svg');
    if (onSvg && offSvg) {
      onSvg.style.display = state.soundEnabled ? 'block' : 'none';
      offSvg.style.display = state.soundEnabled ? 'none' : 'block';
    }
  }

  // Toast Notification
  function showToast(message) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ===================================================================
  // EVENT LISTENERS SETUP
  // ===================================================================
  function setupEventListeners() {
    // Open cover
    if (DOM.btnOpenCover) DOM.btnOpenCover.addEventListener('click', () => goToSpread(1));
    if (DOM.brandCoverBtn) DOM.brandCoverBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSpread(0);
    });
    if (DOM.coverJumpTocBtn) DOM.coverJumpTocBtn.addEventListener('click', () => goToSpread(2));
    if (DOM.coverRandomBtn) DOM.coverRandomBtn.addEventListener('click', () => {
      const randIdx = Math.floor(Math.random() * state.allRecipes.length);
      goToSpread(randIdx + 3);
    });

    // Flip Corners & Dock Navigation
    if (DOM.prevCornerClick) DOM.prevCornerClick.addEventListener('click', prevSpread);
    if (DOM.nextCornerClick) DOM.nextCornerClick.addEventListener('click', nextSpread);

    // Dock Nav Buttons
    if (DOM.dockPrevBtn) DOM.dockPrevBtn.addEventListener('click', prevSpread);
    if (DOM.dockNextBtn) DOM.dockNextBtn.addEventListener('click', nextSpread);
    if (DOM.dockQuickTocBtn) DOM.dockQuickTocBtn.addEventListener('click', openTocDrawer);

    // Drawers
    if (DOM.btnToggleToc) DOM.btnToggleToc.addEventListener('click', openTocDrawer);
    if (DOM.closeTocDrawerBtn) DOM.closeTocDrawerBtn.addEventListener('click', closeAllDrawers);
    if (DOM.tocDrawerOverlay) DOM.tocDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.tocDrawerOverlay) closeAllDrawers();
    });

    if (DOM.btnToggleBookmarks) DOM.btnToggleBookmarks.addEventListener('click', openBookmarksDrawer);
    if (DOM.closeBookmarksDrawerBtn) DOM.closeBookmarksDrawerBtn.addEventListener('click', closeAllDrawers);
    if (DOM.bookmarksDrawerOverlay) DOM.bookmarksDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.bookmarksDrawerOverlay) closeAllDrawers();
    });

    if (DOM.btnToggleShopping) DOM.btnToggleShopping.addEventListener('click', openShoppingDrawer);
    if (DOM.closeShoppingDrawerBtn) DOM.closeShoppingDrawerBtn.addEventListener('click', closeAllDrawers);
    if (DOM.shoppingDrawerOverlay) DOM.shoppingDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.shoppingDrawerOverlay) closeAllDrawers();
    });
    if (DOM.shareShoppingWhatsappBtn) DOM.shareShoppingWhatsappBtn.addEventListener('click', shareShoppingViaWhatsApp);
    if (DOM.clearShoppingListBtn) DOM.clearShoppingListBtn.addEventListener('click', clearShoppingList);

    // Audio & Theme Toggles
    if (DOM.btnToggleSound) {
      DOM.btnToggleSound.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        localStorage.setItem('mango_sound', state.soundEnabled);
        updateSoundUI();
        showToast(`Suara lembaran kertas ${state.soundEnabled ? 'diaktifkan' : 'dinonaktifkan'}.`);
      });
    }

    if (DOM.btnToggleTheme) {
      DOM.btnToggleTheme.addEventListener('click', () => {
        const next = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(next);
        showToast(`Mode baca ${next === 'light' ? 'Ruang Baca Terang' : 'Suasana Malam'} diaktifkan.`);
      });
    }

    // Search Events
    if (DOM.globalBookSearch) {
      DOM.globalBookSearch.addEventListener('input', (e) => handleSearchInput(e.target.value));
    }
    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', () => {
        if (DOM.globalBookSearch) DOM.globalBookSearch.value = '';
        handleSearchInput('');
      });
    }

    if (DOM.mobileBookSearch) {
      DOM.mobileBookSearch.addEventListener('input', (e) => handleSearchInput(e.target.value));
    }
    if (DOM.mobileClearSearchBtn) {
      DOM.mobileClearSearchBtn.addEventListener('click', () => {
        if (DOM.mobileBookSearch) DOM.mobileBookSearch.value = '';
        handleSearchInput('');
      });
    }

    // TOC Category Filters & Search
    document.querySelectorAll('.drawer-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.drawer-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-cat');
        const q = DOM.tocSearchInput ? DOM.tocSearchInput.value : '';
        populateTableOfContentsDrawer(cat, q);
      });
    });

    if (DOM.tocSearchInput) {
      DOM.tocSearchInput.addEventListener('input', (e) => {
        const activePill = document.querySelector('.drawer-cat-pill.active');
        const cat = activePill ? activePill.getAttribute('data-cat') : 'all';
        populateTableOfContentsDrawer(cat, e.target.value);
      });
    }

    // Cook Mode Events
    if (DOM.closeCookModeBtn) DOM.closeCookModeBtn.addEventListener('click', closeCookMode);
    if (DOM.cookNextStepBtn) {
      DOM.cookNextStepBtn.addEventListener('click', () => {
        const r = state.cookMode.currentRecipe;
        if (!r || !r.steps) return;
        if (state.cookMode.currentStepIdx < r.steps.length - 1) {
          state.cookMode.currentStepIdx++;
          renderCookModeStep();
        } else {
          showToast('Selamat! Hidangan mangga Anda selesai dimasak.');
          closeCookMode();
        }
      });
    }
    if (DOM.cookPrevStepBtn) {
      DOM.cookPrevStepBtn.addEventListener('click', () => {
        if (state.cookMode.currentStepIdx > 0) {
          state.cookMode.currentStepIdx--;
          renderCookModeStep();
        }
      });
    }
    if (DOM.btnSpeakStep) {
      DOM.btnSpeakStep.addEventListener('click', () => {
        if (!('speechSynthesis' in window)) {
          showToast('Fitur suara bacakan belum didukung browser ini.');
          return;
        }
        const r = state.cookMode.currentRecipe;
        if (!r || !r.steps) return;
        const text = r.steps[state.cookMode.currentStepIdx] || '';
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'id-ID';
        if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Membacakan...';
        utter.onend = () => { if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Bacakan'; };
        utter.onerror = () => { if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Bacakan'; };
        window.speechSynthesis.speak(utter);
      });
    }
    if (DOM.btnToggleCookIngredients) {
      DOM.btnToggleCookIngredients.addEventListener('click', () => {
        if (DOM.cookIngredientsSheet) DOM.cookIngredientsSheet.classList.toggle('is-open');
      });
    }
    if (DOM.closeCookIngredientsSheet) {
      DOM.closeCookIngredientsSheet.addEventListener('click', () => {
        if (DOM.cookIngredientsSheet) DOM.cookIngredientsSheet.classList.remove('is-open');
      });
    }

    // Keyboard Shortcuts (Arrow Left/Right to flip pages, Esc to close drawers)
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSpread();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSpread();
      } else if (e.key === 'Escape') {
        closeAllDrawers();
        closeCookMode();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (DOM.globalBookSearch) {
          DOM.globalBookSearch.focus();
          DOM.globalBookSearch.select();
        }
      }
    });

    // Touch Swipe Gestures for Mobile & Tablets
    let touchStartX = 0;
    let touchEndX = 0;
    const stage = document.getElementById('bookStage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 50) {
          if (diff < 0) {
            nextSpread(); // Swipe left -> Next Page
          } else {
            prevSpread(); // Swipe right -> Prev Page
          }
        }
      }, { passive: true });
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
