/**
 * YOU'RE MAKEUP - Luxury Glam JavaScript
 * Handles Premium Navbar, Cart Drawer, Wishlist, Shop Filters, Toasts & Interactive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Cart State Management ---
  let cart = [
    {
      id: 1,
      title: "Velvet Siren Matte Lipstick",
      price: 34,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80",
      quantity: 1
    },
    {
      id: 2,
      title: "Starlight Chromatic Palette",
      price: 68,
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=300&q=80",
      quantity: 1
    }
  ];

  let wishlistCount = 1;

  // --- Element Selectors ---
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartCountBadges = document.querySelectorAll('.cart-badge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const toastEl = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');

  // Mobile drawer elements
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');

  // --- Toast Notification Helper ---
  function showToast(message, iconClass = 'fa-solid fa-sparkles') {
    if (!toastEl) return;
    toastEl.querySelector('i').className = iconClass;
    toastMessage.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // --- Cart Drawer Toggles ---
  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      renderCart();
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  // --- Render Cart Items ---
  function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-solid fa-bag-shopping" style="font-size: 40px; color: var(--hot-pink); margin-bottom: 15px; opacity: 0.6;"></i>
          <p style="font-size: 15px; margin-bottom: 15px;">Your glam bag is currently empty.</p>
          <a href="shop.html" class="btn btn-primary" style="padding: 10px 22px; font-size: 12px;" onclick="closeCartDrawer()">Explore Cosmetics</a>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-qty-row">
              <button class="qty-btn btn-qty-minus" data-id="${item.id}"><i class="fa-solid fa-minus"></i></button>
              <span style="font-size: 13px; font-weight: 600; color: #fff;">${item.quantity}</span>
              <button class="qty-btn btn-qty-plus" data-id="${item.id}"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');
    }

    // Attach quantity and remove listeners
    cartItemsContainer.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = cart.find(i => i.id === id);
        if (item) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            cart = cart.filter(i => i.id !== id);
          }
          updateCartSummary();
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity++;
          updateCartSummary();
          renderCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        cart = cart.filter(i => i.id !== id);
        updateCartSummary();
        renderCart();
        showToast("Item removed from your bag", "fa-solid fa-circle-check");
      });
    });

    updateCartSummary();
  }

  function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Badges
    cartCountBadges.forEach(badge => {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (cartTotalEl) {
      cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
  }

  // Initialize summary badge on start
  updateCartSummary();

  // --- Add to Cart Event Listeners (Home & Shop) ---
  document.querySelectorAll('.btn-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;

      const id = parseInt(card.dataset.id || Math.floor(Math.random() * 9000 + 100));
      const title = card.querySelector('.product-title')?.textContent.trim() || "Luxury Glam Product";
      const priceText = card.querySelector('.product-current-price')?.textContent.replace(/[^0-9.]/g, '') || "35";
      const price = parseFloat(priceText);
      const image = card.querySelector('img')?.src || "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=300&q=80";

      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ id, title, price, image, quantity: 1 });
      }

      updateCartSummary();
      showToast(`Added "${title}" to your Glam Bag!`, 'fa-solid fa-bag-shopping');

      // Pulse cart button
      if (cartBtn) {
        cartBtn.style.transform = 'scale(1.25)';
        setTimeout(() => { cartBtn.style.transform = ''; }, 300);
      }
    });
  });

  // --- Wishlist Interaction ---
  const wishlistDot = document.querySelector('.wishlist-dot');
  document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        if (icon) {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
        wishlistCount = Math.max(0, wishlistCount - 1);
        showToast("Removed from Wishlist", "fa-regular fa-heart");
      } else {
        btn.classList.add('active');
        if (icon) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        }
        wishlistCount++;
        showToast("Added to Wishlist! 💖", "fa-solid fa-heart");
      }

      if (wishlistDot) {
        wishlistDot.style.display = wishlistCount > 0 ? 'block' : 'none';
      }
    });
  });

  // --- Mobile Hamburger Menu ---
  if (hamburgerBtn && mobileNavDrawer && mobileOverlay) {
    function toggleMobileMenu() {
      const isOpen = mobileNavDrawer.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', toggleMobileMenu);

    mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Search Bar Behavior ---
  const navSearchForms = document.querySelectorAll('.nav-search-wrapper');
  navSearchForms.forEach(form => {
    const input = form.querySelector('.nav-search-input');
    const btn = form.querySelector('.nav-search-btn');

    function performSearch() {
      const query = input?.value.trim().toLowerCase();
      if (!query) return;

      if (window.location.pathname.endsWith('shop.html')) {
        filterShopProducts(query);
      } else {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
      }
    }

    if (btn) btn.addEventListener('click', performSearch);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch();
        }
      });
    }
  });

  // --- Shop Page Filtering & Sorting Logic ---
  const shopGrid = document.getElementById('shopProductsGrid');
  if (shopGrid) {
    const filterItems = document.querySelectorAll('.filter-item');
    const sortSelect = document.getElementById('sortSelect');
    const priceSlider = document.getElementById('priceRangeSlider');
    const maxPriceDisplay = document.getElementById('maxPriceDisplay');
    const resetFilterBtn = document.getElementById('resetFiltersBtn');
    const productCards = Array.from(shopGrid.querySelectorAll('.product-card'));
    const resultsCountEl = document.getElementById('resultsCount');

    let currentCategory = 'all';
    let maxPrice = 85;

    // Check URL for search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      filterShopProducts(searchParam.toLowerCase());
      const desktopSearch = document.querySelector('.nav-search-input');
      if (desktopSearch) desktopSearch.value = searchParam;
    }

    // Category click
    filterItems.forEach(item => {
      item.addEventListener('click', () => {
        filterItems.forEach(fi => fi.classList.remove('active'));
        item.classList.add('active');
        currentCategory = item.dataset.category || 'all';
        applyShopFilters();
      });
    });

    // Price Slider
    if (priceSlider && maxPriceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        maxPrice = parseFloat(e.target.value);
        maxPriceDisplay.textContent = `$${maxPrice}`;
        applyShopFilters();
      });
    }

    // Sort Dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        sortProducts(sortSelect.value);
      });
    }

    // Reset filters
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        currentCategory = 'all';
        filterItems.forEach(fi => fi.classList.remove('active'));
        filterItems[0]?.classList.add('active');
        if (priceSlider) {
          priceSlider.value = 85;
          maxPrice = 85;
          maxPriceDisplay.textContent = '$85';
        }
        applyShopFilters();
        showToast("Filters reset to default", "fa-solid fa-rotate-left");
      });
    }

    function applyShopFilters() {
      let visibleCount = 0;
      productCards.forEach(card => {
        const category = card.dataset.category || '';
        const price = parseFloat(card.dataset.price || '0');

        const matchesCategory = (currentCategory === 'all' || category.toLowerCase() === currentCategory.toLowerCase());
        const matchesPrice = price <= maxPrice;

        if (matchesCategory && matchesPrice) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (resultsCountEl) {
        resultsCountEl.textContent = visibleCount;
      }
    }

    function sortProducts(criteria) {
      const sortedCards = [...productCards].sort((a, b) => {
        const priceA = parseFloat(a.dataset.price || '0');
        const priceB = parseFloat(b.dataset.price || '0');
        const nameA = a.querySelector('.product-title')?.textContent.trim() || '';
        const nameB = b.querySelector('.product-title')?.textContent.trim() || '';

        if (criteria === 'price-low') return priceA - priceB;
        if (criteria === 'price-high') return priceB - priceA;
        if (criteria === 'name') return nameA.localeCompare(nameB);
        return 0; // default / featured
      });

      sortedCards.forEach(card => shopGrid.appendChild(card));
    }

    window.filterShopProducts = function(query) {
      let count = 0;
      productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const cat = card.dataset.category?.toLowerCase() || '';
        if (title.includes(query) || cat.includes(query)) {
          card.style.display = 'flex';
          count++;
        } else {
          card.style.display = 'none';
        }
      });
      if (resultsCountEl) resultsCountEl.textContent = count;
      showToast(`Showing results for "${query}"`, 'fa-solid fa-magnifying-glass');
    };
  }

  // --- FAQ Accordion (Contact Page) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        faqItems.forEach(fi => fi.classList.remove('active'));
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // --- Newsletter Form Handler ---
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        showToast("💄 Welcome to the VIP Glam Club! Check your inbox for your 20% code.", "fa-solid fa-gift");
        input.value = '';
      }
    });
  });

  // --- Contact Form Handler ---
  const contactForm = document.getElementById('glamContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Dispatched';
        showToast("💌 Thank you, darling! Our VIP concierge will contact you shortly.", "fa-solid fa-paper-plane");
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 2500);
      }, 1200);
    });
  }

  // --- Auth Login/Register Switch & Submission (index.html) ---
  const loginForm = document.getElementById('loginForm');
  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  const authSubmitBtn = document.getElementById('authSubmitBtn');

  if (authTabBtns.length > 0) {
    authTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        authTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.tab;
        if (authSubmitBtn) {
          authSubmitBtn.textContent = mode === 'signup' ? 'Create VIP Account' : 'Sign In & Enter Glam';
        }
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
      btn.disabled = true;

      setTimeout(() => {
        showToast("Welcome back, Glam Queen! 💖", "fa-solid fa-crown");
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 800);
      }, 1000);
    });
  }
});
