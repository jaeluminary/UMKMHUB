/**
 * ============================================================================
 * UMKM HUB - UTILITIES
 * Fungsi bantuan: Sanitasi XSS, Format Rupiah, Tanggal, Haversine,
 * Generator Placeholder SVG (Zero Broken Images), Kompresi Canvas, Toast
 * ============================================================================
 */

export const Utils = {
  /**
   * Sanitasi string untuk mencegah serangan XSS
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  },

  /**
   * Format angka menjadi format mata uang Rupiah
   * @param {number|string} amount
   * @returns {string} Contoh: "Rp 75.000"
   */
  formatRupiah(amount) {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  },

  /**
   * Format tanggal bahasa Indonesia
   * @param {string|Date} dateStr
   * @returns {string} Contoh: "12 Nov 2026"
   */
  formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  },

  /**
   * Format waktu relatif (e.g. "5 menit lalu", "2 jam lalu", "Kemarin")
   * @param {string|Date} dateStr
   * @returns {string}
   */
  formatRelativeTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mnt lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 172800) return 'Kemarin';
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return this.formatDate(dateStr);
  },

  /**
   * Hitung jarak dua titik koordinat bumi dengan rumus Haversine (km)
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} jarak dalam kilometer (desimal 1 digit)
   */
  calcDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  },

  /**
   * Format jarak untuk tampilan UI
   * @param {number} km
   * @returns {string} "850 m" atau "4.2 km"
   */
  formatDistance(km) {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  },

  /**
   * Membuat SVG Data URI Placeholder Bergaya secara Offline
   * Menjamin tidak ada broken image tanpa memerlukan request gambar eksternal
   * @param {string} text - Nama bisnis atau produk
   * @param {string} category - Kategori (Kuliner, Kraft, dll)
   * @param {string} type - 'logo', 'banner', 'product', 'avatar'
   * @returns {string} Data URI (data:image/svg+xml;utf8,...)
   */
  generateSvgPlaceholder(text = 'UMKM', category = 'Bisnis', type = 'product') {
    const cleanText = String(text).trim();
    const initials = cleanText
      .split(' ')
      .slice(0, 2)
      .map(w => w[0] || '')
      .join('')
      .toUpperCase() || 'U';

    // Palet warna gradien sesuai tema UMKM Hub
    const colorThemes = {
      'Kuliner': { bg1: '#042C8F', bg2: '#4891E7', text: '#E8F957', icon: '🍲' },
      'Kriya & Kerajinan': { bg1: '#0B3BAA', bg2: '#86D0FD', text: '#042C8F', icon: '🎨' },
      'Fesyen': { bg1: '#042C8F', bg2: '#3578CE', text: '#C1E5FB', icon: '👗' },
      'Pertanian & Agro': { bg1: '#042C8F', bg2: '#BBE11A', text: '#FFFFFF', icon: '🌱' },
      'Jasa': { bg1: '#0B3BAA', bg2: '#4891E7', text: '#E8F957', icon: '🛠️' },
      'Teknologi & Digital': { bg1: '#021B59', bg2: '#042C8F', text: '#86D0FD', icon: '💻' },
      'Kecantikan & Herbal': { bg1: '#042C8F', bg2: '#86D0FD', text: '#E8F957', icon: '🌿' },
      'Default': { bg1: '#042C8F', bg2: '#4891E7', text: '#E8F957', icon: '🏢' }
    };

    const theme = colorThemes[category] || colorThemes['Default'];

    let svg = '';
    if (type === 'banner') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.bg1}"/>
            <stop offset="100%" stop-color="${theme.bg2}"/>
          </linearGradient>
          <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="#FFFFFF" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="64" fill="${theme.text}">${this.escapeHtml(cleanText)}</text>
        <text x="50%" y="65%" text-anchor="middle" font-family="sans-serif" font-size="28" fill="#C1E5FB" opacity="0.9">${theme.icon} ${this.escapeHtml(category)}</text>
      </svg>`;
    } else if (type === 'logo' || type === 'avatar') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="gLogo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${theme.bg1}"/>
            <stop offset="100%" stop-color="${theme.bg2}"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" rx="30" fill="url(#gLogo)"/>
        <text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="800" font-size="68" fill="${theme.text}">${this.escapeHtml(initials)}</text>
      </svg>`;
    } else {
      // Product
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="380" viewBox="0 0 500 380">
        <defs>
          <linearGradient id="gProd" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F0F7FF"/>
            <stop offset="100%" stop-color="#C1E5FB"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gProd)"/>
        <circle cx="250" cy="160" r="70" fill="${theme.bg1}"/>
        <text x="250" y="170" text-anchor="middle" dominant-baseline="middle" font-size="54">${theme.icon}</text>
        <text x="250" y="275" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="22" fill="#042C8F">${this.escapeHtml(cleanText.substring(0, 24))}</text>
        <text x="250" y="305" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#475569">${this.escapeHtml(category)}</text>
      </svg>`;
    }

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  },

  /**
   * Mengompresi file gambar unggahan pengguna via HTML5 Canvas (maks ~800px)
   * Menyimpan sebagai base64 string
   * @param {File} file
   * @param {number} maxWidth
   * @param {number} quality
   * @returns {Promise<string>} Base64 Data URL
   */
  compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('File tidak ditemukan'));
      }
      if (!file.type.startsWith('image/')) {
        return reject(new Error('File harus berformat gambar'));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Hasilkan base64 jpeg yang terkompresi
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Gagal memproses gambar'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Menampilkan Notifikasi Toast
   * @param {string} message
   * @param {'info'|'success'|'error'} type
   * @param {number} duration
   */
  showToast(message, type = 'info', duration = 3200) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `
      <span style="font-size: 1.1rem; line-height: 1;">${icon}</span>
      <div style="flex: 1; font-weight: 500;">${this.escapeHtml(message)}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.95)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  /**
   * Debounce helper
   */
  debounce(func, delay = 250) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Buka Modal Dialog
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Tutup Modal Dialog
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  },

  /**
   * Highlight query teks dalam hasil pencarian secara aman
   */
  highlightQuery(text, query) {
    if (!text) return '';
    if (!query || !query.trim()) return this.escapeHtml(text);

    const safeText = String(text);
    const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = safeText.split(regex);

    return parts.map(part => {
      if (part.toLowerCase() === query.trim().toLowerCase()) {
        return `<mark class="highlight-text">${this.escapeHtml(part)}</mark>`;
      }
      return this.escapeHtml(part);
    }).join('');
  }
};

