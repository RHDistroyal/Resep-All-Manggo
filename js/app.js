/**
 * RESEP ALL MANGGO - Main Application Script
 * Interactive recipe encyclopedia for 200 mango culinary creations.
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

  function getCategoryKey(cat) {
    if (!cat) return 'simpel';
    if (CATEGORY_MAP[cat]) return CATEGORY_MAP[cat];
    const lower = cat.toLowerCase();
    if (lower.includes('simpel') || lower.includes('harian')) return 'simpel';
    if (lower.includes('minum')) return 'minuman';
    if (lower.includes('nusantara') || lower.includes('daerah')) return 'nusantara';
    if (lower.includes('asia')) return 'asia';
    if (lower.includes('barat') || lower.includes('latin') || lower.includes('meksiko')) return 'barat';
    if (lower.includes('pastry') || lower.includes('bakery') || lower.includes('dessert')) return 'pastry';
    return 'simpel';
  }

  function normalizeRecipe(r) {
    const catKey = r.categoryKey || getCategoryKey(r.category);
    return {
      id: r.id,
      title: r.title || r.name || 'Resep Mangga',
      name: r.title || r.name || 'Resep Mangga',
      desc: r.desc || r.summary || '',
      summary: r.desc || r.summary || '',
      category: r.category || 'Olahan Simpel & Harian',
      categoryKey: catKey,
      icon: r.icon || r.emoji || '🥭',
      emoji: r.icon || r.emoji || '🥭',
      prepTime: r.prepTime || '10 menit',
      cookTime: r.cookTime || '15 menit',
      totalMinutes: typeof r.totalMinutes === 'number' ? r.totalMinutes : 15,
      servings: r.servings || 2,
      difficulty: r.difficulty || 'Mudah',
      calories: r.calories || '150 kkal',
      mangoType: r.mangoType || 'Harum Manis',
      tips: r.tips || r.chefTips || 'Pilih mangga matang pohon berkualitas untuk cita rasa terbaik.',
      chefTips: r.tips || r.chefTips || 'Pilih mangga matang pohon berkualitas untuk cita rasa terbaik.',
      tags: Array.isArray(r.tags) ? r.tags : [],
      ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
      steps: Array.isArray(r.steps) ? r.steps : []
    };
  }

  // State Management
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
    }
  };

  // Kamus Mangga Knowledge Database
  const MANGO_VARIETIES = [
    {
      name: 'Harum Manis',
      origin: 'Probolinggo, Jawa Timur',
      sweetness: '⭐⭐⭐⭐⭐ (16-18° Brix)',
      texture: 'Daging tebal, sangat lembut, nyaris tanpa serat, aroma wangi legit.',
      bestFor: 'Jus kental, Panna Cotta, Mango Sticky Rice, Cheesecake, Smoothie Bowl.'
    },
    {
      name: 'Gedong Gincu',
      origin: 'Cirebon & Majalengka',
      sweetness: '⭐⭐⭐⭐☆ (14-16° Brix)',
      texture: 'Kulit merah keemasan memikat, serat halus kenyal, rasa manis asam segar eksotis.',
      bestFor: 'Cocktail/Mocktail, Mango Mojito, Saus Asam Manis Gurame, Sorbet, Es Lilin.'
    },
    {
      name: 'Manalagi',
      origin: 'Situbondo, Jawa Timur',
      sweetness: '⭐⭐⭐⭐⭐ (15-17° Brix)',
      texture: 'Daging padat, renyah saat mengkal, rasa manis terasa kuat walau masih agak hijau.',
      bestFor: 'Rujak Buah Serut, Asinan Mangga, Setup Kayu Manis, Topping Oatmeal.'
    },
    {
      name: 'Indramayu (Cengkir)',
      origin: 'Indramayu, Jawa Barat',
      sweetness: '⭐⭐⭐☆☆ (11-13° Brix)',
      texture: 'Sangat tebal, renyah keras berderak (crunchy), kadar air sedang, serat minimal.',
      bestFor: 'Sambal Pencit, Sambal Matah, Acar Mangga, Rujak Cuka, Keripik Oven.'
    },
    {
      name: 'Golek',
      origin: 'Pasuruan & Probolinggo',
      sweetness: '⭐⭐⭐⭐☆ (13-15° Brix)',
      texture: 'Bentuk lonjong panjang, tidak berserat, berair banyak dan manis legit saat matang.',
      bestFor: 'Puding Susu, Selai Roti Homemade, Es Campur, Lapis Tepung Beras.'
    },
    {
      name: 'Nam Dok Mai',
      origin: 'Thailand',
      sweetness: '⭐⭐⭐⭐⭐ (17-19° Brix)',
      texture: 'Biji sangat tipis, daging kuning emas berkilau, tekstur silky meleleh di mulut.',
      bestFor: 'Khao Niew Mamuang (Mango Sticky Rice), Mango Pillow Crepes, Mango Tart.'
    },
    {
      name: 'Alphonso',
      origin: 'India (Ratnagiri)',
      sweetness: '⭐⭐⭐⭐⭐ (18-20° Brix)',
      texture: 'Dikenal sebagai "Raja Mangga Dunia". Daging oranye pekat, aroma saffron alami.',
      bestFor: 'Aamras dengan Poori, Mango Kulfi, Mango Lassi Kafe, Mango Shrikhand.'
    },
    {
      name: 'Carabao (Manila Mango)',
      origin: 'Filipina',
      sweetness: '⭐⭐⭐⭐⭐ (Guinness World Records)',
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
    
    // Recipe Detail Modal
    recipeModalOverlay: document.getElementById('recipeModalOverlay'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCategoryBadge: document.getElementById('modalCategoryBadge'),
    modalDifficulty: document.getElementById('modalDifficulty'),
    modalHeroIcon: document.getElementById('modalHeroIcon'),
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
    modalAddShoppingBtn: document.getElementById('modalAddShoppingBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    modalPrintBtn: document.getElementById('modalPrintBtn'),
    scalerBtns: document.querySelectorAll('.scaler-btn'),
    
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
          showToast('⚠️ Gagal memuat data resep. Pastikan koneksi atau file lokal aktif.');
        });
    }
  }

  function finalizeLoadedRecipes() {
    updateCategoryCounts();
    applyFilters();
  }

  function updateCategoryCounts() {
    const counts = {
      all: state.allRecipes.length,
      simpel: 0,
      minuman: 0,
      nusantara: 0,
      asia: 0,
      barat: 0,
      pastry: 0
    };

    state.allRecipes.forEach(r => {
      const key = r.categoryKey;
      if (counts.hasOwnProperty(key)) {
        counts[key]++;
      }
    });

    for (const [cat, count] of Object.entries(counts)) {
      const countEl = document.getElementById(`count-${cat}`);
      if (countEl) countEl.textContent = count;
    }
  }

  // ===================================================================
  // FILTERING, SEARCHING & SORTING
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
      simpel: 'Olahan Simpel & Harian (Praktis)',
      minuman: 'Minuman Kekinian & Kafe',
      nusantara: 'Resep Daerah & Nusantara',
      asia: 'Kuliner Mangga Khas Asia',
      barat: 'Hidangan Barat, Meksiko & Karibia',
      pastry: 'Pastry, Bakery & Dessert Mewah'
    };
    if (DOM.activeCategoryHeading) {
      DOM.activeCategoryHeading.textContent = categoryNames[state.currentCategory] || 'Koleksi Resep Mangga';
    }
    if (DOM.resultsCountText) {
      DOM.resultsCountText.textContent = `Menampilkan ${state.filteredRecipes.length} dari ${state.allRecipes.length} resep`;
    }

    // Clear search buttons
    const hasSearch = state.searchQuery.trim().length > 0;
    if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = hasSearch ? 'flex' : 'none';
    if (DOM.mobileClearSearchBtn) DOM.mobileClearSearchBtn.style.display = hasSearch ? 'flex' : 'none';

    // Reset button visibility
    const isFiltered = state.currentCategory !== 'all' || hasSearch || state.difficultyFilter !== 'all' || state.timeFilter !== 'all' || state.sortBy !== 'default';
    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.style.display = isFiltered ? 'inline-block' : 'none';
  }

  // Global helper for footer links
  window.filterByCategory = function (category) {
    state.currentCategory = category;
    if (DOM.categoryPills) {
      DOM.categoryPills.forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-category') === category);
      });
    }
    applyFilters();
  };

  // ===================================================================
  // RECIPE GRID RENDERING
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

    // Show or hide Load More
    if (DOM.loadMoreContainer) {
      if (state.displayedCount < state.filteredRecipes.length) {
        DOM.loadMoreContainer.style.display = 'flex';
        if (DOM.loadMoreBtn) {
          DOM.loadMoreBtn.innerHTML = `<span>Tampilkan Lebih Banyak (${state.filteredRecipes.length - state.displayedCount} tersisa)</span>`;
        }
      } else {
        DOM.loadMoreContainer.style.display = 'none';
      }
    }
  }

  function createRecipeCardElement(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-id', recipe.id);

    const isFav = state.favorites.includes(recipe.id);

    const categoryLabels = {
      simpel: 'Simpel & Harian',
      minuman: 'Minuman Segar',
      nusantara: 'Nusantara',
      asia: 'Kuliner Asia',
      barat: 'Barat & Latin',
      pastry: 'Pastry & Dessert'
    };

    const diffIcon = recipe.difficulty === 'Mudah' ? '🟢 Mudah' : (recipe.difficulty === 'Sedang' ? '🟡 Sedang' : '🔴 Ahli');

    card.innerHTML = `
      <div class="card-banner">
        <div class="card-decor-circle"></div>
        <span class="card-cat-badge">${categoryLabels[recipe.categoryKey] || recipe.category}</span>
        <button type="button" class="card-fav-btn ${isFav ? 'is-favorite' : ''}" data-id="${recipe.id}" aria-label="Simpan Favorit" title="${isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <span class="card-emoji-hero">${recipe.icon || '🥭'}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${escapeHTML(recipe.title)}</h3>
        <p class="card-summary">${escapeHTML(recipe.desc)}</p>
        <div class="card-chips-row">
          <span class="chip-item">⏱️ ${recipe.totalMinutes} mnt</span>
          <span class="chip-item">🥗 ${recipe.calories}</span>
          <span class="chip-item">👥 ${recipe.servings} Porsi</span>
        </div>
        <div class="card-footer">
          <span class="card-difficulty">${diffIcon}</span>
          <span class="btn-card-action">
            <span>Lihat Resep</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
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
        favBtn.innerHTML = nowFav ? '❤️' : '🤍';
        return;
      }
      openRecipeModal(recipe);
    });

    return card;
  }

  // ===================================================================
  // RECIPE DETAIL MODAL
  // ===================================================================
  function openRecipeModal(recipe) {
    state.currentRecipe = recipe;
    state.portionMultiplier = 1;
    state.checkedIngredients.clear();
    state.checkedSteps.clear();

    const categoryTitles = {
      simpel: 'Olahan Simpel & Harian',
      minuman: 'Minuman Kekinian',
      nusantara: 'Resep Daerah & Nusantara',
      asia: 'Hidangan Khas Asia',
      barat: 'Hidangan Barat & Latin',
      pastry: 'Pastry & Dessert Mewah'
    };

    if (DOM.modalCategoryBadge) DOM.modalCategoryBadge.textContent = categoryTitles[recipe.categoryKey] || recipe.category;
    if (DOM.modalDifficulty) DOM.modalDifficulty.textContent = recipe.difficulty === 'Mudah' ? '🟢 Mudah' : (recipe.difficulty === 'Sedang' ? '🟡 Sedang' : '🔴 Tingkat Ahli');
    if (DOM.modalHeroIcon) DOM.modalHeroIcon.textContent = recipe.icon || '🥭';
    if (DOM.modalRecipeTitle) DOM.modalRecipeTitle.textContent = recipe.title;
    if (DOM.modalSummary) DOM.modalSummary.textContent = recipe.desc;

    if (DOM.modalPrepTime) DOM.modalPrepTime.textContent = recipe.prepTime;
    if (DOM.modalCookTime) DOM.modalCookTime.textContent = recipe.cookTime;
    if (DOM.modalCalories) DOM.modalCalories.textContent = recipe.calories;
    if (DOM.modalMangoType) DOM.modalMangoType.textContent = recipe.mangoType || 'Harum Manis';

    // Scaler Buttons reset
    if (DOM.scalerBtns) {
      DOM.scalerBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-multiplier') === '1');
      });
    }

    renderModalIngredients();
    renderModalSteps();

    // Chef tips & Tags
    if (DOM.modalChefTipsText) DOM.modalChefTipsText.textContent = recipe.tips || 'Pilih mangga berkualitas terbaik untuk kenikmatan maksimal.';
    
    if (DOM.modalTagsContainer) {
      DOM.modalTagsContainer.innerHTML = '';
      if (recipe.tags && Array.isArray(recipe.tags)) {
        recipe.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.className = 'tag-pill';
          tagSpan.textContent = `#${tag}`;
          DOM.modalTagsContainer.appendChild(tagSpan);
        });
      }
    }

    updateModalFavoriteBtnState();
    resetKitchenTimer();

    if (DOM.recipeModalOverlay) {
      DOM.recipeModalOverlay.classList.add('is-open');
      DOM.recipeModalOverlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
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

      const notes = ing.notes ? ` <span style="font-size:0.78rem; opacity:0.8;">(${escapeHTML(ing.notes)})</span>` : '';

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

      li.innerHTML = `
        <span class="step-number">${state.checkedSteps.has(index) ? '✓' : (index + 1)}</span>
        <p class="step-text">${escapeHTML(step)}</p>
      `;

      li.addEventListener('click', () => {
        if (state.checkedSteps.has(index)) {
          state.checkedSteps.delete(index);
          li.classList.remove('is-checked');
          li.querySelector('.step-number').textContent = index + 1;
        } else {
          state.checkedSteps.add(index);
          li.classList.add('is-checked');
          li.querySelector('.step-number').textContent = '✓';
        }
      });

      DOM.modalStepsList.appendChild(li);
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
    DOM.modalFavoriteBtn.querySelector('.util-icon').textContent = isFav ? '❤️' : '⭐';
    DOM.modalFavoriteBtn.querySelector('.util-text').textContent = isFav ? 'Tersimpan' : 'Favorit';
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
          if (DOM.timerStartBtn) DOM.timerStartBtn.textContent = 'Mulai';
          playChimeSound();
          showToast('⏰ Waktu memasak telah selesai!');
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
      DOM.timerStartBtn.textContent = 'Mulai';
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
  // FAVORITES SYSTEM
  // ===================================================================
  function toggleFavorite(recipeId) {
    const idx = state.favorites.indexOf(recipeId);
    if (idx > -1) {
      state.favorites.splice(idx, 1);
      showToast('Dihapus dari Favorit');
    } else {
      state.favorites.push(recipeId);
      showToast('⭐ Ditambahkan ke Favorit!');
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
          <div class="empty-icon">⭐</div>
          <h4 class="empty-title">Belum Ada Resep Favorit</h4>
          <p class="empty-desc">Klik ikon bintang/hati pada resep apa pun untuk menyimpannya ke daftar ini.</p>
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
        row.innerHTML = `
          <div class="fav-item-info">
            <span class="fav-item-emoji">${recipe.icon || '🥭'}</span>
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
    showToast(`🛒 ${addedCount} bahan berhasil ditambahkan ke Daftar Belanja!`);
  }

  function openShoppingListModal() {
    if (!DOM.shoppingItemsList) return;
    DOM.shoppingItemsList.innerHTML = '';

    if (state.shoppingList.length === 0) {
      DOM.shoppingItemsList.innerHTML = `
        <div class="empty-state" style="padding: 30px 10px;">
          <div class="empty-icon">📋</div>
          <h4 class="empty-title">Daftar Belanja Masih Kosong</h4>
          <p class="empty-desc">Buka resep pilihan Anda lalu klik tombol "Beli Bahan" untuk memasukkannya ke sini secara otomatis.</p>
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

    let text = '*📋 DAFTAR BELANJA RESEP ALL MANGGO*\n\n';
    state.shoppingList.forEach((item, idx) => {
      text += `${idx + 1}. ${item.checked ? '[v] ' : '[ ] '} ${item.text}\n`;
    });
    text += '\n_Dibuat dengan web Resep All Manggo_ 🥭';

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
          <span class="variety-origin">📍 ${v.origin}</span>
        </div>
        <div class="variety-sweetness">Tingkat Manis: ${v.sweetness}</div>
        <p class="variety-desc">${v.texture}</p>
        <div class="variety-pairing">✨ Cocok untuk: ${v.bestFor}</div>
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
        DOM.randomDiceIcon.textContent = randomPickedRecipe.icon || '🥭';
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
        .then(() => showToast('🔗 Tautan resep disalin ke clipboard!'))
        .catch(() => showToast('🔗 Tautan siap dibagikan!'));
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
      showToast(`Mode ${nextTheme === 'light' ? 'Terang ☀️' : 'Gelap 🌙'} diaktifkan`);
    });

    // Search Inputs
    let debounceTimer;
    const handleSearch = (val) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = val;
        applyFilters();
      }, 150);
    };

    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', (e) => {
        if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = e.target.value;
        handleSearch(e.target.value);
      });
    }

    if (DOM.mobileSearchInput) {
      DOM.mobileSearchInput.addEventListener('input', (e) => {
        if (DOM.searchInput) DOM.searchInput.value = e.target.value;
        handleSearch(e.target.value);
      });
    }

    // Clear Search Buttons
    on(DOM.clearSearchBtn, 'click', () => {
      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    on(DOM.mobileClearSearchBtn, 'click', () => {
      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.mobileSearchInput) DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    // Category Nav Pills
    if (DOM.categoryPills) {
      DOM.categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          DOM.categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.currentCategory = pill.getAttribute('data-category');
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

    // Keyboard Shortcuts (Escape to close modals)
    document.addEventListener('keydown', (e) => {
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
