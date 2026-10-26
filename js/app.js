/**
 * RESEP ALL MANGGO - Main Application Script
 * Interactive recipe encyclopedia for 200 mango culinary creations.
 */

(function () {
  'use strict';

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
    DOM.html.setAttribute('data-theme', theme);
    localStorage.setItem('mango_theme', theme);
  }

  function loadRecipeData() {
    if (window.MANGO_RECIPES && Array.isArray(window.MANGO_RECIPES)) {
      state.allRecipes = window.MANGO_RECIPES;
      finalizeLoadedRecipes();
    } else {
      fetch('data/recipes.json')
        .then(res => res.json())
        .then(data => {
          state.allRecipes = data;
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
      if (counts.hasOwnProperty(r.category)) {
        counts[r.category]++;
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
      result = result.filter(r => r.category === state.currentCategory);
    }

    // Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        const inName = r.name && r.name.toLowerCase().includes(q);
        const inSummary = r.summary && r.summary.toLowerCase().includes(q);
        const inOrigin = r.origin && r.origin.toLowerCase().includes(q);
        const inMango = r.mangoType && r.mangoType.toLowerCase().includes(q);
        const inTags = r.tags && r.tags.some(t => t.toLowerCase().includes(q));
        const inIng = r.ingredients && r.ingredients.some(i => i.name.toLowerCase().includes(q));
        return inName || inSummary || inOrigin || inMango || inTags || inIng;
      });
    }

    // Difficulty
    if (state.difficultyFilter !== 'all') {
      result = result.filter(r => r.difficulty === state.difficultyFilter);
    }

    // Time Filter
    if (state.timeFilter === 'quick') {
      result = result.filter(r => (r.prepTimeMinutes + r.cookTimeMinutes) <= 15);
    } else if (state.timeFilter === 'medium') {
      result = result.filter(r => {
        const total = r.prepTimeMinutes + r.cookTimeMinutes;
        return total > 15 && total <= 30;
      });
    } else if (state.timeFilter === 'long') {
      result = result.filter(r => (r.prepTimeMinutes + r.cookTimeMinutes) > 30);
    }

    // Sort By
    if (state.sortBy === 'time-asc') {
      result.sort((a, b) => (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes));
    } else if (state.sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'id'));
    } else if (state.sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name, 'id'));
    } else if (state.sortBy === 'calories-asc') {
      result.sort((a, b) => a.calories - b.calories);
    }

    state.filteredRecipes = result;
    state.displayedCount = 24; // Reset pagination batch

    updateFilterUI();
    renderRecipeGrid();
  }

  function updateFilterUI() {
    // Heading
    const categoryNames = {
      all: 'Semua Resep Olahan Mangga',
      simpel: 'Olahan Simpel & Harian (Praktis)',
      minuman: 'Minuman Kekinian & Kafe',
      nusantara: 'Resep Daerah & Nusantara',
      asia: 'Kuliner Mangga Khas Asia',
      barat: 'Hidangan Barat, Meksiko & Karibia',
      pastry: 'Pastry, Bakery & Dessert Mewah'
    };
    DOM.activeCategoryHeading.textContent = categoryNames[state.currentCategory] || 'Koleksi Resep Mangga';
    DOM.resultsCountText.textContent = `Menampilkan ${state.filteredRecipes.length} dari ${state.allRecipes.length} resep`;

    // Clear search buttons
    const hasSearch = state.searchQuery.trim().length > 0;
    DOM.clearSearchBtn.style.display = hasSearch ? 'flex' : 'none';
    DOM.mobileClearSearchBtn.style.display = hasSearch ? 'flex' : 'none';

    // Reset button visibility
    const isFiltered = state.currentCategory !== 'all' || hasSearch || state.difficultyFilter !== 'all' || state.timeFilter !== 'all' || state.sortBy !== 'default';
    DOM.resetFiltersBtn.style.display = isFiltered ? 'inline-block' : 'none';
  }

  // Global helper for footer links
  window.filterByCategory = function (category) {
    state.currentCategory = category;
    DOM.categoryPills.forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-category') === category);
    });
    applyFilters();
  };

  // ===================================================================
  // RECIPE GRID RENDERING
  // ===================================================================
  function renderRecipeGrid() {
    DOM.recipeGrid.innerHTML = '';

    if (state.filteredRecipes.length === 0) {
      DOM.emptyState.style.display = 'block';
      DOM.loadMoreContainer.style.display = 'none';
      return;
    }

    DOM.emptyState.style.display = 'none';

    const slice = state.filteredRecipes.slice(0, state.displayedCount);

    const fragment = document.createDocumentFragment();
    slice.forEach(recipe => {
      const card = createRecipeCardElement(recipe);
      fragment.appendChild(card);
    });

    DOM.recipeGrid.appendChild(fragment);

    // Show or hide Load More
    if (state.displayedCount < state.filteredRecipes.length) {
      DOM.loadMoreContainer.style.display = 'flex';
      DOM.loadMoreBtn.innerHTML = `<span>Tampilkan Lebih Banyak (${state.filteredRecipes.length - state.displayedCount} tersisa)</span>`;
    } else {
      DOM.loadMoreContainer.style.display = 'none';
    }
  }

  function createRecipeCardElement(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.setAttribute('data-id', recipe.id);

    const isFav = state.favorites.includes(recipe.id);
    const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);

    const categoryLabels = {
      simpel: 'Simpel',
      minuman: 'Minuman',
      nusantara: 'Nusantara',
      asia: 'Asia',
      barat: 'Barat',
      pastry: 'Pastry'
    };

    const diffIcon = recipe.difficulty === 'Mudah' ? '🟢 Mudah' : (recipe.difficulty === 'Sedang' ? '🟡 Sedang' : '🔴 Ahli');

    card.innerHTML = `
      <div class="card-banner">
        <div class="card-decor-circle"></div>
        <span class="card-cat-badge">${categoryLabels[recipe.category] || recipe.category}</span>
        <button type="button" class="card-fav-btn ${isFav ? 'is-favorite' : ''}" data-id="${recipe.id}" aria-label="Simpan Favorit" title="${isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <span class="card-emoji-hero">${recipe.emoji || '🥭'}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${escapeHTML(recipe.name)}</h3>
        <p class="card-summary">${escapeHTML(recipe.summary)}</p>
        <div class="card-chips-row">
          <span class="chip-item">⏱️ ${totalTime} mnt</span>
          <span class="chip-item">🥗 ${recipe.calories} kkal</span>
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
      // If clicked the favorite button specifically
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

    // Header & Meta
    DOM.modalCategoryBadge.textContent = categoryTitles[recipe.category] || recipe.category;
    DOM.modalDifficulty.textContent = recipe.difficulty === 'Mudah' ? '🟢 Mudah' : (recipe.difficulty === 'Sedang' ? '🟡 Sedang' : '🔴 Tingkat Ahli');
    DOM.modalHeroIcon.textContent = recipe.emoji || '🥭';
    DOM.modalRecipeTitle.textContent = recipe.name;
    DOM.modalSummary.textContent = recipe.summary;

    DOM.modalPrepTime.textContent = `${recipe.prepTimeMinutes} mnt`;
    DOM.modalCookTime.textContent = `${recipe.cookTimeMinutes} mnt`;
    DOM.modalCalories.textContent = `${recipe.calories} kkal`;
    DOM.modalMangoType.textContent = recipe.mangoType || 'Harum Manis';

    // Scaler Buttons reset
    DOM.scalerBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-multiplier') === '1');
    });

    renderModalIngredients();
    renderModalSteps();

    // Chef tips & Tags
    DOM.modalChefTipsText.textContent = recipe.chefTips || 'Pilih mangga berkualitas terbaik untuk kenikmatan maksimal.';
    
    DOM.modalTagsContainer.innerHTML = '';
    if (recipe.tags && Array.isArray(recipe.tags)) {
      recipe.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag-pill';
        tagSpan.textContent = `#${tag}`;
        DOM.modalTagsContainer.appendChild(tagSpan);
      });
    }

    // Favorite button inside modal
    updateModalFavoriteBtnState();

    // Reset Timer display
    resetKitchenTimer();

    // Open Modal Overlay
    DOM.recipeModalOverlay.classList.add('is-open');
    DOM.recipeModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeRecipeModal() {
    DOM.recipeModalOverlay.classList.remove('is-open');
    DOM.recipeModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    state.currentRecipe = null;
    resetKitchenTimer();
  }

  function renderModalIngredients() {
    if (!state.currentRecipe) return;

    const recipe = state.currentRecipe;
    const mult = state.portionMultiplier;
    const baseServings = recipe.servings || 2;
    const scaledServings = Math.round(baseServings * mult);
    DOM.modalServingsDisplay.textContent = `(${scaledServings} Porsi)`;

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

      li.innerHTML = `
        <span class="custom-checkbox">${state.checkedIngredients.has(index) ? '✓' : ''}</span>
        <span class="ingredient-text">
          <strong class="ingredient-amount">${scaledAmount}</strong> ${escapeHTML(ing.name)}
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
    if (!state.currentRecipe) return;

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
    if (!state.currentRecipe) return;
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
      // Default to recipe cook time or 5 minutes
      const cookTime = state.currentRecipe ? (state.currentRecipe.cookTimeMinutes || 5) : 5;
      state.timer.remainingSeconds = cookTime * 60;
    }

    if (state.timer.isRunning) {
      // Pause
      clearInterval(state.timer.interval);
      state.timer.isRunning = false;
      DOM.timerStartBtn.textContent = 'Lanjutkan';
      DOM.timerStartBtn.classList.remove('btn-secondary');
      DOM.timerStartBtn.classList.add('btn-primary');
    } else {
      // Start
      state.timer.isRunning = true;
      DOM.timerStartBtn.textContent = 'Jeda';
      DOM.timerStartBtn.classList.remove('btn-primary');
      DOM.timerStartBtn.classList.add('btn-secondary');

      state.timer.interval = setInterval(() => {
        if (state.timer.remainingSeconds > 0) {
          state.timer.remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(state.timer.interval);
          state.timer.isRunning = false;
          DOM.timerStartBtn.textContent = 'Mulai';
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
    DOM.timerStartBtn.textContent = 'Mulai';
    DOM.timerStartBtn.classList.remove('btn-secondary');
    DOM.timerStartBtn.classList.add('btn-primary');
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
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
      console.warn('Web Audio not supported or blocked:', e);
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
    DOM.favoritesCountBadge.textContent = favCount;
    DOM.mobFavBadge.textContent = favCount;

    const shopCount = state.shoppingList.length;
    DOM.shoppingCountBadge.textContent = shopCount;
    DOM.mobShopBadge.textContent = shopCount;
  }

  function openFavoritesModal() {
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
            <span class="fav-item-emoji">${recipe.emoji || '🥭'}</span>
            <div>
              <div class="fav-item-title">${escapeHTML(recipe.name)}</div>
              <div class="fav-item-meta">${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mnt • ${recipe.difficulty}</div>
            </div>
          </div>
          <button type="button" class="shopping-delete-btn" title="Hapus dari Favorit">&times;</button>
        `;

        row.addEventListener('click', (e) => {
          if (e.target.closest('.shopping-delete-btn')) {
            e.stopPropagation();
            toggleFavorite(recipe.id);
            openFavoritesModal(); // refresh
            renderRecipeGrid(); // update card
            return;
          }
          closeFavoritesModal();
          openRecipeModal(recipe);
        });

        grid.appendChild(row);
      });

      DOM.favoritesListContainer.appendChild(grid);
    }

    DOM.favoritesModalOverlay.classList.add('is-open');
    DOM.favoritesModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFavoritesModal() {
    DOM.favoritesModalOverlay.classList.remove('is-open');
    DOM.favoritesModalOverlay.setAttribute('aria-hidden', 'true');
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

      const itemText = `${scaledAmount} ${ing.name} (untuk ${state.currentRecipe.name})`.trim();
      
      // Avoid exact duplicates
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

    DOM.shoppingModalOverlay.classList.add('is-open');
    DOM.shoppingModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeShoppingListModal() {
    DOM.shoppingModalOverlay.classList.remove('is-open');
    DOM.shoppingModalOverlay.setAttribute('aria-hidden', 'true');
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
    DOM.mangoGuideModalOverlay.classList.add('is-open');
    DOM.mangoGuideModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMangoGuideModal() {
    DOM.mangoGuideModalOverlay.classList.remove('is-open');
    DOM.mangoGuideModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ===================================================================
  // RANDOM RECIPE INSPIRATION
  // ===================================================================
  let randomPickedRecipe = null;

  function openRandomRecipeModal() {
    DOM.randomRecipeModalOverlay.classList.add('is-open');
    DOM.randomRecipeModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    rollRandomRecipe();
  }

  function closeRandomRecipeModal() {
    DOM.randomRecipeModalOverlay.classList.remove('is-open');
    DOM.randomRecipeModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function rollRandomRecipe() {
    DOM.randomDiceIcon.style.animation = 'roll 0.25s infinite alternate';
    DOM.randomResultTitle.textContent = 'Mengacak Resep...';
    DOM.randomResultDesc.textContent = 'Mencari resep mangga paling pas untuk selera Anda hari ini...';
    DOM.openRandomRecipeDetailBtn.disabled = true;

    setTimeout(() => {
      const pool = state.allRecipes.length > 0 ? state.allRecipes : window.MANGO_RECIPES || [];
      if (pool.length === 0) return;

      const randomIdx = Math.floor(Math.random() * pool.length);
      randomPickedRecipe = pool[randomIdx];

      DOM.randomDiceIcon.textContent = randomPickedRecipe.emoji || '🥭';
      DOM.randomDiceIcon.style.animation = 'none';
      DOM.randomResultTitle.textContent = randomPickedRecipe.name;
      DOM.randomResultDesc.textContent = randomPickedRecipe.summary;
      DOM.openRandomRecipeDetailBtn.disabled = false;
    }, 600);
  }

  // ===================================================================
  // TOAST NOTIFICATIONS & SHARE
  // ===================================================================
  function showToast(message) {
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
      title: `${state.currentRecipe.name} - Resep All Manggo`,
      text: `Cobain resep ${state.currentRecipe.name}! ${state.currentRecipe.summary}`,
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
    DOM.themeToggleBtn.addEventListener('click', () => {
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

    DOM.searchInput.addEventListener('input', (e) => {
      DOM.mobileSearchInput.value = e.target.value;
      handleSearch(e.target.value);
    });

    DOM.mobileSearchInput.addEventListener('input', (e) => {
      DOM.searchInput.value = e.target.value;
      handleSearch(e.target.value);
    });

    // Clear Search Buttons
    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    DOM.mobileClearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.mobileSearchInput.value = '';
      state.searchQuery = '';
      applyFilters();
    });

    // Category Nav Pills
    DOM.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.currentCategory = pill.getAttribute('data-category');
        applyFilters();
      });
    });

    // Difficulty & Time Filters & Sort
    DOM.difficultyFilter.addEventListener('change', (e) => {
      state.difficultyFilter = e.target.value;
      applyFilters();
    });

    DOM.timeFilter.addEventListener('change', (e) => {
      state.timeFilter = e.target.value;
      applyFilters();
    });

    DOM.sortSelect.addEventListener('change', (e) => {
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

      DOM.searchInput.value = '';
      DOM.mobileSearchInput.value = '';
      DOM.difficultyFilter.value = 'all';
      DOM.timeFilter.value = 'all';
      DOM.sortSelect.value = 'default';

      DOM.categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      applyFilters();
    };

    DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
    DOM.emptyResetBtn.addEventListener('click', resetAllFilters);

    // Load More
    DOM.loadMoreBtn.addEventListener('click', () => {
      state.displayedCount += 24;
      renderRecipeGrid();
    });

    // CTA & Header Buttons
    DOM.exploreAllBtn.addEventListener('click', () => {
      document.getElementById('kategori').scrollIntoView({ behavior: 'smooth' });
    });

    DOM.heroRandomBtn.addEventListener('click', openRandomRecipeModal);
    DOM.randomRecipeBtn.addEventListener('click', openRandomRecipeModal);

    DOM.openFavoritesBtn.addEventListener('click', openFavoritesModal);
    DOM.openShoppingListBtn.addEventListener('click', openShoppingListModal);

    DOM.openMangoGuideBtn.addEventListener('click', openMangoGuideModal);
    DOM.spotlightGuideBtn.addEventListener('click', openMangoGuideModal);
    DOM.footerMangoGuideLink.addEventListener('click', (e) => { e.preventDefault(); openMangoGuideModal(); });
    DOM.footerRandomLink.addEventListener('click', (e) => { e.preventDefault(); openRandomRecipeModal(); });
    DOM.footerShoppingLink.addEventListener('click', (e) => { e.preventDefault(); openShoppingListModal(); });
    DOM.footerFavoritesLink.addEventListener('click', (e) => { e.preventDefault(); openFavoritesModal(); });

    // Recipe Detail Modal Events
    DOM.modalCloseBtn.addEventListener('click', closeRecipeModal);
    DOM.recipeModalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.recipeModalOverlay) closeRecipeModal();
    });

    // Scaler Buttons
    DOM.scalerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.scalerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.portionMultiplier = parseFloat(btn.getAttribute('data-multiplier'));
        renderModalIngredients();
      });
    });

    // Modal Action Buttons
    DOM.modalFavoriteBtn.addEventListener('click', () => {
      if (!state.currentRecipe) return;
      toggleFavorite(state.currentRecipe.id);
      updateModalFavoriteBtnState();
      renderRecipeGrid();
    });

    DOM.modalAddShoppingBtn.addEventListener('click', addCurrentRecipeToShoppingList);
    DOM.modalShareBtn.addEventListener('click', shareRecipe);
    DOM.modalPrintBtn.addEventListener('click', () => window.print());

    // Timer Widget Events
    DOM.timerStartBtn.addEventListener('click', startKitchenTimer);
    DOM.timerResetBtn.addEventListener('click', resetKitchenTimer);
    DOM.timerPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = parseInt(btn.getAttribute('data-sec'), 10);
        state.timer.remainingSeconds += sec;
        updateTimerDisplay();
      });
    });

    // Favorites Drawer Events
    DOM.closeFavoritesModalBtn.addEventListener('click', closeFavoritesModal);
    DOM.favoritesModalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.favoritesModalOverlay) closeFavoritesModal();
    });

    // Shopping List Drawer Events
    DOM.closeShoppingModalBtn.addEventListener('click', closeShoppingListModal);
    DOM.shoppingModalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.shoppingModalOverlay) closeShoppingListModal();
    });
    DOM.shareShoppingWhatsappBtn.addEventListener('click', shareShoppingViaWhatsApp);
    DOM.clearShoppingListBtn.addEventListener('click', clearShoppingList);

    // Kamus Mangga Modal Events
    DOM.closeMangoGuideModalBtn.addEventListener('click', closeMangoGuideModal);
    DOM.mangoGuideModalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.mangoGuideModalOverlay) closeMangoGuideModal();
    });

    // Random Modal Events
    DOM.closeRandomModalBtn.addEventListener('click', closeRandomRecipeModal);
    DOM.randomRecipeModalOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.randomRecipeModalOverlay) closeRandomRecipeModal();
    });
    DOM.rollAgainBtn.addEventListener('click', rollRandomRecipe);
    DOM.openRandomRecipeDetailBtn.addEventListener('click', () => {
      if (randomPickedRecipe) {
        closeRandomRecipeModal();
        openRecipeModal(randomPickedRecipe);
      }
    });

    // Mobile Bottom Navigation Bar Events
    DOM.mobNavHome.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    DOM.mobNavCat.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('kategori').scrollIntoView({ behavior: 'smooth' });
    });
    DOM.mobNavRandom.addEventListener('click', openRandomRecipeModal);
    DOM.mobNavFav.addEventListener('click', openFavoritesModal);
    DOM.mobNavShop.addEventListener('click', openShoppingListModal);

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
