/**
 * ============================================================================
 * UMKM HUB - BERANDA (index.js)
 * Logika halaman beranda: hero autosuggest, statistik dinamis,
 * kategori populer, UMKM unggulan, preview board & forum.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Utils } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  loadLiveStats();
  setupHeroSearch();
  renderCategories();
  renderFeaturedUmkm();
  renderRecentBoard();
  renderForumPreview();
});

/**
 * 1. Muat Statistik Dinamis dari Store
 */
function loadLiveStats() {
  const umkms = Store.getAll('umkm');
  const products = Store.getAll('products');
  const boardPosts = Store.getAll('boardPosts');

  const uniqueCities = new Set(umkms.map(u => u.city)).size;

  const statUmkm = document.getElementById('statUmkmCount');
  const statProd = document.getElementById('statProductCount');
  const statCollab = document.getElementById('statCollabCount');
  const statCity = document.getElementById('statCityCount');

  if (statUmkm) statUmkm.textContent = `${umkms.length}+`;
  if (statProd) statProd.textContent = `${products.length}+`;
  if (statCollab) statCollab.textContent = `${boardPosts.length}+`;
  if (statCity) statCity.textContent = `${uniqueCities}`;
}

/**
 * 2. Setup Search Bar & Autosuggest
 */
function setupHeroSearch() {
  const input = document.getElementById('heroSearchInput');
  const btn = document.getElementById('heroSearchBtn');
  const autosuggest = document.getElementById('heroAutosuggest');
  if (!input || !autosuggest) return;

  const umkms = Store.getAll('umkm');
  const products = Store.getAll('products');

  const handleSearchSubmit = () => {
    const q = input.value.trim();
    if (q) {
      window.location.href = `cari.html?q=${encodeURIComponent(q)}`;
    } else {
      window.location.href = 'cari.html';
    }
  };

  if (btn) btn.addEventListener('click', handleSearchSubmit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  });

  // Autosuggestion debounced
  input.addEventListener('input', Utils.debounce(() => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      autosuggest.style.display = 'none';
      autosuggest.innerHTML = '';
      return;
    }

    const matchedUmkm = umkms.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.category.toLowerCase().includes(query) ||
      u.city.toLowerCase().includes(query)
    ).slice(0, 4);

    const matchedProd = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).slice(0, 3);

    if (matchedUmkm.length === 0 && matchedProd.length === 0) {
      autosuggest.style.display = 'none';
      return;
    }

    let html = '';
    matchedUmkm.forEach(u => {
      html += `
        <li class="autosuggest-item" data-url="umkm.html?id=${u.id}">
          <div>
            <strong>${Utils.escapeHtml(u.name)}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">📍 ${Utils.escapeHtml(u.city)}</span>
          </div>
          <span class="autosuggest-category">UMKM &bull; ${Utils.escapeHtml(u.category)}</span>
        </li>
      `;
    });

    matchedProd.forEach(p => {
      html += `
        <li class="autosuggest-item" data-url="marketplace.html?q=${encodeURIComponent(p.name)}">
          <div>
            <span>🛍️ ${Utils.escapeHtml(p.name)}</span>
            <span style="font-size: 0.75rem; color: var(--navy); font-weight: 700; margin-left: 6px;">${Utils.formatRupiah(p.price)}</span>
          </div>
          <span class="autosuggest-category">Produk</span>
        </li>
      `;
    });

    autosuggest.innerHTML = html;
    autosuggest.style.display = 'block';

    autosuggest.querySelectorAll('.autosuggest-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        if (url) window.location.href = url;
      });
    });
  }, 200));

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !autosuggest.contains(e.target)) {
      autosuggest.style.display = 'none';
    }
  });
}

/**
 * 3. Render Kategori Populer
 */
function renderCategories() {
  const container = document.getElementById('categoryGrid');
  if (!container) return;

  const categories = [
    { name: 'Kuliner', icon: '🍲', count: '8 UMKM' },
    { name: 'Kriya & Kerajinan', icon: '🎨', count: '5 UMKM' },
    { name: 'Fesyen', icon: '👗', count: '4 UMKM' },
    { name: 'Pertanian & Agro', icon: '🌱', count: '4 UMKM' },
    { name: 'Jasa', icon: '🛠️', count: '3 UMKM' },
    { name: 'Teknologi & Digital', icon: '💻', count: '1 UMKM' },
    { name: 'Kecantikan & Herbal', icon: '🌿', count: '1 UMKM' }
  ];

  container.innerHTML = categories.map(cat => `
    <a href="cari.html?kategori=${encodeURIComponent(cat.name)}" class="category-card">
      <div class="category-icon-box" style="font-size: 1.5rem;">${cat.icon}</div>
      <div>
        <div class="category-name">${Utils.escapeHtml(cat.name)}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${cat.count}</div>
      </div>
    </a>
  `).join('');
}

/**
 * 4. Render UMKM Unggulan
 */
function renderFeaturedUmkm() {
  const container = document.getElementById('featuredUmkmGrid');
  if (!container) return;

  const umkms = Store.getAll('umkm').slice(0, 6);

  container.innerHTML = umkms.map(u => {
    const logoSvg = Utils.generateSvgPlaceholder(u.name, u.category, 'logo');
    return `
      <article class="umkm-card">
        <div class="umkm-card-banner">
          <div class="umkm-card-logo">
            <img src="${logoSvg}" alt="${Utils.escapeHtml(u.name)}" style="width: 100%; height: 100%; border-radius: var(--radius-sm); object-fit: cover;">
          </div>
        </div>
        <div class="umkm-card-body">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="badge badge-sky">${Utils.escapeHtml(u.category)}</span>
            ${u.isOpenCollab ? `<span class="badge badge-collab">Terbuka Kolaborasi</span>` : ''}
          </div>
          <h3 class="umkm-card-title">
            <a href="umkm.html?id=${u.id}">${Utils.escapeHtml(u.name)}</a>
          </h3>
          <div class="umkm-card-city">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${Utils.escapeHtml(u.city)}</span>
            <span style="margin: 0 4px;">&bull;</span>
            <span style="color: #F59E0B; font-weight: 700;">★ ${u.rating}</span>
          </div>
          <p class="umkm-card-desc">${Utils.escapeHtml(u.description)}</p>
          <div class="umkm-card-footer">
            <button class="btn btn-outline-blue btn-sm" data-follow-umkm="${u.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              Ikuti
            </button>
            <a href="umkm.html?id=${u.id}" class="btn btn-primary btn-sm">
              Lihat Profil
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * 5. Render Board Kolaborasi Terbaru
 */
function renderRecentBoard() {
  const container = document.getElementById('recentBoardGrid');
  if (!container) return;

  const posts = Store.getAll('boardPosts').slice(0, 3);
  const umkms = Store.getAll('umkm');

  const badgeMap = {
    'pemasok': { class: 'badge-pemasok', label: 'Cari Pemasok' },
    'mitra': { class: 'badge-mitra', label: 'Cari Mitra' },
    'kolaborasi': { class: 'badge-kolaborasi', label: 'Terbuka Kolaborasi' },
    'acara': { class: 'badge-acara', label: 'Peluang Acara' },
    'layanan': { class: 'badge-layanan', label: 'Tawarkan Layanan' }
  };

  container.innerHTML = posts.map(post => {
    const author = umkms.find(u => u.id === post.authorUmkmId) || { name: 'UMKM Indonesia', city: 'Indonesia' };
    const badgeInfo = badgeMap[post.type] || { class: 'badge-navy', label: post.type };

    return `
      <article class="board-item-card">
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="badge ${badgeInfo.class}">${badgeInfo.label}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${Utils.formatRelativeTime(post.createdAt)}</span>
        </div>
        <h3 style="font-size: var(--text-base); margin-bottom: 0.5rem; line-height: 1.35;">
          <a href="board.html?id=${post.id}">${Utils.escapeHtml(post.title)}</a>
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${Utils.escapeHtml(post.description)}
        </p>
        <div class="board-meta-row">
          <span>🏢 ${Utils.escapeHtml(author.name)}</span>
          <span>📍 ${Utils.escapeHtml(post.location)}</span>
          <a href="board.html?id=${post.id}" class="btn btn-ghost btn-sm" style="margin-left: auto; color: var(--blue);">
            Lihat Detail &rarr;
          </a>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * 6. Render Forum Preview
 */
function renderForumPreview() {
  const container = document.getElementById('forumPreviewGrid');
  if (!container) return;

  const threads = Store.getAll('forumThreads').slice(0, 3);

  container.innerHTML = threads.map(t => `
    <article class="card card-interactive">
      <div class="flex items-center justify-between mb-2">
        <span class="badge badge-sky">${Utils.escapeHtml(t.category)}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${Utils.formatRelativeTime(t.createdAt)}</span>
      </div>
      <h3 style="font-size: var(--text-base); margin-bottom: 0.5rem; line-height: 1.35;">
        <a href="forum.html?id=${t.id}">${Utils.escapeHtml(t.title)}</a>
      </h3>
      <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${Utils.escapeHtml(t.content)}
      </p>
      <div class="flex items-center justify-between" style="margin-top: auto; padding-top: 0.75rem; border-top: 1px solid var(--border-light); font-size: var(--text-xs); color: var(--text-secondary);">
        <span>Oleh <strong>${Utils.escapeHtml(t.authorName)}</strong></span>
        <div class="flex items-center gap-3">
          <span>▲ ${t.upvotes ? t.upvotes.length : 0}</span>
          <span>💬 ${t.commentsCount || (t.comments ? t.comments.length : 0)}</span>
        </div>
      </div>
    </article>
  `).join('');
}

