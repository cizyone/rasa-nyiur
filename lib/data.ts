export type MenuCategory = 'Semua' | 'Makanan Utama' | 'Rica-Rica & Sambal' | 'Camilan' | 'Minuman';

export interface OptionItem {
  id: string;
  name: string;
  priceAdd: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: OptionItem[];
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imagePath: string;
  rating: number;
  cookTime: string;
  tags: string[];
  badges: string[];
  isFeatured: boolean;
  isSpecial: boolean;
  optionGroups: OptionGroup[];
  pairingDrinks?: string[];
}

export const menuItems: MenuItem[] = [
  {
    id: '1',
    slug: 'tinutuan-glow-up',
    name: 'Tinutuan Glow Up',
    category: 'Makanan Utama',
    price: 15000,
    description:
      'Bubur manado khas Minahasa yang dimasak dengan berbagai sayuran segar, jagung manis, dan labu kuning. Disajikan hangat dengan sambal roa khas Manado yang menggugah selera. Comfort food legendaris yang bikin nagih!',
    imagePath: '/images/menu/tinutuan-glow-up.jpg',
    rating: 4.9,
    cookTime: '10–15 Menit',
    tags: ['Bubur Manado', 'Sayuran Segar', 'Sambal Roa', 'Halal'],
    badges: ['Best Seller', 'Ciri Khas Minahasa'],
    isFeatured: true,
    isSpecial: false,
    pairingDrinks: ['saraba-warm-hug', 'es-kelapa-aren'],
    optionGroups: [
      {
        id: 'tgu-1',
        name: 'Tingkat Kepedasan Sambal',
        type: 'single',
        required: true,
        options: [
          { id: 'tgu-1-1', name: 'Sedang', priceAdd: 0 },
          { id: 'tgu-1-2', name: 'Pedas Gila 🔥🔥', priceAdd: 0 },
        ],
      },
      {
        id: 'tgu-2',
        name: 'Topping Tambahan',
        type: 'multiple',
        required: false,
        options: [
          { id: 'tgu-2-1', name: 'Sambal Roa Nyiur', priceAdd: 3000 },
          { id: 'tgu-2-2', name: 'Perkedel Jagung Crispy', priceAdd: 4000 },
          { id: 'tgu-2-3', name: 'Ikan Asin Jambal Goreng', priceAdd: 5000 },
        ],
      },
    ],
  },
  {
    id: '2',
    slug: 'ayam-woku',
    name: 'Ayam Woku Main Character',
    category: 'Rica-Rica & Sambal',
    price: 22000,
    description:
      'Ayam kampung pilihan dimasak dengan bumbu woku Manado yang kaya rempah — serai, daun pandan, kemangi, daun jeruk, dan cabai segar. Aromanya menggila, rasanya surga! Menu andalan yang selalu habis duluan.',
    imagePath: '/images/menu/ayam-woku.jpg',
    rating: 4.8,
    cookTime: '20–25 Menit',
    tags: ['Ayam Kampung', 'Bumbu Woku', 'Pedas', 'Rempah Khas Manado'],
    badges: ['Best Seller', 'Chef Recommended'],
    isFeatured: true,
    isSpecial: true,
    pairingDrinks: ['es-sirup-pala', 'es-kelapa-aren'],
    optionGroups: [
      {
        id: 'aw-1',
        name: 'Pilihan Potongan Ayam',
        type: 'single',
        required: true,
        options: [
          { id: 'aw-1-1', name: 'Paha Atas & Bawah', priceAdd: 0 },
          { id: 'aw-1-2', name: 'Dada Lembut', priceAdd: 0 },
          { id: 'aw-1-3', name: 'Sayap Komplit', priceAdd: 0 },
        ],
      },
      {
        id: 'aw-2',
        name: 'Tingkat Kepedasan Rica',
        type: 'single',
        required: true,
        options: [
          { id: 'aw-2-1', name: 'Sedang Gurih', priceAdd: 0 },
          { id: 'aw-2-2', name: 'Pedas Nendang Manado 🔥', priceAdd: 0 },
          { id: 'aw-2-3', name: 'Extra Rica Gila 🔥🔥🔥', priceAdd: 2000 },
        ],
      },
      {
        id: 'aw-3',
        name: 'Tambahan Pelengkap',
        type: 'multiple',
        required: false,
        options: [
          { id: 'aw-3-1', name: 'Nasi Putih Pulen', priceAdd: 0 },
          { id: 'aw-3-2', name: 'Sambal Dabu-Dabu', priceAdd: 0 },
          { id: 'aw-3-3', name: 'Ekstra Daun Kemangi', priceAdd: 0 },
          { id: 'aw-3-4', name: 'Perkedel Jagung', priceAdd: 0 },
        ],
      },
    ],
  },
  {
    id: '3',
    slug: 'cakalang-fufu',
    name: 'Cakalang Fufu No Counter',
    category: 'Makanan Utama',
    price: 22000,
    description:
      'Ikan cakalang asap tradisional khas Manado yang diolah dengan bumbu rica segar. Tekstur ikannya solid, aromanya smoky, rasanya bold dan berkarakter. Legend kuliner Manado yang wajib dicoba!',
    imagePath: '/images/menu/cakalang-fufu.jpg',
    rating: 4.7,
    cookTime: '15–20 Menit',
    tags: ['Ikan Cakalang', 'Asap Tradisional', 'Rica', 'Protein Tinggi'],
    badges: ['Ciri Khas Minahasa', 'Fan Favorite'],
    isFeatured: true,
    isSpecial: true,
    pairingDrinks: ['es-kelapa-aren', 'saraba-warm-hug'],
    optionGroups: [
      {
        id: 'cf-1',
        name: 'Gaya Masakan Rica',
        type: 'single',
        required: true,
        options: [
          { id: 'cf-1-1', name: 'Rica Saus Basah Pedas', priceAdd: 0 },
          { id: 'cf-1-2', name: 'Rica Kering Crispy Gurih', priceAdd: 0 },
        ],
      },
      {
        id: 'cf-2',
        name: 'Tingkat Kepedasan',
        type: 'single',
        required: true,
        options: [
          { id: 'cf-2-1', name: 'Sedang', priceAdd: 0 },
          { id: 'cf-2-2', name: 'Pedas Nendang 🔥', priceAdd: 0 },
          { id: 'cf-2-3', name: 'Extra Pedas 🔥🔥', priceAdd: 0 },
        ],
      },
      {
        id: 'cf-3',
        name: 'Tambahan',
        type: 'multiple',
        required: false,
        options: [
          { id: 'cf-3-1', name: 'Nasi Daun Pandan', priceAdd: 5000 },
          { id: 'cf-3-2', name: 'Lalapan Daun Pepaya & Singkong', priceAdd: 4000 },
          { id: 'cf-3-3', name: 'Bakwan Jagung/Milu Goreng', priceAdd: 4000 },
          { id: 'cf-3-4', name: 'Ekstra Lemon Cui', priceAdd: 1500 },
        ],
      },
    ],
  },
  {
    id: '4',
    slug: 'ragey-rizz',
    name: 'Ragey Rizz',
    category: 'Rica-Rica & Sambal',
    price: 25000,
    description:
      'Daging babi (pork belly) asap khas Minahasa yang dimasak dengan bumbu rica-rica dan rempah tradisional. Teksturnya kenyal smoky dengan cita rasa kuat yang autentik. Khusus untuk non-muslim.',
    imagePath: '/images/menu/ragey-rizz.jpg',
    rating: 4.6,
    cookTime: '20–30 Menit',
    tags: ['Daging Asap', 'Bumbu Rica', 'Non-Halal', 'Khas Minahasa'],
    badges: ['Signature Dish', 'Non-Halal'],
    isFeatured: false,
    isSpecial: true,
    pairingDrinks: ['es-sirup-pala'],
    optionGroups: [],
  },
  {
    id: '5',
    slug: 'panada-rizz',
    name: 'Panada Rizz',
    category: 'Camilan',
    price: 5000,
    description:
      'Kue gorengan khas Manado berbentuk setengah lingkaran dengan isian cakalang bumbu pedas yang melimpah. Kulitnya crispy di luar, lembut di dalam, isiannya juicy dan penuh cita rasa. Snack legendaris yang wajib dicoba!',
    imagePath: '/images/menu/panada-rizz.jpg',
    rating: 4.8,
    cookTime: '10–15 Menit',
    tags: ['Gorengan Khas', 'Cakalang', 'Renyah', 'Halal'],
    badges: ['Best Seller', 'Ciri Khas Minahasa'],
    isFeatured: true,
    isSpecial: false,
    pairingDrinks: ['es-kelapa-aren', 'saraba-warm-hug'],
    optionGroups: [
      {
        id: 'pr-1',
        name: 'Pilihan Paket',
        type: 'single',
        required: true,
        options: [
          { id: 'pr-1-1', name: 'Satuan 1 Pcs', priceAdd: 0 },
          { id: 'pr-1-2', name: 'Paket Bestie 3 Pcs', priceAdd: 9000 },
          { id: 'pr-1-3', name: 'Box Rame-Rame 6 Pcs', priceAdd: 22000 },
        ],
      },
      {
        id: 'pr-2',
        name: 'Kondisi Penyajian',
        type: 'single',
        required: false,
        options: [
          { id: 'pr-2-1', name: 'Goreng Hangat (Fresh)', priceAdd: 0 },
          { id: 'pr-2-2', name: 'Setengah Matang (Untuk Digoreng Sendiri)', priceAdd: 0 },
        ],
      },
      {
        id: 'pr-3',
        name: 'Cocolan Tambahan',
        type: 'multiple',
        required: false,
        options: [
          { id: 'pr-3-1', name: 'Sambal Dabu-Dabu', priceAdd: 0 },
          { id: 'pr-3-2', name: 'Mayonaise', priceAdd: 0 },
          { id: 'pr-3-3', name: 'Saus Tomat', priceAdd: 0 },
        ],
      },
    ],
  },
  {
    id: '6',
    slug: 'lalampa-lagi',
    name: 'Lalampa Lagi',
    category: 'Camilan',
    price: 6000,
    description:
      'Lemper khas Manado berbungkus daun pisang dengan isian cakalang bumbu rica yang gurih. Dikukus lembut lalu dibakar di atas bara — menghasilkan aroma daun pisang yang smoky dan rasa yang unforgettable.',
    imagePath: '/images/menu/lalampa-lagi.jpg',
    rating: 4.7,
    cookTime: '10–15 Menit',
    tags: ['Lemper Bakar', 'Daun Pisang', 'Cakalang', 'Halal'],
    badges: ['Ciri Khas Minahasa'],
    isFeatured: false,
    isSpecial: false,
    pairingDrinks: ['saraba-warm-hug'],
    optionGroups: [],
  },
  {
    id: '7',
    slug: 'brenebon-ice',
    name: 'Brenebon Ice Era',
    category: 'Minuman',
    price: 12000,
    description:
      'Es kacang merah khas Manado yang segar dan creamy. Diracik dari kacang merah pilihan yang dimasak lembut, disajikan dengan es serut lebat dan susu kental manis. Minuman penutup yang bikin adem dan kenyang!',
    imagePath: '/images/menu/brenebon-ice.jpg',
    rating: 4.9,
    cookTime: '5 Menit',
    tags: ['Es Kacang Merah', 'Minuman Dingin', 'Halal', 'Favorit Keluarga'],
    badges: ['Best Seller', 'Fan Favorite'],
    isFeatured: true,
    isSpecial: true,
    pairingDrinks: [],
    optionGroups: [
      {
        id: 'bi-1',
        name: 'Tingkat Manis & Es',
        type: 'single',
        required: true,
        options: [
          { id: 'bi-1-1', name: 'Normal', priceAdd: 0 },
          { id: 'bi-1-2', name: 'Less Sweet (Gula Aren)', priceAdd: 0 },
          { id: 'bi-1-3', name: 'Ekstra Es Serut', priceAdd: 0 },
        ],
      },
      {
        id: 'bi-2',
        name: 'Topping Tambahan',
        type: 'multiple',
        required: false,
        options: [
          { id: 'bi-2-1', name: 'Alpukat', priceAdd: 4000 },
          { id: 'bi-2-2', name: 'Kelapa Muda', priceAdd: 3000 },
          { id: 'bi-2-3', name: 'Ekstra Kacang Merah', priceAdd: 3000 },
          { id: 'bi-2-4', name: 'Susu Cokelat', priceAdd: 2000 },
        ],
      },
    ],
  },
  {
    id: '8',
    slug: 'saraba-warm-hug',
    name: 'Saraba Warm Hug',
    category: 'Minuman',
    price: 8000,
    description:
      'Minuman tradisional Manado berbahan dasar jahe, gula aren, santan, dan rempah-rempah pilihan. Sensasinya hangat, manis, dan spicy — seperti pelukan hangat di hari hujan. Obat alami untuk perut yang kedinginan!',
    imagePath: '/images/menu/saraba-warm-hug.jpg',
    rating: 4.8,
    cookTime: '5–8 Menit',
    tags: ['Minuman Jahe', 'Gula Aren', 'Rempah Tradisional', 'Halal'],
    badges: ['Ciri Khas Minahasa'],
    isFeatured: false,
    isSpecial: false,
    pairingDrinks: [],
    optionGroups: [],
  },
  {
    id: '9',
    slug: 'es-kelapa-aren',
    name: 'Es Kelapa Aren',
    category: 'Minuman',
    price: 10000,
    description:
      'Es kelapa muda segar dengan sirup gula aren asli Sulawesi. Daging kelapanya lembut dan segar, dikombinasikan dengan gula aren yang harum dan karamel. Minuman terlaris yang selalu bikin refresh!',
    imagePath: '/images/menu/es-kelapa-aren.jpg',
    rating: 4.9,
    cookTime: '5 Menit',
    tags: ['Kelapa Muda', 'Gula Aren', 'Segar', 'Halal'],
    badges: ['Best Seller'],
    isFeatured: true,
    isSpecial: false,
    pairingDrinks: [],
    optionGroups: [],
  },
  {
    id: '10',
    slug: 'es-sirup-pala',
    name: 'Es Sirup Pala',
    category: 'Minuman',
    price: 8000,
    description:
      'Minuman khas Manado berbahan sirup buah pala asli yang langka dan unik. Rasanya manis-segar dengan aroma pala yang khas dan exotics. Hanya ada di Manado — pengalaman rasa yang tidak akan terlupakan!',
    imagePath: '/images/menu/es-sirup-pala.jpg',
    rating: 4.6,
    cookTime: '5 Menit',
    tags: ['Sirup Pala', 'Eksotis', 'Khas Manado', 'Halal'],
    badges: ['Eksotis Manado'],
    isFeatured: false,
    isSpecial: true,
    pairingDrinks: [],
    optionGroups: [],
  },
];

export const categories: MenuCategory[] = [
  'Semua',
  'Makanan Utama',
  'Rica-Rica & Sambal',
  'Camilan',
  'Minuman',
];

export function getMenuBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  if (category === 'Semua') return menuItems;
  return menuItems.filter((item) => item.category === category);
}

export function getFeaturedMenus(): MenuItem[] {
  return menuItems.filter((item) => item.isFeatured);
}

export function getSpecialMenus(): MenuItem[] {
  return menuItems.filter((item) => item.isSpecial);
}
