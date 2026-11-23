'use client';

import { useState } from 'react';
import { Search, Star, Plus, Tag, ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { menuItems, categories, type MenuCategory } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FloatingCartBar from '@/components/layout/FloatingCartBar';

function QuickAddButton({ item }: { item: (typeof menuItems)[0] }) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.optionGroups.length > 0) {
      window.location.href = `/menu/${item.slug}`;
      return;
    }

    addItem({
      menuItemId: item.id,
      slug: item.slug,
      name: item.name,
      imagePath: item.imagePath,
      basePrice: item.price,
      customizations: [],
      customizationPrice: 0,
      unitPrice: item.price,
      quantity: 1,
      notes: '',
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 flex-shrink-0 ${
        added
          ? 'bg-secondary text-white scale-110'
          : 'bg-primary text-white hover:bg-primary-600'
      }`}
    >
      <Plus size={16} strokeWidth={2.5} />
    </button>
  );
}

function MenuCard({ item, horizontal = false }: { item: (typeof menuItems)[0]; horizontal?: boolean }) {
  if (horizontal) {
    return (
      <Link href={`/menu/${item.slug}`} className="block">
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 overflow-hidden flex gap-3 p-3">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={item.imagePath}
              alt={item.name}
              fill
              menuName={item.name}
              className="object-cover"
              fallbackClassName="w-20 h-20 rounded-xl"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-1 mb-1">
                {item.badges.slice(0, 1).map((badge) => (
                  <Badge
                    key={badge}
                    label={badge}
                    variant={badge === 'Best Seller' ? 'tertiary' : badge === 'Non-Halal' ? 'danger' : 'primary'}
                  />
                ))}
              </div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">{item.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="fill-tertiary text-tertiary" />
                <span className="text-[11px] text-neutral-500 font-medium">{item.rating} · {item.cookTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-primary text-sm">{formatRupiah(item.price)}</span>
              <QuickAddButton item={item} />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/menu/${item.slug}`} className="block">
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
        <div className="relative h-36 bg-gradient-to-br from-[#EBF3EE] to-[#FEF8EC]">
          <ImageWithFallback
            src={item.imagePath}
            alt={item.name}
            fill
            menuName={item.name}
            className="object-cover"
            fallbackClassName="absolute inset-0"
            priority={item.isFeatured}
          />
          {item.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              <Badge
                label={item.badges[0]}
                variant={item.badges[0] === 'Best Seller' ? 'tertiary' : item.badges[0] === 'Non-Halal' ? 'danger' : 'dark'}
              />
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">{item.name}</h3>
          <div className="flex items-center gap-1 mt-0.5 mb-2">
            <Star size={11} className="fill-tertiary text-tertiary" />
            <span className="text-[11px] text-neutral-500">{item.rating} · {item.cookTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-sm">{formatRupiah(item.price)}</span>
            <QuickAddButton item={item} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredMenus = menuItems.filter((m) => m.isFeatured);
  const specialMenus = menuItems.filter((m) => m.isSpecial);

  const filteredMenus = menuItems.filter((item) => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const displayMenus = searchQuery || activeCategory !== 'Semua' ? filteredMenus : null;

  return (
    <div className="app-container">
      <Header />

      {/* Greeting & Search */}
      <div className="px-4 pt-2 pb-3 bg-white">
        <h1 className="text-xl font-extrabold text-gray-900 mb-3">
          Halo, Foodies! 👋
        </h1>
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari tinutuan, cakalang, panada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-4 pt-4">
        <div className="relative bg-primary rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #6F9B55 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F2B84B 0%, transparent 50%)`,
            }}
          />
          <div className="relative p-5">
            <div className="inline-flex items-center gap-1.5 bg-tertiary/20 text-tertiary text-[11px] font-bold px-2.5 py-1 rounded-full mb-2 border border-tertiary/30">
              🎉 SPESIAL PENGGUNA BARU
            </div>
            <h2 className="text-white font-extrabold text-lg leading-snug mb-1">
              DISKON 20%<br />
              <span className="text-tertiary">Spesial Pengguna Baru</span>
            </h2>
            <p className="text-white/70 text-xs leading-relaxed mb-4 max-w-[180px]">
              Lagi laper? Jangan cuma scroll, gas ke Rasa Nyiur! 🌴
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-tertiary text-primary font-bold text-sm rounded-xl px-4 py-2.5 hover:bg-tertiary-600 transition-all active:scale-95"
            >
              Pesan Sekarang
              <ChevronRight size={15} />
            </Link>
          </div>
          {/* Decorative palm */}
          <div className="absolute right-4 top-0 bottom-0 flex items-center opacity-30">
            <svg width="90" height="120" viewBox="0 0 90 120" fill="none">
              <ellipse cx="45" cy="100" rx="20" ry="8" fill="#6F9B55" opacity="0.5"/>
              <line x1="45" y1="100" x2="45" y2="20" stroke="#6F9B55" strokeWidth="4" strokeLinecap="round"/>
              <path d="M45 20 Q20 10 10 25 Q25 20 45 35" fill="#6F9B55"/>
              <path d="M45 25 Q70 10 80 28 Q65 22 45 38" fill="#F2B84B" opacity="0.7"/>
              <path d="M45 35 Q15 30 8 50 Q28 38 45 50" fill="#6F9B55" opacity="0.8"/>
              <path d="M45 38 Q75 32 83 52 Q63 40 45 52" fill="#6F9B55"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mt-5 px-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-gray-100 hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search/Filter Results */}
      {displayMenus && (
        <div className="px-4 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">
              <Search size={16} className="text-primary" />
              Hasil Pencarian ({displayMenus.length})
            </h2>
          </div>
          {displayMenus.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <span className="text-4xl mb-3 block">🌴</span>
              <p className="font-semibold text-gray-700">Menu tidak ditemukan</p>
              <p className="text-sm text-neutral-500 mt-1">Coba kata kunci lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayMenus.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Featured Menus - only show when no search/filter */}
      {!displayMenus && (
        <>
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">
                <Flame size={16} className="text-red-500" />
                Menu yang Lagi Hits
              </h2>
              <Link href="/menu" className="text-primary text-xs font-semibold hover:underline flex items-center gap-0.5">
                Lihat Semua <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredMenus.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Promo Banners */}
          <div className="px-4 mt-5">
            <h2 className="section-title mb-3">
              <Tag size={16} className="text-tertiary" />
              Promo Spesial
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🛵</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-lg">NYIURMANIS</code>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Gratis ongkir se-Kota Manado!</p>
                  <p className="text-[11px] text-neutral-500">Berlaku untuk semua area Manado</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-tertiary/10 to-tertiary/5 border border-tertiary/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <code className="bg-tertiary text-primary text-xs font-bold px-2 py-0.5 rounded-lg">NYIURHEMAT</code>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">Diskon Rp10.000 untuk pesananmu!</p>
                  <p className="text-[11px] text-neutral-500">Min. pesanan Rp30.000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Today */}
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">
                <span className="text-base">⭐</span>
                Pilihan Spesial Hari Ini
              </h2>
              <Link href="/menu" className="text-primary text-xs font-semibold hover:underline flex items-center gap-0.5">
                Lihat Semua <ChevronRight size={13} />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {specialMenus.map((item) => (
                <MenuCard key={item.id} item={item} horizontal />
              ))}
            </div>
          </div>

          {/* Footer spacer */}
          <div className="h-6" />
        </>
      )}

      {/* Bottom spacing for nav + floating cart */}
      <div className="h-32" />

      <FloatingCartBar />
      <BottomNav />
    </div>
  );
}
