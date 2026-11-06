/**
 * ============================================================================
 * UMKM HUB - PETA UMKM & UMKM NEAR ME (peta.js)
 * Peta interaktif Leaflet dengan marker berwarna per kategori,
 * fitur Geolocation "Near Me" (Haversine formula & radius slider),
 * sinkronisasi dua arah marker-daftar, dan toggle mobile Peta/Daftar.
 * ============================================================================
 */

import { Store } from './store.js';
import { Components } from './components.js';
import { Utils } from './utils.js';

let allUmkm = [];
let map = null;
let markerLayerGroup = null;
let userLocationMarker = null;
let userCoordinates = null; // { lat, lng }
let markerRefs = {}; // umkmId -> L.Marker

const categoryColors = {
  'Kuliner': '#042C8F',
  'Kriya & Kerajinan': '#0B3BAA',
  'Fesyen': '#4891E7',
  'Pertanian & Agro': '#96B708',
  'Jasa': '#3578CE',
  'Teknologi & Digital': '#021B59',
  'Kecantikan & Herbal': '#BBE11A',
  'Default': '#042C8F'
};

document.addEventListener('DOMContentLoaded', () => {
  Components.init();

  allUmkm = Store.getAll('umkm');

  initLeafletMap();
  setupEventListeners();
  applyFiltersAndRender();
});

/**
 * 1. Inisialisasi Peta Leaflet
 */
function initLeafletMap() {
  const mapEl = document.getElementById('leafletMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Titik tengah kepulauan Indonesia
  map = L.map('leafletMap', {
    center: [-2.5, 117.0],
    zoom: 5,
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap kontributor'
  }).addTo(map);

  markerLayerGroup = L.layerGroup().addTo(map);
}

/**
 * 2. Setup Event Listeners
 */
function setupEventListeners() {
  const btnNearMe = document.getElementById('btnNearMe');
  const catFilter = document.getElementById('mapCategoryFilter');
  const cityFilter = document.getElementById('mapCityFilter');
  const radiusSlider = document.getElementById('radiusSlider');
  const radiusLabel = document.getElementById('radiusValueLabel');

  // Filter Kategori & Kota
  if (catFilter) catFilter.addEventListener('change', () => applyFiltersAndRender());
  if (cityFilter) {
    cityFilter.addEventListener('change', () => {
      userCoordinates = null; // Reset mode GPS jika pilih kota manual
      const gpsBadge = document.getElementById('gpsActiveIndicator');
      if (gpsBadge) gpsBadge.style.display = 'none';
      applyFiltersAndRender();
    });
  }

  // Slider Radius
  if (radiusSlider && radiusLabel) {
    radiusSlider.addEventListener('input', () => {
      radiusLabel.textContent = `${radiusSlider.value} km`;
      if (userCoordinates) {
        applyFiltersAndRender();
      }
    });
  }

  // Tombol UMKM Near Me (Geolocation)
  if (btnNearMe) {
    btnNearMe.addEventListener('click', handleNearMeClick);
  }

  // Toggle Peta / Daftar di Layar HP
  const btnShowMap = document.getElementById('toggleShowMap');
  const btnShowList = document.getElementById('toggleShowList');
  const mapCanvas = document.getElementById('mapCanvasContainer');
  const mapSidebar = document.getElementById('mapSidebarList');

  if (btnShowMap && btnShowList && mapCanvas && mapSidebar) {
    btnShowMap.addEventListener('click', () => {
      btnShowMap.classList.add('active');
      btnShowList.classList.remove('active');
      mapCanvas.style.display = 'block';
      mapSidebar.style.display = 'none';
      if (map) map.invalidateSize();
    });

    btnShowList.addEventListener('click', () => {
      btnShowList.classList.add('active');
      btnShowMap.classList.remove('active');
      mapCanvas.style.display = 'none';
      mapSidebar.style.display = 'flex';
    });

    // Sesuaikan tampilan awal berdasarkan lebar layar
    const checkViewport = () => {
      if (window.innerWidth < 1024) {
        if (btnShowMap.classList.contains('active')) {
          mapCanvas.style.display = 'block';
          mapSidebar.style.display = 'none';
        } else {
          mapCanvas.style.display = 'none';
          mapSidebar.style.display = 'flex';
        }
      } else {
        mapCanvas.style.display = 'block';
        mapSidebar.style.display = 'flex';
      }
      if (map) map.invalidateSize();
    };

    window.addEventListener('resize', checkViewport);
    checkViewport();
  }
}

/**
 * 3. Handle Fitur Geolocation "UMKM Near Me"
 */
function handleNearMeClick() {
  if (!navigator.geolocation) {
    Utils.showToast('Browser Anda tidak mendukung Geolocation GPS.', 'error');
    return;
  }

  Utils.showToast('Mendeteksi lokasi Anda...', 'info');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userCoordinates = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      const gpsBadge = document.getElementById('gpsActiveIndicator');
      if (gpsBadge) gpsBadge.style.display = 'inline-flex';

      // Reset dropdown kota
      const cityFilter = document.getElementById('mapCityFilter');
      if (cityFilter) cityFilter.value = '';

      Utils.showToast('Lokasi Anda berhasil ditemukan!', 'success');
      applyFiltersAndRender();
    },
    (err) => {
      console.warn('Geolocation denied or error:', err);
      Utils.showToast('Izin lokasi tidak diberikan. Menampilkan pilihan kota manual.', 'info', 4000);
      const cityFilter = document.getElementById('mapCityFilter');
      if (cityFilter) {
        cityFilter.focus();
        cityFilter.value = 'Bogor'; // Fallback cerdas
        applyFiltersAndRender();
      }
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

/**
 * 4. Terapkan Filter & Render Marker serta Daftar
 */
function applyFiltersAndRender() {
  const catFilter = document.getElementById('mapCategoryFilter');
  const cityFilter = document.getElementById('mapCityFilter');
  const radiusSlider = document.getElementById('radiusSlider');

  const catVal = catFilter ? catFilter.value : '';
  const cityVal = cityFilter ? cityFilter.value : '';
  const maxRadiusKm = radiusSlider ? parseFloat(radiusSlider.value) : 50;

  let filtered = allUmkm.filter(u => {
    if (catVal && u.category !== catVal) return false;
    if (cityVal && u.city !== cityVal) return false;
    return true;
  });

  // Jika GPS aktif, hitung jarak Haversine dan filter radius
  if (userCoordinates) {
    filtered = filtered.map(u => {
      const dist = Utils.calcDistance(userCoordinates.lat, userCoordinates.lng, u.lat, u.lng);
      return { ...u, distanceKm: dist };
    }).filter(u => u.distanceKm <= maxRadiusKm);

    // Urutkan dari yang paling dekat
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  renderMarkers(filtered);
  renderSidebarCards(filtered);
}

/**
 * 5. Render Marker di Peta Leaflet
 */
function renderMarkers(items) {
  if (!markerLayerGroup || !map) return;

  markerLayerGroup.clearLayers();
  markerRefs = {};

  // Jika ada lokasi user, pasang marker user
  if (userCoordinates) {
    if (userLocationMarker) map.removeLayer(userLocationMarker);

    const userIcon = L.divIcon({
      className: 'user-geo-pin',
      html: `
        <div style="width: 22px; height: 22px; border-radius: 50%; background: #042C8F; border: 3px solid #E8F957; box-shadow: 0 0 12px rgba(4,44,143,0.8); animation: pulse 1.5s infinite;"></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    userLocationMarker = L.marker([userCoordinates.lat, userCoordinates.lng], { icon: userIcon }).addTo(map);
    userLocationMarker.bindPopup('<strong>📍 Posisi Anda Saat Ini</strong>').openPopup();
  }

  const bounds = [];
  if (userCoordinates) bounds.push([userCoordinates.lat, userCoordinates.lng]);

  items.forEach(u => {
    if (!u.lat || !u.lng) return;

    bounds.push([u.lat, u.lng]);
    const color = categoryColors[u.category] || categoryColors['Default'];

    // Icon Pin Kustom Berwarna
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker-wrap',
      html: `
        <div class="custom-leaflet-marker" style="background-color: ${color};">
          <span>🏢</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const marker = L.marker([u.lat, u.lng], { icon: customIcon });

    const distText = u.distanceKm !== undefined ? `<div style="font-size: 0.75rem; color: var(--navy); font-weight: 700;">Jarak: ${Utils.formatDistance(u.distanceKm)}</div>` : '';

    marker.bindPopup(`
      <div style="font-family: var(--font-body); padding: 4px; max-width: 200px;">
        <strong style="color: var(--navy); font-size: 0.95rem;">${Utils.escapeHtml(u.name)}</strong>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin: 2px 0 4px;">📍 ${Utils.escapeHtml(u.city)} &bull; ${Utils.escapeHtml(u.category)}</div>
        ${distText}
        <a href="umkm.html?id=${u.id}" class="btn btn-primary btn-sm" style="display: block; text-align: center; margin-top: 8px; padding: 4px 8px; font-size: 0.75rem;">
          Lihat Profil &rarr;
        </a>
      </div>
    `);

    // Klik marker: sorot kartu di sidebar
    marker.on('click', () => {
      highlightSidebarCard(u.id);
    });

    markerLayerGroup.addLayer(marker);
    markerRefs[u.id] = marker;
  });

  // Fit bounds ke semua marker
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  } else {
    map.setView([-2.5, 117.0], 5);
  }
}

/**
 * 6. Render Daftar Kartu di Samping Peta
 */
function renderSidebarCards(items) {
  const container = document.getElementById('mapCardsScrollContainer');
  const countText = document.getElementById('mapListCountText');
  if (!container) return;

  if (countText) countText.textContent = `${items.length} UMKM Ditemukan`;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem 1rem; text-align: center; color: var(--text-muted); font-size: var(--text-xs);">
        Tidak ada UMKM yang sesuai dengan filter atau radius ini.
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(u => {
    const logoSvg = Utils.generateSvgPlaceholder(u.name, u.category, 'logo');
    const distBadge = u.distanceKm !== undefined
      ? `<span class="badge badge-collab" style="font-size: 0.65rem;">${Utils.formatDistance(u.distanceKm)}</span>`
      : '';

    return `
      <div class="card mb-2 map-item-card" data-card-umkm="${u.id}" style="padding: 0.875rem; cursor: pointer; transition: all 0.2s;">
        <div class="flex items-center gap-2 mb-1 justify-between">
          <span class="badge badge-sky" style="font-size: 0.65rem;">${Utils.escapeHtml(u.category)}</span>
          ${distBadge}
        </div>
        <div class="flex items-center gap-2">
          <img src="${logoSvg}" alt="${Utils.escapeHtml(u.name)}" style="width: 38px; height: 38px; border-radius: var(--radius-sm); object-fit: cover;">
          <div style="flex: 1; min-width: 0;">
            <strong style="color: var(--navy); font-size: var(--text-sm); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${Utils.escapeHtml(u.name)}
            </strong>
            <span style="font-size: 0.72rem; color: var(--text-secondary);">📍 ${Utils.escapeHtml(u.city)}</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2" style="border-top: 1px solid var(--border-light); font-size: 0.72rem;">
          <span style="color: #F59E0B; font-weight: 700;">★ ${u.rating}</span>
          <a href="umkm.html?id=${u.id}" class="text-blue font-semibold" onclick="event.stopPropagation();">
            Profil &rarr;
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Hover & Klik kartu: buka popup marker di peta
  container.querySelectorAll('.map-item-card').forEach(card => {
    const uid = card.getAttribute('data-card-umkm');
    card.addEventListener('click', () => {
      const marker = markerRefs[uid];
      if (marker && map) {
        map.setView(marker.getLatLng(), 15, { animate: true });
        marker.openPopup();
        highlightSidebarCard(uid);

        // Jika di HP, otomatis alihkan ke tampilan peta
        if (window.innerWidth < 1024) {
          const btnShowMap = document.getElementById('toggleShowMap');
          if (btnShowMap) btnShowMap.click();
        }
      }
    });
  });
}

/**
 * 7. Sorot Kartu di Sidebar
 */
function highlightSidebarCard(umkmId) {
  document.querySelectorAll('.map-item-card').forEach(c => {
    c.style.borderColor = 'var(--border-light)';
    c.style.backgroundColor = 'var(--card-bg)';
  });

  const targetCard = document.querySelector(`[data-card-umkm="${umkmId}"]`);
  if (targetCard) {
    targetCard.style.borderColor = 'var(--blue)';
    targetCard.style.backgroundColor = 'var(--sky-subtle)';
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

