/**
 * ============================================================================
 * UMKM HUB - AUTHENTICATION & ROLE MANAGEMENT
 * Pengunjung (Guest), Pengguna (User), dan Seller UMKM
 * ============================================================================
 */

import { Store } from './store.js';
import { Utils } from './utils.js';

const SESSION_KEY = 'umkmhub_current_user_id';

export const Auth = {
  /**
   * Mengambil data akun pengguna yang sedang login
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return Store.getById('users', userId) || null;
  },

  /**
   * Cek apakah ada sesi login aktif
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  /**
   * Cek apakah pengguna saat ini berstatus Seller
   * @returns {boolean}
   */
  isSeller() {
    const user = this.getCurrentUser();
    return user && user.role === 'seller';
  },

  /**
   * Ambil data UMKM milik seller yang sedang login
   * @returns {Object|null}
   */
  getCurrentSellerUmkm() {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'seller' || !user.umkmId) return null;
    return Store.getById('umkm', user.umkmId);
  },

  /**
   * Masuk / Login dengan Email & Password
   */
  login(email, password) {
    const users = Store.getAll('users');
    const cleanEmail = String(email).trim().toLowerCase();

    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
    if (!user) {
      throw new Error('Email atau password tidak sesuai. Silakan coba lagi.');
    }

    localStorage.setItem(SESSION_KEY, user.id);
    window.dispatchEvent(new CustomEvent('umkm-auth-change', { detail: { user } }));
    return user;
  },

  /**
   * Mendaftar akun baru (Pengguna Biasa atau Seller)
   */
  register(data) {
    const users = Store.getAll('users');
    const cleanEmail = String(data.email).trim().toLowerCase();

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Alamat email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const newUser = Store.create('users', {
      email: cleanEmail,
      password: data.password,
      name: data.name,
      role: data.role || 'user',
      umkmId: data.umkmId || null,
      avatar: data.avatar || '',
      bio: data.bio || '',
      wishlistProducts: [],
      wishlistUmkm: [],
      following: []
    });

    localStorage.setItem(SESSION_KEY, newUser.id);
    window.dispatchEvent(new CustomEvent('umkm-auth-change', { detail: { user: newUser } }));
    return newUser;
  },

  /**
   * Logout dari sesi saat ini
   */
  logout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent('umkm-auth-change', { detail: { user: null } }));
    Utils.showToast('Anda telah keluar dari akun.', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },

  /**
   * Login instan menggunakan Akun Demo
   * @param {'seller'|'user'} role
   */
  loginDemo(role = 'seller') {
    const email = role === 'seller' ? 'seller@umkmhub.id' : 'user@umkmhub.id';
    return this.login(email, 'demo123');
  },

  /**
   * Guard aksi yang membutuhkan login.
   * Jika belum login, tampilkan modal/toast ramah dan arahkan ke login.html
   * @param {string} actionName - Contoh: "menyimpan wishlist", "mengirim pesan", "mengajak kolaborasi"
   * @param {string} [returnUrl] - Halaman tujuan kembali setelah login
   * @returns {boolean} True jika sudah login, False jika dialihkan
   */
  requireAuth(actionName = 'melakukan aksi ini', returnUrl = null) {
    if (this.isLoggedIn()) {
      return true;
    }

    const targetUrl = returnUrl || (window.location.pathname.split('/').pop() + window.location.search);
    const redirectUrl = `login.html?returnUrl=${encodeURIComponent(targetUrl)}&action=${encodeURIComponent(actionName)}`;

    Utils.showToast(`Silakan masuk atau daftar terlebih dahulu untuk ${actionName}.`, 'info', 3000);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 700);
    return false;
  }
};

