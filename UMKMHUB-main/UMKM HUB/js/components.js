/**
 * ============================================================================
 * UMKM HUB - SHARED COMPONENTS & GLOBAL LAYOUT ENGINE
 * Injeksi Navbar, Footer, Mobile Bottom-Nav, Wishlist, & Follow Handlers
 * ============================================================================
 */

import { Store } from './store.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';
import { INITIAL_DATA, initSeedData } from './data.js';

export const Components = {
  /**
   * Inisialisasi komponen di semua halaman
   */
  init() {
    // 1. Pastikan data seed terinisialisasi
    initSeedData(Store);

    // 2. Render Navbar, Bottom Nav, dan Footer jika ada kontainernya
    this.renderNavbar();
    this.renderBottomNav();
    this.renderFooter();

    // 3. Pasang listener event global
    this.bindGlobalEvents();

    // 4. Update status wishlist & following di halaman
    this.syncGlobalInteractions();
  },

  /**
   * Mendapatkan nama file saat ini (contoh: "cari.html")
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.toLowerCase();
  },

  /**
   * Render Navbar Responsif (Desktop & Mobile Drawer)
   */
  renderNavbar() {
    const navPlaceholder = document.getElementById('site-navbar');
    if (!navPlaceholder) return;

    const currentPage = this.getCurrentPage();
    const user = Auth.getCurrentUser();
    const isSeller = Auth.isSeller();

    let userActionHtml = '';
    if (user) {
      const avatarInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
      userActionHtml = `
        <div class="flex items-center gap-2">
          ${isSeller ? `
            <a href="dashboard.html" class="btn btn-primary btn-sm ${currentPage === 'dashboard.html' ? 'btn-blue' : ''}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span>Dashboard</span>
            </a>
          ` : `
            <a href="login.html?mode=seller-register" class="btn btn-cta btn-sm hide-mobile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
              <span>Daftar UMKM</span>
            </a>
          `}
          <div style="position: relative;">
            <button id="userDropdownTrigger" class="user-menu-trigger" aria-label="Menu Pengguna">
              <span class="user-menu-avatar">${avatarInitial}</span>
              <span class="hide-mobile font-semibold text-navy text-xs" style="max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${Utils.escapeHtml(user.name)}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div id="userDropdownMenu" style="display: none; position: absolute; right: 0; top: 110%; background: #ffffff; border: 1px solid var(--border-medium); border-radius: var(--radius-md); box-shadow: var(--shadow-lg); width: 200px; padding: 0.5rem; z-index: var(--z-dropdown);">
              <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-light); margin-bottom: 0.35rem;">
                <p style="font-weight: 700; color: var(--navy); font-size: var(--text-xs); margin: 0;">${Utils.escapeHtml(user.name)}</p>
                <p style="font-size: 0.7rem; color: var(--text-muted); margin: 0;">${user.role === 'seller' ? 'Seller UMKM' : 'Pengguna'}</p>
              </div>
              <a href="profil.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; font-size: var(--text-xs); color: var(--navy); border-radius: var(--radius-sm); font-weight: 600;" onmouseover="this.style.background='var(--blue-light)'" onmouseout="this.style.background='transparent'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Profil Saya
              </a>
              ${isSeller ? `
                <a href="dashboard.html" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; font-size: var(--text-xs); color: var(--navy); border-radius: var(--radius-sm); font-weight: 600;" onmouseover="this.style.background='var(--blue-light)'" onmouseout="this.style.background='transparent'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard Seller
                </a>
              ` : ''}
              <a href="profil.html?tab=wishlist" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; font-size: var(--text-xs); color: var(--navy); border-radius: var(--radius-sm); font-weight: 600;" onmouseover="this.style.background='var(--blue-light)'" onmouseout="this.style.background='transparent'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Wishlist & Favorit
              </a>
              <div style="border-top: 1px solid var(--border-light); margin: 0.35rem 0;"></div>
              <button id="btnLogout" style="width: 100%; text-align: left; display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.75rem; font-size: var(--text-xs); color: var(--danger-text); border-radius: var(--radius-sm); font-weight: 600;" onmouseover="this.style.background='var(--danger-bg)'" onmouseout="this.style.background='transparent'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Keluar
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      userActionHtml = `
        <div class="flex items-center gap-2">
          <a href="login.html" class="btn btn-outline btn-sm">Masuk</a>
          <a href="login.html?mode=seller-register" class="btn btn-cta btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            <span class="hide-mobile">Daftar UMKM</span>
            <span class="hide-desktop">Daftar</span>
          </a>
        </div>
      `;
    }

    navPlaceholder.innerHTML = `
      <header class="navbar" role="banner">
        <div class="container">
          <!-- Logo Brand -->
          <a href="index.html" class="nav-brand" title="Beranda UMKM Hub">
            <div class="nav-logo-badge">U</div>
            <span>UMKM<span style="color: var(--blue);">Hub</span></span>
          </a>

          <!-- Desktop Links: Ringkas, Rapi & Tidak Menumpuk -->
          <nav class="nav-links" aria-label="Menu Utama">
            <a href="index.html" class="nav-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">Beranda</a>
            <a href="cari.html" class="nav-link ${currentPage === 'cari.html' ? 'active' : ''}">Cari</a>
            <a href="marketplace.html" class="nav-link ${currentPage === 'marketplace.html' ? 'active' : ''}">Marketplace</a>
            <a href="board.html" class="nav-link ${currentPage === 'board.html' ? 'active' : ''}">Board</a>
            <a href="matcher.html" class="nav-link ${currentPage === 'matcher.html' ? 'active' : ''}">Matcher</a>
            <a href="forum.html" class="nav-link ${currentPage === 'forum.html' ? 'active' : ''}">Forum</a>
            <a href="komunitas.html" class="nav-link ${currentPage === 'komunitas.html' ? 'active' : ''}">Komunitas</a>
            <a href="peta.html" class="nav-link ${currentPage === 'peta.html' ? 'active' : ''}">Peta</a>
          </nav>

          <!-- Aksi & Hamburger -->
          <div class="nav-actions">
            ${userActionHtml}
            <button id="mobileMenuToggle" class="hamburger-btn" aria-label="Buka Menu Navigasi">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Drawer Modal -->
      <div id="drawerBackdrop" class="mobile-drawer-backdrop"></div>
      <aside id="mobileDrawer" class="mobile-drawer" aria-label="Navigasi Menu Mobile">
        <div class="drawer-header">
          <a href="index.html" class="nav-brand">
            <div class="nav-logo-badge">U</div>
            <span>UMKM<span style="color: var(--blue);">Hub</span></span>
          </a>
          <button id="drawerCloseBtn" class="btn-icon" aria-label="Tutup Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="drawer-links">
          <a href="index.html" class="drawer-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Beranda
          </a>
          <a href="cari.html" class="drawer-link ${currentPage === 'cari.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Cari UMKM
          </a>
          <a href="marketplace.html" class="drawer-link ${currentPage === 'marketplace.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Marketplace
          </a>
          <a href="matcher.html" class="drawer-link ${currentPage === 'matcher.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            Matcher B2B
          </a>
          <a href="board.html" class="drawer-link ${currentPage === 'board.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Board Kolaborasi
          </a>
          <a href="forum.html" class="drawer-link ${currentPage === 'forum.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Forum Diskusi
          </a>
          <a href="komunitas.html" class="drawer-link ${currentPage === 'komunitas.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Komunitas & Chat
          </a>
          <a href="peta.html" class="drawer-link ${currentPage === 'peta.html' ? 'active' : ''}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            Peta UMKM
          </a>
        </div>
        <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-light);">
          ${user ? `
            <a href="profil.html" class="btn btn-outline btn-full mb-2">Profil Akun</a>
            ${isSeller ? `<a href="dashboard.html" class="btn btn-primary btn-full mb-2">Dashboard Seller</a>` : ''}
          ` : `
            <a href="login.html" class="btn btn-outline btn-full mb-2">Masuk ke Akun</a>
            <a href="login.html?mode=seller-register" class="btn btn-cta btn-full">Daftarkan UMKM-mu</a>
          `}
        </div>
      </aside>
    `;

    // Dropdown User toggle
    const dropdownTrigger = document.getElementById('userDropdownTrigger');
    const dropdownMenu = document.getElementById('userDropdownMenu');
    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isOpen ? 'none' : 'block';
      });

      document.addEventListener('click', () => {
        dropdownMenu.style.display = 'none';
      });
    }

    // Mobile Drawer Toggle
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const closeBtn = document.getElementById('drawerCloseBtn');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');

    const openDrawer = () => {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => Auth.logout());
    }
  },

  /**
   * Render Navigasi Bawah Khusus Layar Sentuh / HP (Mobile Bottom Navigation)
   */
  renderBottomNav() {
    const bottomPlaceholder = document.getElementById('site-bottom-nav');
    if (!bottomPlaceholder) return;

    const currentPage = this.getCurrentPage();
    const user = Auth.getCurrentUser();
    const accountUrl = user ? 'profil.html' : 'login.html';

    bottomPlaceholder.innerHTML = `
      <nav class="bottom-nav" aria-label="Navigasi Bawah">
        <a href="index.html" class="bottom-nav-item ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span>Beranda</span>
        </a>
        <a href="cari.html" class="bottom-nav-item ${currentPage === 'cari.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Cari</span>
        </a>
        <a href="peta.html" class="bottom-nav-item ${currentPage === 'peta.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
          <span>Peta</span>
        </a>
        <a href="komunitas.html" class="bottom-nav-item ${currentPage === 'komunitas.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>Komunitas</span>
        </a>
        <a href="${accountUrl}" class="bottom-nav-item ${currentPage === 'profil.html' || currentPage === 'login.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>${user ? 'Akun' : 'Masuk'}</span>
        </a>
      </nav>
    `;
  },

  /**
   * Render Footer Resmi (Deep Navy #0A1938)
   */
  renderFooter() {
    const footerPlaceholder = document.getElementById('site-footer');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <!-- Kolom 1: Brand & Misi -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="nav-logo-badge" style="background: var(--white); color: var(--navy);">U</div>
                <h3 style="color: var(--white); font-size: 1.35rem; margin: 0;">UMKM<span style="color: var(--lime-1);">Hub</span></h3>
              </div>
              <p class="footer-desc">
                Platform ekosistem digital terintegrasi yang menghubungkan sesama pelaku UMKM Indonesia untuk berkolaborasi, bertumbuh bersama, dan menjangkau pasar nasional secara mandiri.
              </p>
              <div class="footer-badge-demo">
                <p><strong>Akun Demo Tersedia:</strong></p>
                <p>Seller: <code>seller@umkmhub.id</code> / <code>demo123</code></p>
                <p>Pengguna: <code>user@umkmhub.id</code> / <code>demo123</code></p>
              </div>
            </div>

            <!-- Kolom 2: Eksplorasi Publik -->
            <div>
              <h4>Jelajahi</h4>
              <ul class="footer-links">
                <li><a href="cari.html">Pencarian UMKM</a></li>
                <li><a href="marketplace.html">Marketplace Showcase</a></li>
                <li><a href="peta.html">Peta UMKM Near Me</a></li>
                <li><a href="login.html?mode=seller-register">Daftarkan Usaha Anda</a></li>
              </ul>
            </div>

            <!-- Kolom 3: Kolaborasi B2B -->
            <div>
              <h4>Kolaborasi B2B</h4>
              <ul class="footer-links">
                <li><a href="matcher.html">Kolaborasi Matcher</a></li>
                <li><a href="board.html">Board Kolaborasi</a></li>
                <li><a href="forum.html">Forum Diskusi Bisnis</a></li>
                <li><a href="komunitas.html">Grup Komunitas & Chat</a></li>
              </ul>
            </div>

            <!-- Kolom 4: Kategori Populer & Reset Data -->
            <div>
              <h4>Kategori Unggulan</h4>
              <ul class="footer-links">
                <li><a href="cari.html?kategori=Kuliner">Kuliner & Makanan</a></li>
                <li><a href="cari.html?kategori=Kriya+%26+Kerajinan">Kriya & Kerajinan Tangan</a></li>
                <li><a href="cari.html?kategori=Fesyen">Fesyen & Wastra Tradisional</a></li>
                <li><a href="cari.html?kategori=Pertanian+%26+Agro">Pertanian & Agro Hidroponik</a></li>
              </ul>
              <div style="margin-top: 1.5rem;">
                <button id="btnResetDatabase" class="btn btn-sm btn-outline" style="border-color: var(--lime-1); color: var(--lime-1); font-size: 0.75rem;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  Reset Data Awal (Seed)
                </button>
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div>
              &copy; ${new Date().getFullYear()} UMKM Hub Indonesia. 100% Karya Anak Bangsa.
            </div>
            <div class="flex items-center gap-3">
              <span style="color: var(--lime-1); font-weight: 600;">#BanggaBuatanIndonesia</span>
              <span>&bull;</span>
              <span>Bahasa Indonesia</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    // Handler Reset Database
    const btnReset = document.getElementById('btnResetDatabase');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengatur ulang data ke kondisi bawaan (seed data)? Semua perubahan Anda akan dikembalikan ke awal.')) {
          Store.resetToSeed(INITIAL_DATA);
          Utils.showToast('Data berhasil di-reset ke kondisi awal.', 'success');
          setTimeout(() => window.location.reload(), 600);
        }
      });
    }
  },

  /**
   * Menangani Wishlist Produk Secara Global
   */
  toggleWishlistProduct(productId) {
    if (!Auth.requireAuth('menyimpan produk ke wishlist')) return;

    const user = Auth.getCurrentUser();
    let wishlist = user.wishlistProducts || [];
    const index = wishlist.indexOf(productId);
    let isAdded = false;

    if (index === -1) {
      wishlist.push(productId);
      isAdded = true;
    } else {
      wishlist.splice(index, 1);
    }

    Store.update('users', user.id, { wishlistProducts: wishlist });

    // Update semua tombol wishlist produk bersangkutan di layar
    document.querySelectorAll(`[data-wishlist-product="${productId}"]`).forEach(btn => {
      if (isAdded) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Hapus dari wishlist');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Tambah ke wishlist');
      }
    });

    Utils.showToast(isAdded ? 'Produk ditambahkan ke Wishlist Anda.' : 'Produk dihapus dari Wishlist.', 'success');
  },

  /**
   * Menangani Follow UMKM Secara Global
   */
  toggleFollowUmkm(umkmId) {
    if (!Auth.requireAuth('mengikuti UMKM ini')) return;

    const user = Auth.getCurrentUser();
    const umkm = Store.getById('umkm', umkmId);
    if (!umkm) return;

    let following = user.following || [];
    const index = following.indexOf(umkmId);
    let isFollowing = false;

    let currentFollowers = (umkm.stats && umkm.stats.followers) || 0;

    if (index === -1) {
      following.push(umkmId);
      isFollowing = true;
      currentFollowers += 1;
    } else {
      following.splice(index, 1);
      currentFollowers = Math.max(0, currentFollowers - 1);
    }

    // Update data di store
    Store.update('users', user.id, { following });
    Store.update('umkm', umkmId, {
      stats: { ...(umkm.stats || {}), followers: currentFollowers }
    });

    // Update visual tombol follow di DOM
    document.querySelectorAll(`[data-follow-umkm="${umkmId}"]`).forEach(btn => {
      if (isFollowing) {
        btn.classList.remove('btn-outline-blue', 'btn-primary');
        btn.classList.add('btn-secondary');
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Mengikuti`;
      } else {
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg> Ikuti`;
      }
    });

    // Update teks jumlah follower jika ada di halaman profil
    const followerCountEl = document.getElementById('profileFollowerCount');
    if (followerCountEl) {
      followerCountEl.textContent = currentFollowers;
    }

    Utils.showToast(isFollowing ? `Anda sekarang mengikuti ${umkm.name}.` : `Batal mengikuti ${umkm.name}.`, 'info');
  },

  /**
   * Sinkronisasi visual status Wishlist & Follow di seluruh halaman aktif
   */
  syncGlobalInteractions() {
    const user = Auth.getCurrentUser();
    const wishlistProducts = user ? (user.wishlistProducts || []) : [];
    const following = user ? (user.following || []) : [];

    // Wishlist produk
    document.querySelectorAll('[data-wishlist-product]').forEach(btn => {
      const pid = btn.getAttribute('data-wishlist-product');
      if (wishlistProducts.includes(pid)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Follow UMKM
    document.querySelectorAll('[data-follow-umkm]').forEach(btn => {
      const uid = btn.getAttribute('data-follow-umkm');
      if (following.includes(uid)) {
        btn.classList.remove('btn-primary', 'btn-outline-blue');
        btn.classList.add('btn-secondary');
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Mengikuti`;
      }
    });
  },

  /**
   * Event delegation global untuk tombol wishlist dan follow
   */
  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      const wishlistBtn = e.target.closest('[data-wishlist-product]');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const pid = wishlistBtn.getAttribute('data-wishlist-product');
        this.toggleWishlistProduct(pid);
        return;
      }

      const followBtn = e.target.closest('[data-follow-umkm]');
      if (followBtn) {
        e.preventDefault();
        e.stopPropagation();
        const uid = followBtn.getAttribute('data-follow-umkm');
        this.toggleFollowUmkm(uid);
        return;
      }
    });

    // Sinkronisasi realtime jika ada perubahan storage
    window.addEventListener('umkm-store-change', () => {
      this.syncGlobalInteractions();
    });
  }
};

