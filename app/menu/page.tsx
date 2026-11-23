'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Star, Plus, SlidersHorizontal } from 'lucide-react';
import { menuItems, categories, type MenuItem, type MenuCategory } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import BottomNav from '@/components/layout/BottomNav';
import FloatingCartBar from '@/components/layout/FloatingCartBar';

type SortKey = 'popular' | 'price_asc' | 'price_desc' | 'rating';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Terlaris' },
  { key: 'price_asc', label: 'Harga Terendah' },
  { key: 'price_desc', label: 'Harga Tertinggi' },
  { key: 'rating', label: 'Rating' },
];

export default function MenuPage() {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'Semua'>('Semua');
  const [sortKey, setSortKey] = useState<SortKey>('popular');

  const filtered = useMemo(() => {
    let items: MenuItem[] = [...menuItems];

    // Filter by category
    if (activeCategory !== 'Semua') {
      items = items.filter((item) => item.category === activeCategory);
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortKey) {
      case 'price_asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'popular':
      default:
        // Featured items first, then by rating
        items.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (b.rating ?? 0) - (a.rating ?? 0);
        });
        break;
    }

    return items;
  }, [query, activeCategory, sortKey]);

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.optionGroups && item.optionGroups.length > 0) {
      router.push(`/menu/${item.slug}`);
    } else {
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
    }
  };

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 flex-1">Jelajahi Menu</h1>
          <SlidersHorizontal size={20} className="text-gray-500" />
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tinutuan, cakalang, panada..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort buttons */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                sortKey === opt.key
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🌴</span>
            <p className="text-gray-500 font-medium text-sm">Menu tidak ditemukan</p>
            <p className="text-xs text-neutral-400">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col active:scale-[0.98] transition-transform hover:shadow-card-hover"
              >
                {/* Image */}
                <div className="relative h-32 w-full bg-gradient-to-br from-[#EBF3EE] to-[#FEF8EC]">
                  <ImageWithFallback
                    src={item.imagePath}
                    alt={item.name}
                    fill
                    menuName={item.name}
                    className="object-cover"
                    fallbackClassName="absolute inset-0"
                  />
                  {item.badges.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge
                        label={item.badges[0]}
                        variant={
                          item.badges[0] === 'Best Seller'
                            ? 'tertiary'
                            : item.badges[0] === 'Non-Halal'
                            ? 'danger'
                            : 'dark'
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
                    {item.name}
                  </p>

                  {/* Rating + Cook time */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-700">{item.rating}</span>
                    {item.cookTime && (
                      <>
                        <span className="mx-0.5">·</span>
                        <span>{item.cookTime}</span>
                      </>
                    )}
                  </div>

                  {/* Price + Quick Add */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-sm font-bold text-primary">
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={(e) => handleQuickAdd(e, item)}
                      aria-label={`Tambah ${item.name}`}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform hover:bg-primary-600"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-32" />

      {/* Floating cart + bottom nav */}
      <FloatingCartBar />
      <BottomNav />
    </div>
  );
}
