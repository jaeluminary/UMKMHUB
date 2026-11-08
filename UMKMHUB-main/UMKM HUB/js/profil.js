/**
 * ============================================================================
 * UMKM HUB - PROFIL PENGGUNA (profil.js)
 * Tampilan profil akun: koleksi wishlist produk, daftar UMKM yang diikuti,
 * dan pengaturan profil dengan kompresi foto Canvas.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let currentUser = null;
let uploadedAvatarBase64 = '';

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  // Guard: Hanya untuk yang sudah Login
  if (!Auth.isLoggedIn()) {
    Utils.showToast('Silakan masuk untuk melihat profil akun Anda.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html?returnUrl=profil.html';
    }, 600);
    return;
  }

  currentUser = Auth.getCurrentUser();

  setupTabs();
  renderProfileHeader();
  renderWishlistProducts();
  renderFollowingUmkm();
  setupSettingsForm();

  // Listener logout
  const btnLogout = document.getElementById('btnLogoutProfile');
  if (btnLogout) btnLogout.addEventListener('click', () => Auth.logout());
});

/**
 * 1. Setup Tab Navigasi
 */
function setupTabs() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');

  const btnWish = document.getElementById('tabBtnWishlistProd');
  const btnFollow = document.getElementById('tabBtnFollowing');
  const btnSet = document.getElementById('tabBtnSettings');

  const panelWish = document.getElementById('panelWishlistProd');
  const panelFollow = document.getElementById('panelFollowing');
  const panelSet = document.getElementById('panelSettings');

  const switchTab = (tabName) => {
    [btnWish, btnFollow, btnSet].forEach(b => b.classList.remove('active'));
    [panelWish, panelFollow, panelSet].forEach(p => p.style.display = 'none');

    if (tabName === 'following') {
      btnFollow.classList.add('active');
      panelFollow.style.display = 'block';
    } else if (tabName === 'settings') {
      btnSet.classList.add('active');
      panelSet.style.display = 'block';
    } else {
      btnWish.classList.add('active');
      panelWish.style.display = 'block';
    }
  };

  btnWish.addEventListener('click', () => switchTab('wishlist'));
  btnFollow.addEventListener('click', () => switchTab('following'));
  btnSet.addEventListener('click', () => switchTab('settings'));

  if (tabParam === 'following') switchTab('following');
  else if (tabParam === 'settings') switchTab('settings');
  else switchTab('wishlist');
}

/**
 * 2. Render Header Profil
 */
function renderProfileHeader() {
  const u = currentUser;
  if (!u) return;

  document.getElementById('userProfileName').textContent = u.name;
  document.getElementById('userProfileEmail').textContent = u.email;
  document.getElementById('userProfileBio').textContent = u.bio || 'Pengguna terdaftar di UMKM Hub.';

  const roleBadge = document.getElementById('userRoleBadge');
  if (roleBadge) {
    roleBadge.textContent = u.role === 'seller' ? 'Seller UMKM' : 'Pengguna';
    roleBadge.className = u.role === 'seller' ? 'badge badge-collab' : 'badge badge-sky';
  }

  const avatarBox = document.getElementById('userProfileAvatarBox');
  if (avatarBox) {
    if (u.avatar) {
      avatarBox.innerHTML = `<img src="${u.avatar}" alt="${Utils.escapeHtml(u.name)}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      avatarBox.textContent = u.name ? u.name.charAt(0).toUpperCase() : 'U';
    }
  }

  // Pre-fill form settings
  const nameInput = document.getElementById('settingName');
  const bioInput = document.getElementById('settingBio');
  if (nameInput) nameInput.value = u.name || '';
  if (bioInput) bioInput.value = u.bio || '';
}

/**
 * 3. Render Daftar Produk Wishlist
 */
function renderWishlistProducts() {
  const container = document.getElementById('userWishlistProductsGrid');
  const emptyBox = document.getElementById('emptyWishlistProd');
  const countSpan = document.getElementById('countWishlistProd');
  if (!container) return;

  const wishlistIds = currentUser.wishlistProducts || [];
  if (countSpan) countSpan.textContent = wishlistIds.length;

  if (wishlistIds.length === 0) {
    container.innerHTML = '';
    if (emptyBox) emptyBox.style.display = 'flex';
    return;
  }

  if (emptyBox) emptyBox.style.display = 'none';

  const allProducts = Store.getAll('products');
  const allUmkm = Store.getAll('umkm');
  const myProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  container.innerHTML = myProducts.map(p => {
    const umkm = allUmkm.find(u => String(u.id) === String(p.umkmId)) || { name: 'UMKM Indonesia', id: 'umkm-1' };
    const imgSvg = p.image || Utils.generateSvgPlaceholder(p.name, p.category, 'product');

    return `
      <article class="product-card" id="card-wishlist-${p.id}">
        <div class="product-image-box">
          <img src="${imgSvg}" alt="${Utils.escapeHtml(p.name)}" loading="lazy">
        </div>
        <div class="product-card-body">
          <div style="font-size: 0.72rem; color: var(--blue); font-weight: 600; margin-bottom: 2px;">
            <a href="umkm.html?id=${umkm.id}">${Utils.escapeHtml(umkm.name)}</a>
          </div>
          <h3 class="product-card-title">${Utils.escapeHtml(p.name)}</h3>
          <div class="product-price mb-3">${Utils.formatRupiah(p.price)}</div>
          <div class="flex items-center justify-between gap-2 mt-auto pt-2" style="border-top: 1px solid var(--border-light);">
            <a href="marketplace.html?q=${encodeURIComponent(p.name)}" class="btn btn-outline btn-sm">
              Lihat di Katalog
            </a>
            <button class="btn btn-ghost btn-sm btn-remove-wishlist" data-remove-product="${p.id}" style="color: var(--danger-text);">
              Hapus
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Listener hapus dari wishlist
  container.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-remove-product');
      Components.toggleWishlistProduct(pid);
      currentUser = Auth.getCurrentUser();
      renderWishlistProducts();
    });
  });
}

/**
 * 4. Render Daftar UMKM yang Diikuti (Following)
 */
function renderFollowingUmkm() {
  const container = document.getElementById('userFollowingUmkmGrid');
  const emptyBox = document.getElementById('emptyFollowing');
  const countSpan = document.getElementById('countFollowing');
  if (!container) return;

  const followingIds = currentUser.following || [];
  if (countSpan) countSpan.textContent = followingIds.length;

  if (followingIds.length === 0) {
    container.innerHTML = '';
    if (emptyBox) emptyBox.style.display = 'flex';
    return;
  }

  if (emptyBox) emptyBox.style.display = 'none';

  const allUmkm = Store.getAll('umkm');
  const myFollowing = allUmkm.filter(u => followingIds.includes(u.id));

  container.innerHTML = myFollowing.map(u => {
    const logoSvg = u.logo || Utils.generateSvgPlaceholder(u.name, u.category, 'logo');

    return `
      <article class="card" id="card-following-${u.id}" style="padding: 1.25rem;">
        <div class="flex items-center gap-3 mb-2">
          <img src="${logoSvg}" alt="${Utils.escapeHtml(u.name)}" style="width: 50px; height: 50px; border-radius: var(--radius-md); object-fit: cover;">
          <div>
            <h3 style="font-size: var(--text-base); color: var(--navy); margin: 0;">
              <a href="umkm.html?id=${u.id}">${Utils.escapeHtml(u.name)}</a>
            </h3>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">📍 ${Utils.escapeHtml(u.city)} &bull; ${Utils.escapeHtml(u.category)}</span>
          </div>
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.45; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${Utils.escapeHtml(u.description)}
        </p>
        <div class="flex items-center justify-between gap-2 mt-auto pt-2" style="border-top: 1px solid var(--border-light);">
          <a href="umkm.html?id=${u.id}" class="btn btn-outline btn-sm">Profil</a>
          <button class="btn btn-ghost btn-sm btn-unfollow" data-unfollow-id="${u.id}" style="color: var(--danger-text);">
            Batal Mengikuti
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Listener Batal Mengikuti
  container.querySelectorAll('.btn-unfollow').forEach(btn => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-unfollow-id');
      Components.toggleFollowUmkm(uid);
      currentUser = Auth.getCurrentUser();
      renderFollowingUmkm();
    });
  });
}

/**
 * 5. Setup Form Pengaturan Profil
 */
function setupSettingsForm() {
  const form = document.getElementById('formUserSettings');
  const avatarInput = document.getElementById('settingAvatarInput');

  if (avatarInput) {
    avatarInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        Utils.showToast('Mengompresi foto profil...', 'info');
        const compressed = await Utils.compressImage(file, 400, 0.85);
        uploadedAvatarBase64 = compressed;

        const avatarBox = document.getElementById('userProfileAvatarBox');
        if (avatarBox) {
          avatarBox.innerHTML = `<img src="${compressed}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        Utils.showToast('Foto profil siap disimpan.', 'success');
      } catch (err) {
        Utils.showToast('Gagal memproses foto: ' + err.message, 'error');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('settingName').value.trim();
      const bio = document.getElementById('settingBio').value.trim();

      if (!name) {
        Utils.showToast('Nama tidak boleh kosong.', 'error');
        return;
      }

      const updates = { name, bio };
      if (uploadedAvatarBase64) updates.avatar = uploadedAvatarBase64;

      const updated = Store.update('users', currentUser.id, updates);
      currentUser = updated;

      Utils.showToast('Profil Anda berhasil diperbarui!', 'success');
      renderProfileHeader();
    });
  }
}

