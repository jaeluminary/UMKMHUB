/**
 * ============================================================================
 * UMKM HUB - DASHBOARD SELLER (dashboard.js)
 * Panel kendali analitik bisnis: grafik interaktif murni SVG (7/30 hari),
 * manajemen produk (tambah, edit, kompresi gambar Canvas, hapus),
 * serta penanganan permintaan kolaborasi B2B masuk.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let currentSellerUmkm = null;
let currentProducts = [];
let currentCollabRequests = [];
let chartTimeframe = '7days';
let uploadedProductImageBase64 = '';

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  // Guard: Hanya untuk Seller yang sudah Login
  if (!Auth.isLoggedIn()) {
    Utils.showToast('Silakan masuk dengan akun Seller untuk membuka Dashboard.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html?returnUrl=dashboard.html';
    }, 600);
    return;
  }

  const user = Auth.getCurrentUser();
  if (user.role !== 'seller') {
    Utils.showToast('Akun Anda belum terdaftar sebagai Seller UMKM. Daftarkan usaha Anda terlebih dahulu.', 'info');
    setTimeout(() => {
      window.location.href = 'login.html?mode=seller-register';
    }, 600);
    return;
  }

  currentSellerUmkm = Auth.getCurrentSellerUmkm() || Store.getAll('umkm')[0];

  loadDashboardData();
  setupEventListeners();
  renderCustomSvgChart(chartTimeframe);
  renderCollabRequestsTable();
  renderProductsManageTable();
});

/**
 * 1. Muat Data & Metrik Bisnis
 */
function loadDashboardData() {
  const u = currentSellerUmkm;
  if (!u) return;

  document.getElementById('dashBusinessTitle').textContent = `Dashboard ${u.name}`;
  document.getElementById('dashBusinessSubtitle').textContent = `${u.category} &bull; ${u.city} &bull; Terdaftar Resmi`;

  const btnLive = document.getElementById('btnViewLiveProfile');
  if (btnLive) btnLive.href = `umkm.html?id=${u.id}`;

  // Ambil produk milik UMKM ini
  currentProducts = Store.query('products', p => String(p.umkmId) === String(u.id));

  // Ambil permintaan kolaborasi masuk ke UMKM ini
  currentCollabRequests = Store.query('collabRequests', r => String(r.toUmkmId) === String(u.id));

  // Hitung total metrik
  const profileViews = (u.stats && u.stats.views) || 428;
  const productViews = currentProducts.reduce((sum, p) => sum + (p.views || 0), 0) || 1240;
  const inquiries = (u.stats && u.stats.inquiries) || 34;
  const collabCount = currentCollabRequests.length;

  document.getElementById('metricProfileViews').textContent = profileViews;
  document.getElementById('metricProductViews').textContent = productViews;
  document.getElementById('metricInquiries').textContent = inquiries;
  document.getElementById('metricCollabRequests').textContent = collabCount;
  document.getElementById('collabRequestsCountBadge').textContent = `${collabCount} Permintaan`;
}

/**
 * 2. Setup Event Listeners
 */
function setupEventListeners() {
  // Chart timeframe toggle
  const btn7 = document.getElementById('btnChart7Days');
  const btn30 = document.getElementById('btnChart30Days');

  if (btn7 && btn30) {
    btn7.addEventListener('click', () => {
      btn7.classList.add('active');
      btn30.classList.remove('active');
      chartTimeframe = '7days';
      renderCustomSvgChart(chartTimeframe);
    });

    btn30.addEventListener('click', () => {
      btn30.classList.add('active');
      btn7.classList.remove('active');
      chartTimeframe = '30days';
      renderCustomSvgChart(chartTimeframe);
    });
  }

  // Modal Produk
  const btnOpenAdd1 = document.getElementById('btnOpenAddProductModal');
  const btnOpenAdd2 = document.getElementById('btnAddNewProductTable');
  const btnCloseModal = document.getElementById('btnCloseProductModal');
  const btnCancelModal = document.getElementById('btnCancelProductModal');
  const productForm = document.getElementById('productManageForm');
  const imgInput = document.getElementById('prodFormImageInput');

  const openAddModal = () => {
    document.getElementById('productModalTitle').textContent = 'Tambah Produk Baru';
    document.getElementById('editProductId').value = '';
    productForm.reset();
    uploadedProductImageBase64 = '';
    const previewBox = document.getElementById('imagePreviewBox');
    if (previewBox) previewBox.innerHTML = '<span style="font-size: var(--text-xs); color: var(--text-muted);">Preview Foto Produk</span>';
    Utils.openModal('productManageModal');
  };

  if (btnOpenAdd1) btnOpenAdd1.addEventListener('click', openAddModal);
  if (btnOpenAdd2) btnOpenAdd2.addEventListener('click', openAddModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', () => Utils.closeModal('productManageModal'));
  if (btnCancelModal) btnCancelModal.addEventListener('click', () => Utils.closeModal('productManageModal'));

  // Upload Gambar & Kompresi HTML5 Canvas
  if (imgInput) {
    imgInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        Utils.showToast('Mengompresi gambar produk...', 'info');
        const compressedBase64 = await Utils.compressImage(file, 800, 0.85);
        uploadedProductImageBase64 = compressedBase64;

        const previewBox = document.getElementById('imagePreviewBox');
        if (previewBox) {
          previewBox.innerHTML = `<img src="${compressedBase64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        Utils.showToast('Foto berhasil diproses.', 'success');
      } catch (err) {
        Utils.showToast('Gagal memproses gambar: ' + err.message, 'error');
      }
    });
  }

  // Submit Simpan / Edit Produk
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSaveProduct();
    });
  }
}

/**
 * 3. Render Grafik Interaktif Murni SVG Tanpa Library Eksternal
 */
function renderCustomSvgChart(timeframe = '7days') {
  const svg = document.getElementById('svgChart');
  const tooltip = document.getElementById('chartTooltip');
  if (!svg) return;

  const width = 800;
  const height = 260;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;

  // Data historis
  let dataPoints = [];
  if (timeframe === '7days') {
    dataPoints = [
      { label: '31 Okt', views: 45, inquiries: 3 },
      { label: '01 Nov', views: 58, inquiries: 4 },
      { label: '02 Nov', views: 52, inquiries: 5 },
      { label: '03 Nov', views: 64, inquiries: 6 },
      { label: '04 Nov', views: 71, inquiries: 7 },
      { label: '05 Nov', views: 68, inquiries: 4 },
      { label: '06 Nov', views: 82, inquiries: 8 }
    ];
  } else {
    dataPoints = [
      { label: 'Minggu 1', views: 240, inquiries: 18 },
      { label: 'Minggu 2', views: 290, inquiries: 22 },
      { label: 'Minggu 3', views: 330, inquiries: 26 },
      { label: 'Minggu 4', views: 380, inquiries: 31 }
    ];
  }

  const maxVal = Math.max(...dataPoints.map(d => d.views)) * 1.15;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const getX = (idx) => padLeft + (idx / (dataPoints.length - 1)) * chartWidth;
  const getY = (val) => padTop + chartHeight - (val / maxVal) * chartHeight;

  // Koordinat Path
  const points = dataPoints.map((d, idx) => ({ x: getX(idx), y: getY(d.views), data: d }));
  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`;

  let svgHtml = `
    <defs>
      <linearGradient id="chartAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#EFF6FF" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
  `;

  // Gridlines Horizontal
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const yVal = Math.round((maxVal / yTicks) * i);
    const yPos = getY(yVal);
    svgHtml += `
      <line x1="${padLeft}" y1="${yPos}" x2="${width - padRight}" y2="${yPos}" stroke="#E2E8F0" stroke-dasharray="4 4" stroke-width="1"/>
      <text x="${padLeft - 10}" y="${yPos + 4}" text-anchor="end" font-size="11" fill="#94A3B8" font-family="sans-serif">${yVal}</text>
    `;
  }

  // Area & Line Path
  svgHtml += `
    <path d="${areaD}" fill="url(#chartAreaGrad)" />
    <path d="${pathD}" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  `;

  // Labels Sumbu X & Data Points Bulat Interaktif
  points.forEach((p, idx) => {
    svgHtml += `
      <text x="${p.x}" y="${height - 12}" text-anchor="middle" font-size="11" font-weight="600" fill="#475569" font-family="sans-serif">
        ${p.data.label}
      </text>
      <circle cx="${p.x}" cy="${p.y}" r="5.5" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5" style="cursor: pointer; transition: all 0.2s;" class="chart-point-node" data-point-idx="${idx}"/>
    `;
  });

  svg.innerHTML = svgHtml;

  // Pasang Tooltip Hover
  svg.querySelectorAll('.chart-point-node').forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      node.setAttribute('r', '7.5');
      node.setAttribute('stroke', '#F59E0B');
      const idx = parseInt(node.getAttribute('data-point-idx'), 10);
      const d = dataPoints[idx];

      if (tooltip) {
        tooltip.innerHTML = `<strong>${d.label}</strong><br>👁️ ${d.views} Views<br>💬 ${d.inquiries} Tanya`;
        tooltip.style.left = `${(points[idx].x / width) * 100}%`;
        tooltip.style.top = `${(points[idx].y / height) * 100}%`;
        tooltip.style.opacity = '1';
      }
    });

    node.addEventListener('mouseleave', () => {
      node.setAttribute('r', '5.5');
      node.setAttribute('stroke', '#2563EB');
      if (tooltip) tooltip.style.opacity = '0';
    });
  });
}

/**
 * 4. Render Tabel Permintaan Kolaborasi Masuk
 */
function renderCollabRequestsTable() {
  const tbody = document.getElementById('tbodyCollabRequests');
  if (!tbody) return;

  if (currentCollabRequests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          Belum ada permintaan kolaborasi masuk saat ini.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentCollabRequests.map(r => {
    const fromUmkm = Store.getById('umkm', r.fromUmkmId) || { name: r.senderName || 'Mitra UMKM', city: 'Indonesia' };

    let statusBadge = `<span class="badge badge-collab">Menunggu</span>`;
    if (r.status === 'accepted') statusBadge = `<span class="badge badge-sky" style="background: #DEF7EC; color: #03543F;">Diterima</span>`;
    if (r.status === 'rejected') statusBadge = `<span class="badge badge-navy" style="background: #FEE2E2; color: #991B1B;">Ditolak</span>`;

    return `
      <tr>
        <td>
          <strong>${Utils.escapeHtml(fromUmkm.name)}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted);">📍 ${Utils.escapeHtml(fromUmkm.city)}</div>
        </td>
        <td><span class="badge badge-sky">${Utils.escapeHtml(r.needOffered || 'Kolaborasi')}</span></td>
        <td style="max-width: 280px; font-size: var(--text-xs); line-height: 1.4;">
          ${Utils.escapeHtml(r.message)}
        </td>
        <td style="font-size: 0.75rem; color: var(--text-muted);">${Utils.formatDate(r.createdAt)}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="flex items-center gap-2">
            ${r.status === 'pending' ? `
              <button class="btn btn-sm btn-primary btn-collab-action" data-action="accepted" data-collab-id="${r.id}">
                Terima
              </button>
              <button class="btn btn-sm btn-outline btn-collab-action" data-action="rejected" data-collab-id="${r.id}">
                Tolak
              </button>
            ` : ''}
            <a href="komunitas.html?dm=${fromUmkm.ownerId || 'user-regular-demo'}" class="btn btn-sm btn-ghost" style="color: var(--blue);">
              Balas Chat &rarr;
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Listener aksi Terima / Tolak
  tbody.querySelectorAll('.btn-collab-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const cid = btn.getAttribute('data-collab-id');
      const action = btn.getAttribute('data-action');

      Store.update('collabRequests', cid, { status: action });
      const item = currentCollabRequests.find(r => r.id === cid);
      if (item) item.status = action;

      Utils.showToast(`Permintaan kolaborasi telah ${action === 'accepted' ? 'diterima' : 'ditolak'}.`, 'success');
      renderCollabRequestsTable();
    });
  });
}

/**
 * 5. Render Tabel Manajemen Produk
 */
function renderProductsManageTable() {
  const tbody = document.getElementById('tbodyProductsManage');
  if (!tbody) return;

  if (currentProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          Belum ada produk di etalase Anda. Klik tombol "+ Tambah Produk Baru" di atas untuk mulai berjualan.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = currentProducts.map(p => {
    const imgSvg = p.image || Utils.generateSvgPlaceholder(p.name, p.category, 'product');

    return `
      <tr>
        <td>
          <img src="${imgSvg}" alt="${Utils.escapeHtml(p.name)}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
        </td>
        <td>
          <strong>${Utils.escapeHtml(p.name)}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${Utils.escapeHtml(p.description)}
          </div>
        </td>
        <td><span class="badge badge-sky">${Utils.escapeHtml(p.category)}</span></td>
        <td style="font-weight: 700; color: var(--navy);">${Utils.formatRupiah(p.price)}</td>
        <td style="font-size: var(--text-xs);">👁️ ${p.views || 0}</td>
        <td>
          <span class="badge ${p.inStock !== false ? 'badge-collab' : 'badge-navy'}" style="font-size: 0.7rem;">
            ${p.inStock !== false ? 'Ready Stock' : 'Habis'}
          </span>
        </td>
        <td>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm btn-outline btn-edit-product" data-product-id="${p.id}">
              Edit
            </button>
            <button class="btn btn-sm btn-ghost btn-delete-product" data-product-id="${p.id}" style="color: var(--danger-text);">
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Listener Edit
  tbody.querySelectorAll('.btn-edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-product-id');
      const prod = currentProducts.find(p => p.id === pid);
      if (!prod) return;

      document.getElementById('productModalTitle').textContent = 'Edit Produk';
      document.getElementById('editProductId').value = prod.id;
      document.getElementById('prodFormName').value = prod.name;
      document.getElementById('prodFormPrice').value = prod.price;
      document.getElementById('prodFormCategory').value = prod.category;
      document.getElementById('prodFormDesc').value = prod.description;
      document.getElementById('prodFormInStock').checked = prod.inStock !== false;

      uploadedProductImageBase64 = prod.image || '';
      const previewBox = document.getElementById('imagePreviewBox');
      if (previewBox && uploadedProductImageBase64) {
        previewBox.innerHTML = `<img src="${uploadedProductImageBase64}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">`;
      }

      Utils.openModal('productManageModal');
    });
  });

  // Listener Hapus
  tbody.querySelectorAll('.btn-delete-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-product-id');
      if (confirm('Hapus produk ini dari etalase?')) {
        Store.remove('products', pid);
        currentProducts = currentProducts.filter(p => p.id !== pid);
        Utils.showToast('Produk berhasil dihapus.', 'info');
        loadDashboardData();
        renderProductsManageTable();
      }
    });
  });
}

/**
 * 6. Simpan atau Perbarui Produk
 */
function handleSaveProduct() {
  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodFormName').value.trim();
  const price = parseInt(document.getElementById('prodFormPrice').value, 10);
  const category = document.getElementById('prodFormCategory').value;
  const desc = document.getElementById('prodFormDesc').value.trim();
  const inStock = document.getElementById('prodFormInStock').checked;

  if (!name || isNaN(price) || !desc) {
    Utils.showToast('Harap lengkapi formulir produk.', 'error');
    return;
  }

  if (editId) {
    // Mode Update
    const updates = {
      name,
      price,
      category,
      description: desc,
      inStock
    };
    if (uploadedProductImageBase64) updates.image = uploadedProductImageBase64;

    Store.update('products', editId, updates);
    const pIdx = currentProducts.findIndex(p => p.id === editId);
    if (pIdx !== -1) currentProducts[pIdx] = { ...currentProducts[pIdx], ...updates };

    Utils.showToast('Produk berhasil diperbarui!', 'success');
  } else {
    // Mode Tambah Baru
    const newProd = Store.create('products', {
      umkmId: currentSellerUmkm.id,
      name,
      price,
      category,
      description: desc,
      inStock,
      views: 1,
      image: uploadedProductImageBase64 || Utils.generateSvgPlaceholder(name, category, 'product')
    });
    currentProducts.unshift(newProd);
    Utils.showToast(`Produk "${name}" berhasil ditambahkan ke etalase!`, 'success');
  }

  Utils.closeModal('productManageModal');
  loadDashboardData();
  renderProductsManageTable();
}

