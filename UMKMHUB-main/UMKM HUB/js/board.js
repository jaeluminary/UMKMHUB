/**
 * ============================================================================
 * UMKM HUB - BOARD KOLABORASI (board.js)
 * Papan pengumuman B2B dengan beragam tipe badge, filter pencarian & status,
 * pembuatan pengumuman baru, respon penawaran, serta aksi tutup/hapus oleh pemilik.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let allPosts = [];
let allUmkms = [];
let activeRespondPostId = null;

const badgeMap = {
  'pemasok': { class: 'badge-pemasok', label: 'Cari Pemasok' },
  'mitra': { class: 'badge-mitra', label: 'Cari Mitra Bisnis' },
  'kolaborasi': { class: 'badge-kolaborasi', label: 'Terbuka Kolaborasi' },
  'acara': { class: 'badge-acara', label: 'Peluang Acara' },
  'layanan': { class: 'badge-layanan', label: 'Tawarkan Layanan' }
};

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allPosts = Store.getAll('boardPosts');
  allUmkms = Store.getAll('umkm');

  setupEventListeners();
  renderBoard();
});

/**
 * 1. Setup Event Listeners
 */
function setupEventListeners() {
  const searchInput = document.getElementById('boardSearchInput');
  const typeFilter = document.getElementById('boardTypeFilter');
  const statusFilter = document.getElementById('boardStatusFilter');

  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => renderBoard(), 250));
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', () => renderBoard());
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', () => renderBoard());
  }

  // Buka Modal Buat Pengumuman
  const btnOpenCreate = document.getElementById('btnOpenCreateBoardModal');
  const btnCloseCreate = document.getElementById('btnCloseCreateBoardModal');
  const btnCancelCreate = document.getElementById('btnCancelCreateBoard');
  const createForm = document.getElementById('createBoardForm');

  if (btnOpenCreate) {
    btnOpenCreate.addEventListener('click', () => {
      if (!Auth.requireAuth('memasang pengumuman kolaborasi')) return;
      Utils.openModal('createBoardModal');
    });
  }
  if (btnCloseCreate) btnCloseCreate.addEventListener('click', () => Utils.closeModal('createBoardModal'));
  if (btnCancelCreate) btnCancelCreate.addEventListener('click', () => Utils.closeModal('createBoardModal'));

  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const title = document.getElementById('newBoardTitle').value.trim();
      const type = document.getElementById('newBoardType').value;
      const location = document.getElementById('newBoardLocation').value.trim();
      const budget = document.getElementById('newBoardBudget').value.trim();
      const deadline = document.getElementById('newBoardDeadline').value;
      const desc = document.getElementById('newBoardDesc').value.trim();

      const newPost = Store.create('boardPosts', {
        authorUmkmId: user.umkmId || 'umkm-1',
        title,
        type,
        location,
        budget: budget || 'Sesuai Kesepakatan',
        deadline,
        description: desc,
        status: 'open',
        responses: []
      });

      allPosts.unshift(newPost);
      Utils.closeModal('createBoardModal');
      createForm.reset();
      Utils.showToast('Pengumuman kolaborasi berhasil diterbitkan!', 'success');
      renderBoard();
    });
  }

  // Modal Respon
  const btnCloseRespond = document.getElementById('btnCloseRespondModal');
  const btnCancelRespond = document.getElementById('btnCancelRespond');
  const respondForm = document.getElementById('respondBoardForm');

  if (btnCloseRespond) btnCloseRespond.addEventListener('click', () => Utils.closeModal('respondBoardModal'));
  if (btnCancelRespond) btnCancelRespond.addEventListener('click', () => Utils.closeModal('respondBoardModal'));

  if (respondForm) {
    respondForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const contact = document.getElementById('respondContact').value.trim();
      const message = document.getElementById('respondMessage').value.trim();

      const post = Store.getById('boardPosts', activeRespondPostId);
      if (!post) return;

      const responses = post.responses || [];
      responses.push({
        id: `resp-${Date.now()}`,
        umkmId: (user && user.umkmId) || 'user-sender',
        senderName: (user && user.name) || 'Mitra UMKM',
        contact,
        message,
        createdAt: new Date().toISOString()
      });

      Store.update('boardPosts', post.id, { responses });

      // Perbarui memori lokal
      const pIdx = allPosts.findIndex(p => p.id === post.id);
      if (pIdx !== -1) allPosts[pIdx].responses = responses;

      Utils.closeModal('respondBoardModal');
      respondForm.reset();
      Utils.showToast('Respon kemitraan Anda berhasil dikirimkan!', 'success');
      renderBoard();
    });
  }
}

/**
 * 2. Render Daftar Pengumuman Board
 */
function renderBoard() {
  const container = document.getElementById('boardPostsContainer');
  const searchInput = document.getElementById('boardSearchInput');
  const typeFilter = document.getElementById('boardTypeFilter');
  const statusFilter = document.getElementById('boardStatusFilter');

  if (!container) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const typeVal = typeFilter ? typeFilter.value : '';
  const statusVal = statusFilter ? statusFilter.value : 'all';

  const user = Auth.getCurrentUser();
  const myUmkmId = user ? user.umkmId : null;

  const filtered = allPosts.filter(p => {
    if (query) {
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchDesc = p.description.toLowerCase().includes(query);
      const matchLoc = (p.location || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    if (typeVal && p.type !== typeVal) return false;
    if (statusVal !== 'all' && p.status !== statusVal) return false;

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3 class="empty-state-title">Tidak Ada Pengumuman Kolaborasi</h3>
        <p class="empty-state-desc">Belum ada pengumuman yang sesuai dengan filter ini. Anda bisa menjadi yang pertama memasang pengumuman!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const author = allUmkms.find(u => u.id === p.authorUmkmId) || { name: 'UMKM Indonesia', city: 'Indonesia' };
    const badge = badgeMap[p.type] || { class: 'badge-navy', label: p.type };
    const isOwner = myUmkmId && String(myUmkmId) === String(p.authorUmkmId);
    const isOpen = p.status === 'open';
    const responses = p.responses || [];

    return `
      <article class="board-item-card" style="${!isOpen ? 'opacity: 0.75; background: var(--surface-bg);' : ''}">
        <div class="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="badge ${badge.class}">${badge.label}</span>
            <span class="badge ${isOpen ? 'badge-sky' : 'badge-navy'}" style="font-size: 0.7rem;">
              ${isOpen ? '● Terbuka' : '✕ Ditutup'}
            </span>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">
            Diterbitkan ${Utils.formatRelativeTime(p.createdAt)}
          </span>
        </div>

        <h3 style="font-size: var(--text-lg); margin-bottom: 0.5rem; color: var(--navy); line-height: 1.3;">
          ${Utils.escapeHtml(p.title)}
        </h3>

        <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
          ${Utils.escapeHtml(p.description)}
        </p>

        <!-- Informasi Penulis & Tenggat -->
        <div class="board-meta-row">
          <span>🏢 <a href="umkm.html?id=${author.id}" style="font-weight: 700; color: var(--navy);">${Utils.escapeHtml(author.name)}</a></span>
          <span>📍 ${Utils.escapeHtml(p.location)}</span>
          ${p.budget ? `<span>💰 ${Utils.escapeHtml(p.budget)}</span>` : ''}
          <span>⏳ Tenggat: <strong>${Utils.formatDate(p.deadline)}</strong></span>
        </div>

        <!-- Bagian Respon Masuk (Jika Ada) -->
        ${responses.length > 0 ? `
          <div style="margin-top: 1rem; padding: 0.875rem; background: var(--surface-bg); border-radius: var(--radius-md); border: 1px dashed var(--border-medium);">
            <div style="font-size: var(--text-xs); font-weight: 700; color: var(--navy); margin-bottom: 0.5rem;">
              💬 Tanggapan / Respon Mitra (${responses.length}):
            </div>
            ${responses.map(r => `
              <div style="font-size: var(--text-xs); margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light);">
                <strong>${Utils.escapeHtml(r.senderName || 'Mitra')}</strong> (${Utils.escapeHtml(r.contact)}):
                <p style="margin: 2px 0 0; color: var(--text-secondary);">${Utils.escapeHtml(r.message)}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Aksi Tombol -->
        <div class="flex items-center justify-end gap-2 mt-3 pt-3" style="border-top: 1px solid var(--border-light);">
          ${isOwner ? `
            <button class="btn btn-sm btn-outline btn-toggle-status" data-post-id="${p.id}" data-current-status="${p.status}">
              ${isOpen ? 'Tutup Pengumuman' : 'Buka Kembali'}
            </button>
            <button class="btn btn-sm btn-ghost text-red-500 btn-delete-post" data-post-id="${p.id}" style="color: var(--danger-text);">
              Hapus
            </button>
          ` : ''}

          ${isOpen ? `
            <button class="btn btn-cta btn-sm btn-open-respond" data-post-id="${p.id}" data-post-title="${Utils.escapeHtml(p.title)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Tanggapi Pengumuman
            </button>
          ` : `
            <span style="font-size: var(--text-xs); color: var(--text-muted); font-style: italic;">Pengumuman ini telah selesai / ditutup</span>
          `}
        </div>
      </article>
    `;
  }).join('');

  // Listener Tanggapi
  container.querySelectorAll('.btn-open-respond').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!Auth.requireAuth('merespon pengumuman kolaborasi')) return;

      activeRespondPostId = btn.getAttribute('data-post-id');
      const title = btn.getAttribute('data-post-title');
      document.getElementById('respondTargetTitle').textContent = title;

      // Isi otomatis kontak user jika ada
      const user = Auth.getCurrentUser();
      const contactInput = document.getElementById('respondContact');
      if (user && contactInput) {
        contactInput.value = user.email || '';
      }

      Utils.openModal('respondBoardModal');
    });
  });

  // Listener Toggle Status (Pemilik)
  container.querySelectorAll('.btn-toggle-status').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-post-id');
      const curr = btn.getAttribute('data-current-status');
      const nextStatus = curr === 'open' ? 'closed' : 'open';

      Store.update('boardPosts', pid, { status: nextStatus });
      const pIdx = allPosts.findIndex(p => p.id === pid);
      if (pIdx !== -1) allPosts[pIdx].status = nextStatus;

      Utils.showToast(`Status pengumuman diubah menjadi ${nextStatus === 'open' ? 'Terbuka' : 'Ditutup'}.`, 'info');
      renderBoard();
    });
  });

  // Listener Hapus (Pemilik)
  container.querySelectorAll('.btn-delete-post').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
        const pid = btn.getAttribute('data-post-id');
        Store.remove('boardPosts', pid);
        allPosts = allPosts.filter(p => p.id !== pid);
        Utils.showToast('Pengumuman berhasil dihapus.', 'info');
        renderBoard();
      }
    });
  });
}

