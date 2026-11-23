'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { formatRupiah } from '@/lib/utils';

export default function FloatingCartBar() {
  const { items, getTotalItems, getTotal } = useCartStore();
  const totalItems = getTotalItems();
  const total = getTotal();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-30 pb-2">
      <Link href="/cart">
        <div className="bg-primary text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-floating hover:bg-primary-600 active:scale-98 transition-all duration-150">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl w-9 h-9 flex items-center justify-center relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-tertiary text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </div>
            <div>
              <p className="text-[11px] text-white/80 font-medium">{totalItems} item dalam keranjang</p>
              <p className="text-xs text-white/60 font-medium">{items.length} menu dipilih</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{formatRupiah(total)}</p>
            <p className="text-[10px] text-white/70">Lihat Keranjang →</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
