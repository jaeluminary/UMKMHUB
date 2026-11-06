/**
 * ============================================================================
 * UMKM HUB - MARKETPLACE SHOWCASE (marketplace.js)
 * Katalog showcase produk publik dengan filter, urutan harga/popularitas,
 * dan modal detail produk terhubung langsung ke WhatsApp penjual.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Utils } from './utils.js';

let allProducts = [];
let allUmkms = [];
let filteredProducts = [];
let activeProduct = null;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allProducts = Store.getAll('products');
  allUmkms = Store.getAll('umkm');

  initUrlParams();
  setupEventListeners();
  applyFiltersAndRender();
});

/**
 * 1. Baca URL Parameters (e.g. ?q=kopi)
 */
function initUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  const cat = urlParams.get('kategori');

  if (q) {
    const input = document.getElementById('marketSearchInput');
    if (input) input.value = q;
  }
  if (cat) {
    const select = document.getElementById('marketCategoryFilter');
    if (select) select.value = cat;
  }
}

/**
 * 2. Setup Event Listeners
 */
function setupEventListeners() {
  const searchInput = document.getElementById('marketSearchInput');
  const catFilter = document.getElementById('marketCategoryFilter');
  const sortOrder = document.getElementById('marketSortOrder');
  const btnReset = document.getElementById('btnResetMarketFilter');

  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => {
      applyFiltersAndRender();
    }, 250));
  }

  if (catFilter) {
    catFilter.addEventListener('change', () => applyFiltersAndRender());
  }

  if (sortOrder) {
    sortOrder.addEventListener('change', () => applyFiltersAndRender());
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = '';
      if (sortOrder) sortOrder.value = 'popular';
      applyFiltersAndRender();
    });
  }

  // Modal events
  const closeBtn = document.getElementById('btnCloseProductModal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => Utils.closeModal('productDetailModal'));
  }

  const modalWishlistBtn = document.getElementById('modalBtnWishlist');
  if (modalWishlistBtn) {
    modalWishlistBtn.addEventListener('click', () => {
      if (activeProduct) {
        Components.toggleWishlistProduct(activeProduct.id);
        updateModalWishlistBtn();
      }
    });
  }
}

/**
 * 3. Terapkan Filter & Sorting
 */
function applyFiltersAndRender() {
  const searchInput = document.getElementById('marketSearchInput');
  const catFilter = document.getElementById('marketCategoryFilter');
  const sortOrder = document.getElementById('marketSortOrder');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = catFilter ? catFilter.value : '';
  const sort = sortOrder ? sortOrder.value : 'popular';

  filteredProducts = allProducts.filter(p => {
    // Cari text
    if (query) {
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      const matchCat = p.category.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // Filter kategori
    if (category && p.category !== category) return false;

    return true;
  });

  // Urutkan
  filteredProducts.sort((a, b) => {
    if (sort === 'popular') return (b.views || 0) - (a.views || 0);
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  renderProductGrid();
}

/**
 * 4. Render Grid Produk
 */
function renderProductGrid() {
  const grid = document.getElementById('marketplaceGrid');
  const countText = document.getElementById('productResultsCount');
  const emptyState = document.getElementById('marketEmptyState');
  if (!grid) return;

  const total = filteredProducts.length;
  if (countText) countText.textContent = `Menampilkan ${total} produk lokal`;

  if (total === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = filteredProducts.map(p => {
    const umkm = allUmkms.find(u => String(u.id) === String(p.umkmId)) || { name: 'UMKM Indonesia', city: 'Indonesia' };
    const imgSvg = p.image || Utils.generateSvgPlaceholder(p.name, p.category, 'product');

    return `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-image-box" style="cursor: pointer;">
          <img src="${imgSvg}" alt="${Utils.escapeHtml(p.name)}" loading="lazy">
          <button class="product-wishlist-btn" data-wishlist-product="${p.id}" aria-label="Simpan ke Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="product-card-body" style="cursor: pointer;">
          <div class="flex items-center justify-between mb-1">
            <a href="umkm.html?id=${umkm.id}" class="product-seller-link" onclick="event.stopPropagation();">
              🏢 ${Utils.escapeHtml(umkm.name)}
            </a>
            <span style="font-size: 0.7rem; color: var(--text-muted);">📍 ${Utils.escapeHtml(umkm.city)}</span>
          </div>
          <h3 class="product-card-title">${Utils.escapeHtml(p.name)}</h3>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${Utils.escapeHtml(p.description)}
          </p>
          <div class="flex items-center justify-between mt-auto pt-2" style="border-top: 1px solid var(--border-light);">
            <div class="product-price">${Utils.formatRupiah(p.price)}</div>
            <button class="btn btn-primary btn-sm btn-view-detail" data-product-id="${p.id}">
              Detail &rarr;
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Klik kartu produk untuk buka modal
  grid.querySelectorAll('.product-card').forEach(card => {
    const pid = card.getAttribute('data-product-id');
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-wishlist-product]') || e.target.closest('.product-seller-link')) return;
      openProductModal(pid);
    });
  });

  // Sinkronisasi status wishlist
  Components.syncGlobalInteractions();
}

/**
 * 5. Buka Modal Detail Produk & Naikkan Counter View
 */
function openProductModal(productId) {
  const product = Store.getById('products', productId);
  if (!product) return;

  activeProduct = product;
  const umkm = Store.getById('umkm', product.umkmId) || { name: 'UMKM Indonesia', city: 'Indonesia', contact: {} };

  // Tambah hit view counter produk
  const currentViews = (product.views || 0) + 1;
  Store.update('products', product.id, { views: currentViews });

  // Isi data modal
  const imgSvg = product.image || Utils.generateSvgPlaceholder(product.name, product.category, 'product');
  document.getElementById('modalProductImage').src = imgSvg;
  document.getElementById('modalProductTitle').textContent = product.name;
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductCategory').textContent = product.category;
  document.getElementById('modalProductPrice').textContent = Utils.formatRupiah(product.price);
  document.getElementById('modalProductDesc').textContent = product.description;

  document.getElementById('modalSellerName').textContent = umkm.name;
  document.getElementById('modalSellerCity').textContent = `📍 ${umkm.city}`;
  document.getElementById('modalSellerProfileLink').href = `umkm.html?id=${umkm.id}`;

  // WhatsApp Button Link
  const waContact = (umkm.contact && umkm.contact.wa) || '';
  const waBtn = document.getElementById('modalBtnWhatsApp');
  if (waBtn) {
    if (waContact) {
      waBtn.href = `https://wa.me/${waContact}?text=${encodeURIComponent(`Halo ${umkm.name}, saya menemukan produk "${product.name}" di UMKM Hub dan ingin memesan atau bertanya ketersediaan.`)}`;
      waBtn.style.display = 'inline-flex';
    } else {
      waBtn.style.display = 'none';
    }
  }

  updateModalWishlistBtn();

  Utils.openModal('productDetailModal');
}

/**
 * 6. Update Visual Tombol Wishlist di dalam Modal
 */
function updateModalWishlistBtn() {
  const btn = document.getElementById('modalBtnWishlist');
  if (!btn || !activeProduct) return;

  const user = Store.getAll('users').find(u => u.id === localStorage.getItem('umkmhub_current_user_id'));
  const isWishlisted = user && user.wishlistProducts && user.wishlistProducts.includes(activeProduct.id);

  if (isWishlisted) {
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-secondary');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#E02424" stroke="#E02424" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span>Tersimpan di Wishlist</span>
    `;
  } else {
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-outline');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      <span>Simpan ke Wishlist</span>
    `;
  }
}

