'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Clock,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  ChevronRight,
  Check,
} from 'lucide-react';
import { getMenuBySlug, menuItems, type OptionGroup, type OptionItem } from '@/lib/data';
import { useCartStore, type CartItemCustomization } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import Badge from '@/components/ui/Badge';
import FloatingCartBar from '@/components/layout/FloatingCartBar';

function OptionSelector({
  group,
  selectedOptions,
  onToggle,
}: {
  group: OptionGroup;
  selectedOptions: Map<string, OptionItem[]>;
  onToggle: (groupId: string, option: OptionItem, type: 'single' | 'multiple') => void;
}) {
  const selected = selectedOptions.get(group.id) || [];

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="font-bold text-gray-800 text-sm">{group.name}</h3>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            group.required
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-100 text-neutral-500'
          }`}
        >
          {group.required ? 'Wajib' : 'Opsional'}
        </span>
      </div>
      <div className="space-y-2">
        {group.options.map((option) => {
          const isSelected = selected.some((s) => s.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => onToggle(group.id, option, group.type)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-150 active:scale-[0.98] ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check size={11} strokeWidth={3} className="text-white" />}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                  {option.name}
                </span>
              </div>
              {option.priceAdd > 0 && (
                <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-neutral-500'}`}>
                  +{formatRupiah(option.priceAdd)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MenuDetailPage({ params }: { params: { slug: string } }) {
  const item = getMenuBySlug(params.slug);

  if (!item) {
    notFound();
  }

  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Map<string, OptionItem[]>>(new Map());
  const [addedSuccess, setAddedSuccess] = useState(false);

  const toggleOption = (groupId: string, option: OptionItem, type: 'single' | 'multiple') => {
    setSelectedOptions((prev) => {
      const newMap = new Map(prev);
      if (type === 'single') {
        newMap.set(groupId, [option]);
      } else {
        const current = newMap.get(groupId) || [];
        const exists = current.some((o) => o.id === option.id);
        if (exists) {
          newMap.set(groupId, current.filter((o) => o.id !== option.id));
        } else {
          newMap.set(groupId, [...current, option]);
        }
      }
      return newMap;
    });
  };

  const customizationPrice = Array.from(selectedOptions.values())
    .flat()
    .reduce((sum, opt) => sum + opt.priceAdd, 0);

  const unitPrice = item.price + customizationPrice;
  const totalPrice = unitPrice * quantity;

  const isValid = item.optionGroups
    .filter((g) => g.required)
    .every((g) => (selectedOptions.get(g.id) || []).length > 0);

  const handleAddToCart = () => {
    if (!isValid) return;

    const customizations: CartItemCustomization[] = item.optionGroups
      .filter((g) => (selectedOptions.get(g.id) || []).length > 0)
      .map((g) => ({
        groupId: g.id,
        groupName: g.name,
        selectedOptions: selectedOptions.get(g.id) || [],
      }));

    addItem({
      menuItemId: item.id,
      slug: item.slug,
      name: item.name,
      imagePath: item.imagePath,
      basePrice: item.price,
      customizations,
      customizationPrice,
      unitPrice,
      quantity,
      notes,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const pairingDrinks = menuItems.filter(
    (m) => item.pairingDrinks?.includes(m.slug)
  );

  return (
    <div className="app-container bg-[#F5F6F5]">
      {/* Hero Image */}
      <div className="relative h-72 bg-gradient-to-br from-[#EBF3EE] to-[#FEF8EC]">
        <ImageWithFallback
          src={item.imagePath}
          alt={item.name}
          fill
          menuName={item.name}
          className="object-cover"
          fallbackClassName="absolute inset-0"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Link
            href="/menu"
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </Link>
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
          <Star size={13} className="fill-tertiary text-tertiary" />
          <span className="text-sm font-bold text-gray-800">{item.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-4 relative z-10">
        <div className="px-4 pt-5 pb-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.badges.map((badge) => (
              <Badge
                key={badge}
                label={badge}
                variant={
                  badge === 'Best Seller'
                    ? 'tertiary'
                    : badge === 'Non-Halal'
                    ? 'danger'
                    : badge === 'Chef Recommended'
                    ? 'secondary'
                    : 'primary'
                }
              />
            ))}
          </div>

          {/* Name & Price */}
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">{item.name}</h1>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-extrabold text-primary">{formatRupiah(item.price)}</span>
            {customizationPrice > 0 && (
              <span className="text-sm text-neutral-500 font-medium">
                + {formatRupiah(customizationPrice)} kustomisasi
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-tertiary text-tertiary" />
              <span className="font-semibold text-gray-700">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{item.cookTime}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
        </div>
      </div>

      {/* Customization Options */}
      {item.optionGroups.length > 0 && (
        <div className="bg-white mt-2 px-4 py-5">
          <h2 className="font-extrabold text-gray-900 mb-4">Kustomisasi Pesanan</h2>
          {item.optionGroups.map((group) => (
            <OptionSelector
              key={group.id}
              group={group}
              selectedOptions={selectedOptions}
              onToggle={toggleOption}
            />
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="bg-white mt-2 px-4 py-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} className="text-primary" />
          <h2 className="font-bold text-gray-900 text-sm">Catatan untuk Penjual</h2>
        </div>
        <textarea
          placeholder="Contoh: Tolong jangan terlalu pedas, alergi udang, dll."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input-field resize-none text-sm"
        />
      </div>

      {/* Pairing Drinks */}
      {pairingDrinks.length > 0 && (
        <div className="bg-white mt-2 px-4 py-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm">🧋 Minuman Pendamping Segar</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            {pairingDrinks.map((drink) => (
              <Link key={drink.id} href={`/menu/${drink.slug}`} className="block flex-shrink-0 w-28">
                <div className="bg-gradient-to-br from-[#EBF3EE] to-[#FEF8EC] rounded-xl h-20 relative overflow-hidden mb-2">
                  <ImageWithFallback
                    src={drink.imagePath}
                    alt={drink.name}
                    fill
                    menuName={drink.name}
                    className="object-cover"
                    fallbackClassName="absolute inset-0"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-tight line-clamp-2">{drink.name}</p>
                <p className="text-xs text-primary font-bold mt-0.5">{formatRupiah(drink.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-36" />

      {/* Sticky Bottom - Quantity + Add to Cart */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4 z-50">
        {!isValid && item.optionGroups.some((g) => g.required) && (
          <p className="text-xs text-amber-600 font-medium text-center mb-2">
            ⚠️ Pilih opsi yang wajib terlebih dahulu
          </p>
        )}
        <div className="flex items-center gap-3">
          {/* Quantity */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="font-bold text-gray-800 w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(20, quantity + 1))}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-600 transition-all active:scale-90"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isValid}
            className={`flex-1 flex items-center justify-between gap-2 rounded-2xl px-4 py-3 transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              addedSuccess ? 'bg-secondary' : 'bg-primary hover:bg-primary-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {addedSuccess ? (
                <Check size={16} strokeWidth={2.5} className="text-white" />
              ) : (
                <ShoppingBag size={16} className="text-white" />
              )}
              <span className="text-white font-bold text-sm">
                {addedSuccess ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
              </span>
            </div>
            <span className="text-white font-bold text-sm">{formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>

      <FloatingCartBar />
    </div>
  );
}
