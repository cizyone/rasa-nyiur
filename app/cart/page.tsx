'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trash2,
  Tag,
  Leaf,
  Check,
  X,
  ShoppingBag,
  MapPin,
  Pencil,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAddressStore } from '@/lib/address-store';
import { formatRupiah, PROMO_CODES } from '@/lib/utils';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import QuantitySelector from '@/components/ui/QuantitySelector';
import AddressModal from '@/components/ui/AddressModal';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    promoApplied,
    promoCode,
    promoDescription,
    ecoFriendlyCutlery,
    setEcoFriendlyCutlery,
    serviceFee,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isAddressOpen, setAddressOpen] = useState(false);

  const savedAddress = useAddressStore((s) => s.address);
  const hasGpsPoint = useAddressStore((s) => s.latitude !== null && s.longitude !== null);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();

  // Promo handlers
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Masukkan kode promo terlebih dahulu.');
      return;
    }
    const result = applyPromoCode(code);
    if (result.success) {
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError(result.message);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoError('');
    setPromoInput('');
  };

  // Build customization summary string
  const getCustomizationSummary = (item: (typeof items)[number]) => {
    const parts: string[] = [];
    if (item.customizations && item.customizations.length > 0) {
      item.customizations.forEach((c) => {
        c.selectedOptions.forEach((o) => parts.push(o.name));
      });
    }
    if (item.notes) parts.push(item.notes);
    return parts.length ? parts.join(', ') : null;
  };

  const hasItems = items.length > 0;

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label="Kembali">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-base text-gray-800">Keranjang Saya</h1>
      </header>

      {/* ── Body ── */}
      <main className="px-4 space-y-4 pt-4 pb-4">

        {/* 1. DELIVERY ADDRESS */}
        <section className="bg-white rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Alamat Pengantaran</p>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-snug whitespace-pre-line">
                {savedAddress}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {hasGpsPoint ? '📍 Titik GPS presisi tersimpan' : 'Alamat pengantaran'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddressOpen(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Edit alamat"
            >
              <Pencil size={15} className="text-gray-500" />
            </button>
          </div>
        </section>

        {/* 2. CART ITEMS */}
        <section>
          {!hasItems ? (
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 text-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700">Keranjang kamu kosong</p>
              <p className="text-xs text-gray-400">Yuk tambahkan makanan favoritmu!</p>
              <Link
                href="/menu"
                className="mt-1 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Lihat Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
                Item ({items.reduce((s, i) => s + i.quantity, 0)})
              </p>
              {items.map((item) => {
                const summary = getCustomizationSummary(item);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 flex gap-3 items-start"
                  >
                    {/* Image */}
                    <div className="shrink-0 rounded-xl overflow-hidden w-[60px] h-[60px]">
                      <ImageWithFallback
                        src={item.imagePath}
                        alt={item.name}
                        menuName={item.name}
                        width={60}
                        height={60}
                        className="object-cover w-full h-full"
                        fallbackClassName="w-[60px] h-[60px] rounded-xl"
                      />
                    </div>

                    {/* Info + quantity */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 leading-snug truncate">{item.name}</p>
                      {summary && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{summary}</p>
                      )}
                      <div className="mt-2">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                          onDecrease={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          size="sm"
                        />
                      </div>
                    </div>

                    {/* Price + delete */}
                    <div className="flex flex-col items-end justify-between h-full shrink-0 gap-2">
                      <p className="text-sm font-bold text-gray-800">
                        {formatRupiah(item.unitPrice * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. PROMO CODE */}
        <section className="bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-primary" />
            <p className="text-sm font-semibold text-gray-800">Kode Promo</p>
          </div>

          {promoApplied ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <Check size={15} className="text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-green-700">{promoCode}</span>
                <p className="text-[11px] text-green-600">{promoDescription}</p>
              </div>
              <button
                onClick={handleRemovePromo}
                className="ml-1 text-green-500 hover:text-green-700 transition-colors flex-shrink-0"
                aria-label="Hapus promo"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError('');
                  }}
                  placeholder="Masukkan kode promo"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Pakai
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-500 mt-1.5">{promoError}</p>
              )}
            </>
          )}
        </section>

        {/* 4. ECO CUTLERY */}
        <section className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-green-50 rounded-full shrink-0">
                <Leaf size={16} className="text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">🌿 Alat Makan Ramah Lingkungan</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Kurangi plastik sekali pakai demi bumi yang lebih baik.
                </p>
              </div>
            </div>

            {/* Custom toggle */}
            <button
              role="switch"
              aria-checked={ecoFriendlyCutlery}
              onClick={() => setEcoFriendlyCutlery(!ecoFriendlyCutlery)}
              className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                ecoFriendlyCutlery ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  ecoFriendlyCutlery ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 5. PAYMENT SUMMARY */}
        <section className="bg-white rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Ringkasan Pembayaran
          </p>
          <div className="space-y-2.5">
            <SummaryRow label="Subtotal" value={formatRupiah(subtotal)} />
            <SummaryRow label="Biaya Pengantaran" value={formatRupiah(deliveryFee)} />
            <SummaryRow label="Biaya Layanan & Kemasan" value={formatRupiah(serviceFee)} />
            {promoApplied && (
              <SummaryRow
                label={`Potongan Kupon (${promoCode})`}
                value={`-${formatRupiah(discount)}`}
                valueClass="text-secondary font-semibold"
              />
            )}
            <div className="border-t border-gray-100 pt-2.5">
              <SummaryRow
                label="Total"
                value={formatRupiah(total)}
                labelClass="font-bold text-gray-800 text-sm"
                valueClass="font-bold text-primary text-base"
              />
            </div>
          </div>
        </section>

        {/* Spacer before sticky bar */}
        <div className="h-32" />
      </main>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-3 z-30">
        <Link
          href={hasItems ? '/checkout' : '#'}
          aria-disabled={!hasItems}
          tabIndex={!hasItems ? -1 : undefined}
          className={`block w-full text-center py-3.5 rounded-2xl font-bold text-sm transition-opacity ${
            hasItems
              ? 'bg-primary text-white hover:opacity-90'
              : 'bg-gray-200 text-gray-400 pointer-events-none cursor-not-allowed'
          }`}
        >
          {hasItems
            ? `Lanjut ke Checkout · ${formatRupiah(total)}`
            : 'Keranjang Kosong'}
        </Link>
      </div>

      <AddressModal open={isAddressOpen} onClose={() => setAddressOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary Row helper
// ---------------------------------------------------------------------------

function SummaryRow({
  label,
  value,
  labelClass = 'text-sm text-gray-500',
  valueClass = 'text-sm text-gray-800',
}: {
  label: string;
  value: string;
  labelClass?: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
