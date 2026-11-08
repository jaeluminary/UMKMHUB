/**
 * ============================================================================
 * UMKM HUB - STORE (ABSTRAKSI LOCALSTORAGE CRUD)
 * Meniru REST API backend dengan metode getAll, getById, create, update, remove.
 * Dilengkapi broadcast event internal dan window storage sync antar-tab.
 * ============================================================================
 */

const STORAGE_KEY_PREFIX = 'umkmhub_';

export const Store = {
  /**
   * Mengambil semua data dalam sebuah koleksi
   * @param {string} collection - Nama koleksi ('umkm', 'products', 'users', dll)
   * @returns {Array}
   */
  getAll(collection) {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + collection);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error reading collection ${collection}:`, e);
      return [];
    }
  },

  /**
   * Mengambil satu item berdasarkan ID
   * @param {string} collection
   * @param {string} id
   * @returns {Object|null}
   */
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => String(item.id) === String(id)) || null;
  },

  /**
   * Menyimpan item baru ke dalam koleksi
   * @param {string} collection
   * @param {Object} item
   * @returns {Object} item yang baru disimpan
   */
  create(collection, item) {
    const items = this.getAll(collection);
    const newItem = {
      id: item.id || `${collection}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
      ...item
    };
    items.unshift(newItem);
    this._save(collection, items);
    this._broadcast(collection, 'create', newItem);
    return newItem;
  },

  /**
   * Memperbarui item yang ada
   * @param {string} collection
   * @param {string} id
   * @param {Object} updates
   * @returns {Object|null}
   */
  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    items[index] = updatedItem;
    this._save(collection, items);
    this._broadcast(collection, 'update', updatedItem);
    return updatedItem;
  },

  /**
   * Menghapus item berdasarkan ID
   * @param {string} collection
   * @param {string} id
   * @returns {boolean}
   */
  remove(collection, id) {
    const items = this.getAll(collection);
    const filtered = items.filter(item => String(item.id) !== String(id));
    if (filtered.length === items.length) return false;

    this._save(collection, filtered);
    this._broadcast(collection, 'remove', { id });
    return true;
  },

  /**
   * Mencari data dengan filter callback kustom
   * @param {string} collection
   * @param {Function} filterFn
   * @returns {Array}
   */
  query(collection, filterFn) {
    const items = this.getAll(collection);
    return typeof filterFn === 'function' ? items.filter(filterFn) : items;
  },

  /**
   * Simpan array langsung ke localStorage
   * @private
   */
  _save(collection, items) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + collection, JSON.stringify(items));
    } catch (e) {
      console.error(`Error saving collection ${collection}:`, e);
    }
  },

  /**
   * Mengirim event perubahan state
   * @private
   */
  _broadcast(collection, action, payload) {
    window.dispatchEvent(new CustomEvent('umkm-store-change', {
      detail: { collection, action, payload }
    }));
  },

  /**
   * Reset seluruh database ke data bawaan (Seed)
   */
  resetToSeed(seedData) {
    if (!seedData) return;
    Object.keys(seedData).forEach(collection => {
      this._save(collection, seedData[collection]);
    });
    // Simpan penanda bahwa seed telah dimuat
    localStorage.setItem(STORAGE_KEY_PREFIX + 'initialized', 'true');
    window.dispatchEvent(new CustomEvent('umkm-store-reset'));
  },

  /**
   * Periksa apakah localStorage sudah memiliki data seed
   */
  isInitialized() {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized') === 'true';
  }
};

// Listener perubahan antar-tab browser via Storage Event
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith(STORAGE_KEY_PREFIX)) {
    const collection = e.key.replace(STORAGE_KEY_PREFIX, '');
    window.dispatchEvent(new CustomEvent('umkm-store-change', {
      detail: { collection, action: 'cross-tab-sync' }
    }));
  }
});

