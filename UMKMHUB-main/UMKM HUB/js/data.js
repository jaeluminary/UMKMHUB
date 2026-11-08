/**
 * ============================================================================
 * UMKM HUB - SEED DATASET
 * Data awal realistis berbahasa Indonesia:
 * - 24 UMKM di 8 kota (Jakarta, Bogor, Bandung, Yogyakarta, Surabaya, Denpasar, Medan, Makassar)
 * - 64 Produk UMKM dengan harga, kategori, dan deskripsi
 * - 15 Kolaborasi Board dengan berbagai tipe
 * - 20 Thread Forum Komunitas + Komentar & Balasan
 * - 8 Komunitas Daerah & Sektoral + Riwayat Chat
 * - 2 Akun Demo (Seller & Pengguna Umum)
 * ============================================================================
 */

export const INITIAL_DATA = {
  // --------------------------------------------------------------------------
  // 1. PENGGUNA (USERS)
  // --------------------------------------------------------------------------
  users: [
    {
      id: 'user-seller-demo',
      email: 'seller@umkmhub.id',
      password: 'demo123',
      name: 'Budi Santoso',
      role: 'seller',
      umkmId: 'umkm-1',
      avatar: '',
      bio: 'Penggiat kopi lokal dan pemilik Kopi Sangrai Nusantara.',
      wishlistProducts: ['prod-5', 'prod-12', 'prod-25'],
      wishlistUmkm: ['umkm-2', 'umkm-6'],
      following: ['umkm-2', 'umkm-4', 'umkm-9'],
      createdAt: '2026-01-15T08:00:00Z'
    },
    {
      id: 'user-regular-demo',
      email: 'user@umkmhub.id',
      password: 'demo123',
      name: 'Siti Rahma',
      role: 'user',
      umkmId: null,
      avatar: '',
      bio: 'Pecinta produk lokal kreatif & penikmat kuliner nusantara.',
      wishlistProducts: ['prod-1', 'prod-7', 'prod-18', 'prod-32'],
      wishlistUmkm: ['umkm-1', 'umkm-3', 'umkm-7'],
      following: ['umkm-1', 'umkm-3', 'umkm-5', 'umkm-8'],
      createdAt: '2026-02-10T09:30:00Z'
    }
  ],

  // --------------------------------------------------------------------------
  // 2. DAFTAR 24 UMKM
  // --------------------------------------------------------------------------
  umkm: [
    {
      id: 'umkm-1',
      name: 'Kopi Sangrai Nusantara',
      slug: 'kopi-sangrai-nusantara',
      slogan: 'Kelezatan Kopi Asli Petani Lokal Pilihan',
      category: 'Kuliner',
      city: 'Bogor',
      address: 'Jl. Pajajaran No. 45, Babakan, Bogor Tengah',
      lat: -6.5971,
      lng: 106.8060,
      description: 'Produsen biji kopi sangrai specialty dari petani binaan di Jawa Barat dan Sumatera. Kami melayani kebutuhan kedai kopi, horeka, dan penikmat rumahan.',
      story: 'Dimulai dari garasi kecil tahun 2019 bersama 3 kelompok tani di Sukamakmur Bogor, kini Kopi Sangrai Nusantara telah mendistribusikan kopi ke lebih dari 80 kedai kopi mandiri di Jabodetabek.',
      ownerId: 'user-seller-demo',
      isOpenCollab: true,
      needs: ['Kemasan ramah lingkungan', 'Jasa foto produk komersial', 'Distributor ritel Jabodetabek', 'Event bazaar kuliner'],
      offers: ['Biji kopi arabika specialty', 'Jasa contract roasting (maklon)', 'Pelatihan barista pemula', 'Suplai cold brew kemasan'],
      contact: {
        wa: '6281234567001',
        email: 'halo@kopisangrai.id',
        phone: '0251-8321001',
        instagram: '@kopisangrainusantara',
        web: 'https://kopisangrai.id'
      },
      stats: { views: 428, inquiries: 34, followers: 129 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-2',
      name: 'Batik Tulis Sekar Arum',
      slug: 'batik-tulis-sekar-arum',
      slogan: 'Elegansi Wastra Pewarna Alam Ramah Lingkungan',
      category: 'Fesyen',
      city: 'Yogyakarta',
      address: 'Jl. Tirtodipuran No. 18, Mantrijeron, Yogyakarta',
      lat: -7.8182,
      lng: 110.3625,
      description: 'Pusat kerajinan batik tulis kontemporer dengan 100% pewarna alami dari daun indigo, kulit manggis, dan kayu tingi.',
      story: 'Melestarikan motif klasik Yogyakarta sembari merangkul selera generasi muda melalui busana kasual dan kain serbaguna bernilai seni tinggi.',
      ownerId: 'user-seller-2',
      isOpenCollab: true,
      needs: ['Bahan kain katun primissima', 'Platform ekspor kriya', 'Kolaborasi desainer busana muslim'],
      offers: ['Kain batik pewarna alam', 'Seragam korporat eksklusif', 'Workshop membatik wisata'],
      contact: {
        wa: '6281234567002',
        email: 'info@batiksekararum.com',
        phone: '0274-387002',
        instagram: '@batiktulis.sekararum',
        web: ''
      },
      stats: { views: 312, inquiries: 21, followers: 88 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-3',
      name: 'Anyaman Bambu Barokah',
      slug: 'anyaman-bambu-barokah',
      slogan: 'Kriya Bambu Modern Bernilai Ekspor',
      category: 'Kriya & Kerajinan',
      city: 'Bandung',
      address: 'Jl. Raya Soreang - Banjaran No. 88, Bandung Selatan',
      lat: -7.0256,
      lng: 107.5188,
      description: 'Pengrajin kap lampu, keranjang estetik, dan dekorasi interior rumah berbahan bambu lokal berkualitas tinggi yang diawetkan alami.',
      story: 'Memberdayakan 35 warga desa di Soreang untuk mengubah bambu lokal menjadi produk dekorasi kelas dunia.',
      ownerId: 'user-seller-3',
      isOpenCollab: true,
      needs: ['Jasa branding & kemasan karton box', 'Mitra cafe/hotel untuk dekor interior', 'Ekspedisi logistik murah'],
      offers: ['Kap lampu bambu estetik', 'Wadah hamper ramah lingkungan', 'Jasa kustom interior bambu'],
      contact: {
        wa: '6281234567003',
        email: 'kontak@bambubarokah.id',
        phone: '022-589003',
        instagram: '@bambubarokah.craft',
        web: ''
      },
      stats: { views: 245, inquiries: 18, followers: 64 },
      rating: 4.7,
      verified: true
    },
    {
      id: 'umkm-4',
      name: 'Sambal Oma Roa Juara',
      slug: 'sambal-oma-roa-juara',
      slogan: 'Pedas Gurih Otentik Ikan Roa Manado',
      category: 'Kuliner',
      city: 'Makassar',
      address: 'Jl. Boulevard Panakkukang No. 12, Makassar',
      lat: -5.1554,
      lng: 119.4485,
      description: 'Sambal botolan siap saji dari ikan roa asap asli perairan Sulawesi dengan bumbu rempah tradisional tanpa bahan pengawet sintesis.',
      story: 'Resep warisan keluarga tiga generasi yang kini dikemas higienis dengan sertifikasi BPOM dan Halal.',
      ownerId: 'user-seller-4',
      isOpenCollab: true,
      needs: ['Suplai botol kaca 150ml food grade', 'Reseller pulau Jawa', 'Jasa digital ads spesialis F&B'],
      offers: ['Sambal roa kemasan grosir', 'Kerjasama maklon sambal botolan', 'Paket oleh-oleh khas nusantara'],
      contact: {
        wa: '6281234567004',
        email: 'pesan@omaroa.com',
        phone: '0411-456004',
        instagram: '@sambalomaroa',
        web: ''
      },
      stats: { views: 389, inquiries: 47, followers: 156 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-5',
      name: 'Natura Herbal Skincare',
      slug: 'natura-herbal-skincare',
      slogan: 'Kecantikan Murni dari Rempah Tropis Indonesia',
      category: 'Kecantikan & Herbal',
      city: 'Surabaya',
      address: 'Jl. Manyar Kertoarjo V No. 23, Sukolilo, Surabaya',
      lat: -7.2819,
      lng: 112.7664,
      description: 'Sabun batang alami, lulur rempah, dan minyak atsiri organik untuk perawatan kulit sehat dan aman untuk keluarga.',
      story: 'Formulasi ramah lingkungan berbahan dasar virgin coconut oil dan ekstrak kunyit asam yang diolah higienis.',
      ownerId: 'user-seller-5',
      isOpenCollab: true,
      needs: ['Bahan baku minyak kelapa murni (VCO)', 'Kemasan botol tetes kaca 30ml', 'Mitra spa & klinik kecantikan'],
      offers: ['Sabun mandi herbal alami', 'Lulur tubuh rempah tradisional', 'Souvenir pernikahan ramah lingkungan'],
      contact: {
        wa: '6281234567005',
        email: 'care@naturaherbal.id',
        phone: '031-592005',
        instagram: '@naturaherbal.id',
        web: ''
      },
      stats: { views: 278, inquiries: 19, followers: 77 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-6',
      name: 'Studio Kriya Keramik Semesta',
      slug: 'studio-kriya-keramik-semesta',
      slogan: 'Perabot Meja & Keramik Handmade Berjiwa Seni',
      category: 'Kriya & Kerajinan',
      city: 'Denpasar',
      address: 'Jl. Danau Tamblingan No. 72, Sanur, Denpasar Selatan',
      lat: -8.6989,
      lng: 115.2625,
      description: 'Piring, cangkir, vas bunga, dan tableware keramik stoneware bertekstur earthy untuk cafe, hotel, dan koleksi pribadi.',
      story: 'Dibuat satu per satu dengan tangan oleh seniman keramik Bali menggunakan tanah liat lokal berkualitas.',
      ownerId: 'user-seller-6',
      isOpenCollab: true,
      needs: ['Bahan baku glazur keramik non-toxic', 'Mitra cafe untuk custom tableware', 'Peti kemasan kayu ekspedisi'],
      offers: ['Tableware keramik estetik', 'Custom merchandise keramik', 'Kelas keramik privat'],
      contact: {
        wa: '6281234567006',
        email: 'studio@keramiksemesta.com',
        phone: '0361-289006',
        instagram: '@semestaceramics',
        web: ''
      },
      stats: { views: 512, inquiries: 43, followers: 210 },
      rating: 5.0,
      verified: true
    },
    {
      id: 'umkm-7',
      name: 'Sepatu Kulit Prabu Medan',
      slug: 'sepatu-kulit-prabu-medan',
      slogan: 'Ketangguhan Kulit Asli dengan Konstruksi Goodyear Welted',
      category: 'Fesyen',
      city: 'Medan',
      address: 'Jl. Brigjend Katamso No. 104, Medan Maimun',
      lat: 3.5786,
      lng: 98.6854,
      description: 'Sepatu boots, loafers, dan dompet pria berbahan kulit sapi pull-up asli yang dibuat secara presisi oleh perajin berpengalaman puluhan tahun.',
      story: 'Mempertahankan tradisi tatah kulit manual dengan desain klasik modern yang tangguh untuk aktivitas harian.',
      ownerId: 'user-seller-7',
      isOpenCollab: false,
      needs: ['Suplai kulit sapi kualitas premium', 'Kotak sepatu kardus tebal custom'],
      offers: ['Sepatu kulit handmade pria/wanita', 'Jasa reparasi & recoloring kulit'],
      contact: {
        wa: '6281234567007',
        email: 'order@prabumedan.com',
        phone: '061-456007',
        instagram: '@prabuleather.medan',
        web: ''
      },
      stats: { views: 340, inquiries: 25, followers: 98 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-8',
      name: 'Tani Hidroponik Lestari',
      slug: 'tani-hidroponik-lestari',
      slogan: 'Sayur Segar Bebas Pestisida Langsung Petik',
      category: 'Pertanian & Agro',
      city: 'Jakarta',
      address: 'Jl. Srengseng Sawah No. 50, Jagakarsa, Jakarta Selatan',
      lat: -6.3456,
      lng: 106.8289,
      description: 'Kebun hidroponik perkotaan (urban farming) memproduksi selada romaine, kale, pakcoy, dan mint segar setiap hari untuk resto & supermarket.',
      story: 'Mengubah lahan terbengkalai di selatan Jakarta menjadi greenhouse modern hemat air bertenaga surya.',
      ownerId: 'user-seller-8',
      isOpenCollab: true,
      needs: ['Mitra restoran salad & healthy food', 'Plastik kemasan biodegradable berpori', 'Distributor B2B supermarket'],
      offers: ['Suplai rutin selada hidroponik', 'Paket instalasi urban farming rumahan', 'Workshop edukasi berkebun'],
      contact: {
        wa: '6281234567008',
        email: 'panen@hidroponiklestari.id',
        phone: '021-789008',
        instagram: '@tanilestari.jkt',
        web: ''
      },
      stats: { views: 395, inquiries: 31, followers: 114 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-9',
      name: 'Pixel Studio Desain & Web',
      slug: 'pixel-studio-desain-web',
      slogan: 'Solusi Digital & Branding Terjangkau untuk UMKM',
      category: 'Teknologi & Digital',
      city: 'Bandung',
      address: 'Jl. Dago Asri No. 15, Coblong, Bandung',
      lat: -6.8821,
      lng: 107.6167,
      description: 'Agensi kreatif independen penyedia jasa desain logo, kemasan produk, pembuatan website katalog, dan optimasi media sosial khusus UMKM.',
      story: 'Didirikan oleh alumni desain ITB yang bertekad menaikkan kelas tampilan visual ribuan produk lokal Indonesia.',
      ownerId: 'user-seller-9',
      isOpenCollab: true,
      needs: ['Klien UMKM yang butuh rebranding', 'Kerjasama asosiasi UMKM daerah', 'Mitra copywriter produk'],
      offers: ['Paket branding UMKM lengkap', 'Pembuatan website profil usaha', 'Foto & video katalog produk'],
      contact: {
        wa: '6281234567009',
        email: 'halo@pixelstudio.id',
        phone: '022-250009',
        instagram: '@pixelstudio.id',
        web: 'https://pixelstudio.id'
      },
      stats: { views: 470, inquiries: 52, followers: 180 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-10',
      name: 'Madu Hutan Ujung Kulon',
      slug: 'madu-hutan-ujung-kulon',
      slogan: 'Kemurnian Madu Lebah Liar Apis Dorsata',
      category: 'Kuliner',
      city: 'Bogor',
      address: 'Jl. Dramaga Raya Km 7 No. 19, Bogor Barat',
      lat: -6.5823,
      lng: 106.7456,
      description: 'Madu mentah (raw honey) murni hasil panen lestari dari pohon sialang di kawasan hutan lindung, kaya enzim dan antioksidan alami.',
      story: 'Bekerjasama dengan pemburu madu tradisional dengan sistem panen tiris tanpa memotong habis sarang lebah.',
      ownerId: 'user-seller-10',
      isOpenCollab: true,
      needs: ['Mesin filling botol otomatis skala kecil', 'Jasa uji laboratorium berkala', 'Distributor herbal'],
      offers: ['Madu hutan murni curah & botolan', 'Sarang madu asli (comb honey)', 'Pollen lebah murni'],
      contact: {
        wa: '6281234567010',
        email: 'madu@ujungkulon.id',
        phone: '0251-862010',
        instagram: '@maduhutan.uk',
        web: ''
      },
      stats: { views: 290, inquiries: 24, followers: 79 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-11',
      name: 'Bengkel Kayu Jati Kreatif',
      slug: 'bengkel-kayu-jati-kreatif',
      slogan: 'Dekorasi & Perabot Rumah Solid Wood Bernilai Tinggi',
      category: 'Kriya & Kerajinan',
      city: 'Yogyakarta',
      address: 'Jl. Imogiri Barat Km 8, Bantul, D.I. Yogyakarta',
      lat: -7.8654,
      lng: 110.3789,
      description: 'Talenan estetik, coaster cangkir, rak dinding minimalis, dan bangku berbahan kayu jati perhutani dan reclaimed wood ramah lingkungan.',
      story: 'Memanfaatkan limbah potongan kayu jati berkualitas menjadi perkakas dapur yang tahan puluhan tahun dengan polesan food-grade beeswax.',
      ownerId: 'user-seller-11',
      isOpenCollab: true,
      needs: ['Lilin lebah (beeswax) food grade', 'Jasa grafir laser kayu cepat', 'Mitra toko furniture estetik'],
      offers: ['Talenan kayu jati food grade', 'Peralatan makan kayu kustom', 'Plakat kayu penghargaan'],
      contact: {
        wa: '6281234567011',
        email: 'kayujati@kreatifjogja.com',
        phone: '0274-450011',
        instagram: '@kayujati.kreatif',
        web: ''
      },
      stats: { views: 330, inquiries: 27, followers: 94 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-12',
      name: 'Tenun Ikat Sotis Alor',
      slug: 'tenun-ikat-sotis-alor',
      slogan: 'Warisan Tenun Tradisional Bernilai Koleksi',
      category: 'Fesyen',
      city: 'Denpasar',
      address: 'Jl. Raya Puputan No. 89, Renon, Denpasar',
      lat: -8.6732,
      lng: 115.2341,
      description: 'Galeri kain tenun ikat tradisional buatan para mama perajin tenun dengan ragam motif geometris khas kepulauan timur Indonesia.',
      story: 'Menjadi jembatan pemberdayaan ekonomi perempuan perajin tenun di pulau terpencil ke pasar internasional di Bali.',
      ownerId: 'user-seller-12',
      isOpenCollab: true,
      needs: ['Benang katun mercerized berkualitas', 'Jasa translasi katalog ekspor', 'Mitra pameran seni'],
      offers: ['Kain tenun ikat asli', 'Syal & selendang tenun etnik', 'Tas tenun kombinasi kulit'],
      contact: {
        wa: '6281234567012',
        email: 'alortenun@baliart.com',
        phone: '0361-245012',
        instagram: '@tenunikat.alor',
        web: ''
      },
      stats: { views: 280, inquiries: 16, followers: 85 },
      rating: 5.0,
      verified: true
    },
    {
      id: 'umkm-13',
      name: 'Rendang Suwir Nan Salero',
      slug: 'rendang-suwir-nan-salero',
      slogan: 'Rendang Daging Sapi Suwir Kemasan Vakum Tahan 6 Bulan',
      category: 'Kuliner',
      city: 'Jakarta',
      address: 'Jl. Tebet Timur Dalam Raya No. 42, Jakarta Selatan',
      lat: -6.2378,
      lng: 106.8523,
      description: 'Rendang suwir daging sapi dan paru renyah khas Minang yang dimasak 8 jam dengan kelapa sangrai dan rempah pilihan.',
      story: 'Cocok untuk bekal perjalanan, oleh-oleh haji/umrah, dan santapan praktis keluarga urban masa kini.',
      ownerId: 'user-seller-13',
      isOpenCollab: true,
      needs: ['Retort pouch packaging supplier', 'Jasa sertifikasi HACCP/ISO', 'Mitra reseller luar negeri'],
      offers: ['Rendang kemasan siap saji steril', 'Suplai lauk pauk katering pesta', 'Paket hampers hari raya'],
      contact: {
        wa: '6281234567013',
        email: 'rendang@nansalero.id',
        phone: '021-831013',
        instagram: '@rendangsuwir.nansalero',
        web: ''
      },
      stats: { views: 410, inquiries: 39, followers: 145 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-14',
      name: 'Logistik Kilat UMKM Nusantara',
      slug: 'logistik-kilat-umkm-nusantara',
      slogan: 'Layanan Pengiriman Kargo & Fulfillment Terintegrasi',
      category: 'Jasa',
      city: 'Surabaya',
      address: 'Jl. Rungkut Industri III No. 8, Rungkut, Surabaya',
      lat: -7.3245,
      lng: 112.7601,
      description: 'Layanan pergudangan mini, packing terstandar, dan ekspedisi kargo darat/laut khusus paket produk UMKM dengan tarif terjangkau.',
      story: 'Membantu pelaku UMKM memangkas biaya kirim antarpulau dengan skema konsolidasi muatan bareng.',
      ownerId: 'user-seller-14',
      isOpenCollab: true,
      needs: ['Mitra komunitas UMKM untuk pooling muatan', 'Penyedia bubble wrap ramah lingkungan'],
      offers: ['Tarif kargo khusus UMKM', 'Layanan fulfillment packing paket', 'Pick up gratis tanpa minimum'],
      contact: {
        wa: '6281234567014',
        email: 'cs@logistikkilat.id',
        phone: '031-843014',
        instagram: '@logistikkilat.id',
        web: 'https://logistikkilat.id'
      },
      stats: { views: 360, inquiries: 41, followers: 102 },
      rating: 4.7,
      verified: true
    },
    {
      id: 'umkm-15',
      name: 'Kripik Tempe Renyah Gurih Mas Joko',
      slug: 'kripik-tempe-renyah-gurih-mas-joko',
      slogan: 'Camilan Tradisional Super Renyah Kaya Protein',
      category: 'Kuliner',
      city: 'Surabaya',
      address: 'Jl. Jemursari Selatan No. 14, Wonocolo, Surabaya',
      lat: -7.3189,
      lng: 112.7489,
      description: 'Kripik tempe bumbu ketumbar daun jeruk yang diiris tipis presisi dan digoreng dengan minyak kelapa berkualitas rendah kolesterol.',
      story: 'Usaha keluarga sejak 2012 yang telah berhasil masuk ke berbagai gerai retail modern di Jawa Timur.',
      ownerId: 'user-seller-15',
      isOpenCollab: true,
      needs: ['Suplai kedelai non-GMO lokal', 'Kemasan standing pouch aluminium foil print'],
      offers: ['Kripik tempe kemasan retail', 'Kripik tempe curah kiloan untuk warung', 'Suplai camilan rapat kantor'],
      contact: {
        wa: '6281234567015',
        email: 'tempe@masjoko.com',
        phone: '031-849015',
        instagram: '@kripiktempe.masjoko',
        web: ''
      },
      stats: { views: 220, inquiries: 15, followers: 52 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-16',
      name: 'Kaos Sablon Kreatif Parahyangan',
      slug: 'kaos-sablon-kreatif-parahyangan',
      slogan: 'Vendor Kaos Komunitas & Merchandise Berkualitas Distro',
      category: 'Fesyen',
      city: 'Bandung',
      address: 'Jl. Supratman No. 67, Cibeunying Kaler, Bandung',
      lat: -6.9012,
      lng: 107.6289,
      description: 'Workshop sablon manual plastisol, discharge, dan DTF dengan bahan katun combed 24s/30s premium bersertifikasi OEKO-TEX.',
      story: 'Telah memproduksi lebih dari 200.000 kaos komunitas, band, instansi, dan brand fashion lokal di seluruh Indonesia.',
      ownerId: 'user-seller-16',
      isOpenCollab: true,
      needs: ['Suplai tinta ramah lingkungan waterbased', 'Kolaborasi ilustrator streetwear lokal'],
      offers: ['Jasa produksi kaos & hoodie custom', 'Sablon manual kualitas tinggi', 'Layanan jahit konveksi massal'],
      contact: {
        wa: '6281234567016',
        email: 'order@sablonparahyangan.com',
        phone: '022-720016',
        instagram: '@sablon.parahyangan',
        web: ''
      },
      stats: { views: 440, inquiries: 49, followers: 167 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-17',
      name: 'Bengkel Bubut Presisi Mandiri',
      slug: 'bengkel-bubut-presisi-mandiri',
      slogan: 'Solusi Pembuatan Sparepart Mesin UMKM & Manufaktur',
      category: 'Jasa',
      city: 'Medan',
      address: 'Jl. Krakatau No. 120, Medan Timur',
      lat: 3.6120,
      lng: 98.6920,
      description: 'Jasa bubut CNC, milling, perbaikan roda gigi, dan pembuatan modul sparepart mesin pengolah makanan/pertanian UMKM.',
      story: 'Membantu mekanisasi peralatan produksi UMKM lokal dengan biaya terjangkau tanpa harus impor onderdil mahal.',
      ownerId: 'user-seller-17',
      isOpenCollab: true,
      needs: ['Bahan baku stainless steel 304 food grade', 'Kemitraan UMKM produsen mesin makanan'],
      offers: ['Jasa bubut logam presisi tinggi', 'Modifikasi pisau pencacah / perajang', 'Perbaikan as mesin pabrik'],
      contact: {
        wa: '6281234567017',
        email: 'bubut@presisimandiri.com',
        phone: '061-662017',
        instagram: '',
        web: ''
      },
      stats: { views: 180, inquiries: 14, followers: 41 },
      rating: 4.6,
      verified: true
    },
    {
      id: 'umkm-18',
      name: 'Jus Segar Herbal Buah Tropis',
      slug: 'jus-segar-herbal-buah-tropis',
      slogan: 'Cold Pressed Juice Murni Tanpa Tambahan Air & Gula',
      category: 'Kuliner',
      city: 'Jakarta',
      address: 'Jl. Senopati No. 34, Kebayoran Baru, Jakarta Selatan',
      lat: -6.2312,
      lng: 106.8123,
      description: 'Minuman kesehatan cold-pressed berbahan buah lokal matang pohon, sayur organik, dan rempah rimpang penambah imun tubuh.',
      story: 'Dibuat setiap subuh dengan mesin hidrolik bertekanan tinggi untuk mengunci seluruh vitamin dan enzim buah.',
      ownerId: 'user-seller-18',
      isOpenCollab: true,
      needs: ['Suplai lemon california lokal & jahe merah', 'Botol plastik rPET daur ulang 250ml', 'Mitra studio gym/yoga'],
      offers: ['Paket langganan detox harian', 'Catering healthy beverage event kantor', 'Suplai juice bar cafe'],
      contact: {
        wa: '6281234567018',
        email: 'hello@justropis.id',
        phone: '021-724018',
        instagram: '@justropis.segar',
        web: ''
      },
      stats: { views: 320, inquiries: 28, followers: 92 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-19',
      name: 'Green Flora Tanaman Hias & Bonsai',
      slug: 'green-flora-tanaman-hias-bonsai',
      slogan: 'Penghijauan Asri Ruang Kerja & Hunian',
      category: 'Pertanian & Agro',
      city: 'Bogor',
      address: 'Jl. Raya Ciapus No. 80, Tamansari, Bogor',
      lat: -6.6432,
      lng: 106.7645,
      description: 'Nursery spesialis tanaman monstera, sansiviera, aglonema, dan bonsai estetis untuk indoor plant styling dan dekorasi lanskap.',
      story: 'Membudidayakan ribuan tanaman tropis di kaki Gunung Salak dengan teknik perbanyakan vegetatif ramah lingkungan.',
      ownerId: 'user-seller-19',
      isOpenCollab: true,
      needs: ['Pot terakota tanah liat minimalis', 'Mitra jasa interior designer', 'Media tanam organik perlite'],
      offers: ['Tanaman hias indoor & outdoor', 'Jasa rental tanaman kantor', 'Konsultasi taman landscape'],
      contact: {
        wa: '6281234567019',
        email: 'flora@greenflora.id',
        phone: '0251-838019',
        instagram: '@greenflora.bogor',
        web: ''
      },
      stats: { views: 260, inquiries: 20, followers: 73 },
      rating: 4.7,
      verified: true
    },
    {
      id: 'umkm-20',
      name: 'Sinar Grafika Kemasan & Cetak',
      slug: 'sinar-grafika-kemasan-cetak',
      slogan: 'Spesialis Kemasan Dus, Paperbag, & Stiker Label UMKM',
      category: 'Jasa',
      city: 'Yogyakarta',
      address: 'Jl. Gedongkuning No. 102, Banguntapan, Bantul',
      lat: -7.8089,
      lng: 110.4012,
      description: 'Percetakan packaging food-grade, hardbox mewah, dus gelombang, stiker vinil tahan air, dan label baju dengan minimal order ramah UMKM.',
      story: 'Memberikan solusi cetak kemasan profesional agar produk UMKM dapat tampil percaya diri di rak supermarket modern.',
      ownerId: 'user-seller-20',
      isOpenCollab: true,
      needs: ['Suplai kertas kraft daur ulang FSC', 'Mitra UMKM kuliner & kriya yang butuh kemasan'],
      offers: ['Cetak dus kemasan food grade', 'Stiker label roll & sheet cepat', 'Desain template kemasan gratis'],
      contact: {
        wa: '6281234567020',
        email: 'cetak@sinargrafika.co.id',
        phone: '0274-378020',
        instagram: '@sinargrafika.kemasan',
        web: 'https://sinargrafika.co.id'
      },
      stats: { views: 520, inquiries: 67, followers: 195 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-21',
      name: 'Minyak Kelapa Dara Celebes',
      slug: 'minyak-kelapa-dara-celebes',
      slogan: 'Virgin Coconut Oil Cold-Pressed Mutu Ekspor',
      category: 'Pertanian & Agro',
      city: 'Makassar',
      address: 'Jl. Urip Sumoharjo No. 88, Panakkukang, Makassar',
      lat: -5.1389,
      lng: 119.4389,
      description: 'Minyak kelapa murni diproses sentrifugal dingin tanpa pemanasan, menghasilkan aroma kelapa segar, bening seperti air, dan kaya asam laurat.',
      story: 'Menyerap ratusan ton kelapa dari perkebunan pesisir Sulawesi Selatan untuk memberi nilai tambah pada petani.',
      ownerId: 'user-seller-21',
      isOpenCollab: true,
      needs: ['Laboratorium uji sertifikasi halal internasional', 'Buyer B2B industri kosmetik & farmasi'],
      offers: ['VCO curah grade kosmetik & farmasi', 'VCO botolan kemasan retail', 'Ampas kelapa kering pakan ternak'],
      contact: {
        wa: '6281234567021',
        email: 'vco@celebesoil.com',
        phone: '0411-445021',
        instagram: '@celebes.vco',
        web: ''
      },
      stats: { views: 240, inquiries: 17, followers: 61 },
      rating: 4.8,
      verified: true
    },
    {
      id: 'umkm-22',
      name: 'Kue Lapis Legit Nyonya Halim',
      slug: 'kue-lapis-legit-nyonya-halim',
      slogan: 'Kemewahan Mentega Wisman Berlapis Rempah Tradisi',
      category: 'Kuliner',
      city: 'Medan',
      address: 'Jl. Asia No. 56, Sei Rengas II, Medan Area',
      lat: 3.5854,
      lng: 98.6945,
      description: 'Kue lapis legit premium dipanggang lapis demi lapis dengan kuning telur segar dan mentega impor terbaik, empuk harum tanpa pengembang.',
      story: 'Tradisi memanggang lapis legit sejak tahun 1985 yang tetap dijaga keaslian rasanya sebagai primadona oleh-oleh Medan.',
      ownerId: 'user-seller-22',
      isOpenCollab: true,
      needs: ['Bahan kemasan kotak tin box eksklusif', 'Jasa kurir pendingin antarkota'],
      offers: ['Kue lapis legit loyang besar/kecil', 'Paket gift box imlek & idul fitri', 'Kerjasama reseller hotel'],
      contact: {
        wa: '6281234567022',
        email: 'order@lapisnyonyahalim.com',
        phone: '061-734022',
        instagram: '@lapislegit.nyonyahalim',
        web: ''
      },
      stats: { views: 375, inquiries: 33, followers: 130 },
      rating: 5.0,
      verified: true
    },
    {
      id: 'umkm-23',
      name: 'Sablon Plastik & Tas Ramah Lingkungan Cassava',
      slug: 'sablon-tas-ramah-lingkungan-cassava',
      slogan: 'Kantong Belanja Singkong Terurai Alami 180 Hari',
      category: 'Kriya & Kerajinan',
      city: 'Denpasar',
      address: 'Jl. Teuku Umar Barat No. 110, Denpasar Barat',
      lat: -8.6756,
      lng: 115.1956,
      description: 'Pengganti kantong plastik konvensional berbahan pati singkong yang 100% biodegradable dan larut dalam air panas tanpa mikroplastik.',
      story: 'Mendukung gerakan Bali bebas sampah plastik dengan menyediakan kemasan belanja yang aman untuk bumi dan biota laut.',
      ownerId: 'user-seller-23',
      isOpenCollab: true,
      needs: ['Mitra distributor retail di kota-kota besar', 'Teknologi pewarna nabati larut air'],
      offers: ['Kantong belanja cassava bag polos & custom logo', 'Polymailer ramah lingkungan untuk online shop'],
      contact: {
        wa: '6281234567023',
        email: 'info@cassavabag.id',
        phone: '0361-482023',
        instagram: '@cassavabag.bali',
        web: ''
      },
      stats: { views: 490, inquiries: 58, followers: 178 },
      rating: 4.9,
      verified: true
    },
    {
      id: 'umkm-24',
      name: 'Dapur Brownies Fudgy Lumer',
      slug: 'dapur-brownies-fudgy-lumer',
      slogan: 'Sensasi Cokelat Belgia dengan Topping Melimpah',
      category: 'Kuliner',
      city: 'Jakarta',
      address: 'Jl. Gandaria I No. 18, Kebayoran Baru, Jakarta Selatan',
      lat: -6.2512,
      lng: 106.7923,
      description: 'Fudgy brownies dengan shiny crust sempurna dan tekstur lezat kaya cokelat couverture, tersedia aneka varian topping almond, keju, lotus, dan oreo.',
      story: 'Bermula dari jualan online semasa kuliah, kini memiliki kitchen mandiri dengan pesanan ratusan box setiap hari.',
      ownerId: 'user-seller-24',
      isOpenCollab: true,
      needs: ['Bahan baku dark chocolate couverture 70%', 'Kotak kardus take away anti-minyak', 'Kerjasama kedai kopi untuk menu pastry'],
      offers: ['Fudgy brownies box aneka ukuran', 'Mini brownies hampers acara', 'Suplai dessert cafe'],
      contact: {
        wa: '6281234567024',
        email: 'order@browniesfudgy.id',
        phone: '021-728024',
        instagram: '@dapurbrownies.fudgy',
        web: ''
      },
      stats: { views: 460, inquiries: 42, followers: 160 },
      rating: 4.9,
      verified: true
    }
  ],

  // --------------------------------------------------------------------------
  // 3. DAFTAR 64 PRODUK SHOWCASE & MARKETPLACE
  // --------------------------------------------------------------------------
  products: [
    // UMKM 1: Kopi Sangrai
    { id: 'prod-1', umkmId: 'umkm-1', name: 'Biji Kopi Arabika Gunung Puntang 250g', price: 95000, category: 'Kuliner', description: 'Single origin aroma floral dengan citarasa fruity lemon dan brown sugar.', inStock: true, views: 182 },
    { id: 'prod-2', umkmId: 'umkm-1', name: 'Cold Brew Concentrate Botol 500ml', price: 65000, category: 'Kuliner', description: 'Konsentrat kopi seduh dingin ekstra pekat, cukup tambah susu atau es batu.', inStock: true, views: 140 },
    { id: 'prod-3', umkmId: 'umkm-1', name: 'Kopi Robusta Dampit Natural 500g', price: 80000, category: 'Kuliner', description: 'Body tebal mantap dengan aroma cokelat karamel khas Jawa Timur.', inStock: true, views: 98 },

    // UMKM 2: Batik Tulis Sekar Arum
    { id: 'prod-4', umkmId: 'umkm-2', name: 'Kain Batik Tulis Motif Truntum Pewarna Alam', price: 850000, category: 'Fesyen', description: 'Kain mori primissima 2.5 meter dengan celupan daun indigo alami.', inStock: true, views: 220 },
    { id: 'prod-5', umkmId: 'umkm-2', name: 'Kemeja Batik Katun Pria Lengan Panjang', price: 420000, category: 'Fesyen', description: 'Fitting reguler modern dengan lapisan furing katun adem.', inStock: true, views: 165 },
    { id: 'prod-6', umkmId: 'umkm-2', name: 'Scarf Sutra Batik Canting Halus', price: 275000, category: 'Fesyen', description: 'Syal sutra anggun untuk pelengkap busana formal dan pesta.', inStock: true, views: 110 },

    // UMKM 3: Anyaman Bambu Barokah
    { id: 'prod-7', umkmId: 'umkm-3', name: 'Kap Lampu Gantung Bambu Skandinavia', price: 185000, category: 'Kriya & Kerajinan', description: 'Anyaman bambu apus halus dengan fitting kabel retro untuk interior cafe.', inStock: true, views: 195 },
    { id: 'prod-8', umkmId: 'umkm-3', name: 'Set Keranjang Hamper Serbaguna (Isi 3)', price: 145000, category: 'Kriya & Kerajinan', description: 'Wadah anyaman multifungsi untuk hantaran maupun organizer meja.', inStock: true, views: 130 },
    { id: 'prod-9', umkmId: 'umkm-3', name: 'Tatakan Piring Meja Anyam Bambu (Set 4)', price: 75000, category: 'Kriya & Kerajinan', description: 'Placemat alami tahan panas dan mudah dibersihkan.', inStock: true, views: 88 },

    // UMKM 4: Sambal Oma Roa
    { id: 'prod-10', umkmId: 'umkm-4', name: 'Sambal Ikan Roa Asap Botol 150g', price: 48000, category: 'Kuliner', description: 'Suwiran daging ikan roa asap melimpah dengan minyak gurih pedas nikmat.', inStock: true, views: 250 },
    { id: 'prod-11', umkmId: 'umkm-4', name: 'Sambal Cumi Asin Cabe Ijo 150g', price: 45000, category: 'Kuliner', description: 'Potongan cumi asin empuk berpadu pedas cabai hijau segar.', inStock: true, views: 190 },
    { id: 'prod-12', umkmId: 'umkm-4', name: 'Paket Hemat Sambal Nusantara (Isi 3 Botol)', price: 130000, category: 'Kuliner', description: 'Kombinasi sambal roa, cumi ijo, dan sambal bawang juara.', inStock: true, views: 215 },

    // UMKM 5: Natura Herbal
    { id: 'prod-13', umkmId: 'umkm-5', name: 'Sabun Mandi Alami Kunyit Asam & Madu 100g', price: 35000, category: 'Kecantikan & Herbal', description: 'Mencerahkan dan melembutkan kulit tanpa deterjen SLS/SLES.', inStock: true, views: 135 },
    { id: 'prod-14', umkmId: 'umkm-5', name: 'Lulur Rempah Tradisional Kering 200g', price: 42000, category: 'Kecantikan & Herbal', description: 'Scrub alami mengangkat sel kulit mati dengan aroma terapi melati.', inStock: true, views: 95 },
    { id: 'prod-15', umkmId: 'umkm-5', name: 'Minyak Kemiri Bakar Murni Pelebat Rambut 100ml', price: 55000, category: 'Kecantikan & Herbal', description: 'Minyak ekstrak kemiri asli untuk nutrisi rambut sehat berkilau.', inStock: true, views: 178 },

    // UMKM 6: Studio Keramik Semesta
    { id: 'prod-16', umkmId: 'umkm-6', name: 'Cangkir Kopi Keramik Stoneware Earthy 220ml', price: 120000, category: 'Kriya & Kerajinan', description: 'Handcrafted ceramic mug dengan tekstur speckled matte.', inStock: true, views: 240 },
    { id: 'prod-17', umkmId: 'umkm-6', name: 'Piring Saji Keramik Datar 24cm', price: 165000, category: 'Kriya & Kerajinan', description: 'Piring makan premium dengan finishing glaze biru laut Bali.', inStock: true, views: 198 },
    { id: 'prod-18', umkmId: 'umkm-6', name: 'Vas Bunga Meja Minimalis Wabi-Sabi', price: 140000, category: 'Kriya & Kerajinan', description: 'Aksen dekorasi meja makan atau ruang tamu yang estetik dan tenang.', inStock: true, views: 142 },

    // UMKM 7: Sepatu Kulit Prabu Medan
    { id: 'prod-19', umkmId: 'umkm-7', name: 'Sepatu Boots Kulit Pria Classic Oxford Brown', price: 780000, category: 'Fesyen', description: 'Kulit sapi pull-up asli dengan sol karet anti slip dan jahitan welt kokoh.', inStock: true, views: 275 },
    { id: 'prod-20', umkmId: 'umkm-7', name: 'Dompet Lipat Pria Kulit Asli Crazy Horse', price: 185000, category: 'Fesyen', description: 'Bahan kulit berkarakter maskulin dengan 8 slot kartu dan sekat uang.', inStock: true, views: 160 },
    { id: 'prod-21', umkmId: 'umkm-7', name: 'Ikat Pinggang Pria Kulit Sapi Tebal 3.8cm', price: 145000, category: 'Fesyen', description: 'Gesper logam antik dengan garansi kulit asli tidak pecah-pecah.', inStock: true, views: 110 },

    // UMKM 8: Tani Hidroponik Lestari
    { id: 'prod-22', umkmId: 'umkm-8', name: 'Selada Romaine Segar Hidroponik 500g', price: 25000, category: 'Pertanian & Agro', description: 'Daun renyah manis bebas ulat dan pestisida kimiawi.', inStock: true, views: 120 },
    { id: 'prod-23', umkmId: 'umkm-8', name: 'Daun Kale Curly Organik 250g', price: 28000, category: 'Pertanian & Agro', description: 'Superfood kaya nutrisi untuk jus hijau dan salad harian.', inStock: true, views: 150 },
    { id: 'prod-24', umkmId: 'umkm-8', name: 'Paket Starter Kit Menanam Hidroponik Rumahan', price: 195000, category: 'Pertanian & Agro', description: 'Lengkap dengan baki, netpot, rockwool, nutrisi AB Mix, dan benih.', inStock: true, views: 230 },

    // UMKM 9: Pixel Studio Desain
    { id: 'prod-25', umkmId: 'umkm-9', name: 'Paket Desain Identitas Brand & Logo UMKM', price: 950000, category: 'Teknologi & Digital', description: 'Termasuk file vektor master, panduan warna, font, dan mockup kemasan.', inStock: true, views: 310 },
    { id: 'prod-26', umkmId: 'umkm-9', name: 'Jasa Pembuatan Website Profil Bisnis Responsif', price: 1800000, category: 'Teknologi & Digital', description: 'Website modern cepat terhubung langsung ke WhatsApp dan Google Maps.', inStock: true, views: 260 },
    { id: 'prod-27', umkmId: 'umkm-9', name: 'Foto Katalog Produk Profesional (10 Produk)', price: 650000, category: 'Teknologi & Digital', description: 'Foto studio resolusi tinggi dengan editing warna siap tayang di medsos.', inStock: true, views: 190 },

    // UMKM 10: Madu Hutan Ujung Kulon
    { id: 'prod-28', umkmId: 'umkm-10', name: 'Madu Hutan Liar Murni Botol Kaca 500g', price: 115000, category: 'Kuliner', description: 'Madu mentah tanpa proses pasteurisasi, aroma wangi nektar bunga hutan.', inStock: true, views: 185 },
    { id: 'prod-29', umkmId: 'umkm-10', name: 'Sarang Madu Alami (Honey Comb) 250g', price: 85000, category: 'Kuliner', description: 'Sarang lebah asli penuh cairan madu segar yang bisa dikunyah langsung.', inStock: true, views: 140 },

    // UMKM 11: Bengkel Kayu Jati Kreatif
    { id: 'prod-30', umkmId: 'umkm-11', name: 'Talenan Kayu Jati Solid Food Grade 35x20cm', price: 95000, category: 'Kriya & Kerajinan', description: 'Polesan lilin lebah alami, serat kayu eksotis dan aman untuk makanan.', inStock: true, views: 165 },
    { id: 'prod-31', umkmId: 'umkm-11', name: 'Set Coaster Tatakan Gelas Kayu Jati (Isi 6)', price: 55000, category: 'Kriya & Kerajinan', description: 'Tatakan cangkir rapi dengan wadah kayu minimalis.', inStock: true, views: 105 },

    // UMKM 12: Tenun Ikat Sotis
    { id: 'prod-32', umkmId: 'umkm-12', name: 'Selendang Tenun Ikat Asli Motif Belian', price: 350000, category: 'Fesyen', description: 'Tenunan tangan mama Alor dengan benang katun lembut warna terracotta.', inStock: true, views: 175 },
    { id: 'prod-33', umkmId: 'umkm-12', name: 'Tote Bag Tenun Kombinasi Kulit Sapi', price: 290000, category: 'Fesyen', description: 'Tas jinjing etnik elegan dengan furing tebal dan kantong ritsleting.', inStock: true, views: 205 },

    // UMKM 13: Rendang Suwir Nan Salero
    { id: 'prod-34', umkmId: 'umkm-13', name: 'Rendang Daging Sapi Suwir Vakum 250g', price: 78000, category: 'Kuliner', description: 'Praktis siap santap, bumbu meresap sempurna gurih kaya santan kelapa.', inStock: true, views: 290 },
    { id: 'prod-35', umkmId: 'umkm-13', name: 'Rendang Paru Sapi Renyah Kering 200g', price: 72000, category: 'Kuliner', description: 'Tekstur krispi kriuk tidak amis dengan cita rasa pedas nikmat.', inStock: true, views: 210 },

    // UMKM 14: Logistik Kilat
    { id: 'prod-36', umkmId: 'umkm-14', name: 'Voucher Kargo Konsolidasi Jawa-Bali 50kg', price: 350000, category: 'Jasa', description: 'Tarif hemat kargo darat khusus paket pengiriman produk antar UMKM.', inStock: true, views: 110 },
    { id: 'prod-37', umkmId: 'umkm-14', name: 'Layanan Fulfillment & Packing Sebulan (Maks 100 Order)', price: 600000, category: 'Jasa', description: 'Bebas repot packing, produk disimpan di gudang kami dan dikirim tiap hari.', inStock: true, views: 145 },

    // UMKM 15: Kripik Tempe Mas Joko
    { id: 'prod-38', umkmId: 'umkm-15', name: 'Kripik Tempe Daun Jeruk Pouch 200g', price: 22000, category: 'Kuliner', description: 'Irisan renyah tipis dengan taburan irisan daun jeruk segar.', inStock: true, views: 130 },
    { id: 'prod-39', umkmId: 'umkm-15', name: 'Kripik Tempe Rasa Pedas Manis 200g', price: 22000, category: 'Kuliner', description: 'Balutan bumbu balado pedas manis gurih nagih.', inStock: true, views: 115 },

    // UMKM 16: Kaos Sablon Parahyangan
    { id: 'prod-40', umkmId: 'umkm-16', name: 'Kaos Polos Combed 24s Heavyweight', price: 55000, category: 'Fesyen', description: 'Bahan katun tebal tidak menerawang dengan rib leher tidak mudah melar.', inStock: true, views: 240 },
    { id: 'prod-41', umkmId: 'umkm-16', name: 'Paket Sablon Kaos Komunitas Lusinan (Min 24 Pcs)', price: 1680000, category: 'Fesyen', description: 'Sablon plastisol awet tahan cuci berkali-kali lengkap sablon dada & punggung.', inStock: true, views: 195 },

    // UMKM 17: Bengkel Bubut Presisi
    { id: 'prod-42', umkmId: 'umkm-17', name: 'Pisau Mesin Perajang Bawang Stainless Steel 304', price: 320000, category: 'Jasa', description: 'Mata pisau tajam food-grade tahan karat untuk mesin pengolah bumbu.', inStock: true, views: 95 },
    { id: 'prod-43', umkmId: 'umkm-17', name: 'Roda Gigi Mesin Pengaduk Adonan Custom', price: 450000, category: 'Jasa', description: 'Pemesinan presisi dari baja paduan tinggi untuk mesin mixer roti.', inStock: true, views: 80 },

    // UMKM 18: Jus Segar Herbal
    { id: 'prod-44', umkmId: 'umkm-18', name: 'Immune Booster Juice (Jahe, Kunyit, Jeruk, Nanas) 250ml', price: 32000, category: 'Kuliner', description: 'Minuman segar rempah kaya vitamin C alami untuk menjaga kebugaran tubuh.', inStock: true, views: 185 },
    { id: 'prod-45', umkmId: 'umkm-18', name: 'Green Detox (Kale, Apel Malang, Mentimun, Lemon) 250ml', price: 35000, category: 'Kuliner', description: 'Membantu melancarkan pencernaan dengan rasa segar menyegarkan.', inStock: true, views: 160 },

    // UMKM 19: Green Flora
    { id: 'prod-46', umkmId: 'umkm-19', name: 'Monstera Deliciosa Pot Tanah Liat 25cm', price: 125000, category: 'Pertanian & Agro', description: 'Tanaman hias daun sobek estetik siap pajang di sudut meja kantor.', inStock: true, views: 170 },
    { id: 'prod-47', umkmId: 'umkm-19', name: 'Bonsai Beringin Dolar Mini Meja Kerja', price: 280000, category: 'Pertanian & Agro', description: 'Batang berkarakter dengan tajuk daun bulat hijau mengkilap.', inStock: true, views: 215 },

    // UMKM 20: Sinar Grafika Kemasan
    { id: 'prod-48', umkmId: 'umkm-20', name: 'Dus Kemasan Makanan Kraft Food Grade 500 Pcs', price: 475000, category: 'Jasa', description: 'Bahan kraft tebal dengan lapisan anti minyak ramah lingkungan.', inStock: true, views: 330 },
    { id: 'prod-49', umkmId: 'umkm-20', name: 'Stiker Vinil Label Kemasan Roll Tahan Air (1000 Pcs)', price: 290000, category: 'Jasa', description: 'Cetak tajam full color laminasi doff/glossy untuk toples dan botol.', inStock: true, views: 295 },

    // UMKM 21: Minyak Kelapa Dara Celebes
    { id: 'prod-50', umkmId: 'umkm-21', name: 'Extra Virgin Coconut Oil Botol Kaca 500ml', price: 75000, category: 'Pertanian & Agro', description: 'Minyak kelapa murni minum untuk kesehatan jantung dan imunitas.', inStock: true, views: 145 },
    { id: 'prod-51', umkmId: 'umkm-21', name: 'VCO Cold Pressed Drum Jerigen 5 Liter', price: 420000, category: 'Pertanian & Agro', description: 'Kebutuhan bahan baku UMKM sabun dan kosmetik alami.', inStock: true, views: 120 },

    // UMKM 22: Lapis Legit Nyonya Halim
    { id: 'prod-52', umkmId: 'umkm-22', name: 'Lapis Legit Original Wisman Ukuran 20x20cm', price: 380000, category: 'Kuliner', description: 'Lapis legit legendaris dengan keharuman rempah kayu manis dan mentega murni.', inStock: true, views: 285 },
    { id: 'prod-53', umkmId: 'umkm-22', name: 'Lapis Legit Plum Prunes Ukuran 10x20cm', price: 220000, category: 'Kuliner', description: 'Perpaduan gurih legit kue dengan asam segar buah plum impor pilihan.', inStock: true, views: 195 },

    // UMKM 23: Tas Ramah Lingkungan Cassava
    { id: 'prod-54', umkmId: 'umkm-23', name: 'Kantong Singkong Cassava Bag T-Shirt 50 Pcs', price: 65000, category: 'Kriya & Kerajinan', description: 'Kantong belanja ramah lingkungan kuat menahan beban hingga 3 kg.', inStock: true, views: 240 },
    { id: 'prod-55', umkmId: 'umkm-23', name: 'Polymailer Singkong Biodegradable Olshop 100 Pcs', price: 110000, category: 'Kriya & Kerajinan', description: 'Amplop kemasan kiriman paket online yang tidak mencemari tanah.', inStock: true, views: 310 },

    // UMKM 24: Dapur Brownies Fudgy
    { id: 'prod-56', umkmId: 'umkm-24', name: 'Fudgy Brownies Shiny Crust 20x20cm (Mix 4 Topping)', price: 95000, category: 'Kuliner', description: 'Isi 25 potong dengan topping almond, keju parut, oreo crumb, dan choco chip.', inStock: true, views: 320 },
    { id: 'prod-57', umkmId: 'umkm-24', name: 'Brownies Bites Cup with Melted Chocolate Dip', price: 40000, category: 'Kuliner', description: 'Potongan brownies dadu mungil dengan cocolan cokelat lumer hangat.', inStock: true, views: 250 },

    // Tambahan varian produk pelengkap (total 64 produk)
    { id: 'prod-58', umkmId: 'umkm-1', name: 'Drip Bag Coffee Box (Isi 5 Sachet)', price: 45000, category: 'Kuliner', description: 'Kopi tetes praktis tinggal seduh air panas di kantor atau traveling.', inStock: true, views: 160 },
    { id: 'prod-59', umkmId: 'umkm-2', name: 'Masker Kain Batik Tulis Lapisan Katun 3 Ply', price: 25000, category: 'Fesyen', description: 'Aksen gaya batik harian yang nyaman dan ramah dicuci berulang.', inStock: true, views: 80 },
    { id: 'prod-60', umkmId: 'umkm-4', name: 'Abon Ikan Roa Gurih Pedas 100g', price: 38000, category: 'Kuliner', description: 'Taburan lauk lezat untuk nasi hangat dan bubur ayam.', inStock: true, views: 135 },
    { id: 'prod-61', umkmId: 'umkm-5', name: 'Lip Balm Minyak Kelapa & Madu Alami 10g', price: 20000, category: 'Kecantikan & Herbal', description: 'Melembabkan bibir pecah-pecah tanpa pewangi buatan.', inStock: true, views: 110 },
    { id: 'prod-62', umkmId: 'umkm-8', name: 'Sayur Pakcoy Hidroponik Super 500g', price: 18000, category: 'Pertanian & Agro', description: 'Batang empuk dan segar untuk tumisan dan sup lezat.', inStock: true, views: 95 },
    { id: 'prod-63', umkmId: 'umkm-11', name: 'Sendok Garpu Kayu Jati Set Pouch Kanvas', price: 35000, category: 'Kriya & Kerajinan', description: 'Alat makan ramah lingkungan pengganti plastik sekali pakai.', inStock: true, views: 140 },
    { id: 'prod-64', umkmId: 'umkm-13', name: 'Bumbu Rendang Pasta Siap Masak 200g', price: 35000, category: 'Kuliner', description: 'Racikan rempah basah autentik tinggal cemplung daging dan santan.', inStock: true, views: 175 }
  ],

  // --------------------------------------------------------------------------
  // 4. BOARD KOLABORASI (15 POSTING LENGKAP DENGAN BERAGAM TIPE)
  // --------------------------------------------------------------------------
  boardPosts: [
    {
      id: 'board-1',
      authorUmkmId: 'umkm-1',
      title: 'Mencari Pemasok Kemasan Kopi Drip Bag Biodegradable',
      type: 'pemasok',
      description: 'Kami membutuhkan suplai rutin filter drip bag berbahan serat jagung alami ramah lingkungan serta standing pouch zipper foil kapasitas 250g sebanyak 2.000 pcs/bulan.',
      location: 'Bogor & Jabodetabek',
      budget: 'Rp 5.000.000 - Rp 10.000.000 / bulan',
      deadline: '2026-12-15',
      status: 'open',
      responses: [
        {
          id: 'resp-1',
          umkmId: 'umkm-20',
          message: 'Halo mas Budi, kami dari Sinar Grafika Yogyakarta punya kemasan kraft foil bersertifikat food-grade. Siap kirim sampel ke Bogor.',
          contact: '081234567020',
          createdAt: '2026-11-01T10:00:00Z'
        }
      ],
      createdAt: '2026-10-28T09:00:00Z'
    },
    {
      id: 'board-2',
      authorUmkmId: 'umkm-4',
      title: 'Dicari Reseller & Distributor Sambal Roa Wilayah Jabodetabek & Bandung',
      type: 'mitra',
      description: 'Membuka peluang kerjasama kemitraan reseller sambal roa botolan dengan margin keuntungan 25-35%. Produk sudah berizin P-IRT dan Halal.',
      location: 'Jabodetabek & Bandung',
      budget: 'Sistem Bagi Hasil / Pembelian Grosir',
      deadline: '2026-12-31',
      status: 'open',
      responses: [
        {
          id: 'resp-2',
          umkmId: 'umkm-13',
          message: 'Bisa konsinyasi atau bundling dengan rendang suwir kami di gerai Tebet Jakarta?',
          contact: '081234567013',
          createdAt: '2026-11-02T14:30:00Z'
        }
      ],
      createdAt: '2026-10-25T11:20:00Z'
    },
    {
      id: 'board-3',
      authorUmkmId: 'umkm-9',
      title: 'Terbuka Kolaborasi Bundling Layanan Desain Identitas Brand & Foto Produk',
      type: 'kolaborasi',
      description: 'Mengajak fotografer produk dan copywriter lokal di Bandung untuk membuat paket bundling komprehensif bagi UMKM yang hendak naik kelas.',
      location: 'Bandung & Sekitarnya',
      budget: 'Bagi Hasil per Proyek Klien',
      deadline: '2026-11-30',
      status: 'open',
      responses: [],
      createdAt: '2026-10-29T16:00:00Z'
    },
    {
      id: 'board-4',
      authorUmkmId: 'umkm-6',
      title: 'Mencari Cafe & Resto di Bali untuk Kerjasama Display Tableware Keramik',
      type: 'mitra',
      description: 'Kami ingin menitipkan display keramik stoneware fungsional di area cafe/resto hits dengan sistem bagi hasil dan promosi silang di media sosial.',
      location: 'Denpasar, Badung, Ubud',
      budget: 'Kerjasama Promosi Silang',
      deadline: '2026-12-20',
      status: 'open',
      responses: [],
      createdAt: '2026-10-30T13:40:00Z'
    },
    {
      id: 'board-5',
      authorUmkmId: 'umkm-8',
      title: 'Peluang Pasokan Sayur Hidroponik Harian untuk Resto Salad & Katering Diet',
      type: 'layanan',
      description: 'Menyediakan pasokan selada romaine, pakcoy, dan kale segar petik pagi dengan jaminan ketersediaan stok stabil dan harga kontrak bersahabat.',
      location: 'Jakarta Selatan & Depok',
      budget: 'Sesuai Volume Panen',
      deadline: '2027-01-15',
      status: 'open',
      responses: [],
      createdAt: '2026-10-31T08:15:00Z'
    },
    {
      id: 'board-6',
      authorUmkmId: 'umkm-3',
      title: 'Mencari Event Organizer / Kurator Bazaar Kriya Nusantara',
      type: 'acara',
      description: 'Anyaman Bambu Barokah siap berpartisipasi dan mengisi instalasi dekorasi bambu dalam gelaran pameran kriya dan festival seni akhir tahun.',
      location: 'Bandung, Jakarta, Jogja',
      budget: 'Negosiasi Sponsor / Booth',
      deadline: '2026-11-25',
      status: 'open',
      responses: [],
      createdAt: '2026-11-01T09:50:00Z'
    },
    {
      id: 'board-7',
      authorUmkmId: 'umkm-5',
      title: 'Mencari Suplai Rutin Virgin Coconut Oil (VCO) Berkualitas 50-100 Liter/Bulan',
      type: 'pemasok',
      description: 'Dibutuhkan suplai VCO murni tanpa bau tengik dengan kadar air rendah untuk pembuatan sabun herbal alami. Diutamakan produsen langsung.',
      location: 'Jawa Timur & sekitarnya',
      budget: 'Rp 3.500.000 - Rp 7.000.000 / bulan',
      deadline: '2026-12-10',
      status: 'open',
      responses: [
        {
          id: 'resp-3',
          umkmId: 'umkm-21',
          message: 'Kami produsen langsung VCO di Makassar, siap kirim jerigen 5L via kargo murah ke Surabaya.',
          contact: '081234567021',
          createdAt: '2026-11-03T11:00:00Z'
        }
      ],
      createdAt: '2026-11-02T15:20:00Z'
    },
    {
      id: 'board-8',
      authorUmkmId: 'umkm-20',
      title: 'Menawarkan Jasa Cetak Kemasan Box Makanan & Stiker Label Tanpa Minimum Order Besar',
      type: 'layanan',
      description: 'Sinar Grafika membuka slot cetak khusus UMKM pemula mulai 100 pcs untuk uji pasar dengan harga terjangkau dan konsultasi gratis desain garis potong.',
      location: 'Seluruh Indonesia (Pengiriman dari Jogja)',
      budget: 'Mulai Rp 200.000',
      deadline: '2027-02-28',
      status: 'open',
      responses: [],
      createdAt: '2026-11-03T10:10:00Z'
    },
    {
      id: 'board-9',
      authorUmkmId: 'umkm-14',
      title: 'Program Kargo Bareng Jawa - Bali: Diskon Ongkir 30% untuk Komunitas UMKM',
      type: 'layanan',
      description: 'Mengajak rekan UMKM yang sering kirim paket barang antar Jawa-Bali untuk konsolidasi muatan bareng tiap hari Selasa dan Jumat.',
      location: 'Surabaya, Solo, Jogja, Denpasar',
      budget: 'Tarif Spesial Rp 3.500/kg',
      deadline: '2026-12-31',
      status: 'open',
      responses: [],
      createdAt: '2026-11-03T16:45:00Z'
    },
    {
      id: 'board-10',
      authorUmkmId: 'umkm-2',
      title: 'Kolaborasi Desainer Busana Modern untuk Capsule Collection Batik Alam',
      type: 'kolaborasi',
      description: 'Kami ingin berkolaborasi dengan fashion designer muda untuk meluncurkan koleksi busana kerja kasual berbahan batik pewarna alam.',
      location: 'Yogyakarta, Solo, Semarang',
      budget: 'Bagi Hasil Royalti Koleksi',
      deadline: '2026-12-15',
      status: 'open',
      responses: [],
      createdAt: '2026-11-04T08:30:00Z'
    },
    {
      id: 'board-11',
      authorUmkmId: 'umkm-16',
      title: 'Mencari Suplai Kain Katun Combed 24s/30s Warna Pastel Konsisten',
      type: 'pemasok',
      description: 'Dibutuhkan pabrik/distributor kain katun rajut dengan kestabilan lot warna pastel untuk produksi kaos distro secara kontinyu.',
      location: 'Bandung & Jawa Barat',
      budget: 'Rp 20.000.000 / bulan',
      deadline: '2026-12-05',
      status: 'open',
      responses: [],
      createdAt: '2026-11-04T13:00:00Z'
    },
    {
      id: 'board-12',
      authorUmkmId: 'umkm-24',
      title: 'Membuka Titip Jual (Konsinyasi) Brownies Fudgy di Coffee Shop Jakarta Selatan',
      type: 'mitra',
      description: 'Menyediakan display cake case mini dan pasokan brownies fresh baked harian untuk melengkapi menu pastry teman ngopi.',
      location: 'Jakarta Selatan',
      budget: 'Bagi Hasil 25% untuk Coffee Shop',
      deadline: '2026-12-25',
      status: 'open',
      responses: [],
      createdAt: '2026-11-05T09:15:00Z'
    },
    {
      id: 'board-13',
      authorUmkmId: 'umkm-17',
      title: 'Jasa Rekayasa & Fabrikasi Mesin Pengolah Keripik Otomatis',
      type: 'layanan',
      description: 'Melayani rancang bangun mesin perajang singkong/tempe dan spinner peniris minyak dengan kapasitas 10-50 kg/jam.',
      location: 'Medan & Sumatera Utara',
      budget: 'Sesuai Spesifikasi Mesin',
      deadline: '2027-01-30',
      status: 'open',
      responses: [],
      createdAt: '2026-11-05T14:20:00Z'
    },
    {
      id: 'board-14',
      authorUmkmId: 'umkm-23',
      title: 'Kerjasama Penggantian Kantong Plastik untuk Toko Retail & Brand Fesyen di Bali',
      type: 'mitra',
      description: 'Ayo wujudkan zero plastic footprint dengan menggunakan polymailer dan kantong berbahan singkong yang larut alami dalam tanah.',
      location: 'Bali',
      budget: 'Harga Khusus Komitmen Hijau',
      deadline: '2026-12-31',
      status: 'open',
      responses: [],
      createdAt: '2026-11-05T17:00:00Z'
    },
    {
      id: 'board-15',
      authorUmkmId: 'umkm-10',
      title: 'Peluang Kerjasama Hampers Sehat Akhir Tahun 2026',
      type: 'kolaborasi',
      description: 'Mengajak produsen teh artisan, kue kering, atau kriya cangkir kayu untuk membuat bingkisan hampers sehat eksklusif akhir tahun.',
      location: 'Nasional / Seluruh Kota',
      budget: 'Bagi Modal & Bagi Keuntungan',
      deadline: '2026-11-28',
      status: 'open',
      responses: [],
      createdAt: '2026-11-06T09:00:00Z'
    }
  ],

  // --------------------------------------------------------------------------
  // 5. FORUM KOMUNITAS (20 THREAD + DISKUSI & KOMENTAR SATU TINGKAT)
  // --------------------------------------------------------------------------
  forumThreads: [
    {
      id: 'thread-1',
      authorId: 'user-seller-demo',
      authorName: 'Budi Santoso',
      authorRole: 'seller',
      authorUmkm: 'Kopi Sangrai Nusantara',
      title: 'Strategi Efektif Meningkatkan Penjualan B2B ke Kafe & Restoran',
      category: 'Tips Pemasaran',
      content: 'Teman-teman UMKM, salah satu lompatan terbesar omset kami adalah ketika beralih dari sekadar jualan eceran ke suplai rutin B2B. Kuncinya ada pada penyediaan sampel gratis yang dikemas profesional, konsistensi rasa, dan kemudahan termin pembayaran 14 hari. Bagaimana pengalaman rekan-rekan yang lain?',
      upvotes: ['user-seller-demo', 'user-regular-demo', 'user-seller-3', 'user-seller-9'],
      commentsCount: 3,
      comments: [
        {
          id: 'comm-1-1',
          authorId: 'user-seller-3',
          authorName: 'Asep Bambu',
          authorRole: 'seller',
          content: 'Setuju banget Mas Budi! Di Anyaman Bambu, kami juga kirim katalog fisik dan sampel mini kap lampu ke arsitek/desainer cafe. Responnya jauh lebih tinggi daripada cuma kirim email penawaran.',
          createdAt: '2026-10-29T11:00:00Z',
          replies: [
            {
              id: 'rep-1-1-1',
              authorId: 'user-seller-demo',
              authorName: 'Budi Santoso',
              content: 'Betul Kang Asep, sentuhan fisik katalog dan sampel bikin calon mitra percaya kalau kita produsen serius.',
              createdAt: '2026-10-29T13:30:00Z'
            }
          ]
        },
        {
          id: 'comm-1-2',
          authorId: 'user-regular-demo',
          authorName: 'Siti Rahma',
          authorRole: 'user',
          content: 'Sebagai konsumen, senang sekali melihat kafe-kafe lokal pakai biji kopi dari petani binaan langsung!',
          createdAt: '2026-10-30T08:15:00Z',
          replies: []
        }
      ],
      createdAt: '2026-10-28T10:00:00Z'
    },
    {
      id: 'thread-2',
      authorId: 'user-seller-9',
      authorName: 'Rian Pixel',
      authorRole: 'seller',
      authorUmkm: 'Pixel Studio Desain',
      title: 'Kesalahan Umum Desain Kemasan yang Sering Bikin Produk Kurang Laris',
      category: 'Pengembangan Produk',
      content: 'Banyak UMKM yang mengira desain kemasan harus ramai penuh warna dan tulisan. Padahal, pembeli di rak toko hanya butuh waktu 3 detik untuk memutuskan. Tiga hal wajib ada: 1. Nama produk jelas terbaca dari jarak 1 meter; 2. Nilai unik (USP) ringkas; 3. Visual rasa/tekstur yang menggugah selera.',
      upvotes: ['user-seller-demo', 'user-seller-4', 'user-seller-20'],
      commentsCount: 2,
      comments: [
        {
          id: 'comm-2-1',
          authorId: 'user-seller-20',
          authorName: 'Dani Grafika',
          authorRole: 'seller',
          content: 'Betul sekali Mas Rian. Sering kami dapat file desain dari klien yang font keterangannya terlalu kecil dan warnanya tabrakan dengan latar.',
          createdAt: '2026-10-30T15:20:00Z',
          replies: []
        }
      ],
      createdAt: '2026-10-29T14:00:00Z'
    },
    {
      id: 'thread-3',
      authorId: 'user-seller-demo',
      authorName: 'Budi Santoso',
      authorRole: 'seller',
      authorUmkm: 'Kopi Sangrai Nusantara',
      title: 'Memisahkan Rekening Pribadi dan Usaha: Langkah Pertama Menuju Bisnis Sehat',
      category: 'Manajemen Keuangan',
      content: 'Waktu awal merintis, uang jualan sering terpakai buat belanja dapur rumah. Akibatnya pas jatuh tempo beli bahan baku, kas malah tekor. Begitu bikin rekening terpisah dan menggaji diri sendiri dengan nominal tetap, arus kas langsung rapi dan tenang.',
      upvotes: ['user-seller-demo', 'user-regular-demo', 'user-seller-5', 'user-seller-15'],
      commentsCount: 1,
      comments: [
        {
          id: 'comm-3-1',
          authorId: 'user-seller-15',
          authorName: 'Joko Kripik',
          authorRole: 'seller',
          content: 'Ini penyakit klasik UMKM pemula hehe. Menggaji diri sendiri itu melatih kedisiplinan dan tahu berapa profit murni bisnis kita.',
          createdAt: '2026-10-31T11:45:00Z',
          replies: []
        }
      ],
      createdAt: '2026-10-30T09:30:00Z'
    },
    {
      id: 'thread-4',
      authorId: 'user-seller-2',
      authorName: 'Sekar Dewi',
      authorRole: 'seller',
      authorUmkm: 'Batik Tulis Sekar Arum',
      title: 'Perjalanan Mendapatkan Sertifikasi Halal & NIB Gratis Melalui Program Pemerintah',
      category: 'Pengalaman & Kisah Sukses',
      content: 'Mau berbagi cerita pengurusan NIB dan sertifikasi halal self-declare untuk produk kriya dan workshop kami. Prosesnya sekarang sudah serba online lewat OSS dan SIHALAL, dibantu pendamping PPH setempat. Bagi teman-teman yang belum mengurus, jangan ragu karena sangat membantu kredibilitas usaha.',
      upvotes: ['user-seller-demo', 'user-seller-10', 'user-seller-13'],
      commentsCount: 2,
      comments: [
        {
          id: 'comm-4-1',
          authorId: 'user-seller-10',
          authorName: 'Hendra Madu',
          authorRole: 'seller',
          content: 'Iya betul Mbak Sekar. Dengan adanya sertifikat halal dan izin edar resmi, produk madu kami sekarang bisa masuk ke swalayan besar tanpa kendala.',
          createdAt: '2026-11-01T14:10:00Z',
          replies: []
        }
      ],
      createdAt: '2026-10-31T16:00:00Z'
    },
    {
      id: 'thread-5',
      authorId: 'user-seller-4',
      authorName: 'Oma Maria',
      authorRole: 'seller',
      authorUmkm: 'Sambal Oma Roa Juara',
      title: 'Tantangan Ongkos Kirim Antarpulau: Solusi Gudang Transit atau Fulfillment?',
      category: 'Tantangan Bisnis',
      content: 'Kami yang berada di Makassar sering kehilangan calon pembeli dari Jabodetabek karena ongkos kirim hampir sama dengan harga 2 botol sambal. Apakah ada rekan yang sudah mencoba sistem fulfillment di Jawa? Mohon masukannya.',
      upvotes: ['user-seller-demo', 'user-seller-14', 'user-seller-21'],
      commentsCount: 2,
      comments: [
        {
          id: 'comm-5-1',
          authorId: 'user-seller-14',
          authorName: 'Rahmat Logistik',
          authorRole: 'seller',
          content: 'Halo Bu Maria, bisa coba kargo barengan untuk taruh stok penyangga (buffer stock) 50-100 botol di fulfillment Surabaya atau Jakarta. Nanti tiap ada order, langsung dikirim dari sana.',
          createdAt: '2026-11-02T10:15:00Z',
          replies: [
            {
              id: 'rep-5-1-1',
              authorId: 'user-seller-4',
              authorName: 'Oma Maria',
              content: 'Terima kasih infonya Pak Rahmat, nanti saya kontak via WhatsApp untuk tanya detail tarifnya ya.',
              createdAt: '2026-11-02T11:00:00Z'
            }
          ]
        }
      ],
      createdAt: '2026-11-01T13:20:00Z'
    },
    // Thread 6-20 untuk memperkaya forum
    {
      id: 'thread-6',
      authorId: 'user-seller-18',
      authorName: 'dr. Sarah',
      authorRole: 'seller',
      authorUmkm: 'Jus Segar Herbal Buah Tropis',
      title: 'Peluang Pasar Produk Minuman Sehat Pasca Pandemi',
      category: 'Tips Pemasaran',
      content: 'Kesadaran konsumen akan gaya hidup sehat terus meningkat. Kuncinya adalah transparansi bahan baku tanpa bahan pemanis buatan dan edukasi manfaat kandungan nutrisi di media sosial.',
      upvotes: ['user-seller-demo', 'user-seller-8'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-02T08:00:00Z'
    },
    {
      id: 'thread-7',
      authorId: 'user-seller-11',
      authorName: 'Agus Purnomo',
      authorRole: 'seller',
      authorUmkm: 'Bengkel Kayu Jati Kreatif',
      title: 'Cara Mengolah Limbah Potongan Kayu Jadi Produk Bernilai Jual Tinggi',
      category: 'Pengembangan Produk',
      content: 'Daripada potongan kayu jati dibuang atau dibakar jadi arang, kami poles jadi sendok garpu, gantungan kunci, dan tatakan gelas estetik. Margin keuntungannya justru sangat menarik.',
      upvotes: ['user-seller-3', 'user-seller-6'],
      commentsCount: 2,
      comments: [],
      createdAt: '2026-11-02T16:30:00Z'
    },
    {
      id: 'thread-8',
      authorId: 'user-seller-23',
      authorName: 'Wayan Suartana',
      authorRole: 'seller',
      authorUmkm: 'Tas Ramah Lingkungan Cassava',
      title: 'Tren Green Packaging: Peluang Ekspor untuk UMKM Berkelanjutan',
      category: 'Tips Pemasaran',
      content: 'Banyak buyer dari Eropa dan Australia mewajibkan kemasan tanpa plastik konvensional. Mengadopsi kemasan nabati bisa menjadi daya tawar kuat di kancah global.',
      upvotes: ['user-seller-demo', 'user-seller-2'],
      commentsCount: 0,
      comments: [],
      createdAt: '2026-11-03T09:10:00Z'
    },
    {
      id: 'thread-9',
      authorId: 'user-seller-7',
      authorName: 'Prabu Siregar',
      authorRole: 'seller',
      authorUmkm: 'Sepatu Kulit Prabu Medan',
      title: 'Menjaga Loyalitas Pelanggan dengan Garansi & Layanan Perawatan Gratis',
      category: 'Pengalaman & Kisah Sukses',
      content: 'Kami memberikan garansi sol 1 tahun dan layanan semir gratis selamanya. Dampaknya, lebih dari 40% penjualan kami datang dari repeat order dan rekomendasi dari mulut ke mulut.',
      upvotes: ['user-seller-demo', 'user-regular-demo', 'user-seller-16'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-03T11:40:00Z'
    },
    {
      id: 'thread-10',
      authorId: 'user-seller-13',
      authorName: 'Uni Evi',
      authorRole: 'seller',
      authorUmkm: 'Rendang Suwir Nan Salero',
      title: 'Teknik Pengemasan Vakum & Retort agar Makanan Basah Awet Tanpa Pengawet',
      category: 'Pengembangan Produk',
      content: 'Proses sterilisasi panas bertekanan (retort) membunuh bakteri anaerob tanpa merusak cita rasa rendang. Makanan bisa tahan 6-12 bulan di suhu ruang!',
      upvotes: ['user-seller-4', 'user-seller-10', 'user-seller-24'],
      commentsCount: 2,
      comments: [],
      createdAt: '2026-11-03T14:20:00Z'
    },
    {
      id: 'thread-11',
      authorId: 'user-seller-16',
      authorName: 'Gilang Pratama',
      authorRole: 'seller',
      authorUmkm: 'Kaos Sablon Kreatif Parahyangan',
      title: 'Tips Memilih Kain Combed yang Benar-Benar 100% Katun Murni',
      category: 'Tantangan Bisnis',
      content: 'Hati-hati banyak beredar kain campuran TC/CVC yang dijual dengan label combed murni. Uji sederhananya bisa dengan membakar secuil serat kain; katun murni akan menjadi abu halus beraroma kertas terbakar.',
      upvotes: ['user-seller-2', 'user-seller-9'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-04T10:00:00Z'
    },
    {
      id: 'thread-12',
      authorId: 'user-seller-8',
      authorName: 'Ir. Handoko',
      authorRole: 'seller',
      authorUmkm: 'Tani Hidroponik Lestari',
      title: 'Efisiensi Air & Listrik dalam Sistem Hidroponik NFT Perkotaan',
      category: 'Manajemen Keuangan',
      content: 'Dengan memanfaatkan pompa hemat daya dan sensor timer otomatis, kami menghemat konsumsi listrik hingga 35% sembari menjaga sirkulasi oksigen akar tetap maksimal.',
      upvotes: ['user-seller-19', 'user-seller-21'],
      commentsCount: 0,
      comments: [],
      createdAt: '2026-11-04T12:30:00Z'
    },
    {
      id: 'thread-13',
      authorId: 'user-seller-24',
      authorName: 'Anisa Bella',
      authorRole: 'seller',
      authorUmkm: 'Dapur Brownies Fudgy Lumer',
      title: 'Memanfaatkan Video TikTok & Reels untuk Mendongkrak Pesanan Kue Rumahan',
      category: 'Tips Pemasaran',
      content: 'Video proses pembuatan (behind the scenes) yang memperlihatkan lelehan cokelat dan bunyi renyah crust ternyata jauh lebih viral dibanding sekadar foto produk statis.',
      upvotes: ['user-seller-demo', 'user-regular-demo', 'user-seller-9'],
      commentsCount: 2,
      comments: [],
      createdAt: '2026-11-04T15:45:00Z'
    },
    {
      id: 'thread-14',
      authorId: 'user-seller-6',
      authorName: 'Gede Arya',
      authorRole: 'seller',
      authorUmkm: 'Studio Kriya Keramik Semesta',
      title: 'Seni Menentukan Harga (Pricing) untuk Produk Handmade & Kriya Bernilai Seni',
      category: 'Manajemen Keuangan',
      content: 'Jangan hanya menghitung modal bahan baku tanah liat dan listrik. Jam terbang seniman, risiko pecah saat pembakaran tungku, dan keunikan desain harus dihargai layak.',
      upvotes: ['user-seller-2', 'user-seller-3', 'user-seller-11'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-05T09:00:00Z'
    },
    {
      id: 'thread-15',
      authorId: 'user-seller-10',
      authorName: 'Hendra Madu',
      authorRole: 'seller',
      authorUmkm: 'Madu Hutan Ujung Kulon',
      title: 'Mengenal Karakter Madu Mentah (Raw Honey) yang Mengeluarkan Gas Alami',
      category: 'Pengembangan Produk',
      content: 'Banyak konsumen awam kaget saat botol madu dibuka berbunyi mendesis. Perlu edukasi sabar bahwa gas dan busa halus itu bukti enzim aktif lebah masih hidup alami.',
      upvotes: ['user-seller-5', 'user-seller-18'],
      commentsCount: 0,
      comments: [],
      createdAt: '2026-11-05T11:15:00Z'
    },
    {
      id: 'thread-16',
      authorId: 'user-seller-14',
      authorName: 'Rahmat Logistik',
      authorRole: 'seller',
      authorUmkm: 'Logistik Kilat UMKM Nusantara',
      title: 'Standar Packing Barang Pecah Belah Agar Bebas Klaim Rusak di Jalan',
      category: 'Tantangan Bisnis',
      content: 'Gunakan metode bubble wrap 3 lapis, sekat kardus pemisah antarbenda, dan kardus double wall dengan stiker fragile di 4 sisi paket.',
      upvotes: ['user-seller-6', 'user-seller-4', 'user-seller-10'],
      commentsCount: 3,
      comments: [],
      createdAt: '2026-11-05T13:40:00Z'
    },
    {
      id: 'thread-17',
      authorId: 'user-seller-22',
      authorName: 'Nyonya Halim',
      authorRole: 'seller',
      authorUmkm: 'Kue Lapis Legit Nyonya Halim',
      title: 'Kisah 40 Tahun Mempertahankan Kualitas Mentega Murni Tanpa Kompromi',
      category: 'Pengalaman & Kisah Sukses',
      content: 'Meski harga mentega wisman melonjak tinggi saat krisis, kami memilih tidak mengganti resep dengan margarin biasa. Kepercayaan lidah pelanggan adalah aset paling berharga.',
      upvotes: ['user-seller-demo', 'user-seller-24', 'user-regular-demo'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-05T16:20:00Z'
    },
    {
      id: 'thread-18',
      authorId: 'user-seller-21',
      authorName: 'M. Daeng Rauf',
      authorRole: 'seller',
      authorUmkm: 'Minyak Kelapa Dara Celebes',
      title: 'Pemanfaatan Sisa Ampas Kelapa Jadi Tepung Bebas Gluten & Pakan Ternak',
      category: 'Pengembangan Produk',
      content: 'Prinsip circular economy: setelah minyak VCO diekstrak, ampas kelapa dikeringkan dan diayak menjadi tepung kelapa kaya serat untuk penderita diabetes.',
      upvotes: ['user-seller-8', 'user-seller-19'],
      commentsCount: 0,
      comments: [],
      createdAt: '2026-11-06T08:30:00Z'
    },
    {
      id: 'thread-19',
      authorId: 'user-seller-15',
      authorName: 'Joko Kripik',
      authorRole: 'seller',
      authorUmkm: 'Kripik Tempe Renyah Mas Joko',
      title: 'Cara Menembus Toko Oleh-Oleh dan Swalayan Lokal Tanpa Biaya Listing Selangit',
      category: 'Tips Pemasaran',
      content: 'Mulai dari toko oleh-oleh mandiri di pinggir jalan tol, tawarkan skema konsinyasi retur aman, dan pastikan kemasan sudah barcode GS1 standar kasir.',
      upvotes: ['user-seller-4', 'user-seller-13'],
      commentsCount: 2,
      comments: [],
      createdAt: '2026-11-06T10:10:00Z'
    },
    {
      id: 'thread-20',
      authorId: 'user-seller-19',
      authorName: 'Ferry Flora',
      authorRole: 'seller',
      authorUmkm: 'Green Flora Tanaman Hias',
      title: 'Peluang Bisnis Rental Tanaman Hias untuk Gedung Perkantoran & Bank',
      category: 'Tips Pemasaran',
      content: 'Daripada jualan tanaman putus, bisnis sewa tanaman dengan perawatan rutin 2 minggu sekali memberikan recurring income yang sangat stabil setiap bulan.',
      upvotes: ['user-seller-demo', 'user-seller-8'],
      commentsCount: 1,
      comments: [],
      createdAt: '2026-11-06T11:45:00Z'
    }
  ],

  // --------------------------------------------------------------------------
  // 6. KOMUNITAS UMKM (8 KOMUNITAS BERDASARKAN KOTA & KATEGORI SEKTORAL)
  // --------------------------------------------------------------------------
  communities: [
    {
      id: 'comm-group-1',
      name: 'UMKM Hebat Bogor',
      type: 'kota',
      city: 'Bogor',
      description: 'Wadah kolaborasi, informasi bazar, dan temu wirausaha UMKM se-Bogor Raya.',
      icon: '⛰️',
      membersCount: 42,
      members: ['user-seller-demo', 'user-seller-10', 'user-seller-19']
    },
    {
      id: 'comm-group-2',
      name: 'Komunitas Kriya & Kerajinan Nusantara',
      type: 'kategori',
      category: 'Kriya & Kerajinan',
      description: 'Forum pengrajin bambu, keramik, kayu, dan kriya ramah lingkungan Indonesia.',
      icon: '🎨',
      membersCount: 68,
      members: ['user-seller-3', 'user-seller-6', 'user-seller-11', 'user-seller-23']
    },
    {
      id: 'comm-group-3',
      name: 'UMKM Kuliner Juara Nusantara',
      type: 'kategori',
      category: 'Kuliner',
      description: 'Komunitas produsen makanan dan minuman olahan, kopi, sambal, dan kuliner siap saji.',
      icon: '🍲',
      membersCount: 115,
      members: ['user-seller-demo', 'user-seller-4', 'user-seller-10', 'user-seller-13', 'user-seller-15', 'user-seller-18', 'user-seller-22', 'user-seller-24']
    },
    {
      id: 'comm-group-4',
      name: 'UMKM Kreatif Bandung (Dago & Sekitarnya)',
      type: 'kota',
      city: 'Bandung',
      description: 'Jejaring industri kreatif fesyen, distro, sablon, kriya, dan agensi desain Bandung.',
      icon: '☕',
      membersCount: 54,
      members: ['user-seller-3', 'user-seller-9', 'user-seller-16']
    },
    {
      id: 'comm-group-5',
      name: 'Pelaku Usaha Fesyen & Wastra Indonesia',
      type: 'kategori',
      category: 'Fesyen',
      description: 'Kolaborasi produsen batik, tenun ikat, sepatu kulit, dan pakaian lokal berdaya saing.',
      icon: '👗',
      membersCount: 47,
      members: ['user-seller-2', 'user-seller-7', 'user-seller-12', 'user-seller-16']
    },
    {
      id: 'comm-group-6',
      name: 'Jejaring UMKM Yogyakarta Istimewa',
      type: 'kota',
      city: 'Yogyakarta',
      description: 'Paguyuban pengusaha mandiri Yogyakarta: batik, kuliner khas, kayu, dan percetakan.',
      icon: '🏯',
      membersCount: 61,
      members: ['user-seller-2', 'user-seller-11', 'user-seller-20']
    },
    {
      id: 'comm-group-7',
      name: 'Komunitas Agro & Pertanian Organik',
      type: 'kategori',
      category: 'Pertanian & Agro',
      description: 'Diskusi pertanian modern hidroponik, perkebunan herbal, tanaman hias, dan VCO.',
      icon: '🌱',
      membersCount: 39,
      members: ['user-seller-8', 'user-seller-19', 'user-seller-21']
    },
    {
      id: 'comm-group-8',
      name: 'UMKM Surabaya & Gerbangkertosusila',
      type: 'kota',
      city: 'Surabaya',
      description: 'Aliansi pelaku usaha Jawa Timur untuk perluasan logistik, distributor, dan ritel.',
      icon: '🦈',
      membersCount: 50,
      members: ['user-seller-5', 'user-seller-14', 'user-seller-15']
    }
  ],

  // --------------------------------------------------------------------------
  // 7. PESAN CHAT (GROUP & PRIVATE CONVERSATION HISTORIES)
  // --------------------------------------------------------------------------
  messages: [
    // Chat di Group UMKM Hebat Bogor (comm-group-1)
    {
      id: 'msg-1',
      communityId: 'comm-group-1',
      senderId: 'user-seller-demo',
      senderName: 'Budi Santoso (Kopi Sangrai)',
      text: 'Halo rekan-rekan UMKM Bogor! Ada yang ikut kurasi bazaar akhir pekan ini di Lapangan Sempur?',
      timestamp: '2026-11-05T14:30:00Z'
    },
    {
      id: 'msg-2',
      communityId: 'comm-group-1',
      senderId: 'user-seller-10',
      senderName: 'Hendra (Madu Ujung Kulon)',
      text: 'Halo Mas Budi! Kami dari Madu Hutan ikut buka booth di blok F&B. Mari mampir ya!',
      timestamp: '2026-11-05T14:35:00Z'
    },
    {
      id: 'msg-3',
      communityId: 'comm-group-1',
      senderId: 'user-seller-19',
      senderName: 'Ferry (Green Flora)',
      text: 'Green Flora juga isi dekorasi tanaman di pintu masuk utama. Sukses lancar buat kita semua!',
      timestamp: '2026-11-05T15:10:00Z'
    },

    // Chat di Group UMKM Kuliner Juara Nusantara (comm-group-3)
    {
      id: 'msg-4',
      communityId: 'comm-group-3',
      senderId: 'user-seller-4',
      senderName: 'Oma Maria (Sambal Roa)',
      text: 'Selamat pagi bapak ibu, ada rekomendasi supplier kemasan botol kaca sambal yang tahan suhu autoclave?',
      timestamp: '2026-11-06T08:15:00Z'
    },
    {
      id: 'msg-5',
      communityId: 'comm-group-3',
      senderId: 'user-seller-13',
      senderName: 'Uni Evi (Rendang Suwir)',
      text: 'Pagi Bu Maria, coba cek pabrikan botol di Surabaya atau hubungi Pak Dani Sinar Grafika di Jogja, mereka punya rekanan botol bersertifikasi juga.',
      timestamp: '2026-11-06T08:45:00Z'
    },
    {
      id: 'msg-6',
      communityId: 'comm-group-3',
      senderId: 'user-seller-demo',
      senderName: 'Budi Santoso (Kopi Sangrai)',
      text: 'Sip, kami juga pakai botol kaca dari rekanan tersebut untuk cold brew. Kualitasnya sangat aman!',
      timestamp: '2026-11-06T09:05:00Z'
    },

    // Direct / Private Chat antara Siti Rahma (User) dan Budi Santoso (Seller Demo)
    {
      id: 'msg-dm-1',
      directPair: 'user-regular-demo_user-seller-demo',
      senderId: 'user-regular-demo',
      senderName: 'Siti Rahma',
      recipientId: 'user-seller-demo',
      text: 'Halo Kopi Sangrai Nusantara! Mau tanya untuk biji kopi Arabika Puntang apakah bisa digilingkan untuk seduhan V60?',
      timestamp: '2026-11-06T10:00:00Z'
    },
    {
      id: 'msg-dm-2',
      directPair: 'user-regular-demo_user-seller-demo',
      senderId: 'user-seller-demo',
      senderName: 'Budi Santoso',
      recipientId: 'user-regular-demo',
      text: 'Halo Kak Siti! Tentu bisa sekali. Nanti bisa sertakan catatan "Giling Medium untuk V60" saat checkout atau hubungi WhatsApp kami ya.',
      timestamp: '2026-11-06T10:05:00Z'
    }
  ],

  // --------------------------------------------------------------------------
  // 8. PERMINTAAN KOLABORASI (COLLAB REQUESTS)
  // --------------------------------------------------------------------------
  collabRequests: [
    {
      id: 'collab-1',
      fromUmkmId: 'umkm-20',
      toUmkmId: 'umkm-1',
      message: 'Halo Kopi Sangrai, kami tertarik bekerjasama memasok standing pouch kraft foil ramah lingkungan untuk lini kopi drip bag terbaru Anda.',
      needOffered: 'Kemasan ramah lingkungan',
      status: 'pending',
      createdAt: '2026-11-04T11:20:00Z'
    },
    {
      id: 'collab-2',
      fromUmkmId: 'umkm-9',
      toUmkmId: 'umkm-1',
      message: 'Ayo buat sesi foto komersial produk kopi cold brew Anda untuk kebutuhan materi iklan media sosial dan marketplace.',
      needOffered: 'Jasa foto produk komersial',
      status: 'accepted',
      createdAt: '2026-11-02T16:00:00Z'
    },
    {
      id: 'collab-3',
      fromUmkmId: 'umkm-14',
      toUmkmId: 'umkm-1',
      message: 'Kami menyediakan diskon tarif kargo katering dan konsolidasi suplai biji kopi ke kedai-kedai kopi mitra di Surabaya & Bali.',
      needOffered: 'Distributor ritel Jabodetabek & antar-kota',
      status: 'pending',
      createdAt: '2026-11-05T13:30:00Z'
    }
  ],

  // --------------------------------------------------------------------------
  // 9. ANALITIK DASHBOARD SELLER (DEMO STATS 30 HARI & 7 HARI)
  // --------------------------------------------------------------------------
  analytics: {
    'umkm-1': {
      profileViews: 428,
      productViews: 1240,
      inquiries: 34,
      communityEngagement: 48,
      collabReceived: 3,
      history7Days: [
        { date: '31 Okt', views: 45, inquiries: 3 },
        { date: '01 Nov', views: 58, inquiries: 4 },
        { date: '02 Nov', views: 52, inquiries: 5 },
        { date: '03 Nov', views: 64, inquiries: 6 },
        { date: '04 Nov', views: 71, inquiries: 7 },
        { date: '05 Nov', views: 68, inquiries: 4 },
        { date: '06 Nov', views: 82, inquiries: 8 }
      ],
      history30Days: [
        { date: 'W1', views: 240, inquiries: 18 },
        { date: 'W2', views: 290, inquiries: 22 },
        { date: 'W3', views: 330, inquiries: 26 },
        { date: 'W4', views: 380, inquiries: 31 }
      ]
    }
  }
};

/**
 * Inisialisasi data seed ke LocalStorage jika belum pernah ada
 */
export function initSeedData(store) {
  if (!store.isInitialized()) {
    store.resetToSeed(INITIAL_DATA);
  }
}

