/**
 * RESEP ALL MANGGO - Cookpad-Style Application Script
 * Interactive culinary encyclopedia for 1,000 mango recipes with Cookpad UX.
 */

(function () {
  'use strict';

  // Category mapping helper (20 Comprehensive Culinary Sections)
  const CATEGORY_MAP = {
    'Olahan Simpel & Harian': 'simpel',
    'Minuman Kekinian & Segar': 'minuman',
    'Resep Daerah & Nusantara': 'nusantara',
    'Hidangan Asia': 'asia',
    'Hidangan Barat & Latin': 'barat',
    'Pastry & Dessert Internasional': 'pastry',
    'Eksplorasi Nusantara Lanjutan': 'nusantara-lanjutan',
    'Khazanah Mangga Anak Benua India, Pakistan & Sri Lanka': 'anak-benua',
    'Asia Tenggara & Asia Timur Lanjutan': 'asia-lanjutan',
    'Kuliner Meksiko, Amerika Latin, Karibia & Afrika': 'latin-afrika',
    'Hidangan Gurih Modern, Fusion & Fine Dining': 'fusion-finedining',
    'Pastry, Kue, Cokelat & Dessert Kreatif Lanjutan': 'pastry-kreatif',
    'Minuman Spesial, Fermentasi, Bumbu & Pengawetan': 'minuman-fermentasi',
    'MPASI, Makanan Anak & Camilan Keluarga': 'mpasi-anak',
    'Diet Sehat, Vegan, Keto, Paleo & Superfood Bowls': 'diet-sehat',
    'Jajanan Kaki Lima Dunia & Gorengan Kreatif': 'streetfood',
    'Masakan Rumahan & Tradisional Lintas Daerah': 'rumahan-tradisional',
    'Artisan Gelato, Es Krim, Sorbet & Kreasi Beku': 'gelato-eskrim',
    'Kopi, Teh, Mocktail & Barista Kreasi': 'kopi-mocktail',
    'Molecular Gastronomy, Fermentasi Eksperimental & Zero-Waste Mangga': 'molecular-zerowaste',
    'simpel': 'simpel',
    'minuman': 'minuman',
    'nusantara': 'nusantara',
    'asia': 'asia',
    'barat': 'barat',
    'pastry': 'pastry',
    'nusantara-lanjutan': 'nusantara-lanjutan',
    'anak-benua': 'anak-benua',
    'asia-lanjutan': 'asia-lanjutan',
    'latin-afrika': 'latin-afrika',
    'fusion-finedining': 'fusion-finedining',
    'pastry-kreatif': 'pastry-kreatif',
    'minuman-fermentasi': 'minuman-fermentasi',
    'mpasi-anak': 'mpasi-anak',
    'diet-sehat': 'diet-sehat',
    'streetfood': 'streetfood',
    'rumahan-tradisional': 'rumahan-tradisional',
    'gelato-eskrim': 'gelato-eskrim',
    'kopi-mocktail': 'kopi-mocktail',
    'molecular-zerowaste': 'molecular-zerowaste'
  };

  // High-Resolution Food Photography Category Images
  const CATEGORY_IMAGES = {
    'minuman': 'assets/images/cat-minuman.jpg',
    'nusantara': 'assets/images/cat-nusantara.jpg',
    'asia': 'assets/images/cat-asia.jpg',
    'pastry': 'assets/images/cat-pastry.jpg',
    'simpel': 'assets/images/cat-simpel.jpg',
    'barat': 'assets/images/cat-barat.jpg',
    'nusantara-lanjutan': 'assets/images/cat-nusantara.jpg',
    'anak-benua': 'assets/images/cat-asia.jpg',
    'asia-lanjutan': 'assets/images/cat-asia.jpg',
    'latin-afrika': 'assets/images/cat-barat.jpg',
    'fusion-finedining': 'assets/images/cat-barat.jpg',
    'pastry-kreatif': 'assets/images/cat-pastry.jpg',
    'minuman-fermentasi': 'assets/images/cat-minuman.jpg',
    'mpasi-anak': 'assets/images/cat-simpel.jpg',
    'diet-sehat': 'assets/images/cat-simpel.jpg',
    'streetfood': 'assets/images/cat-nusantara.jpg',
    'rumahan-tradisional': 'assets/images/cat-nusantara.jpg',
    'gelato-eskrim': 'assets/images/cat-pastry.jpg',
    'kopi-mocktail': 'assets/images/cat-minuman.jpg',
    'molecular-zerowaste': 'assets/images/cat-pastry.jpg'
  };

  function getCategoryKey(cat) {
    if (!cat) return 'simpel';
    if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
    const lower = cat.toLowerCase();
    for (const [name, key] of Object.entries(CATEGORY_MAP)) {
      if (lower.includes(name.toLowerCase()) || lower.includes(key.toLowerCase())) {
        return key;
      }
    }
    return 'simpel';
  }

  function normalizeRecipe(r) {
    const catKey = r.categoryKey || getCategoryKey(r.category);
    return {
      id: r.id,
      title: r.title || r.name || 'Resep Olahan Mangga',
      author: r.author || 'Dapur Kreasi',
      name: r.title || r.name || 'Resep Olahan Mangga',
      desc: r.desc || r.summary || '',
      summary: r.desc || r.summary || '',
      category: r.category || 'Olahan Simpel & Harian',
      categoryKey: catKey,
      image: r.image || CATEGORY_IMAGES[catKey] || 'assets/images/cat-minuman.jpg',
      icon: r.icon || r.emoji || '',
      emoji: r.icon || r.emoji || '',
      prepTime: r.prepTime || '10 menit',
      cookTime: r.cookTime || '15 menit',
      totalMinutes: typeof r.totalMinutes === 'number' ? r.totalMinutes : 15,
      servings: r.servings || 2,
      difficulty: r.difficulty || 'Mudah',
      calories: r.calories || '165 kkal',
      mangoType: r.mangoType || 'Harum Manis Matang',
      tips: r.tips || r.chefTips || 'Pilih mangga berkualitas matang pohon untuk hasil rasa terbaik.',
      chefTips: r.tips || r.chefTips || 'Pilih mangga berkualitas matang pohon untuk hasil rasa terbaik.',
      tags: Array.isArray(r.tags) ? r.tags : [],
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      steps: Array.isArray(r.steps) ? r.steps : []
    };
  }

  // Application State
  const state = {
    allRecipes: [],
    filteredRecipes: [],
    displayedCount: 24,
    currentCategory: 'all',
    searchQuery: '',
    difficultyFilter: 'all',
    timeFilter: 'all',
    sortBy: 'default',
    currentRecipe: null,
    portionMultiplier: 1,
    checkedIngredients: new Set(),
    checkedSteps: new Set(),
    favorites: JSON.parse(localStorage.getItem('mango_favorites') || '[]'),
    shoppingList: JSON.parse(localStorage.getItem('mango_shopping_list') || '[]'),
    theme: localStorage.getItem('mango_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    timer: {
      interval: null,
      remainingSeconds: 0,
      isRunning: false
    },
    cookMode: {
      currentStepIdx: 0,
      timerInterval: null,
      remainingSeconds: 0,
      isRunning: false,
      wakeLock: null
    }
  };

  // Kamus Mangga Knowledge Database
  const MANGO_VARIETIES = [
    {
      name: 'Harum Manis',
      origin: 'Probolinggo, Jawa Timur',
      sweetness: 'Sangat Manis (16-18° Brix)',
      texture: 'Daging tebal, sangat lembut, nyaris tanpa serat, aroma wangi legit khas tropis.',
      bestFor: 'Jus kental, Panna Cotta, Mango Sticky Rice, Cheesecake, Smoothie Bowl.'
    },
    {
      name: 'Gedong Gincu',
      origin: 'Cirebon & Majalengka',
      sweetness: 'Manis Segar (14-16° Brix)',
      texture: 'Kulit merah keemasan memikat, serat halus kenyal, rasa manis asam segar eksotis.',
      bestFor: 'Mocktail kafe, Mango Mojito, Saus Asam Manis Gurame, Sorbet, Es Lilin.'
    },
    {
      name: 'Manalagi',
      origin: 'Situbondo, Jawa Timur',
      sweetness: 'Manis Gurih (15-17° Brix)',
      texture: 'Daging padat, renyah saat mengkal, rasa manis terasa kuat walau masih agak hijau.',
      bestFor: 'Rujak Buah Serut, Asinan Mangga, Setup Kayu Manis, Topping Oatmeal.'
    },
    {
      name: 'Indramayu (Cengkir)',
      origin: 'Indramayu, Jawa Barat',
      sweetness: 'Asam Segar Renyah (11-13° Brix)',
      texture: 'Sangat tebal, renyah keras berderak (crunchy), kadar air sedang, serat minimal.',
      bestFor: 'Sambal Pencit, Sambal Matah, Acar Mangga, Rujak Cuka, Keripik Oven.'
    },
    {
      name: 'Golek',
      origin: 'Pasuruan & Probolinggo',
      sweetness: 'Manis Berair (13-15° Brix)',
      texture: 'Bentuk lonjong panjang, tidak berserat, berair banyak dan manis legit saat matang.',
      bestFor: 'Puding Susu, Selai Roti Homemade, Es Campur, Lapis Tepung Beras.'
    },
    {
      name: 'Nam Dok Mai',
      origin: 'Thailand',
      sweetness: 'Sangat Manis Legit (17-19° Brix)',
      texture: 'Biji sangat tipis, daging kuning emas berkilau, tekstur silky meleleh di lidah.',
      bestFor: 'Khao Niew Mamuang (Mango Sticky Rice), Mango Pillow Crepes, Mango Tart.'
    },
    {
      name: 'Alphonso',
      origin: 'India (Ratnagiri)',
      sweetness: 'Super Legit (18-20° Brix)',
      texture: 'Dikenal sebagai "Raja Mangga Dunia". Daging oranye pekat, aroma saffron alami.',
      bestFor: 'Aamras dengan Poori, Mango Kulfi, Mango Lassi Kafe, Mango Shrikhand.'
    },
    {
      name: 'Carabao (Manila Mango)',
      origin: 'Filipina',
      sweetness: 'Super Manis (Guinness World Records)',
      texture: 'Tercatat sebagai salah satu mangga termanis di dunia, aroma tropis tajam segar.',
      bestFor: 'Mango Float (Crema de Mangga), Mango Sago, Mango Pomelo Sago, Bingsu.'
    }
  ];

  // DOM Elements Cache
  const DOM = {
    html: document.documentElement,
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    heroSearchInput: document.getElementById('heroSearchInput'),
    heroSearchBtn: document.getElementById('heroSearchBtn'),
    mobileSearchInput: document.getElementById('mobileSearchInput'),
    mobileClearSearchBtn: document.getElementById('mobileClearSearchBtn'),
    categoryPills: document.querySelectorAll('.cat-pill'),
    activeCategoryHeading: document.getElementById('activeCategoryHeading'),
    resultsCountText: document.getElementById('resultsCountText'),
    difficultyFilter: document.getElementById('difficultyFilter'),
    timeFilter: document.getElementById('timeFilter'),
    sortSelect: document.getElementById('sortSelect'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    recipeGrid: document.getElementById('recipeGrid'),
    emptyState: document.getElementById('emptyState'),
    emptyResetBtn: document.getElementById('emptyResetBtn'),
    loadMoreContainer: document.getElementById('loadMoreContainer'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    
    // App View Switcher & Shelves
    btnViewHome: document.getElementById('btnViewHome'),
    btnViewCatalog: document.getElementById('btnViewCatalog'),
    homeViewContainer: document.getElementById('homeViewContainer'),
    catalogViewContainer: document.getElementById('catalogViewContainer'),
    
    // Action Badges & Buttons
    favoritesCountBadge: document.getElementById('favoritesCountBadge'),
    shoppingCountBadge: document.getElementById('shoppingCountBadge'),
    mobFavBadge: document.getElementById('mobFavBadge'),
    mobShopBadge: document.getElementById('mobShopBadge'),
    openFavoritesBtn: document.getElementById('openFavoritesBtn'),
    openShoppingListBtn: document.getElementById('openShoppingListBtn'),
    openMangoGuideBtn: document.getElementById('openMangoGuideBtn'),
    spotlightGuideBtn: document.getElementById('spotlightGuideBtn'),
    footerMangoGuideLink: document.getElementById('footerMangoGuideLink'),
    footerRandomLink: document.getElementById('footerRandomLink'),
    footerShoppingLink: document.getElementById('footerShoppingLink'),
    footerFavoritesLink: document.getElementById('footerFavoritesLink'),
    randomRecipeBtn: document.getElementById('randomRecipeBtn'),
    heroRandomBtn: document.getElementById('heroRandomBtn'),
    exploreAllBtn: document.getElementById('exploreAllBtn'),
    
    // Hero Spotlight
    heroCookNowBtn: document.getElementById('heroCookNowBtn'),
    heroSaveDishBtn: document.getElementById('heroSaveDishBtn'),
    heroDishTitle: document.getElementById('heroDishTitle'),
    heroDishImg: document.getElementById('heroDishImg'),
    
    // Recipe Detail Modal Elements
    recipeModalOverlay: document.getElementById('recipeModalOverlay'),
    modalCoverImage: document.getElementById('modalCoverImage'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCategoryBadge: document.getElementById('modalCategoryBadge'),
    modalDifficulty: document.getElementById('modalDifficulty'),
    modalRecipeTitle: document.getElementById('modalRecipeTitle'),
    modalSummary: document.getElementById('modalSummary'),
    modalPrepTime: document.getElementById('modalPrepTime'),
    modalCookTime: document.getElementById('modalCookTime'),
    modalCalories: document.getElementById('modalCalories'),
    modalMangoType: document.getElementById('modalMangoType'),
    modalServingsDisplay: document.getElementById('modalServingsDisplay'),
    modalIngredientsList: document.getElementById('modalIngredientsList'),
    modalStepsList: document.getElementById('modalStepsList'),
    modalChefTipsText: document.getElementById('modalChefTipsText'),
    modalTagsContainer: document.getElementById('modalTagsContainer'),
    modalFavoriteBtn: document.getElementById('modalFavoriteBtn'),
    btnLaunchCookMode: document.getElementById('btnLaunchCookMode'),
    modalAddShoppingBtn: document.getElementById('modalAddShoppingBtn'),
    modalAddAllIngBtn: document.getElementById('modalAddAllIngBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    modalPrintBtn: document.getElementById('modalPrintBtn'),
    scalerBtns: document.querySelectorAll('.scaler-btn'),
    modalRelatedCardsGrid: document.getElementById('modalRelatedCardsGrid'),
    
    // Hands-Free Kitchen Cook Mode Elements
    cookModeOverlay: document.getElementById('cookModeOverlay'),
    closeCookModeBtn: document.getElementById('closeCookModeBtn'),
    cookModeDishTitle: document.getElementById('cookModeDishTitle'),
    cookStepCounter: document.getElementById('cookStepCounter'),
    cookStepInstruction: document.getElementById('cookStepInstruction'),
    cookProgressFill: document.getElementById('cookProgressFill'),
    cookPrevStepBtn: document.getElementById('cookPrevStepBtn'),
    cookNextStepBtn: document.getElementById('cookNextStepBtn'),
    btnSpeakStep: document.getElementById('btnSpeakStep'),
    speakBtnText: document.getElementById('speakBtnText'),
    btnStepTimer: document.getElementById('btnStepTimer'),
    stepTimerBtnText: document.getElementById('stepTimerBtnText'),
    stepActiveTimerCard: document.getElementById('stepActiveTimerCard'),
    stepTimerDisplay: document.getElementById('stepTimerDisplay'),
    btnStepTimerPause: document.getElementById('btnStepTimerPause'),
    btnStepTimerReset: document.getElementById('btnStepTimerReset'),
    wakeLockStatus: document.getElementById('wakeLockStatus'),
    btnToggleCookIngredients: document.getElementById('btnToggleCookIngredients'),
    closeCookIngredientsSheet: document.getElementById('closeCookIngredientsSheet'),
    cookIngredientsSheet: document.getElementById('cookIngredientsSheet'),
    cookSheetIngredientsList: document.getElementById('cookSheetIngredientsList'),
    
    // Timer Widget
    kitchenTimerWidget: document.getElementById('kitchenTimerWidget'),
    timerDisplay: document.getElementById('timerDisplay'),
    timerStartBtn: document.getElementById('timerStartBtn'),
    timerResetBtn: document.getElementById('timerResetBtn'),
    timerPresetBtns: document.querySelectorAll('.timer-preset-btn'),

    // Favorites Drawer
    favoritesModalOverlay: document.getElementById('favoritesModalOverlay'),
    closeFavoritesModalBtn: document.getElementById('closeFavoritesModalBtn'),
    favoritesListContainer: document.getElementById('favoritesListContainer'),

    // Shopping List Drawer
    shoppingModalOverlay: document.getElementById('shoppingModalOverlay'),
    closeShoppingModalBtn: document.getElementById('closeShoppingModalBtn'),
    shoppingItemsList: document.getElementById('shoppingItemsList'),
    shareShoppingWhatsappBtn: document.getElementById('shareShoppingWhatsappBtn'),
    clearShoppingListBtn: document.getElementById('clearShoppingListBtn'),

    // Kamus Mangga Modal
    mangoGuideModalOverlay: document.getElementById('mangoGuideModalOverlay'),
    closeMangoGuideModalBtn: document.getElementById('closeMangoGuideModalBtn'),
    mangoVarietiesGrid: document.getElementById('mangoVarietiesGrid'),

    // Random Modal
    randomRecipeModalOverlay: document.getElementById('randomRecipeModalOverlay'),
    closeRandomModalBtn: document.getElementById('closeRandomModalBtn'),
    randomDiceIcon: document.getElementById('randomDiceIcon'),
    randomResultTitle: document.getElementById('randomResultTitle'),
    randomResultDesc: document.getElementById('randomResultDesc'),
    openRandomRecipeDetailBtn: document.getElementById('openRandomRecipeDetailBtn'),
    rollAgainBtn: document.getElementById('rollAgainBtn'),

    // Mobile Bottom Nav
    mobNavHome: document.getElementById('mobNavHome'),
    mobNavCat: document.getElementById('mobNavCat'),
    mobNavRandom: document.getElementById('mobNavRandom'),
    mobNavFav: document.getElementById('mobNavFav'),
    mobNavShop: document.getElementById('mobNavShop'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  function on(el, evt, handler) {
    if (el) el.addEventListener(evt, handler);
  }

  // ===================================================================
  // INITIALIZATION
  // ===================================================================
  function init() {
    applyTheme(state.theme);
    loadRecipeData();
    setupEventListeners();
    updateBadges();
    populateMangoGuide();
  }

  function applyTheme(theme) {
    state.theme = theme;
    if (DOM.html) DOM.html.setAttribute('data-theme', theme);
    localStorage.setItem('mango_theme', theme);
  }

  function loadRecipeData() {
    if (window.MANGO_RECIPES && Array.isArray(window.MANGO_RECIPES) && window.MANGO_RECIPES.length > 0) {
      state.allRecipes = window.MANGO_RECIPES.map(normalizeRecipe);
      finalizeLoadedRecipes();
    } else {
      fetch('data/recipes.json')
        .then(res => res.json())
        .then(data => {
          state.allRecipes = data.map(normalizeRecipe);
          finalizeLoadedRecipes();
        })
        .catch(err => {
          console.error('Gagal memuat recipes.json:', err);
          showToast('Gagal memuat data resep. Pastikan koneksi atau file lokal aktif.');
        });
    }
  }

  function finalizeLoadedRecipes() {
    updateCategoryCounts();
    populateHomeShelves();
    applyFilters();
  }

  // App View Switcher (Beranda Shelves vs Katalog 1.000 Resep)
  function switchAppView(viewName) {
    const isHome = viewName === 'home';
    if (DOM.btnViewHome) DOM.btnViewHome.classList.toggle('active', isHome);
    if (DOM.btnViewCatalog) DOM.btnViewCatalog.classList.toggle('active', !isHome);
    if (DOM.homeViewContainer) DOM.homeViewContainer.classList.toggle('active', isHome);
    if (DOM.catalogViewContainer) DOM.catalogViewContainer.classList.toggle('active', !isHome);
  }
  window.switchAppView = switchAppView;

  // Populate Curated Feed Shelves (Structured & Elegant, No Overwhelming Dump)
  function populateHomeShelves() {
    if (!state.allRecipes || state.allRecipes.length === 0) return;

    // 1. Featured Top Picks: 6 standout recipes
    const featuredKeywords = ['King Mango Thai', 'Sticky Rice', 'Sambal Pencit', 'Mango Sago', 'Cheesecake', 'Puding Mangga Silky', 'Crepes'];
    let featured = state.allRecipes.filter(r => featuredKeywords.some(kw => r.title.toLowerCase().includes(kw.toLowerCase())));
    if (featured.length < 6) {
      featured = state.allRecipes.slice(0, 6);
    } else {
      featured = featured.slice(0, 6);
    }
    renderShelf('shelfFeatured', featured);

    // 2. Minuman Kafe & Segar: 6 drinks
    const drinks = state.allRecipes.filter(r => r.categoryKey === 'minuman').slice(0, 6);
    renderShelf('shelfMinuman', drinks);

    // 3. Sambal & Nusantara: 6 dishes
    const nusantara = state.allRecipes.filter(r => r.categoryKey === 'nusantara').slice(0, 6);
    renderShelf('shelfNusantara', nusantara);

    // 4. Street Food & Khas Asia: 6 dishes
    const asia = state.allRecipes.filter(r => r.categoryKey === 'asia').slice(0, 6);
    renderShelf('shelfAsia', asia);

    // 5. Pastry & Dessert: 6 dishes
    const pastry = state.allRecipes.filter(r => r.categoryKey === 'pastry').slice(0, 6);
    renderShelf('shelfPastry', pastry);

    // 6. Simpel & Cepat: 6 dishes
    const simpel = state.allRecipes.filter(r => r.categoryKey === 'simpel').slice(0, 6);
    renderShelf('shelfSimpel', simpel);
  }

  function renderShelf(containerId, recipes) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    recipes.forEach(recipe => {
      const card = createRecipeCardElement(recipe);
      fragment.appendChild(card);
    });
    container.appendChild(fragment);
  }

  function updateCategoryCounts() {
    const counts = { all: state.allRecipes.length };

    state.allRecipes.forEach(r => {
      const key = r.categoryKey;
      counts[key] = (counts[key] || 0) + 1;
    });

    for (const [cat, count] of Object.entries(counts)) {
      const countEl = document.getElementById(`count-${cat}`);
      if (countEl) countEl.textContent = count.toLocaleString('id-ID');
    }
  }

  // ===================================================================
  // FILTERING, SEARCHING & SORTING (COOKPAD STYLE)
  // ===================================================================
  function applyFilters() {
    let result = [...state.allRecipes];

    // Category filter
    if (state.currentCategory !== 'all') {
      result = result.filter(r => r.categoryKey === state.currentCategory);
    }


    // Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        const inTitle = r.title && r.title.toLowerCase().includes(q);
        const inDesc = r.desc && r.desc.toLowerCase().includes(q);
        const inMango = r.mangoType && r.mangoType.toLowerCase().includes(q);
        const inTags = r.tags && r.tags.some(t => t.toLowerCase().includes(q));
        const inIng = r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(q));
        return inTitle || inDesc || inMango || inTags || inIng;
      });
    }

    // Difficulty
    if (state.difficultyFilter !== 'all') {
      result = result.filter(r => r.difficulty === state.difficultyFilter);
    }

    // Time Filter
    if (state.timeFilter === 'quick') {
      result = result.filter(r => r.totalMinutes <= 15);
    } else if (state.timeFilter === 'medium') {
      result = result.filter(r => r.totalMinutes > 15 && r.totalMinutes <= 30);
    } else if (state.timeFilter === 'long') {
      result = result.filter(r => r.totalMinutes > 30);
    }

    // Sort By
    if (state.sortBy === 'time-asc') {
      result.sort((a, b) => a.totalMinutes - b.totalMinutes);
    } else if (state.sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'id'));
    } else if (state.sortBy === 'name-desc') {
      result.sort((a, b) => b.title.localeCompare(a.title, 'id'));
    } else if (state.sortBy === 'calories-asc') {
      result.sort((a, b) => parseInt(a.calories, 10) - parseInt(b.calories, 10));
    }

    state.filteredRecipes = result;
    state.displayedCount = 24; // Reset pagination batch

    updateFilterUI();
    renderRecipeGrid();
  }

  function updateFilterUI() {
    const categoryNames = {
      all: 'Semua Resep Olahan Mangga',
      simpel: 'Resep Simpel & Kilat',
      minuman: 'Minuman Kafe & Segar',
      nusantara: 'Resep Daerah & Nusantara',
      asia: 'Kuliner Khas Asia',
      barat: 'Western & Latin Mango',
      pastry: 'Pastry & Dessert Mewah',
      'nusantara-lanjutan': 'Eksplorasi Nusantara Lanjutan',
      'anak-benua': 'Khazanah Anak Benua India, Pakistan & Sri Lanka',
      'asia-lanjutan': 'Asia Tenggara & Asia Timur Lanjutan',
      'latin-afrika': 'Meksiko, Amerika Latin, Karibia & Afrika',
      'fusion-finedining': 'Hidangan Gurih Modern & Fine Dining',
      'pastry-kreatif': 'Pastry, Kue, Cokelat & Dessert Kreatif',
      'minuman-fermentasi': 'Minuman Spesial, Fermentasi & Bumbu',
      'mpasi-anak': 'MPASI, Makanan Anak & Camilan Keluarga',
      'diet-sehat': 'Diet Sehat, Vegan, Keto & Superfood',
      'streetfood': 'Jajanan Kaki Lima Dunia & Gorengan Kreatif',
      'rumahan-tradisional': 'Masakan Rumahan & Tradisional Lintas Daerah',
      'gelato-eskrim': 'Artisan Gelato, Es Krim & Kreasi Beku',
      'kopi-mocktail': 'Kopi, Teh, Mocktail & Barista Kreasi',
      'molecular-zerowaste': 'Molecular Gastronomy & Zero-Waste Mangga'
    };
    if (DOM.activeCategoryHeading) {
      DOM.activeCategoryHeading.textContent = categoryNames[state.currentCategory] || 'Koleksi Resep Olahan Mangga';
    }
    if (DOM.resultsCountText) {
      DOM.resultsCountText.textContent = `Menampilkan ${state.filteredRecipes.length} dari ${state.allRecipes.length} resep teruji`;
    }

    // Clear search buttons
    const hasSearch = state.searchQuery.trim().length > 0;
    if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = hasSearch ? 'flex' : 'none';
    if (DOM.mobileClearSearchBtn) DOM.mobileClearSearchBtn.style.display = hasSearch ? 'flex' : 'none';

    // Reset button visibility
    const isFiltered = state.currentCategory !== 'all' || hasSearch || state.difficultyFilter !== 'all' || state.timeFilter !== 'all' || state.sortBy !== 'default';
    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.style.display = isFiltered ? 'inline-flex' : 'none';
  }

  // Global helper for shelf action links and footer category navigation
  window.filterByCategory = function (category) {
    switchAppView('catalog');
    state.currentCategory = category;
    if (DOM.categoryPills) {
      DOM.categoryPills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === category);
      });
    }
    applyFilters();
    const catEl = document.getElementById('kategori');
    if (catEl) {
      catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ===================================================================
  // COOKPAD RECIPE GRID RENDERING
  // ===================================================================
  function renderRecipeGrid() {
    if (!DOM.recipeGrid) return;
    DOM.recipeGrid.innerHTML = '';

    if (state.filteredRecipes.length === 0) {
      if (DOM.emptyState) DOM.emptyState.style.display = 'block';
      if (DOM.loadMoreContainer) DOM.loadMoreContainer.style.display = 'none';
      return;
    }

    if (DOM.emptyState) DOM.emptyState.style.display = 'none';

    const slice = state.filteredRecipes.slice(0, state.displayedCount);

    const fragment = document.createDocumentFragment();
    slice.forEach(recipe => {
      const card = createRecipeCardElement(recipe);
      fragment.appendChild(card);
    });

    DOM.recipeGrid.appendChild(fragment);

    // Show or hide Load More button
    if (DOM.loadMoreContainer) {
      if (state.displayedCount < state.filteredRecipes.length) {
        DOM.loadMoreContainer.style.display = 'flex';
        if (DOM.loadMoreBtn) {
          DOM.loadMoreBtn.innerHTML = `<span>Muat Lebih Banyak (${state.filteredRecipes.length - state.displayedCount} resep tersisa)</span>`;
        }
      } else {
        DOM.loadMoreContainer.style.display = 'none';
      }
    }
  }

  // Create Authentic Cookpad Recipe Card
  function createRecipeCardElement(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-id', recipe.id);

    const isFav = state.favorites.includes(recipe.id);
    const photoUrl = recipe.image || CATEGORY_IMAGES[recipe.categoryKey] || 'assets/images/cat-minuman.jpg';

    // Extract top 3-4 ingredients for Cookpad's signature ingredients snippet
    let ingPreview = '';
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      ingPreview = recipe.ingredients.slice(0, 4).map(i => i.name).join(' • ');
    } else {
      ingPreview = 'Mangga • Bahan pelengkap dapur';
    }

    card.innerHTML = `
      <div class="card-thumb-frame">
        <img src="${photoUrl}" alt="${escapeHTML(recipe.title)}" class="card-thumb-img" loading="lazy" onerror="this.src='assets/images/cat-minuman.jpg'">
        <span class="card-cat-badge">${escapeHTML(recipe.category)}</span>
        <button type="button" class="card-fav-btn ${isFav ? 'is-favorite' : ''}" data-id="${recipe.id}" aria-label="Simpan Favorit" title="${isFav ? 'Hapus dari Tersimpan' : 'Simpan Resep'}">
          <svg class="fav-svg" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
        <span class="card-time-badge">${recipe.totalMinutes} mnt</span>
      </div>
      <div class="card-content">
        <div class="card-author-header">
          <span class="card-author-avatar-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span class="card-author-name">${escapeHTML(recipe.author || "Dapur Kreasi")}</span>
          <span class="card-author-dot">•</span>
          <span class="card-star-rating" title="Rating 4.9 dari 5">★ 4.9</span>
          <span class="card-author-dot">•</span>
          <span class="card-tested-tag">Teruji</span>
        </div>
        <h3 class="card-title">${escapeHTML(recipe.title)}</h3>
        <div class="card-ing-snippet" title="${escapeHTML(ingPreview)}">
          <span class="card-ing-text">${escapeHTML(ingPreview)}</span>
        </div>
        <div class="card-footer">
          <span class="card-diff-tag">${escapeHTML(recipe.difficulty)}</span>
          <span class="card-cal-tag">${escapeHTML(recipe.calories)}</span>
        </div>
      </div>
    `;

    // Click handler for card
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) {
        e.stopPropagation();
        toggleFavorite(recipe.id);
        const favBtn = card.querySelector('.card-fav-btn');
        const nowFav = state.favorites.includes(recipe.id);
        favBtn.classList.toggle('is-favorite', nowFav);
        const favSvg = favBtn.querySelector('.fav-svg');
        if (favSvg) favSvg.setAttribute('fill', nowFav ? 'currentColor' : 'none');
        return;
      }
      openRecipeModal(recipe);
    });

    return card;
  }

  // ===================================================================
  // COOKPAD RECIPE DETAIL MODAL
  // ===================================================================
  function openRecipeModal(recipe) {
    state.currentRecipe = recipe;
    state.portionMultiplier = 1;
    state.checkedIngredients.clear();
    state.checkedSteps.clear();

    const photoUrl = recipe.image || CATEGORY_IMAGES[recipe.categoryKey] || 'assets/images/cat-minuman.jpg';

    if (DOM.modalCoverImage) {
      DOM.modalCoverImage.src = photoUrl;
      DOM.modalCoverImage.alt = recipe.title;
    }
    if (DOM.modalCategoryBadge) DOM.modalCategoryBadge.textContent = recipe.category;
    const modalAuthorEl = document.getElementById('modalAuthorName');
    if (modalAuthorEl) {
      modalAuthorEl.innerHTML = `${escapeHTML(recipe.author || 'Dapur Kreasi')} <span class="cookpad-verified-badge">Resep Teruji</span>`;
    }
    if (DOM.modalDifficulty) DOM.modalDifficulty.textContent = recipe.difficulty;
    if (DOM.modalRecipeTitle) DOM.modalRecipeTitle.textContent = recipe.title;
    if (DOM.modalSummary) DOM.modalSummary.textContent = recipe.desc;

    if (DOM.modalPrepTime) DOM.modalPrepTime.textContent = recipe.prepTime;
    if (DOM.modalCookTime) DOM.modalCookTime.textContent = recipe.cookTime;
    if (DOM.modalCalories) DOM.modalCalories.textContent = recipe.calories;
    if (DOM.modalMangoType) DOM.modalMangoType.textContent = recipe.mangoType || 'Harum Manis Matang';

    // Scaler Buttons reset
    if (DOM.scalerBtns) {
      DOM.scalerBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-multiplier') === '1');
      });
    }

    renderModalIngredients();
    renderModalSteps();
    renderRelatedRecipes(recipe);
    updateModalFavoriteBtnState();

    // Chef tips & Tags
    if (DOM.modalChefTipsText) DOM.modalChefTipsText.textContent = recipe.tips || 'Pilih mangga berkualitas matang pohon untuk hasil rasa terbaik.';
    
    if (DOM.modalTagsContainer) {
      DOM.modalTagsContainer.innerHTML = '';
      if (recipe.tags && Array.isArray(recipe.tags)) {
        recipe.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tag-pill';
          tagSpan.textContent = tag;
          DOM.modalTagsContainer.appendChild(tagSpan);
        });
      }
    }

    renderRelatedRecipes(recipe);
    updateModalFavoriteBtnState();
    resetKitchenTimer();

    if (DOM.recipeModalOverlay) {
      DOM.recipeModalOverlay.classList.add('is-open');
      DOM.recipeModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';

    // Reset scroll of modal body to top
    const modalBody = document.getElementById('modalBody');
    if (modalBody) modalBody.scrollTop = 0;
  }

  function closeRecipeModal() {
    if (DOM.recipeModalOverlay) {
      DOM.recipeModalOverlay.classList.remove('is-open');
      DOM.recipeModalOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    state.currentRecipe = null;
    resetKitchenTimer();
  }

  function renderModalIngredients() {
    if (!state.currentRecipe || !DOM.modalIngredientsList) return;

    const recipe = state.currentRecipe;
    const mult = state.portionMultiplier;
    const baseServings = recipe.servings || 2;
    const scaledServings = Math.round(baseServings * mult);
    if (DOM.modalServingsDisplay) DOM.modalServingsDisplay.textContent = `(${scaledServings} Porsi)`;

    DOM.modalIngredientsList.innerHTML = '';

    recipe.ingredients.forEach((ing, index) => {
      const li = document.createElement('li');
      li.className = 'ingredient-item';
      if (state.checkedIngredients.has(index)) {
        li.classList.add('is-checked');
      }

      let scaledAmount = '';
      if (typeof ing.amount === 'number') {
        const val = ing.amount * mult;
        scaledAmount = formatAmount(val) + (ing.unit ? ' ' + ing.unit : '');
      } else if (typeof ing.amount === 'string' && !isNaN(parseFloat(ing.amount))) {
        const val = parseFloat(ing.amount) * mult;
        scaledAmount = formatAmount(val) + (ing.unit ? ' ' + ing.unit : '');
      } else {
        scaledAmount = (ing.amount || '') + (ing.unit ? ' ' + ing.unit : '');
      }

      const notes = ing.notes ? ` <span class="ing-notes">(${escapeHTML(ing.notes)})</span>` : '';

      li.innerHTML = `
        <span class="custom-checkbox">${state.checkedIngredients.has(index) ? '✓' : ''}</span>
        <span class="ingredient-text">
          <strong class="ingredient-amount">${scaledAmount}</strong> ${escapeHTML(ing.name)}${notes}
        </span>
      `;

      li.addEventListener('click', () => {
        if (state.checkedIngredients.has(index)) {
          state.checkedIngredients.delete(index);
          li.classList.remove('is-checked');
          li.querySelector('.custom-checkbox').textContent = '';
        } else {
          state.checkedIngredients.add(index);
          li.classList.add('is-checked');
          li.querySelector('.custom-checkbox').textContent = '✓';
        }
      });

      DOM.modalIngredientsList.appendChild(li);
    });
  }

  function renderModalSteps() {
    if (!state.currentRecipe || !DOM.modalStepsList) return;

    const steps = state.currentRecipe.steps || [];
    DOM.modalStepsList.innerHTML = '';

    steps.forEach((step, index) => {
      const li = document.createElement('li');
      li.className = 'step-item';
      if (state.checkedSteps.has(index)) {
        li.classList.add('is-checked');
      }

      // Check if step mentions minutes
      const match = step.match(/(\d+)\s*(?:-|–)?\s*(\d+)?\s*menit/i);
      let timerBtnHTML = '';
      if (match) {
        const mins = parseInt(match[1], 10);
        if (mins > 0 && mins <= 120) {
          timerBtnHTML = `
            <button type="button" class="btn-step-timer" data-sec="${mins * 60}" title="Mulai timer otomatis">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="display:inline-block;vertical-align:-1px;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Pasang Timer ${mins} Menit
            </button>
          `;
        }
      }

      li.innerHTML = `
        <span class="step-number">${state.checkedSteps.has(index) ? '✓' : (index + 1)}</span>
        <div class="step-content-wrap">
          <p class="step-text">${escapeHTML(step)}</p>
          ${timerBtnHTML}
        </div>
      `;

      // Step text click toggles completion
      const stepText = li.querySelector('.step-text');
      const stepNumber = li.querySelector('.step-number');

      const toggleCheck = () => {
        if (state.checkedSteps.has(index)) {
          state.checkedSteps.delete(index);
          li.classList.remove('is-checked');
          stepNumber.textContent = index + 1;
        } else {
          state.checkedSteps.add(index);
          li.classList.add('is-checked');
          stepNumber.textContent = '✓';
        }
      };

      stepText.addEventListener('click', toggleCheck);
      stepNumber.addEventListener('click', toggleCheck);

      // Step timer button trigger
      const stepTimerBtn = li.querySelector('.btn-step-timer');
      if (stepTimerBtn) {
        stepTimerBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const sec = parseInt(stepTimerBtn.getAttribute('data-sec'), 10);
          state.timer.remainingSeconds = sec;
          startKitchenTimer();
          showToast(`Timer dapur ${Math.round(sec / 60)} menit dimulai!`);
          const timerEl = document.getElementById('kitchenTimerWidget');
          if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }

      DOM.modalStepsList.appendChild(li);
    });
  }

  // Render Cookpad Related Recipes
  function renderRelatedRecipes(currentRecipe) {
    if (!DOM.modalRelatedCardsGrid) return;
    DOM.modalRelatedCardsGrid.innerHTML = '';

    const sameCat = state.allRecipes.filter(r => r.id !== currentRecipe.id && r.categoryKey === currentRecipe.categoryKey);
    const relatedList = (sameCat.length >= 3 ? sameCat : state.allRecipes.filter(r => r.id !== currentRecipe.id)).slice(0, 3);

    relatedList.forEach(rel => {
      const card = document.createElement('div');
      card.className = 'modal-related-card';
      const photo = rel.image || CATEGORY_IMAGES[rel.categoryKey] || 'assets/images/cat-minuman.jpg';
      card.innerHTML = `
        <div class="rel-thumb">
          <img src="${photo}" alt="${escapeHTML(rel.title)}" loading="lazy" onerror="this.src='assets/images/cat-minuman.jpg'">
          <span class="rel-time">${rel.totalMinutes} mnt</span>
        </div>
        <div class="rel-info">
          <div class="rel-title">${escapeHTML(rel.title)}</div>
          <div class="rel-meta">${escapeHTML(rel.difficulty)} • ${escapeHTML(rel.calories)}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        openRecipeModal(rel);
      });
      DOM.modalRelatedCardsGrid.appendChild(card);
    });
  }

  function formatAmount(num) {
    if (num % 1 === 0) return num.toString();
    if (Math.abs(num - 0.5) < 0.05) return '½';
    if (Math.abs(num - 0.25) < 0.05) return '¼';
    if (Math.abs(num - 0.75) < 0.05) return '¾';
    return Number(num.toFixed(1)).toString();
  }

  function updateModalFavoriteBtnState() {
    if (!state.currentRecipe || !DOM.modalFavoriteBtn) return;
    const isFav = state.favorites.includes(state.currentRecipe.id);
    DOM.modalFavoriteBtn.classList.toggle('is-active', isFav);
    const svg = DOM.modalFavoriteBtn.querySelector('svg');
    if (svg) svg.setAttribute('fill', isFav ? 'currentColor' : 'none');
    const textEl = DOM.modalFavoriteBtn.querySelector('.util-text');
    if (textEl) textEl.textContent = isFav ? 'Tersimpan' : 'Simpan';
  }

  // ===================================================================
  // HANDS-FREE KITCHEN COOK MODE (THE ENGINEER + CHEF MASTERPIECE)
  // ===================================================================
  async function openCookMode(recipe) {
    if (!recipe && state.currentRecipe) recipe = state.currentRecipe;
    if (!recipe) return;

    state.currentRecipe = recipe;
    state.cookMode.currentStepIdx = 0;

    if (DOM.cookModeDishTitle) DOM.cookModeDishTitle.textContent = recipe.title;

    // Request screen wake lock so display never sleeps while cooking in the kitchen
    if ('wakeLock' in navigator) {
      try {
        state.cookMode.wakeLock = await navigator.wakeLock.request('screen');
        if (DOM.wakeLockStatus) {
          DOM.wakeLockStatus.style.display = 'inline-flex';
          const txt = DOM.wakeLockStatus.querySelector('.wakelock-text');
          if (txt) txt.textContent = 'Layar Selalu Aktif';
        }
      } catch (err) {
        console.warn('Wake Lock request error:', err);
      }
    }

    renderCurrentCookStep();
    populateCookIngredientsSheet();

    if (DOM.cookModeOverlay) {
      DOM.cookModeOverlay.classList.add('is-active');
      DOM.cookModeOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCookMode() {
    if (state.cookMode.wakeLock) {
      state.cookMode.wakeLock.release().catch(() => {});
      state.cookMode.wakeLock = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    resetStepTimer();

    if (DOM.cookModeOverlay) {
      DOM.cookModeOverlay.classList.remove('is-active');
      DOM.cookModeOverlay.setAttribute('aria-hidden', 'true');
    }
    if (DOM.cookIngredientsSheet) {
      DOM.cookIngredientsSheet.classList.remove('is-open');
    }
    // If recipe modal is still open, keep overflow hidden, else restore
    if (!DOM.recipeModalOverlay || !DOM.recipeModalOverlay.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  }

  function renderCurrentCookStep() {
    const recipe = state.currentRecipe;
    if (!recipe || !recipe.steps || recipe.steps.length === 0) return;

    const totalSteps = recipe.steps.length;
    const idx = state.cookMode.currentStepIdx;
    const stepText = recipe.steps[idx] || '';

    if (DOM.cookStepCounter) {
      DOM.cookStepCounter.textContent = `Langkah ${idx + 1} dari ${totalSteps}`;
    }

    if (DOM.cookStepInstruction) {
      DOM.cookStepInstruction.textContent = stepText;
    }

    if (DOM.cookProgressFill) {
      const pct = Math.round(((idx + 1) / totalSteps) * 100);
      DOM.cookProgressFill.style.width = `${pct}%`;
    }

    if (DOM.cookPrevStepBtn) {
      DOM.cookPrevStepBtn.disabled = idx === 0;
      DOM.cookPrevStepBtn.style.opacity = idx === 0 ? '0.4' : '1';
    }

    if (DOM.cookNextStepBtn) {
      if (idx === totalSteps - 1) {
        DOM.cookNextStepBtn.innerHTML = `<span>Selesai Memasak</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else {
        DOM.cookNextStepBtn.innerHTML = `<span>Langkah Berikutnya</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
      }
    }

    // Auto-detect minutes in step text (e.g. "15 menit", "20 menit", "5 menit")
    const match = stepText.match(/(\d+)\s*(?:menit|mnt)/i);
    if (match && match[1]) {
      const detectedMin = parseInt(match[1], 10);
      if (DOM.stepTimerBtnText) DOM.stepTimerBtnText.textContent = `Timer ${detectedMin} Mnt`;
      if (DOM.btnStepTimer) {
        DOM.btnStepTimer.setAttribute('data-min', detectedMin);
        DOM.btnStepTimer.style.borderColor = 'var(--mango-500)';
      }
    } else {
      if (DOM.stepTimerBtnText) DOM.stepTimerBtnText.textContent = `Timer Dapur`;
      if (DOM.btnStepTimer) {
        DOM.btnStepTimer.setAttribute('data-min', '5');
        DOM.btnStepTimer.style.borderColor = 'var(--border-subtle)';
      }
    }
  }

  function nextCookStep() {
    const recipe = state.currentRecipe;
    if (!recipe || !recipe.steps) return;
    if (state.cookMode.currentStepIdx < recipe.steps.length - 1) {
      state.cookMode.currentStepIdx++;
      renderCurrentCookStep();
    } else {
      showToast('Selamat! Hidangan mangga Anda telah selesai dimasak dengan sempurna.');
      closeCookMode();
    }
  }

  function prevCookStep() {
    if (state.cookMode.currentStepIdx > 0) {
      state.cookMode.currentStepIdx--;
      renderCurrentCookStep();
    }
  }

  function speakCurrentStep() {
    if (!('speechSynthesis' in window)) {
      showToast('Fitur suara bacakan belum didukung browser ini.');
      return;
    }
    const recipe = state.currentRecipe;
    if (!recipe || !recipe.steps) return;
    const stepText = recipe.steps[state.cookMode.currentStepIdx] || '';

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(stepText);
    utter.lang = 'id-ID';
    utter.rate = 0.95;

    if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Membacakan...';
    utter.onend = () => {
      if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Bacakan';
    };
    utter.onerror = () => {
      if (DOM.speakBtnText) DOM.speakBtnText.textContent = 'Bacakan';
    };
    window.speechSynthesis.speak(utter);
  }

  function startStepTimer(minutes) {
    resetStepTimer();
    const duration = (minutes || 5) * 60;
    state.cookMode.remainingSeconds = duration;
    state.cookMode.isRunning = true;

    if (DOM.stepActiveTimerCard) DOM.stepActiveTimerCard.style.display = 'flex';
    updateStepTimerDisplay();

    state.cookMode.timerInterval = setInterval(() => {
      if (state.cookMode.remainingSeconds > 0) {
        state.cookMode.remainingSeconds--;
        updateStepTimerDisplay();
      } else {
        resetStepTimer();
        showToast('Waktu memasak langkah ini telah habis!');
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      }
    }, 1000);
  }

  function updateStepTimerDisplay() {
    const sec = state.cookMode.remainingSeconds;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (DOM.stepTimerDisplay) DOM.stepTimerDisplay.textContent = str;
  }

  function pauseStepTimer() {
    if (state.cookMode.isRunning) {
      clearInterval(state.cookMode.timerInterval);
      state.cookMode.isRunning = false;
      if (DOM.btnStepTimerPause) DOM.btnStepTimerPause.textContent = 'Lanjut';
    } else {
      state.cookMode.isRunning = true;
      if (DOM.btnStepTimerPause) DOM.btnStepTimerPause.textContent = 'Jeda';
      state.cookMode.timerInterval = setInterval(() => {
        if (state.cookMode.remainingSeconds > 0) {
          state.cookMode.remainingSeconds--;
          updateStepTimerDisplay();
        } else {
          resetStepTimer();
          showToast('Waktu memasak telah habis!');
        }
      }, 1000);
    }
  }

  function resetStepTimer() {
    if (state.cookMode.timerInterval) {
      clearInterval(state.cookMode.timerInterval);
      state.cookMode.timerInterval = null;
    }
    state.cookMode.isRunning = false;
    state.cookMode.remainingSeconds = 0;
    if (DOM.stepActiveTimerCard) DOM.stepActiveTimerCard.style.display = 'none';
    if (DOM.btnStepTimerPause) DOM.btnStepTimerPause.textContent = 'Jeda';
  }

  function populateCookIngredientsSheet() {
    if (!state.currentRecipe || !DOM.cookSheetIngredientsList) return;
    const ingList = state.currentRecipe.ingredients || [];
    DOM.cookSheetIngredientsList.innerHTML = '';
    ingList.forEach((ing, i) => {
      const li = document.createElement('li');
      li.style.cssText = 'display:flex;align-items:center;gap:10px;font-size:0.9rem;padding:6px 0;border-bottom:1px solid var(--border-subtle);';
      li.innerHTML = `
        <input type="checkbox" id="cookIng-${i}" style="width:18px;height:18px;accent-color:var(--mango-500);cursor:pointer;">
        <label for="cookIng-${i}" style="cursor:pointer;flex:1;"><strong>${ing.amount || ''} ${ing.unit || ''}</strong> ${escapeHTML(ing.name)} ${ing.notes ? `<small style="color:var(--text-muted)">(${escapeHTML(ing.notes)})</small>` : ''}</label>
      `;
      DOM.cookSheetIngredientsList.appendChild(li);
    });
  }

  // ===================================================================
  // KITCHEN TIMER & WEB AUDIO CHIME
  // ===================================================================
  function startKitchenTimer() {
    if (state.timer.remainingSeconds <= 0) {
      const cookMins = state.currentRecipe ? (state.currentRecipe.totalMinutes || 5) : 5;
      state.timer.remainingSeconds = cookMins * 60;
    }

    if (state.timer.isRunning) {
      clearInterval(state.timer.interval);
      state.timer.isRunning = false;
      if (DOM.timerStartBtn) {
        DOM.timerStartBtn.textContent = 'Lanjutkan';
        DOM.timerStartBtn.classList.remove('btn-secondary');
        DOM.timerStartBtn.classList.add('btn-primary');
      }
    } else {
      state.timer.isRunning = true;
      if (DOM.timerStartBtn) {
        DOM.timerStartBtn.textContent = 'Jeda';
        DOM.timerStartBtn.classList.remove('btn-primary');
        DOM.timerStartBtn.classList.add('btn-secondary');
      }

      state.timer.interval = setInterval(() => {
        if (state.timer.remainingSeconds > 0) {
          state.timer.remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(state.timer.interval);
          state.timer.isRunning = false;
          if (DOM.timerStartBtn) DOM.timerStartBtn.textContent = 'Mulai Timer';
          playChimeSound();
          showToast('Waktu memasak telah selesai! Hidangan siap disajikan.');
        }
      }, 1000);
    }
    updateTimerDisplay();
  }

  function resetKitchenTimer() {
    clearInterval(state.timer.interval);
    state.timer.isRunning = false;
    state.timer.remainingSeconds = 0;
    if (DOM.timerStartBtn) {
      DOM.timerStartBtn.textContent = 'Mulai Timer';
      DOM.timerStartBtn.classList.remove('btn-secondary');
      DOM.timerStartBtn.classList.add('btn-primary');
    }
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    if (!DOM.timerDisplay) return;
    const mins = Math.floor(state.timer.remainingSeconds / 60);
    const secs = state.timer.remainingSeconds % 60;
    DOM.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function playChimeSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      playTone(587.33, now, 0.4);       // D5
      playTone(739.99, now + 0.2, 0.4); // F#5
      playTone(880.00, now + 0.4, 0.8); // A5
    } catch (e) {
      console.warn('Web Audio chime blocked:', e);
    }
  }

  // ===================================================================
  // FAVORITES SYSTEM (COOKPAD BOOKMARKS)
  // ===================================================================
  function toggleFavorite(recipeId) {
    const idx = state.favorites.indexOf(recipeId);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
      showToast('Dihapus dari Resep Tersimpan');
    } else {
      state.favorites.push(recipeId);
      showToast('Disimpan ke Resep Tersimpan');
    }
    localStorage.setItem('mango_favorites', JSON.stringify(state.favorites));
    updateBadges();
  }

  function updateBadges() {
    const favCount = state.favorites.length;
    if (DOM.favoritesCountBadge) DOM.favoritesCountBadge.textContent = favCount;
    if (DOM.mobFavBadge) DOM.mobFavBadge.textContent = favCount;

    const shopCount = state.shoppingList.length;
    if (DOM.shoppingCountBadge) DOM.shoppingCountBadge.textContent = shopCount;
    if (DOM.mobShopBadge) DOM.mobShopBadge.textContent = shopCount;
  }

  function openFavoritesModal() {
    if (!DOM.favoritesListContainer) return;
    DOM.favoritesListContainer.innerHTML = '';

    if (state.favorites.length === 0) {
      DOM.favoritesListContainer.innerHTML = `
        <div class="empty-state" style="padding: 30px 10px;">
          <div class="empty-icon-clean">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h4 class="empty-title">Belum Ada Resep Tersimpan</h4>
          <p class="empty-desc">Klik tombol simpan pada resep olahan mangga apa pun untuk menyimpannya ke daftar ini.</p>
        </div>
      `;
    } else {
      const grid = document.createElement('div');
      grid.className = 'favorites-list-grid';

      state.favorites.forEach(id => {
        const recipe = state.allRecipes.find(r => r.id === id);
        if (!recipe) return;

        const row = document.createElement('div');
        row.className = 'fav-item-row';
        const photo = CATEGORY_IMAGES[recipe.categoryKey] || 'assets/images/cat-simpel.jpg';
        row.innerHTML = `
          <div class="fav-item-info">
            <img src="${photo}" alt="${escapeHTML(recipe.title)}" class="fav-item-thumb">
            <div>
              <div class="fav-item-title">${escapeHTML(recipe.title)}</div>
              <div class="fav-item-meta">${recipe.totalMinutes} mnt • ${recipe.difficulty}</div>
            </div>
          </div>
          <button type="button" class="shopping-delete-btn" title="Hapus dari Favorit">&times;</button>
        `;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.shopping-delete-btn')) {
            e.stopPropagation();
            toggleFavorite(recipe.id);
            openFavoritesModal();
            renderRecipeGrid();
            return;
          }
          closeFavoritesModal();
          openRecipeModal(recipe);
        });

        grid.appendChild(row);
      });

      DOM.favoritesListContainer.appendChild(grid);
    }

    if (DOM.favoritesModalOverlay) {
      DOM.favoritesModalOverlay.classList.add('is-open');
      DOM.favoritesModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeFavoritesModal() {
    if (DOM.favoritesModalOverlay) {
      DOM.favoritesModalOverlay.classList.remove('is-open');
      DOM.favoritesModalOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // ===================================================================
  // SHOPPING LIST SYSTEM
  // ===================================================================
  function addCurrentRecipeToShoppingList() {
    if (!state.currentRecipe) return;

    const mult = state.portionMultiplier;
    let addedCount = 0;

    state.currentRecipe.ingredients.forEach(ing => {
      let scaledAmount = '';
      if (typeof ing.amount === 'number') {
        scaledAmount = formatAmount(ing.amount * mult) + (ing.unit ? ' ' + ing.unit : '');
      } else if (typeof ing.amount === 'string' && !isNaN(parseFloat(ing.amount))) {
        scaledAmount = formatAmount(parseFloat(ing.amount) * mult) + (ing.unit ? ' ' + ing.unit : '');
      } else {
        scaledAmount = (ing.amount || '') + (ing.unit ? ' ' + ing.unit : '');
      }

      const itemText = `${scaledAmount} ${ing.name} (untuk ${state.currentRecipe.title})`.trim();
      
      if (!state.shoppingList.some(item => item.text === itemText)) {
        state.shoppingList.push({
          id: 'shop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          text: itemText,
          checked: false
        });
        addedCount++;
      }
    });

    localStorage.setItem('mango_shopping_list', JSON.stringify(state.shoppingList));
    updateBadges();
    showToast(`🛒 ${addedCount} bahan berhasil dimasukkan ke Daftar Belanja!`);
  }

  function openShoppingListModal() {
    if (!DOM.shoppingItemsList) return;
    DOM.shoppingItemsList.innerHTML = '';

    if (state.shoppingList.length === 0) {
      DOM.shoppingItemsList.innerHTML = `
        <div class="empty-state" style="padding: 30px 10px;">
          <div class="empty-icon">🛒</div>
          <h4 class="empty-title">Daftar Belanja Masih Kosong</h4>
          <p class="empty-desc">Buka resep pilihan Anda lalu klik tombol "+ Masukkan ke Belanja" untuk mencatat kebutuhan bahan masakan secara otomatis.</p>
        </div>
      `;
    } else {
      state.shoppingList.forEach(item => {
        const li = document.createElement('li');
        li.className = 'shopping-item-row';
        li.innerHTML = `
          <div class="shopping-item-left" style="cursor: pointer;">
            <span class="custom-checkbox">${item.checked ? '✓' : ''}</span>
            <span style="${item.checked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${escapeHTML(item.text)}</span>
          </div>
          <button type="button" class="shopping-delete-btn" title="Hapus item">&times;</button>
        `;

        li.querySelector('.shopping-item-left').addEventListener('click', () => {
          item.checked = !item.checked;
          localStorage.setItem('mango_shopping_list', JSON.stringify(state.shoppingList));
          openShoppingListModal();
        });

        li.querySelector('.shopping-delete-btn').addEventListener('click', () => {
          state.shoppingList = state.shoppingList.filter(i => i.id !== item.id);
          localStorage.setItem('mango_shopping_list', JSON.stringify(state.shoppingList));
          updateBadges();
          openShoppingListModal();
        });

        DOM.shoppingItemsList.appendChild(li);
      });
    }

    if (DOM.shoppingModalOverlay) {
      DOM.shoppingModalOverlay.classList.add('is-open');
      DOM.shoppingModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeShoppingListModal() {
    if (DOM.shoppingModalOverlay) {
      DOM.shoppingModalOverlay.classList.remove('is-open');
      DOM.shoppingModalOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
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
    text += '\n_Dibuat dengan web Resep All Manggo_';

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function clearShoppingList() {
    if (confirm('Yakin ingin mengosongkan seluruh daftar belanja?')) {
      state.shoppingList = [];
      localStorage.setItem('mango_shopping_list', JSON.stringify(state.shoppingList));
      updateBadges();
      openShoppingListModal();
      showToast('Daftar belanja telah dikosongkan.');
    }
  }

  // ===================================================================
  // KAMUS MANGGA GUIDE MODAL
  // ===================================================================
  function populateMangoGuide() {
    if (!DOM.mangoVarietiesGrid) return;
    DOM.mangoVarietiesGrid.innerHTML = '';
    MANGO_VARIETIES.forEach(v => {
      const card = document.createElement('div');
      card.className = 'variety-card';
      card.innerHTML = `
        <div class="variety-header">
          <h4 class="variety-title">${v.name}</h4>
          <span class="variety-origin">${v.origin}</span>
        </div>
        <div class="variety-sweetness">Tingkat Manis: ${v.sweetness}</div>
        <p class="variety-desc">${v.texture}</p>
        <div class="variety-pairing"><strong>Rekomendasi Olahan:</strong> ${v.bestFor}</div>
      `;
      DOM.mangoVarietiesGrid.appendChild(card);
    });
  }

  function openMangoGuideModal() {
    if (DOM.mangoGuideModalOverlay) {
      DOM.mangoGuideModalOverlay.classList.add('is-open');
      DOM.mangoGuideModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMangoGuideModal() {
    if (DOM.mangoGuideModalOverlay) {
      DOM.mangoGuideModalOverlay.classList.remove('is-open');
      DOM.mangoGuideModalOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // ===================================================================
  // RANDOM RECIPE INSPIRATION
  // ===================================================================
  let randomPickedRecipe = null;

  function openRandomRecipeModal() {
    if (DOM.randomRecipeModalOverlay) {
      DOM.randomRecipeModalOverlay.classList.add('is-open');
      DOM.randomRecipeModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    rollRandomRecipe();
  }

  function closeRandomRecipeModal() {
    if (DOM.randomRecipeModalOverlay) {
      DOM.randomRecipeModalOverlay.classList.remove('is-open');
      DOM.randomRecipeModalOverlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  function rollRandomRecipe() {
    if (DOM.randomDiceIcon) DOM.randomDiceIcon.style.animation = 'roll 0.25s infinite alternate';
    if (DOM.randomResultTitle) DOM.randomResultTitle.textContent = 'Mengacak Resep...';
    if (DOM.randomResultDesc) DOM.randomResultDesc.textContent = 'Mencari resep mangga paling pas untuk selera Anda hari ini...';
    if (DOM.openRandomRecipeDetailBtn) DOM.openRandomRecipeDetailBtn.disabled = true;

    setTimeout(() => {
      const pool = state.allRecipes.length > 0 ? state.allRecipes : [];
      if (pool.length === 0) return;

      const randomIdx = Math.floor(Math.random() * pool.length);
      randomPickedRecipe = pool[randomIdx];

      if (DOM.randomDiceIcon) {
        DOM.randomDiceIcon.style.animation = 'none';
      }
      if (DOM.randomResultTitle) DOM.randomResultTitle.textContent = randomPickedRecipe.title;
      if (DOM.randomResultDesc) DOM.randomResultDesc.textContent = randomPickedRecipe.desc;
      if (DOM.openRandomRecipeDetailBtn) DOM.openRandomRecipeDetailBtn.disabled = false;
    }, 600);
  }

  // ===================================================================
  // TOAST NOTIFICATIONS & SHARE
  // ===================================================================
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
    }, 2800);
  }

  function shareRecipe() {
    if (!state.currentRecipe) return;
    const shareData = {
      title: `${state.currentRecipe.title} - Resep All Manggo`,
      text: `Cobain resep ${state.currentRecipe.title}! ${state.currentRecipe.desc}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        .then(() => showToast('Tautan resep disalin ke clipboard!'))
        .catch(() => showToast('Tautan siap dibagikan!'));
    }
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
    // Theme Switcher
    on(DOM.themeToggleBtn, 'click', () => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      showToast(`Mode ${nextTheme === 'light' ? 'Terang' : 'Gelap'} diaktifkan`);
    });

    // App View Switcher Buttons (Beranda Rekomendasi vs Katalog 1.000 Resep)
    on(DOM.btnViewHome, 'click', () => {
      switchAppView('home');
      window.scrollTo({ top: 380, behavior: 'smooth' });
    });
    on(DOM.btnViewCatalog, 'click', () => {
      switchAppView('catalog');
      const catEl = document.getElementById('kategori');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    });

    // Search Inputs
    let debounceTimer;
    const handleSearch = (val) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = val;
        if (val.trim().length > 0) {
          switchAppView('catalog');
        }
        applyFilters();
      }, 150);
    };

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', (e) => {
        if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = e.target.value;
        if (DOM.heroSearchInput) DOM.heroSearchInput.value = e.target.value;
        handleSearch(e.target.value);
      });
    }

    if (DOM.heroSearchInput) {
      DOM.heroSearchInput.addEventListener('input', (e) => {
        if (DOM.searchInput) DOM.searchInput.value = e.target.value;
        if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = e.target.value;
        handleSearch(e.target.value);
      });
      DOM.heroSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          switchAppView('catalog');
          const catEl = document.getElementById('kategori');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (DOM.heroSearchBtn) {
      DOM.heroSearchBtn.addEventListener('click', () => {
        const val = DOM.heroSearchInput ? DOM.heroSearchInput.value : '';
        if (DOM.searchInput) DOM.searchInput.value = val;
        state.searchQuery = val;
        switchAppView('catalog');
        applyFilters();
        const catEl = document.getElementById('kategori');
        if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (DOM.mobileSearchInput) {
      DOM.mobileSearchInput.addEventListener('input', (e) => {
        if (DOM.searchInput) DOM.searchInput.value = e.target.value;
        if (DOM.heroSearchInput) DOM.heroSearchInput.value = e.target.value;
        handleSearch(e.target.value);
      });
    }

    // Clear Search Buttons
    on(DOM.clearSearchBtn, 'click', () => {
      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.heroSearchInput) DOM.heroSearchInput.value = '';
      if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    on(DOM.mobileClearSearchBtn, 'click', () => {
      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.heroSearchInput) DOM.heroSearchInput.value = '';
      if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    // Trending Search Tag Buttons Click
    const trendTagBtns = document.querySelectorAll('.trend-tag-btn');
    trendTagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        if (DOM.searchInput) DOM.searchInput.value = tag;
        if (DOM.heroSearchInput) DOM.heroSearchInput.value = tag;
        if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = tag;
        state.searchQuery = tag;
        switchAppView('catalog');
        applyFilters();
        const catEl = document.getElementById('kategori');
        if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Category Nav Pills
    if (DOM.categoryPills) {
      DOM.categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          DOM.categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.currentCategory = pill.getAttribute('data-category');
          switchAppView('catalog');
          applyFilters();
        });
      });
    }

    // Difficulty & Time Filters & Sort
    on(DOM.difficultyFilter, 'change', (e) => {
      state.difficultyFilter = e.target.value;
      applyFilters();
    });

    on(DOM.timeFilter, 'change', (e) => {
      state.timeFilter = e.target.value;
      applyFilters();
    });

    on(DOM.sortSelect, 'change', (e) => {
      state.sortBy = e.target.value;
      applyFilters();
    });

    // Reset Filters
    const resetAllFilters = () => {
      state.currentCategory = 'all';
      state.searchQuery = '';
      state.difficultyFilter = 'all';
      state.timeFilter = 'all';
      state.sortBy = 'default';

      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.heroSearchInput) DOM.heroSearchInput.value = '';
      if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
      if (DOM.difficultyFilter) DOM.difficultyFilter.value = 'all';
      if (DOM.timeFilter) DOM.timeFilter.value = 'all';
      if (DOM.sortSelect) DOM.sortSelect.value = 'default';

      if (DOM.categoryPills) {
        DOM.categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      }
      applyFilters();
    };

    on(DOM.resetFiltersBtn, 'click', resetAllFilters);
    on(DOM.emptyResetBtn, 'click', resetAllFilters);

    // Load More
    on(DOM.loadMoreBtn, 'click', () => {
      state.displayedCount += 24;
      renderRecipeGrid();
    });

    // CTA & Header Buttons
    on(DOM.exploreAllBtn, 'click', () => {
      const catEl = document.getElementById('kategori');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    });

    on(DOM.heroRandomBtn, 'click', openRandomRecipeModal);
    on(DOM.randomRecipeBtn, 'click', openRandomRecipeModal);

    on(DOM.openFavoritesBtn, 'click', openFavoritesModal);
    on(DOM.openShoppingListBtn, 'click', openShoppingListModal);

    on(DOM.openMangoGuideBtn, 'click', openMangoGuideModal);
    on(DOM.spotlightGuideBtn, 'click', openMangoGuideModal);
    on(DOM.footerMangoGuideLink, 'click', (e) => { e.preventDefault(); openMangoGuideModal(); });
    on(DOM.footerRandomLink, 'click', (e) => { e.preventDefault(); openRandomRecipeModal(); });
    on(DOM.footerShoppingLink, 'click', (e) => { e.preventDefault(); openShoppingListModal(); });
    on(DOM.footerFavoritesLink, 'click', (e) => { e.preventDefault(); openFavoritesModal(); });

    // Recipe Detail Modal Events
    on(DOM.modalCloseBtn, 'click', closeRecipeModal);
    on(DOM.recipeModalOverlay, 'click', (e) => {
      if (e.target === DOM.recipeModalOverlay) closeRecipeModal();
    });

    // Scaler Buttons
    if (DOM.scalerBtns) {
      DOM.scalerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          DOM.scalerBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.portionMultiplier = parseFloat(btn.getAttribute('data-multiplier'));
          renderModalIngredients();
        });
      });
    }

    // Modal Action Buttons
    on(DOM.modalFavoriteBtn, 'click', () => {
      if (!state.currentRecipe) return;
      toggleFavorite(state.currentRecipe.id);
      updateModalFavoriteBtnState();
      renderRecipeGrid();
    });

    on(DOM.modalAddShoppingBtn, 'click', addCurrentRecipeToShoppingList);
    on(DOM.modalAddAllIngBtn, 'click', addCurrentRecipeToShoppingList);
    on(DOM.modalShareBtn, 'click', shareRecipe);
    on(DOM.modalPrintBtn, 'click', () => window.print());

    // Timer Widget Events
    on(DOM.timerStartBtn, 'click', startKitchenTimer);
    on(DOM.timerResetBtn, 'click', resetKitchenTimer);
    if (DOM.timerPresetBtns) {
      DOM.timerPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const sec = parseInt(btn.getAttribute('data-sec'), 10);
          state.timer.remainingSeconds += sec;
          updateTimerDisplay();
        });
      });
    }

    // Favorites Drawer Events
    on(DOM.closeFavoritesModalBtn, 'click', closeFavoritesModal);
    on(DOM.favoritesModalOverlay, 'click', (e) => {
      if (e.target === DOM.favoritesModalOverlay) closeFavoritesModal();
    });

    // Shopping List Drawer Events
    on(DOM.closeShoppingModalBtn, 'click', closeShoppingListModal);
    on(DOM.shoppingModalOverlay, 'click', (e) => {
      if (e.target === DOM.shoppingModalOverlay) closeShoppingListModal();
    });
    on(DOM.shareShoppingWhatsappBtn, 'click', shareShoppingViaWhatsApp);
    on(DOM.clearShoppingListBtn, 'click', clearShoppingList);

    // Kamus Mangga Modal Events
    on(DOM.closeMangoGuideModalBtn, 'click', closeMangoGuideModal);
    on(DOM.mangoGuideModalOverlay, 'click', (e) => {
      if (e.target === DOM.mangoGuideModalOverlay) closeMangoGuideModal();
    });

    // Random Modal Events
    on(DOM.closeRandomModalBtn, 'click', closeRandomRecipeModal);
    on(DOM.randomRecipeModalOverlay, 'click', (e) => {
      if (e.target === DOM.randomRecipeModalOverlay) closeRandomRecipeModal();
    });
    on(DOM.rollAgainBtn, 'click', rollRandomRecipe);
    on(DOM.openRandomRecipeDetailBtn, 'click', () => {
      if (randomPickedRecipe) {
        closeRandomRecipeModal();
        openRecipeModal(randomPickedRecipe);
      }
    });

    // Mobile Bottom Navigation Bar Events
    on(DOM.mobNavHome, 'click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    on(DOM.mobNavCat, 'click', (e) => {
      e.preventDefault();
      const catEl = document.getElementById('kategori');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    });
    on(DOM.mobNavRandom, 'click', openRandomRecipeModal);
    on(DOM.mobNavFav, 'click', openFavoritesModal);
    on(DOM.mobNavShop, 'click', openShoppingListModal);

    // Cook Mode Events (Hands-Free Cooking Experience)
    on(DOM.btnLaunchCookMode, 'click', () => openCookMode(state.currentRecipe));
    on(DOM.closeCookModeBtn, 'click', closeCookMode);
    on(DOM.cookNextStepBtn, 'click', nextCookStep);
    on(DOM.cookPrevStepBtn, 'click', prevCookStep);
    on(DOM.btnSpeakStep, 'click', speakCurrentStep);
    
    on(DOM.btnStepTimer, 'click', () => {
      const min = parseInt(DOM.btnStepTimer.getAttribute('data-min') || '5', 10);
      startStepTimer(min);
      showToast(`Timer langkah ${min} menit dimulai!`);
    });
    on(DOM.btnStepTimerPause, 'click', pauseStepTimer);
    on(DOM.btnStepTimerReset, 'click', resetStepTimer);
    on(DOM.btnToggleCookIngredients, 'click', () => {
      if (DOM.cookIngredientsSheet) DOM.cookIngredientsSheet.classList.toggle('is-open');
    });
    on(DOM.closeCookIngredientsSheet, 'click', () => {
      if (DOM.cookIngredientsSheet) DOM.cookIngredientsSheet.classList.remove('is-open');
    });

    // Hero Spotlight & Dish of the Day Actions
    on(DOM.heroCookNowBtn, 'click', () => {
      const dish = state.allRecipes.find(r => r.title.toLowerCase().includes('sticky rice') || r.title.toLowerCase().includes('khao niew')) || state.allRecipes[0];
      if (dish) {
        openRecipeModal(dish);
        openCookMode(dish);
      }
    });

    on(DOM.heroSaveDishBtn, 'click', () => {
      const dish = state.allRecipes.find(r => r.title.toLowerCase().includes('sticky rice') || r.title.toLowerCase().includes('khao niew')) || state.allRecipes[0];
      if (dish) {
        toggleFavorite(dish.id);
        const isFav = state.favorites.includes(dish.id);
        DOM.heroSaveDishBtn.style.color = isFav ? '#E65100' : '';
        const svg = DOM.heroSaveDishBtn.querySelector('svg');
        if (svg) svg.setAttribute('fill', isFav ? 'currentColor' : 'none');
      }
    });

    // Keyboard Shortcuts (Ctrl+K to search, Cook mode navigation, Escape)
    document.addEventListener('keydown', (e) => {
      // Ctrl + K or Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = DOM.heroSearchInput || DOM.searchInput;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Cook mode keyboard navigation (Arrow keys)
      if (DOM.cookModeOverlay && DOM.cookModeOverlay.classList.contains('is-active')) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextCookStep();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevCookStep();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeCookMode();
        }
        return;
      }

      if (e.key === 'Escape') {
        closeRecipeModal();
        closeFavoritesModal();
        closeShoppingListModal();
        closeMangoGuideModal();
        closeRandomRecipeModal();
      }
    });
  }

  // Execute on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
