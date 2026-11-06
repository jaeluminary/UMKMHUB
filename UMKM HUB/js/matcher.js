/**
 * ============================================================================
 * UMKM HUB - KOLABORASI MATCHER B2B (matcher.js)
 * Algoritma cerdas dua arah mencocokkan Kebutuhan & Penawaran antar-UMKM,
 * dilengkapi skor persentase, penjabaran alasan kecocokan, dan live tags edit.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Auth } from './auth.js';
import { Utils } from './utils.js';

let allUmkm = [];
let myUmkm = null;
let myNeeds = [];
let myOffers = [];
let targetCollabUmkm = null;

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allUmkm = Store.getAll('umkm');

  initMyProfile();
  setupEventListeners();
  calculateAndRenderMatches();
});

/**
 * 1. Inisialisasi Profil Pembanding (Seller Login atau Default UMKM 1)
 */
function initMyProfile() {
  const currentSellerUmkm = Auth.getCurrentSellerUmkm();
  const select = document.getElementById('selectMyUmkm');

  if (select) {
    select.innerHTML = allUmkm.map(u => `
      <option value="${u.id}" ${currentSellerUmkm && currentSellerUmkm.id === u.id ? 'selected' : (u.id === 'umkm-1' ? 'selected' : '')}>
        ${Utils.escapeHtml(u.name)} (${Utils.escapeHtml(u.city)})
      </option>
    `).join('');
  }

  const selectedId = select ? select.value : 'umkm-1';
  setMyUmkm(selectedId);
}

/**
 * 2. Set UMKM Aktif untuk Dicocokkan
 */
function setMyUmkm(umkmId) {
  myUmkm = allUmkm.find(u => u.id === umkmId) || allUmkm[0];
  myNeeds = [...(myUmkm.needs || [])];
  myOffers = [...(myUmkm.offers || [])];

  renderMyTags();
}

/**
 * 3. Render Tags Kebutuhan & Penawaran Saya
 */
function renderMyTags() {
  const needsContainer = document.getElementById('myNeedsTagsContainer');
  const offersContainer = document.getElementById('myOffersTagsContainer');

  if (needsContainer) {
    needsContainer.innerHTML = myNeeds.map((need, idx) => `
      <div class="chip active" style="background-color: var(--navy);">
        <span>${Utils.escapeHtml(need)}</span>
        <button class="chip-remove" data-remove-need="${idx}" aria-label="Hapus ${Utils.escapeHtml(need)}">&times;</button>
      </div>
    `).join('');

    needsContainer.querySelectorAll('[data-remove-need]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-remove-need'), 10);
        myNeeds.splice(idx, 1);
        renderMyTags();
        calculateAndRenderMatches();
      });
    });
  }

  if (offersContainer) {
    offersContainer.innerHTML = myOffers.map((offer, idx) => `
      <div class="chip active" style="background-color: var(--lime-2); color: var(--navy);">
        <span>${Utils.escapeHtml(offer)}</span>
        <button class="chip-remove" data-remove-offer="${idx}" aria-label="Hapus ${Utils.escapeHtml(offer)}" style="background-color: rgba(4,44,143,0.2); color: var(--navy);">&times;</button>
      </div>
    `).join('');

    offersContainer.querySelectorAll('[data-remove-offer]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-remove-offer'), 10);
        myOffers.splice(idx, 1);
        renderMyTags();
        calculateAndRenderMatches();
      });
    });
  }
}

/**
 * 4. Setup Event Listeners
 */
function setupEventListeners() {
  const select = document.getElementById('selectMyUmkm');
  if (select) {
    select.addEventListener('change', () => {
      setMyUmkm(select.value);
      calculateAndRenderMatches();
    });
  }

  // Tambah Kebutuhan Baru
  const btnAddNeed = document.getElementById('btnAddNeedTag');
  if (btnAddNeed) {
    btnAddNeed.addEventListener('click', () => {
      const newNeed = prompt('Masukkan kebutuhan bisnis baru (contoh: Jasa foto produk, Botol kaca 150ml, Kemasan box):');
      if (newNeed && newNeed.trim()) {
        myNeeds.push(newNeed.trim());
        renderMyTags();
        calculateAndRenderMatches();
      }
    });
  }

  // Tambah Penawaran Baru
  const btnAddOffer = document.getElementById('btnAddOfferTag');
  if (btnAddOffer) {
    btnAddOffer.addEventListener('click', () => {
      const newOffer = prompt('Masukkan penawaran bisnis baru (contoh: Kopi arabika sangrai, Sablon kaos katun, Suplai sayur hidroponik):');
      if (newOffer && newOffer.trim()) {
        myOffers.push(newOffer.trim());
        renderMyTags();
        calculateAndRenderMatches();
      }
    });
  }

  // Modal Collab
  const modalClose = document.getElementById('btnCloseMatcherModal');
  const modalCancel = document.getElementById('btnCancelMatcherModal');
  const collabForm = document.getElementById('matcherCollabForm');

  if (modalClose) modalClose.addEventListener('click', () => Utils.closeModal('matcherCollabModal'));
  if (modalCancel) modalCancel.addEventListener('click', () => Utils.closeModal('matcherCollabModal'));

  if (collabForm) {
    collabForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const topic = document.getElementById('matcherCollabTopic').value.trim();
      const msg = document.getElementById('matcherCollabMessage').value.trim();

      if (!topic || !msg) {
        Utils.showToast('Harap lengkapi topik dan pesan kolaborasi.', 'error');
        return;
      }

      Store.create('collabRequests', {
        fromUmkmId: (user && user.umkmId) || myUmkm.id,
        toUmkmId: targetCollabUmkm.id,
        senderName: (user && user.name) || myUmkm.name,
        needOffered: topic,
        message: msg,
        status: 'pending'
      });

      Utils.closeModal('matcherCollabModal');
      collabForm.reset();
      Utils.showToast(`Ajakan kolaborasi berhasil dikirimkan ke ${targetCollabUmkm.name}!`, 'success', 4000);
    });
  }
}

/**
 * 5. Algoritma Pencocokan Dua Arah (Bidirectional Scoring Algorithm)
 */
function calculateAndRenderMatches() {
  const container = document.getElementById('matcherResultsGrid');
  const badgeCount = document.getElementById('matcherCountBadge');
  if (!container || !myUmkm) return;

  const candidates = allUmkm.filter(u => u.id !== myUmkm.id && u.isOpenCollab);

  const scoredMatches = candidates.map(other => {
    let score = 40; // Base score
    const reasons = [];

    // Helper ekstraksi kata kunci signifikan
    const extractKeywords = (tags) => {
      const stopWords = ['dan', 'di', 'ke', 'dari', 'untuk', 'yang', 'dengan', 'atau', 'pada', 'jasa', 'bahan'];
      return tags.flatMap(t =>
        t.toLowerCase().split(/[\s,/-]+/).filter(w => w.length > 2 && !stopWords.includes(w))
      );
    };

    const myNeedWords = extractKeywords(myNeeds);
    const myOfferWords = extractKeywords(myOffers);
    const otherNeedWords = extractKeywords(other.needs || []);
    const otherOfferWords = extractKeywords(other.offers || []);

    // 1. Arah 1: Apa yang Anda butuhkan dipenuhi oleh penawaran mereka
    let needOfferMatches = 0;
    myNeeds.forEach(need => {
      const needLower = need.toLowerCase();
      (other.offers || []).forEach(offer => {
        const offerLower = offer.toLowerCase();
        // Cek overlap kata kunci
        const hasKeywordMatch = myNeedWords.some(kw => offerLower.includes(kw));
        if (hasKeywordMatch || needLower.includes(offerLower) || offerLower.includes(needLower)) {
          needOfferMatches++;
          if (reasons.length < 2) {
            reasons.push(`Anda butuh "${need}", mereka menawarkan "${offer}"`);
          }
        }
      });
    });
    score += Math.min(30, needOfferMatches * 15);

    // 2. Arah 2: Apa yang mereka butuhkan dipenuhi oleh penawaran Anda
    let offerNeedMatches = 0;
    (other.needs || []).forEach(oNeed => {
      const oNeedLower = oNeed.toLowerCase();
      myOffers.forEach(offer => {
        const offerLower = offer.toLowerCase();
        const hasKeywordMatch = myOfferWords.some(kw => oNeedLower.includes(kw));
        if (hasKeywordMatch || oNeedLower.includes(offerLower) || offerLower.includes(oNeedLower)) {
          offerNeedMatches++;
          if (reasons.length < 3) {
            reasons.push(`Mereka butuh "${oNeed}", Anda menawarkan "${offer}"`);
          }
        }
      });
    });
    score += Math.min(25, offerNeedMatches * 12);

    // 3. Sinergi Kategori Komplementer
    const isComplementary =
      (myUmkm.category === 'Kuliner' && ['Jasa', 'Pertanian & Agro'].includes(other.category)) ||
      (myUmkm.category === 'Fesyen' && ['Kriya & Kerajinan', 'Jasa'].includes(other.category)) ||
      (myUmkm.category === 'Kriya & Kerajinan' && ['Jasa', 'Fesyen'].includes(other.category)) ||
      (myUmkm.category === 'Pertanian & Agro' && ['Kuliner', 'Jasa'].includes(other.category));

    if (isComplementary) {
      score += 8;
      reasons.push(`Kategori saling melengkapi (${myUmkm.category} & ${other.category})`);
    }

    // 4. Bonus Lokasi Sama / Berdekatan
    if (myUmkm.city.toLowerCase() === other.city.toLowerCase()) {
      score += 10;
      reasons.push(`Sama-sama berada di ${other.city} (hemat ongkos kirim)`);
    }

    // Default reason jika belum ada yang spesifik
    if (reasons.length === 0) {
      reasons.push(`Peluang kemitraan lintas sektor antara ${myUmkm.city} dan ${other.city}`);
    }

    // Clamp score maksimal 98%
    score = Math.min(98, Math.max(50, score));

    return {
      umkm: other,
      score,
      reasons: reasons.slice(0, 3)
    };
  });

  // Urutkan dari persentase tertinggi
  scoredMatches.sort((a, b) => b.score - a.score);

  if (badgeCount) badgeCount.textContent = `${scoredMatches.length} Rekomendasi`;

  container.innerHTML = scoredMatches.map(m => {
    const u = m.umkm;
    const logoSvg = Utils.generateSvgPlaceholder(u.name, u.category, 'logo');

    return `
      <article class="match-card">
        <div class="match-score-badge">
          <span class="match-score-num">${m.score}%</span>
          <span class="match-score-label">Cocok</span>
        </div>

        <div class="flex items-center gap-3 mb-2" style="padding-right: 65px;">
          <img src="${logoSvg}" alt="${Utils.escapeHtml(u.name)}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover;">
          <div>
            <h3 style="font-size: var(--text-base); margin: 0; color: var(--navy); line-height: 1.25;">
              <a href="umkm.html?id=${u.id}">${Utils.escapeHtml(u.name)}</a>
            </h3>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">📍 ${Utils.escapeHtml(u.city)} &bull; ${Utils.escapeHtml(u.category)}</span>
          </div>
        </div>

        <!-- Alasan Kecocokan -->
        <div class="match-reasons-box">
          <strong style="color: var(--navy); margin-bottom: 2px;">Mengapa Cocok:</strong>
          ${m.reasons.map(r => `<div>&bull; ${Utils.escapeHtml(r)}</div>`).join('')}
        </div>

        <!-- Tag Penawaran Mereka -->
        <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 1rem;">
          <strong style="color: var(--navy);">Menawarkan:</strong> ${(u.offers || []).slice(0, 2).join(', ')}
        </div>

        <div class="flex items-center justify-between gap-2 mt-auto pt-3" style="border-top: 1px solid var(--border-light);">
          <a href="umkm.html?id=${u.id}" class="btn btn-outline btn-sm">
            Lihat Profil
          </a>
          <button class="btn btn-cta btn-sm btn-open-match-collab" data-umkm-id="${u.id}" data-umkm-name="${Utils.escapeHtml(u.name)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            Ajak Kolaborasi
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Event listener untuk tombol ajak kolaborasi
  container.querySelectorAll('.btn-open-match-collab').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!Auth.requireAuth('mengajak kolaborasi bisnis')) return;

      const uid = btn.getAttribute('data-umkm-id');
      const uname = btn.getAttribute('data-umkm-name');
      targetCollabUmkm = allUmkm.find(u => u.id === uid);

      const targetTitle = document.getElementById('matcherTargetName');
      const topicInput = document.getElementById('matcherCollabTopic');

      if (targetTitle) targetTitle.textContent = uname;
      if (topicInput && targetCollabUmkm && targetCollabUmkm.offers && targetCollabUmkm.offers[0]) {
        topicInput.value = `Kerjasama ${targetCollabUmkm.offers[0]}`;
      }

      Utils.openModal('matcherCollabModal');
    });
  });
}

