/**
 * ============================================================================
 * UMKM HUB - PROFIL BISNIS DIGITAL (umkm.js)
 * Mini showcase & kartu nama digital interaktif:
 * Mini Leaflet map, galeri produk, auto views increment, ajak kolaborasi modal.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let currentUmkm = null;
let miniMapInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  const urlParams = new URLSearchParams(window.location.search);
  const umkmId = urlParams.get('id') || 'umkm-1';

  currentUmkm = Store.getById('umkm', umkmId);
  if (!currentUmkm) {
    // Fallback ke umkm pertama jika ID tidak valid
    currentUmkm = Store.getAll('umkm')[0];
  }

  // Tambahkan hit counter view profil (real-time interaction tracking)
  incrementProfileViews(currentUmkm);

  renderProfileData();
  renderProducts();
  renderMiniMap();
  setupActionButtons();
  setupCollabModal();
});

/**
 * 1. Tambah Counter Kunjungan Profil
 */
function incrementProfileViews(umkm) {
  const currentViews = ((umkm.stats && umkm.stats.views) || 0) + 1;
  const updatedStats = { ...(umkm.stats || {}), views: currentViews };
  Store.update('umkm', umkm.id, { stats: updatedStats });

  // Update visual di DOM
  const viewsEl = document.getElementById('profileViewsCount');
  if (viewsEl) viewsEl.textContent = currentViews;
}

/**
 * 2. Render Informasi Profil UMKM
 */
function renderProfileData() {
  const u = currentUmkm;
  if (!u) return;

  document.title = `${u.name} - Profil Bisnis UMKM Hub`;

  // Cover Banner & Logo SVG Placeholder
  const bannerBox = document.getElementById('profileCoverBanner');
  const logoBox = document.getElementById('profileLogoBox');

  const bannerSvg = u.banner || Utils.generateSvgPlaceholder(u.name, u.category, 'banner');
  const logoSvg = u.logo || Utils.generateSvgPlaceholder(u.name, u.category, 'logo');

  if (bannerBox) {
    bannerBox.style.backgroundImage = `url("${bannerSvg}")`;
    bannerBox.style.backgroundSize = 'cover';
    bannerBox.style.backgroundPosition = 'center';
  }

  if (logoBox) {
    logoBox.innerHTML = `<img src="${logoSvg}" alt="${Utils.escapeHtml(u.name)}" style="width: 100%; height: 100%; border-radius: var(--radius-lg); object-fit: cover;">`;
  }

  // Teks Header
  document.getElementById('profileName').textContent = u.name;
  document.getElementById('profileCategoryBadge').textContent = u.category;
  document.getElementById('profileSlogan').textContent = u.slogan || u.category;
  document.getElementById('profileCityText').textContent = `📍 ${u.city}`;
  document.getElementById('profileRatingText').textContent = `★ ${u.rating || 4.8}`;
  document.getElementById('profileFollowerCount').textContent = (u.stats && u.stats.followers) || 0;

  const collabBadge = document.getElementById('profileCollabBadge');
  if (collabBadge) {
    collabBadge.style.display = u.isOpenCollab ? 'inline-flex' : 'none';
  }

  // Deskripsi & Kisah Usaha
  document.getElementById('profileDescription').textContent = u.description;
  document.getElementById('profileStory').textContent = u.story || 'Belum ada kisah usaha yang dicantumkan.';

  // Kontak
  const contact = u.contact || {};
  const waBtn = document.getElementById('btnWhatsAppContact');
  const waLink = document.getElementById('profileContactWa');
  const emailLink = document.getElementById('profileContactEmail');
  const phoneText = document.getElementById('profileContactPhone');
  const igText = document.getElementById('profileContactIg');
  const addressText = document.getElementById('profileAddressText');

  const waUrl = contact.wa
    ? `https://wa.me/${contact.wa}?text=${encodeURIComponent(`Halo ${u.name}, saya menemukan usaha Anda di UMKM Hub dan tertarik bekerjasama.`)}`
    : '#';

  if (waBtn) waBtn.href = waUrl;
  if (waLink) {
    waLink.href = waUrl;
    waLink.textContent = contact.wa || '-';
  }
  if (emailLink) {
    emailLink.href = contact.email ? `mailto:${contact.email}` : '#';
    emailLink.textContent = contact.email || '-';
  }
  if (phoneText) phoneText.textContent = contact.phone || '-';
  if (igText) igText.textContent = contact.instagram || '-';
  if (addressText) addressText.textContent = u.address || u.city;

  // Direct Message Link
  const dmBtn = document.getElementById('btnDirectMessage');
  if (dmBtn) {
    dmBtn.href = `komunitas.html?dm=${encodeURIComponent(u.ownerId || 'user-seller-demo')}`;
  }

  // Tag Kebutuhan
  const needsContainer = document.getElementById('profileNeedsTags');
  if (needsContainer) {
    if (u.needs && u.needs.length > 0) {
      needsContainer.innerHTML = u.needs.map(n => `<span class="tag-item">🔍 ${Utils.escapeHtml(n)}</span>`).join('');
    } else {
      needsContainer.innerHTML = '<span style="font-size: var(--text-xs); color: var(--text-muted);">Tidak mencantumkan kebutuhan spesifik saat ini.</span>';
    }
  }

  // Tag Penawaran
  const offersContainer = document.getElementById('profileOffersTags');
  if (offersContainer) {
    if (u.offers && u.offers.length > 0) {
      offersContainer.innerHTML = u.offers.map(o => `<span class="tag-item tag-offer">🤝 ${Utils.escapeHtml(o)}</span>`).join('');
    } else {
      offersContainer.innerHTML = '<span style="font-size: var(--text-xs); color: var(--text-muted);">Tidak mencantumkan penawaran spesifik saat ini.</span>';
    }
  }
}

/**
 * 3. Render Produk UMKM Ini
 */
function renderProducts() {
  const container = document.getElementById('profileProductsGrid');
  const badge = document.getElementById('productCountBadge');
  if (!container) return;

  const products = Store.query('products', p => String(p.umkmId) === String(currentUmkm.id));

  if (badge) badge.textContent = `${products.length} Produk`;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-secondary); background: var(--surface-bg); border-radius: var(--radius-md);">
        UMKM ini belum memajang produk di etalase.
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(p => {
    const imgSvg = p.image || Utils.generateSvgPlaceholder(p.name, p.category, 'product');
    return `
      <article class="product-card">
        <div class="product-image-box">
          <img src="${imgSvg}" alt="${Utils.escapeHtml(p.name)}" loading="lazy">
          <button class="product-wishlist-btn" data-wishlist-product="${p.id}" aria-label="Simpan ke Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div class="product-card-body">
          <h3 class="product-card-title">${Utils.escapeHtml(p.name)}</h3>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${Utils.escapeHtml(p.description)}
          </p>
          <div class="product-price">${Utils.formatRupiah(p.price)}</div>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * 4. Inisialisasi Mini Map Leaflet
 */
function renderMiniMap() {
  const mapContainer = document.getElementById('miniMap');
  if (!mapContainer || typeof L === 'undefined') return;

  const lat = currentUmkm.lat || -6.2088;
  const lng = currentUmkm.lng || 106.8456;

  try {
    miniMapInstance = L.map('miniMap', {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(miniMapInstance);

    const marker = L.marker([lat, lng]).addTo(miniMapInstance);
    marker.bindPopup(`<strong>${Utils.escapeHtml(currentUmkm.name)}</strong><br>${Utils.escapeHtml(currentUmkm.address || currentUmkm.city)}`).openPopup();
  } catch (e) {
    console.warn('Leaflet mini map warning:', e);
  }
}

/**
 * 5. Setup Action Buttons (Follow & Share)
 */
function setupActionButtons() {
  const followBtn = document.getElementById('btnFollowProfile');
  if (followBtn) {
    followBtn.setAttribute('data-follow-umkm', currentUmkm.id);
  }

  // Share Web Share API / Copy Link
  const shareBtn = document.getElementById('btnShareProfile');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: `${currentUmkm.name} - UMKM Hub`,
        text: `Lihat profil bisnis dan produk ${currentUmkm.name} di UMKM Hub Indonesia!`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled
        }
      } else {
        // Fallback: Copy URL to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          Utils.showToast('Tautan profil berhasil disalin ke clipboard!', 'success');
        } catch (e) {
          Utils.showToast('Gagal menyalin tautan.', 'error');
        }
      }
    });
  }
}

/**
 * 6. Setup Modal Ajak Kolaborasi
 */
function setupCollabModal() {
  const openBtn = document.getElementById('btnOpenCollabModal');
  const closeBtn = document.getElementById('btnCloseCollabModal');
  const cancelBtn = document.getElementById('btnCancelCollab');
  const modal = document.getElementById('collabModal');
  const form = document.getElementById('collabForm');
  const selectNeed = document.getElementById('collabNeedSelect');
  const targetName = document.getElementById('collabTargetName');

  if (targetName) targetName.textContent = currentUmkm.name;

  // Isi opsi kebutuhan
  if (selectNeed) {
    selectNeed.innerHTML = '<option value="">Pilih topik kemitraan...</option>';
    if (currentUmkm.needs && currentUmkm.needs.length > 0) {
      currentUmkm.needs.forEach(n => {
        selectNeed.innerHTML += `<option value="${Utils.escapeHtml(n)}">${Utils.escapeHtml(n)}</option>`;
      });
    }
    selectNeed.innerHTML += '<option value="Kemitraan Umum Lainnya">Kemitraan Umum Lainnya</option>';
  }

  const openModal = () => {
    if (!Auth.requireAuth('mengajak kolaborasi bisnis')) return;
    Utils.openModal('collabModal');
  };

  const closeModal = () => {
    Utils.closeModal('collabModal');
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const user = Auth.getCurrentUser();
      const needVal = selectNeed.value;
      const messageVal = document.getElementById('collabMessage').value.trim();

      if (!needVal || !messageVal) {
        Utils.showToast('Mohon lengkapi semua kolom form kolaborasi.', 'error');
        return;
      }

      // Simpan permintaan kolaborasi ke store
      Store.create('collabRequests', {
        fromUmkmId: user.umkmId || 'user-sender',
        toUmkmId: currentUmkm.id,
        senderName: user.name,
        message: messageVal,
        needOffered: needVal,
        status: 'pending'
      });

      closeModal();
      form.reset();
      Utils.showToast(`Permintaan kolaborasi berhasil dikirimkan ke ${currentUmkm.name}!`, 'success', 4000);
    });
  }
}

