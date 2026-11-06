/**
 * ============================================================================
 * UMKM HUB - PENCARIAN UMKM (cari.js)
 * Mesin pencarian cerdas dengan autosuggest, penyorotan kata kunci (highlighting),
 * multi-filter (kategori, kota, kolaborasi), chip filter aktif, & pagination.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Utils } from './utils.js';

let allUmkm = [];
let filteredUmkm = [];
let currentPageNum = 1;
const ITEMS_PER_PAGE = 8;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allUmkm = Store.getAll('umkm');

  initUrlParams();
  setupEventListeners();
  applyFiltersAndRender();
});

/**
 * 1. Baca Parameter URL Awal (e.g. ?q=kopi&kategori=Kuliner)
 */
function initUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get('q');
  const kategori = urlParams.get('kategori');
  const kota = urlParams.get('kota');
  const collab = urlParams.get('terbukaKolaborasi');

  if (q) {
    const input = document.getElementById('searchInput');
    if (input) input.value = q;
  }
  if (kategori) {
    const select = document.getElementById('filterKategori');
    if (select) select.value = kategori;
  }
  if (kota) {
    const select = document.getElementById('filterKota');
    if (select) select.value = kota;
  }
  if (collab === 'true') {
    const cb = document.getElementById('filterCollabOnly');
    if (cb) cb.checked = true;
  }
}

/**
 * 2. Setup Event Listeners & Autosuggest
 */
function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const btnClear = document.getElementById('btnClearSearch');
  const filterKategori = document.getElementById('filterKategori');
  const filterKota = document.getElementById('filterKota');
  const filterCollab = document.getElementById('filterCollabOnly');
  const sortOrder = document.getElementById('sortOrder');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const btnEmptyReset = document.getElementById('btnEmptyReset');
  const btnLoadMore = document.getElementById('btnLoadMore');
  const autosuggest = document.getElementById('searchAutosuggest');

  // Input search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (btnClear) {
        btnClear.style.display = searchInput.value ? 'flex' : 'none';
      }
      handleAutosuggest(searchInput.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (autosuggest) autosuggest.style.display = 'none';
        currentPageNum = 1;
        applyFiltersAndRender();
      }
    });
  }

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      searchInput.value = '';
      btnClear.style.display = 'none';
      if (autosuggest) autosuggest.style.display = 'none';
      currentPageNum = 1;
      applyFiltersAndRender();
    });
  }

  // Filter perubahan select & checkbox
  [filterKategori, filterKota, filterCollab, sortOrder].forEach(el => {
    if (el) {
      el.addEventListener('change', () => {
        currentPageNum = 1;
        applyFiltersAndRender();
      });
    }
  });

  // Reset filters
  const resetAll = () => {
    if (searchInput) searchInput.value = '';
    if (btnClear) btnClear.style.display = 'none';
    if (filterKategori) filterKategori.value = '';
    if (filterKota) filterKota.value = '';
    if (filterCollab) filterCollab.checked = false;
    if (sortOrder) sortOrder.value = 'relevance';
    if (autosuggest) autosuggest.style.display = 'none';
    currentPageNum = 1;
    applyFiltersAndRender();
  };

  if (btnResetFilters) btnResetFilters.addEventListener('click', resetAll);
  if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetAll);

  // Load More
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      currentPageNum += 1;
      renderCurrentPage(false);
    });
  }

  // Tutup autosuggest jika klik di luar
  document.addEventListener('click', (e) => {
    if (searchInput && autosuggest && !searchInput.contains(e.target) && !autosuggest.contains(e.target)) {
      autosuggest.style.display = 'none';
    }
  });
}

/**
 * 3. Logika Autosuggest Cepat
 */
function handleAutosuggest(rawQuery) {
  const autosuggest = document.getElementById('searchAutosuggest');
  const searchInput = document.getElementById('searchInput');
  if (!autosuggest) return;

  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) {
    autosuggest.style.display = 'none';
    autosuggest.innerHTML = '';
    return;
  }

  const matches = allUmkm.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.category.toLowerCase().includes(query) ||
    u.city.toLowerCase().includes(query)
  ).slice(0, 5);

  if (matches.length === 0) {
    autosuggest.style.display = 'none';
    return;
  }

  autosuggest.innerHTML = matches.map(u => `
    <li class="autosuggest-item" data-value="${Utils.escapeHtml(u.name)}">
      <div>
        <strong>${Utils.highlightQuery(u.name, query)}</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 6px;">📍 ${Utils.escapeHtml(u.city)}</span>
      </div>
      <span class="autosuggest-category">${Utils.escapeHtml(u.category)}</span>
    </li>
  `).join('');

  autosuggest.style.display = 'block';

  autosuggest.querySelectorAll('.autosuggest-item').forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-value');
      if (searchInput) searchInput.value = val;
      autosuggest.style.display = 'none';
      currentPageNum = 1;
      applyFiltersAndRender();
    });
  });
}

/**
 * 4. Terapkan Filter & Sorting
 */
function applyFiltersAndRender() {
  const searchInput = document.getElementById('searchInput');
  const filterKategori = document.getElementById('filterKategori');
  const filterKota = document.getElementById('filterKota');
  const filterCollab = document.getElementById('filterCollabOnly');
  const sortOrder = document.getElementById('sortOrder');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const kat = filterKategori ? filterKategori.value : '';
  const kota = filterKota ? filterKota.value : '';
  const isCollab = filterCollab ? filterCollab.checked : false;
  const sort = sortOrder ? sortOrder.value : 'relevance';

  renderActiveFilterChips(query, kat, kota, isCollab);

  filteredUmkm = allUmkm.filter(u => {
    // 1. Text Search (nama, deskripsi, kebutuhan, penawaran, kota, kategori)
    if (query) {
      const matchName = u.name.toLowerCase().includes(query);
      const matchDesc = u.description.toLowerCase().includes(query);
      const matchCat = u.category.toLowerCase().includes(query);
      const matchCity = u.city.toLowerCase().includes(query);
      const matchNeeds = (u.needs || []).some(n => n.toLowerCase().includes(query));
      const matchOffers = (u.offers || []).some(o => o.toLowerCase().includes(query));

      if (!matchName && !matchDesc && !matchCat && !matchCity && !matchNeeds && !matchOffers) {
        return false;
      }
    }

    // 2. Filter Kategori
    if (kat && u.category !== kat) {
      return false;
    }

    // 3. Filter Kota
    if (kota && u.city !== kota) {
      return false;
    }

    // 4. Terbuka Kolaborasi
    if (isCollab && !u.isOpenCollab) {
      return false;
    }

    return true;
  });

  // Sorting
  filteredUmkm.sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'views') return ((b.stats && b.stats.views) || 0) - ((a.stats && a.stats.views) || 0);
    if (sort === 'name_asc') return a.name.localeCompare(b.name);
    // Default 'relevance': prioritaskan yang nama cocok, lalu verified
    return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
  });

  renderCurrentPage(true);
}

/**
 * 5. Render Chip Filter Aktif
 */
function renderActiveFilterChips(query, kat, kota, isCollab) {
  const container = document.getElementById('activeChipsContainer');
  if (!container) return;

  const chips = [];
  if (query) {
    chips.push({ id: 'chip-query', label: `Kata kunci: "${query}"`, type: 'query' });
  }
  if (kat) {
    chips.push({ id: 'chip-kat', label: `Kategori: ${kat}`, type: 'kategori' });
  }
  if (kota) {
    chips.push({ id: 'chip-kota', label: `Kota: ${kota}`, type: 'kota' });
  }
  if (isCollab) {
    chips.push({ id: 'chip-collab', label: 'Terbuka Kolaborasi', type: 'collab' });
  }

  if (chips.length === 0) {
    container.innerHTML = '<span style="font-size: var(--text-xs); color: var(--text-muted);">Menampilkan seluruh daftar UMKM terdaftar</span>';
    return;
  }

  container.innerHTML = `
    <span style="font-size: var(--text-xs); font-weight: 700; color: var(--navy); margin-right: 4px;">Filter Aktif:</span>
    ${chips.map(c => `
      <div class="chip active" data-chip-type="${c.type}">
        <span>${Utils.escapeHtml(c.label)}</span>
        <button class="chip-remove" aria-label="Hapus filter ${Utils.escapeHtml(c.label)}">&times;</button>
      </div>
    `).join('')}
  `;

  // Listener hapus chip satu per satu
  container.querySelectorAll('.chip').forEach(chip => {
    chip.querySelector('.chip-remove').addEventListener('click', () => {
      const type = chip.getAttribute('data-chip-type');
      if (type === 'query') {
        const input = document.getElementById('searchInput');
        if (input) input.value = '';
      } else if (type === 'kategori') {
        const sel = document.getElementById('filterKategori');
        if (sel) sel.value = '';
      } else if (type === 'kota') {
        const sel = document.getElementById('filterKota');
        if (sel) sel.value = '';
      } else if (type === 'collab') {
        const cb = document.getElementById('filterCollabOnly');
        if (cb) cb.checked = false;
      }
      currentPageNum = 1;
      applyFiltersAndRender();
    });
  });
}

/**
 * 6. Render Hasil Kartu UMKM & Pagination
 */
function renderCurrentPage(resetGrid = false) {
  const grid = document.getElementById('umkmResultsGrid');
  const countText = document.getElementById('resultsCountText');
  const emptyState = document.getElementById('searchEmptyState');
  const loadMoreWrapper = document.getElementById('loadMoreWrapper');
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value.trim() : '';

  if (!grid || !countText) return;

  const total = filteredUmkm.length;
  countText.textContent = `Ditemukan ${total} UMKM yang sesuai`;

  if (total === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (loadMoreWrapper) loadMoreWrapper.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  const endIdx = currentPageNum * ITEMS_PER_PAGE;
  const pageItems = filteredUmkm.slice(0, endIdx);

  const html = pageItems.map(u => {
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
            <a href="umkm.html?id=${u.id}">${Utils.highlightQuery(u.name, query)}</a>
          </h3>
          <div class="umkm-card-city">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${Utils.highlightQuery(u.city, query)}</span>
            <span style="margin: 0 4px;">&bull;</span>
            <span style="color: #F59E0B; font-weight: 700;">★ ${u.rating}</span>
          </div>
          <p class="umkm-card-desc">${Utils.highlightQuery(u.description, query)}</p>
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

  grid.innerHTML = html;

  // Tombol Muat Lebih Banyak
  if (loadMoreWrapper) {
    loadMoreWrapper.style.display = endIdx < total ? 'block' : 'none';
  }

  // Sinkronkan kembali tombol follow
  Components.syncGlobalInteractions();
}

