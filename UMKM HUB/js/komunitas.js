/**
 * ============================================================================
 * UMKM HUB - KOMUNITAS & CHAT (komunitas.js)
 * Obrolan grup kota/sektor & chat privat antar-pengguna dengan simulasi
 * real-time antar tab via storage event, mobile toggle, & auto-scroll.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let allCommunities = [];
let allMessages = [];
let activeMode = 'community'; // 'community' atau 'direct'
let activeTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allCommunities = Store.getAll('communities');
  allMessages = Store.getAll('messages');

  const urlParams = new URLSearchParams(window.location.search);
  const dmParam = urlParams.get('dm');
  const commParam = urlParams.get('comm');

  if (dmParam) {
    activeMode = 'direct';
    activeTargetId = dmParam;
  } else if (commParam) {
    activeMode = 'community';
    activeTargetId = commParam;
  } else {
    activeMode = 'community';
    activeTargetId = allCommunities[0] ? allCommunities[0].id : 'comm-group-1';
  }

  setupEventListeners();
  renderConversationsList();
  renderActiveChatRoom();

  // Listener sinkronisasi real-time antar-tab
  window.addEventListener('umkm-store-change', (e) => {
    if (e.detail && (e.detail.collection === 'messages' || e.detail.action === 'cross-tab-sync')) {
      allMessages = Store.getAll('messages');
      renderMessagesOnly();
    }
  });
});

/**
 * 1. Setup Event Listeners
 */
function setupEventListeners() {
  const tabGroups = document.getElementById('tabCommGroups');
  const tabDirects = document.getElementById('tabDirectChats');
  const searchInput = document.getElementById('commSearchInput');
  const msgForm = document.getElementById('chatSendMessageForm');
  const mobileBackBtn = document.getElementById('btnMobileBackToSidebar');

  // Tab switch
  if (tabGroups && tabDirects) {
    tabGroups.addEventListener('click', () => {
      tabGroups.classList.add('active');
      tabDirects.classList.remove('active');
      activeMode = 'community';
      if (!allCommunities.some(c => c.id === activeTargetId)) {
        activeTargetId = allCommunities[0] ? allCommunities[0].id : null;
      }
      renderConversationsList();
      renderActiveChatRoom();
    });

    tabDirects.addEventListener('click', () => {
      tabDirects.classList.add('active');
      tabGroups.classList.remove('active');
      activeMode = 'direct';
      renderConversationsList();
      renderActiveChatRoom();
    });
  }

  // Filter pencarian
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => renderConversationsList(), 200));
  }

  // Kirim Pesan
  if (msgForm) {
    msgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendMessage();
    });
  }

  // Tombol Kembali di Layar HP
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', () => {
      const layout = document.getElementById('chatLayoutContainer');
      if (layout) layout.classList.remove('showing-room');
    });
  }

  // Modal Buat Komunitas
  const btnOpenModal = document.getElementById('btnOpenCreateCommModal');
  const btnCloseModal = document.getElementById('btnCloseCreateCommModal');
  const btnCancelModal = document.getElementById('btnCancelCreateComm');
  const createForm = document.getElementById('createCommForm');

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      if (!Auth.requireAuth('membentuk komunitas baru')) return;
      Utils.openModal('createCommModal');
    });
  }
  if (btnCloseModal) btnCloseModal.addEventListener('click', () => Utils.closeModal('createCommModal'));
  if (btnCancelModal) btnCancelModal.addEventListener('click', () => Utils.closeModal('createCommModal'));

  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const name = document.getElementById('newCommName').value.trim();
      const type = document.getElementById('newCommType').value;
      const icon = document.getElementById('newCommIcon').value.trim() || '👥';
      const desc = document.getElementById('newCommDesc').value.trim();

      const newComm = Store.create('communities', {
        name,
        type,
        icon,
        description: desc,
        membersCount: 1,
        members: [user.id]
      });

      allCommunities.push(newComm);
      activeMode = 'community';
      activeTargetId = newComm.id;

      Utils.closeModal('createCommModal');
      createForm.reset();
      Utils.showToast(`Komunitas "${name}" berhasil dibentuk!`, 'success');

      renderConversationsList();
      renderActiveChatRoom();
    });
  }
}

/**
 * 2. Render Daftar Percakapan di Sidebar
 */
function renderConversationsList() {
  const container = document.getElementById('conversationsListContainer');
  const searchInput = document.getElementById('commSearchInput');
  if (!container) return;

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const user = Auth.getCurrentUser();

  if (activeMode === 'community') {
    // Mode Komunitas Grup
    const filtered = allCommunities.filter(c => {
      if (query) {
        return c.name.toLowerCase().includes(query) || (c.city && c.city.toLowerCase().includes(query));
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: var(--text-xs);">Komunitas tidak ditemukan.</div>`;
      return;
    }

    container.innerHTML = filtered.map(c => {
      const isActive = c.id === activeTargetId;
      // Ambil pesan terakhir
      const lastMsg = allMessages.filter(m => m.communityId === c.id).slice(-1)[0];

      return `
        <div class="chat-conversation-item ${isActive ? 'active' : ''}" data-target-id="${c.id}" data-mode="community">
          <div style="font-size: 1.5rem; width: 40px; height: 40px; border-radius: var(--radius-full); background: var(--sky-1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${c.icon || '🏢'}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="flex items-center justify-between">
              <strong style="color: var(--navy); font-size: var(--text-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${Utils.escapeHtml(c.name)}
              </strong>
              ${lastMsg ? `<span style="font-size: 0.65rem; color: var(--text-muted);">${Utils.formatRelativeTime(lastMsg.timestamp)}</span>` : ''}
            </div>
            <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${lastMsg ? `${Utils.escapeHtml(lastMsg.senderName.split(' ')[0])}: ${Utils.escapeHtml(lastMsg.text)}` : `${c.membersCount || 10} Anggota terdaftar`}
            </p>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // Mode Direct Chat
    const users = Store.getAll('users');
    const contacts = users.filter(u => !user || u.id !== user.id);

    container.innerHTML = contacts.map(u => {
      const isActive = u.id === activeTargetId;
      const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';

      return `
        <div class="chat-conversation-item ${isActive ? 'active' : ''}" data-target-id="${u.id}" data-mode="direct">
          <div style="font-size: 1rem; width: 40px; height: 40px; border-radius: var(--radius-full); background: var(--blue-light); color: var(--navy); font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${initial}
          </div>
          <div style="flex: 1; min-width: 0;">
            <div class="flex items-center justify-between">
              <strong style="color: var(--navy); font-size: var(--text-sm); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${Utils.escapeHtml(u.name)}
              </strong>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">
              ${u.role === 'seller' ? 'Seller UMKM' : 'Pengguna Terverifikasi'}
            </p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Pasang listener klik item percakapan
  container.querySelectorAll('.chat-conversation-item').forEach(item => {
    item.addEventListener('click', () => {
      activeTargetId = item.getAttribute('data-target-id');
      renderConversationsList();
      renderActiveChatRoom();

      // Di HP, aktifkan tampilan room
      const layout = document.getElementById('chatLayoutContainer');
      if (layout) layout.classList.add('showing-room');
    });
  });
}

/**
 * 3. Render Ruang Obrolan Aktif (Header & Messages)
 */
function renderActiveChatRoom() {
  const iconEl = document.getElementById('chatRoomIcon');
  const titleEl = document.getElementById('chatRoomTitle');
  const subEl = document.getElementById('chatRoomSubtitle');
  const inputEl = document.getElementById('chatMessageInput');

  if (activeMode === 'community') {
    const comm = allCommunities.find(c => c.id === activeTargetId) || allCommunities[0];
    if (comm) {
      if (iconEl) iconEl.textContent = comm.icon || '🏢';
      if (titleEl) titleEl.textContent = comm.name;
      if (subEl) subEl.textContent = `${comm.membersCount || 10} Anggota &bull; ${comm.type === 'kota' ? 'Grup Kota' : 'Grup Sektoral'}`;
      if (inputEl) inputEl.placeholder = `Tulis pesan di ${comm.name}...`;
    }
  } else {
    const otherUser = Store.getById('users', activeTargetId);
    if (otherUser) {
      if (iconEl) iconEl.textContent = '👤';
      if (titleEl) titleEl.textContent = otherUser.name;
      if (subEl) subEl.textContent = `${otherUser.role === 'seller' ? 'Seller UMKM' : 'Pengguna'} &bull; Obrolan Privat`;
      if (inputEl) inputEl.placeholder = `Kirim pesan privat ke ${otherUser.name}...`;
    }
  }

  renderMessagesOnly();
}

/**
 * 4. Render Hanya Bubble Pesan & Auto-Scroll
 */
function renderMessagesOnly() {
  const area = document.getElementById('chatMessagesArea');
  if (!area) return;

  const user = Auth.getCurrentUser();
  const currentUserId = user ? user.id : 'guest';

  let relevantMsgs = [];
  if (activeMode === 'community') {
    relevantMsgs = allMessages.filter(m => m.communityId === activeTargetId);
  } else {
    relevantMsgs = allMessages.filter(m =>
      (m.senderId === currentUserId && m.recipientId === activeTargetId) ||
      (m.senderId === activeTargetId && m.recipientId === currentUserId)
    );
  }

  if (relevantMsgs.length === 0) {
    area.innerHTML = `
      <div style="margin: auto; text-align: center; color: var(--text-muted); font-size: var(--text-sm);">
        <p>👋 Belum ada pesan dalam percakapan ini.</p>
        <p style="font-size: var(--text-xs);">Ketik sapaan pertama Anda di bawah untuk memulai obrolan!</p>
      </div>
    `;
    return;
  }

  let html = '';
  let lastDateStr = '';

  relevantMsgs.forEach(m => {
    const isSent = m.senderId === currentUserId;
    const msgDate = new Date(m.timestamp);
    const dateStr = msgDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    if (dateStr !== lastDateStr) {
      html += `<div class="chat-date-divider">${dateStr}</div>`;
      lastDateStr = dateStr;
    }

    const timeStr = msgDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    html += `
      <div class="chat-bubble-wrapper ${isSent ? 'sent' : 'received'}">
        ${!isSent ? `<span class="chat-bubble-sender">${Utils.escapeHtml(m.senderName)}</span>` : ''}
        <div class="chat-bubble">
          ${Utils.escapeHtml(m.text)}
        </div>
        <span class="chat-bubble-time">${timeStr}</span>
      </div>
    `;
  });

  area.innerHTML = html;
  // Scroll ke pesan terbaru
  area.scrollTop = area.scrollHeight;
}

/**
 * 5. Handle Kirim Pesan
 */
function handleSendMessage() {
  if (!Auth.requireAuth('mengirim pesan')) return;

  const input = document.getElementById('chatMessageInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const user = Auth.getCurrentUser();

  const newMsg = {
    senderId: user.id,
    senderName: user.name,
    text,
    timestamp: new Date().toISOString()
  };

  if (activeMode === 'community') {
    newMsg.communityId = activeTargetId;
  } else {
    newMsg.recipientId = activeTargetId;
  }

  const saved = Store.create('messages', newMsg);
  allMessages.push(saved);

  input.value = '';
  renderMessagesOnly();
  renderConversationsList();
}

