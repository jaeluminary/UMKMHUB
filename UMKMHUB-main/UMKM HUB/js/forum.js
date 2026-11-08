/**
 * ============================================================================
 * UMKM HUB - FORUM KOMUNITAS (forum.js)
 * Diskusi interaktif: thread list, filter kategori & urutan,
 * detail thread dengan komentar bersarang 1-tingkat, dan voting upvote.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let allThreads = [];
let activeThreadId = null;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allThreads = Store.getAll('forumThreads');

  const urlParams = new URLSearchParams(window.location.search);
  const threadId = urlParams.get('id');

  setupEventListeners();

  if (threadId) {
    showThreadDetail(threadId);
  } else {
    showThreadList();
  }
});

/**
 * 1. Setup Event Listeners
 */
function setupEventListeners() {
  const searchInput = document.getElementById('forumSearchInput');
  const catFilter = document.getElementById('forumCategoryFilter');
  const sortOrder = document.getElementById('forumSortOrder');
  const btnBack = document.getElementById('btnBackToThreadList');

  if (searchInput) searchInput.addEventListener('input', Utils.debounce(() => renderThreadList(), 250));
  if (catFilter) catFilter.addEventListener('change', () => renderThreadList());
  if (sortOrder) sortOrder.addEventListener('change', () => renderThreadList());

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      // Ubah URL tanpa reload
      window.history.pushState({}, '', 'forum.html');
      showThreadList();
    });
  }

  // Modal Buat Thread
  const btnOpenModal = document.getElementById('btnOpenCreateThreadModal');
  const btnCloseModal = document.getElementById('btnCloseCreateThreadModal');
  const btnCancelModal = document.getElementById('btnCancelCreateThread');
  const createForm = document.getElementById('createThreadForm');

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      if (!Auth.requireAuth('membuat thread baru')) return;
      Utils.openModal('createThreadModal');
    });
  }
  if (btnCloseModal) btnCloseModal.addEventListener('click', () => Utils.closeModal('createThreadModal'));
  if (btnCancelModal) btnCancelModal.addEventListener('click', () => Utils.closeModal('createThreadModal'));

  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const title = document.getElementById('newThreadTitle').value.trim();
      const category = document.getElementById('newThreadCategory').value;
      const content = document.getElementById('newThreadContent').value.trim();

      const newThread = Store.create('forumThreads', {
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        authorUmkm: user.role === 'seller' ? 'Seller UMKM' : '',
        title,
        category,
        content,
        upvotes: [user.id],
        commentsCount: 0,
        comments: []
      });

      allThreads.unshift(newThread);
      Utils.closeModal('createThreadModal');
      createForm.reset();
      Utils.showToast('Thread diskusi berhasil diterbitkan!', 'success');
      showThreadDetail(newThread.id);
    });
  }
}

/**
 * 2. Tampilkan Halaman Daftar Thread
 */
function showThreadList() {
  activeThreadId = null;
  document.getElementById('threadDetailBackBar').style.display = 'none';
  document.getElementById('threadDetailContainer').style.display = 'none';
  document.getElementById('threadListSection').style.display = 'block';
  renderThreadList();
}

/**
 * 3. Render Daftar Thread
 */
function renderThreadList() {
  const container = document.getElementById('forumThreadsList');
  const searchInput = document.getElementById('forumSearchInput');
  const catFilter = document.getElementById('forumCategoryFilter');
  const sortOrder = document.getElementById('forumSortOrder');

  if (!container) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = catFilter ? catFilter.value : '';
  const sort = sortOrder ? sortOrder.value : 'newest';

  const user = Auth.getCurrentUser();
  const currentUserId = user ? user.id : null;

  const filtered = allThreads.filter(t => {
    if (query) {
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchContent = t.content.toLowerCase().includes(query);
      if (!matchTitle && !matchContent) return false;
    }
    if (category && t.category !== category) return false;
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'popular') return (b.upvotes ? b.upvotes.length : 0) - (a.upvotes ? a.upvotes.length : 0);
    if (sort === 'comments') return (b.commentsCount || 0) - (a.commentsCount || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <h3 class="empty-state-title">Belum Ada Diskusi di Topik Ini</h3>
        <p class="empty-state-desc">Jadilah yang pertama memulai diskusi bermanfaat untuk komunitas UMKM.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(t => {
    const upvotes = t.upvotes || [];
    const hasUpvoted = currentUserId && upvotes.includes(currentUserId);
    const commentsCount = t.commentsCount || (t.comments ? t.comments.length : 0);

    return `
      <article class="forum-thread-card" data-thread-id="${t.id}">
        <!-- Upvote Box -->
        <button class="vote-box ${hasUpvoted ? 'voted' : ''}" data-vote-thread="${t.id}" aria-label="Beri Upvote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
          <span style="font-size: 0.75rem; font-weight: 800; margin-top: 2px;">${upvotes.length}</span>
        </button>

        <!-- Content Area -->
        <div style="flex: 1; cursor: pointer;" onclick="window.location.href='forum.html?id=${t.id}'">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="badge badge-sky">${Utils.escapeHtml(t.category)}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">&bull; ${Utils.formatRelativeTime(t.createdAt)}</span>
          </div>
          <h2 style="font-size: var(--text-base); color: var(--navy); margin-bottom: 0.4rem; line-height: 1.35;">
            <a href="forum.html?id=${t.id}" onclick="event.stopPropagation();">${Utils.escapeHtml(t.title)}</a>
          </h2>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${Utils.escapeHtml(t.content)}
          </p>
          <div class="flex items-center justify-between" style="font-size: var(--text-xs); color: var(--text-secondary);">
            <span>
              Dimulai oleh <strong>${Utils.escapeHtml(t.authorName)}</strong>
              ${t.authorRole === 'seller' ? `<span class="badge badge-collab" style="font-size: 0.65rem; padding: 2px 6px; margin-left: 4px;">Seller</span>` : ''}
            </span>
            <span class="flex items-center gap-1 font-semibold text-navy">
              💬 ${commentsCount} Komentar
            </span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Event listener tombol upvote
  container.querySelectorAll('[data-vote-thread]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tid = btn.getAttribute('data-vote-thread');
      handleVote(tid);
    });
  });
}

/**
 * 4. Tampilkan Detail Thread
 */
function showThreadDetail(threadId) {
  const thread = Store.getById('forumThreads', threadId);
  if (!thread) {
    showThreadList();
    return;
  }

  activeThreadId = thread.id;
  document.getElementById('threadListSection').style.display = 'none';
  document.getElementById('threadDetailBackBar').style.display = 'block';
  const detailBox = document.getElementById('threadDetailContainer');
  detailBox.style.display = 'block';

  renderThreadDetailContent(thread);
}

/**
 * 5. Render Isi Detail Thread & Komentar
 */
function renderThreadDetailContent(t) {
  const container = document.getElementById('threadDetailContainer');
  const user = Auth.getCurrentUser();
  const currentUserId = user ? user.id : null;
  const isAuthor = currentUserId && String(currentUserId) === String(t.authorId);
  const upvotes = t.upvotes || [];
  const hasUpvoted = currentUserId && upvotes.includes(currentUserId);
  const comments = t.comments || [];

  container.innerHTML = `
    <!-- Kartu Postingan Utama -->
    <article class="card mb-4" style="padding: 1.75rem;">
      <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="badge badge-sky">${Utils.escapeHtml(t.category)}</span>
          <span style="font-size: 0.75rem; color: var(--text-muted);">&bull; Diterbitkan ${Utils.formatRelativeTime(t.createdAt)}</span>
        </div>
        ${isAuthor ? `
          <button id="btnDeleteThread" class="btn btn-ghost btn-sm" style="color: var(--danger-text);">
            Hapus Thread
          </button>
        ` : ''}
      </div>

      <h1 style="font-size: var(--text-2xl); color: var(--navy); margin-bottom: 1rem; line-height: 1.3;">
        ${Utils.escapeHtml(t.title)}
      </h1>

      <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom: 1px solid var(--border-light); font-size: var(--text-sm);">
        <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--sky-1); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--navy);">
          ${t.authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <strong>${Utils.escapeHtml(t.authorName)}</strong>
          ${t.authorRole === 'seller' ? `<span class="badge badge-collab" style="font-size: 0.65rem; padding: 2px 6px; margin-left: 4px;">Seller UMKM</span>` : ''}
        </div>
      </div>

      <div style="font-size: var(--text-base); color: var(--text-secondary); line-height: 1.7; white-space: pre-line; margin-bottom: 1.5rem;">
        ${Utils.escapeHtml(t.content)}
      </div>

      <div class="flex items-center gap-3 pt-3" style="border-top: 1px solid var(--border-light);">
        <button class="btn ${hasUpvoted ? 'btn-secondary' : 'btn-outline'} btn-sm" id="btnDetailUpvote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
          <span>Upvote (${upvotes.length})</span>
        </button>
        <span style="font-size: var(--text-xs); color: var(--text-muted);">
          💬 ${comments.length} Komentar Diskusi
        </span>
      </div>
    </article>

    <!-- Bagian Komentar -->
    <div class="card" style="padding: 1.75rem;">
      <h3 style="font-size: var(--text-lg); color: var(--navy); margin-bottom: 1.25rem;">
        Komentar & Diskusi (${comments.length})
      </h3>

      <!-- Form Tambah Komentar Utama -->
      <form id="addCommentForm" style="margin-bottom: 2rem;">
        <div class="form-group">
          <label class="form-label" for="commentInput">Tulis Tanggapan Anda:</label>
          <textarea id="commentInput" class="form-textarea" placeholder="Bagikan pandangan atau pengalaman Anda tentang topik ini..." required style="min-height: 90px;"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary btn-sm">Kirim Komentar</button>
        </div>
      </form>

      <!-- Daftar Komentar -->
      <div id="threadCommentsList" class="flex flex-col gap-3">
        ${comments.length === 0 ? `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: var(--text-sm);">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </div>
        ` : comments.map((comm, cIdx) => `
          <div class="forum-comment-item">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <strong style="color: var(--navy); font-size: var(--text-sm);">${Utils.escapeHtml(comm.authorName)}</strong>
                ${comm.authorRole === 'seller' ? `<span class="badge badge-sky" style="font-size: 0.65rem; padding: 1px 6px;">Seller</span>` : ''}
              </div>
              <span style="font-size: 0.7rem; color: var(--text-muted);">${Utils.formatRelativeTime(comm.createdAt)}</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 0.5rem; line-height: 1.5;">
              ${Utils.escapeHtml(comm.content)}
            </p>
            <button class="btn btn-ghost btn-sm btn-reply-toggle" data-comment-idx="${cIdx}" style="padding: 0; font-size: 0.75rem; color: var(--blue);">
              ↳ Balas Komentar
            </button>

            <!-- Box Form Balasan (Hidden by default) -->
            <div id="replyBox-${cIdx}" style="display: none; margin-top: 0.75rem; padding: 0.75rem; background: var(--surface-bg); border-radius: var(--radius-sm);">
              <input type="text" id="replyInput-${cIdx}" class="form-input mb-2" placeholder="Tulis balasan Anda..." style="min-height: 38px; font-size: var(--text-xs);">
              <div class="flex justify-end gap-2">
                <button type="button" class="btn btn-ghost btn-sm btn-cancel-reply" data-comment-idx="${cIdx}">Batal</button>
                <button type="button" class="btn btn-primary btn-sm btn-submit-reply" data-comment-idx="${cIdx}">Kirim Balasan</button>
              </div>
            </div>

            <!-- Balasan Satu Tingkat (Replies) -->
            ${(comm.replies || []).map(rep => `
              <div class="forum-reply-item">
                <div class="flex items-center justify-between mb-1">
                  <strong style="color: var(--navy); font-size: var(--text-xs);">${Utils.escapeHtml(rep.authorName)}</strong>
                  <span style="font-size: 0.68rem; color: var(--text-muted);">${Utils.formatRelativeTime(rep.createdAt)}</span>
                </div>
                <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.45;">
                  ${Utils.escapeHtml(rep.content)}
                </p>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Listener Upvote di Detail
  const btnDetailUpvote = document.getElementById('btnDetailUpvote');
  if (btnDetailUpvote) {
    btnDetailUpvote.addEventListener('click', () => handleVote(t.id, true));
  }

  // Listener Hapus Thread
  const btnDelete = document.getElementById('btnDeleteThread');
  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      if (confirm('Hapus thread diskusi ini secara permanen?')) {
        Store.remove('forumThreads', t.id);
        allThreads = allThreads.filter(th => th.id !== t.id);
        Utils.showToast('Thread berhasil dihapus.', 'info');
        showThreadList();
      }
    });
  }

  // Listener Submit Komentar Utama
  const commentForm = document.getElementById('addCommentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!Auth.requireAuth('menulis komentar')) return;

      const user = Auth.getCurrentUser();
      const content = document.getElementById('commentInput').value.trim();
      if (!content) return;

      const newComments = t.comments || [];
      newComments.push({
        id: `comm-${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        content,
        createdAt: new Date().toISOString(),
        replies: []
      });

      Store.update('forumThreads', t.id, {
        comments: newComments,
        commentsCount: newComments.length
      });

      // Update objek lokal & render ulang
      t.comments = newComments;
      t.commentsCount = newComments.length;
      Utils.showToast('Komentar berhasil dikirim!', 'success');
      renderThreadDetailContent(t);
    });
  }

  // Listener Form Balasan Satu Tingkat (Replies)
  container.querySelectorAll('.btn-reply-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!Auth.requireAuth('membalas komentar')) return;
      const idx = btn.getAttribute('data-comment-idx');
      const box = document.getElementById(`replyBox-${idx}`);
      if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });
  });

  container.querySelectorAll('.btn-cancel-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-comment-idx');
      const box = document.getElementById(`replyBox-${idx}`);
      if (box) box.style.display = 'none';
    });
  });

  container.querySelectorAll('.btn-submit-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!Auth.requireAuth('membalas komentar')) return;
      const idx = parseInt(btn.getAttribute('data-comment-idx'), 10);
      const input = document.getElementById(`replyInput-${idx}`);
      const val = input ? input.value.trim() : '';
      if (!val) return;

      const user = Auth.getCurrentUser();
      const comment = t.comments[idx];
      comment.replies = comment.replies || [];
      comment.replies.push({
        id: `rep-${Date.now()}`,
        authorId: user.id,
        authorName: user.name,
        content: val,
        createdAt: new Date().toISOString()
      });

      Store.update('forumThreads', t.id, { comments: t.comments });
      Utils.showToast('Balasan Anda telah dikirim.', 'success');
      renderThreadDetailContent(t);
    });
  });
}

/**
 * 6. Handle Upvote Thread
 */
function handleVote(threadId, isDetailView = false) {
  if (!Auth.requireAuth('memberikan upvote')) return;

  const user = Auth.getCurrentUser();
  const thread = Store.getById('forumThreads', threadId);
  if (!thread) return;

  let upvotes = thread.upvotes || [];
  const idx = upvotes.indexOf(user.id);
  let isVoted = false;

  if (idx === -1) {
    upvotes.push(user.id);
    isVoted = true;
  } else {
    upvotes.splice(idx, 1);
  }

  Store.update('forumThreads', thread.id, { upvotes });

  // Update memori lokal
  const tIdx = allThreads.findIndex(th => th.id === thread.id);
  if (tIdx !== -1) allThreads[tIdx].upvotes = upvotes;

  if (isDetailView) {
    thread.upvotes = upvotes;
    renderThreadDetailContent(thread);
  } else {
    renderThreadList();
  }
}

