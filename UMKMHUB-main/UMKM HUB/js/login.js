/**
 * ============================================================================
 * UMKM HUB - AUTENTIKASI & WIZARD REGISTRASI (login.js)
 * Form Masuk, Form Daftar Pengguna, dan Wizard Multi-Langkah Pendaftaran Seller
 * dengan login 1-klik akun demo dan validasi interaktif.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let returnUrl = null;

// Koordinat kota default untuk UMKM baru
const cityCoordinates = {
  'Bogor': { lat: -6.5971, lng: 106.8060 },
  'Bandung': { lat: -6.9175, lng: 107.6191 },
  'Jakarta': { lat: -6.2088, lng: 106.8456 },
  'Yogyakarta': { lat: -7.7956, lng: 110.3695 },
  'Surabaya': { lat: -7.2575, lng: 112.7521 },
  'Denpasar': { lat: -8.6705, lng: 115.2126 },
  'Medan': { lat: 3.5952, lng: 98.6722 },
  'Makassar': { lat: -5.1477, lng: 119.4327 }
};

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  returnUrl = urlParams.get('returnUrl');
  const actionParam = urlParams.get('action');

  if (actionParam) {
    const alertBox = document.getElementById('authAlertBox');
    if (alertBox) {
      alertBox.textContent = `Silakan masuk atau daftar akun terlebih dahulu untuk ${decodeURIComponent(actionParam)}.`;
      alertBox.style.display = 'block';
    }
  }

  setupTabModes();
  setupDemoLogin();
  setupPasswordToggle();
  setupFormSubmissions();
  setupSellerWizard();

  // Mode otomatis berdasarkan parameter
  if (mode === 'seller-register') {
    switchMode('seller-register');
  } else if (mode === 'register') {
    switchMode('register-user');
  } else {
    switchMode('login');
  }
});

/**
 * 1. Setup Tab Mode Switcher
 */
function setupTabModes() {
  const tabLogin = document.getElementById('tabModeLogin');
  const tabRegUser = document.getElementById('tabModeRegisterUser');
  const tabRegSeller = document.getElementById('tabModeRegisterSeller');

  if (tabLogin) tabLogin.addEventListener('click', () => switchMode('login'));
  if (tabRegUser) tabRegUser.addEventListener('click', () => switchMode('register-user'));
  if (tabRegSeller) tabRegSeller.addEventListener('click', () => switchMode('seller-register'));
}

function switchMode(mode) {
  const tabLogin = document.getElementById('tabModeLogin');
  const tabRegUser = document.getElementById('tabModeRegisterUser');
  const tabRegSeller = document.getElementById('tabModeRegisterSeller');

  const formLogin = document.getElementById('formLogin');
  const formRegUser = document.getElementById('formRegisterUser');
  const wizSeller = document.getElementById('wizardSellerContainer');

  const mainTitle = document.getElementById('authMainTitle');
  const subtitle = document.getElementById('authSubtitle');
  const demoBox = document.getElementById('demoAccountsBox');

  [tabLogin, tabRegUser, tabRegSeller].forEach(t => t && t.classList.remove('active'));

  if (mode === 'login') {
    if (tabLogin) tabLogin.classList.add('active');
    if (formLogin) formLogin.style.display = 'block';
    if (formRegUser) formRegUser.style.display = 'none';
    if (wizSeller) wizSeller.style.display = 'none';
    if (mainTitle) mainTitle.textContent = 'Selamat Datang di UMKM Hub';
    if (subtitle) subtitle.textContent = 'Masuk untuk mengelola usaha atau melihat favorit';
    if (demoBox) demoBox.style.display = 'block';
  } else if (mode === 'register-user') {
    if (tabRegUser) tabRegUser.classList.add('active');
    if (formLogin) formLogin.style.display = 'none';
    if (formRegUser) formRegUser.style.display = 'block';
    if (wizSeller) wizSeller.style.display = 'none';
    if (mainTitle) mainTitle.textContent = 'Daftar Akun Pengguna';
    if (subtitle) subtitle.textContent = 'Simpan wishlist dan ikuti UMKM lokal favoritmu';
    if (demoBox) demoBox.style.display = 'none';
  } else if (mode === 'seller-register') {
    if (tabRegSeller) tabRegSeller.classList.add('active');
    if (formLogin) formLogin.style.display = 'none';
    if (formRegUser) formRegUser.style.display = 'none';
    if (wizSeller) wizSeller.style.display = 'block';
    if (mainTitle) mainTitle.textContent = 'Daftarkan Profil Bisnis UMKM-mu';
    if (subtitle) subtitle.textContent = 'Lengkapi 4 langkah singkat untuk etalase digital & fitur B2B';
    if (demoBox) demoBox.style.display = 'none';
  }
}

/**
 * 2. Setup 1-Click Demo Login
 */
function setupDemoLogin() {
  const btnSeller = document.getElementById('btnQuickDemoSeller');
  const btnUser = document.getElementById('btnQuickDemoUser');

  if (btnSeller) {
    btnSeller.addEventListener('click', () => {
      try {
        const user = Auth.loginDemo('seller');
        Utils.showToast(`Berhasil masuk sebagai ${user.name} (Seller Demo)!`, 'success');
        setTimeout(() => {
          window.location.href = returnUrl || 'dashboard.html';
        }, 500);
      } catch (e) {
        Utils.showToast(e.message, 'error');
      }
    });
  }

  if (btnUser) {
    btnUser.addEventListener('click', () => {
      try {
        const user = Auth.loginDemo('user');
        Utils.showToast(`Berhasil masuk sebagai ${user.name} (Pengguna Demo)!`, 'success');
        setTimeout(() => {
          window.location.href = returnUrl || 'index.html';
        }, 500);
      } catch (e) {
        Utils.showToast(e.message, 'error');
      }
    });
  }
}

/**
 * 3. Setup Toggle Password
 */
function setupPasswordToggle() {
  const btn = document.getElementById('btnTogglePassword');
  const pwdInput = document.getElementById('loginPassword');
  if (btn && pwdInput) {
    btn.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      btn.textContent = isPwd ? 'Sembunyikan' : 'Tampilkan';
    });
  }
}

/**
 * 4. Setup Form Submissions (Login & User Register)
 */
function setupFormSubmissions() {
  // Login Submit
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const pwd = document.getElementById('loginPassword').value;

      try {
        const user = Auth.login(email, pwd);
        Utils.showToast(`Selamat datang kembali, ${user.name}!`, 'success');
        setTimeout(() => {
          if (returnUrl) {
            window.location.href = decodeURIComponent(returnUrl);
          } else if (user.role === 'seller') {
            window.location.href = 'dashboard.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 600);
      } catch (err) {
        Utils.showToast(err.message, 'error');
      }
    });
  }

  // Register User Submit
  const formRegUser = document.getElementById('formRegisterUser');
  if (formRegUser) {
    formRegUser.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regUserName').value.trim();
      const email = document.getElementById('regUserEmail').value.trim();
      const password = document.getElementById('regUserPassword').value;

      try {
        const user = Auth.register({ name, email, password, role: 'user' });
        Utils.showToast(`Akun berhasil dibuat! Selamat datang, ${user.name}.`, 'success');
        setTimeout(() => {
          window.location.href = returnUrl ? decodeURIComponent(returnUrl) : 'index.html';
        }, 600);
      } catch (err) {
        Utils.showToast(err.message, 'error');
      }
    });
  }
}

/**
 * 5. Setup Multi-Step Wizard Pendaftaran Seller UMKM
 */
function setupSellerWizard() {
  const wizardForm = document.getElementById('formRegisterSellerWizard');
  if (!wizardForm) return;

  const steps = [1, 2, 3, 4];
  let currentStep = 1;

  const goToStep = (stepNum) => {
    steps.forEach(n => {
      const content = document.getElementById(`stepContent${n}`);
      const node = document.getElementById(`wizardNode${n}`);

      if (content) content.style.display = n === stepNum ? 'block' : 'none';
      if (node) {
        if (n < stepNum) {
          node.className = 'wizard-step-node completed';
        } else if (n === stepNum) {
          node.className = 'wizard-step-node active';
        } else {
          node.className = 'wizard-step-node';
        }
      }
    });
    currentStep = stepNum;
  };

  // Tombol Next & Prev
  wizardForm.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextNum = parseInt(btn.getAttribute('data-next'), 10);

      // Validasi langkah saat ini
      if (currentStep === 1) {
        const owner = document.getElementById('wizOwnerName').value.trim();
        const email = document.getElementById('wizSellerEmail').value.trim();
        const pwd = document.getElementById('wizSellerPassword').value;
        const bName = document.getElementById('wizBusinessName').value.trim();

        if (!owner || !email || !pwd || !bName) {
          Utils.showToast('Harap lengkapi semua kolom wajib di langkah 1.', 'error');
          return;
        }
        if (pwd.length < 6) {
          Utils.showToast('Kata sandi minimal 6 karakter.', 'error');
          return;
        }
      } else if (currentStep === 2) {
        const addr = document.getElementById('wizAddress').value.trim();
        const desc = document.getElementById('wizDesc').value.trim();
        if (!addr || !desc) {
          Utils.showToast('Harap lengkapi alamat dan deskripsi usaha.', 'error');
          return;
        }
      } else if (currentStep === 3) {
        const wa = document.getElementById('wizWa').value.trim();
        if (!wa) {
          Utils.showToast('Nomor WhatsApp bisnis wajib diisi.', 'error');
          return;
        }
      }

      goToStep(nextNum);
    });
  });

  wizardForm.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevNum = parseInt(btn.getAttribute('data-prev'), 10);
      goToStep(prevNum);
    });
  });

  // Final Submit
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const ownerName = document.getElementById('wizOwnerName').value.trim();
    const email = document.getElementById('wizSellerEmail').value.trim();
    const password = document.getElementById('wizSellerPassword').value;
    const businessName = document.getElementById('wizBusinessName').value.trim();
    const slogan = document.getElementById('wizBusinessSlogan').value.trim();
    const category = document.getElementById('wizCategory').value;
    const city = document.getElementById('wizCity').value;
    const address = document.getElementById('wizAddress').value.trim();
    const desc = document.getElementById('wizDesc').value.trim();
    const wa = document.getElementById('wizWa').value.trim();
    const phone = document.getElementById('wizPhone').value.trim();
    const instagram = document.getElementById('wizInstagram').value.trim();
    const needsRaw = document.getElementById('wizNeeds').value.trim();
    const offersRaw = document.getElementById('wizOffers').value.trim();
    const story = document.getElementById('wizStory').value.trim();

    const needs = needsRaw ? needsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Mitra Penjualan'];
    const offers = offersRaw ? offersRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Produk Berkualitas'];

    const coords = cityCoordinates[city] || { lat: -6.2088, lng: 106.8456 };

    try {
      // 1. Buat UMKM di Store
      const newUmkm = Store.create('umkm', {
        name: businessName,
        slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        slogan,
        category,
        city,
        address,
        lat: coords.lat + (Math.random() - 0.5) * 0.02, // sedikit offset agar tidak menumpuk
        lng: coords.lng + (Math.random() - 0.5) * 0.02,
        description: desc,
        story: story || `Perjalanan usaha ${businessName} dimulai dari dedikasi menghasilkan produk berkualitas di ${city}.`,
        isOpenCollab: true,
        needs,
        offers,
        contact: {
          wa,
          email,
          phone,
          instagram,
          web: ''
        },
        stats: { views: 1, inquiries: 0, followers: 0 },
        rating: 5.0,
        verified: true
      });

      // 2. Buat Akun Pengguna Seller
      const newUser = Auth.register({
        name: ownerName,
        email,
        password,
        role: 'seller',
        umkmId: newUmkm.id,
        bio: `Pemilik usaha ${businessName}`
      });

      // 3. Update ownerId di objek UMKM
      Store.update('umkm', newUmkm.id, { ownerId: newUser.id });

      Utils.showToast(`Selamat! UMKM "${businessName}" berhasil terdaftar di UMKM Hub.`, 'success', 5000);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    } catch (err) {
      Utils.showToast(err.message, 'error');
    }
  });
}

