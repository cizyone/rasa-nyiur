'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Bike,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Banknote,
  User,
  Phone,
  FileText,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useAddressStore } from '@/lib/address-store';
import { formatRupiah, generateOrderNumber } from '@/lib/utils';

type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'qris' | 'transfer' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getDiscount, getTotal, serviceFee, promoCode, clearCart } =
    useCartStore();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const savedAddress = useAddressStore((s) => s.address);
  const setSavedAddress = useAddressStore((s) => s.setAddress);
  const [address, setAddress] = useState(savedAddress);
  const [landmark, setLandmark] = useState('');
  const [courierNotes, setCourierNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambil alamat tersimpan setelah store selesai hidrasi dari localStorage.
  useEffect(() => {
    setAddress(savedAddress);
  }, [savedAddress]);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!name.trim() || !phone.trim()) {
      setError('Nama dan nomor WhatsApp wajib diisi.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      setError('Alamat pengantaran wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    // Simpan alamat agar otomatis terpakai pada pesanan berikutnya.
    if (deliveryMethod === 'delivery') {
      setSavedAddress(address);
    }

    const orderNumber = generateOrderNumber();

    try {
      // Try to save to Supabase if configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isSupabaseConfigured = supabaseUrl && supabaseUrl !== 'your_supabase_project_url';

      if (isSupabaseConfigured) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_name: name,
            customer_phone: phone,
            delivery_address: deliveryMethod === 'delivery' ? `${address}${landmark ? ` (Patokan: ${landmark})` : ''}` : 'Ambil Sendiri',
            delivery_method: deliveryMethod,
            payment_method: paymentMethod,
            promo_code: promoCode || null,
            discount_amount: discount,
            subtotal,
            delivery_fee: deliveryFee,
            service_fee: serviceFee,
            total,
            status: 'pending',
            notes: courierNotes,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (order) {
          await supabase.from('order_items').insert(
            items.map((item) => ({
              order_id: order.id,
              menu_item_id: item.menuItemId,
              menu_item_name: item.name,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              customizations: item.customizations,
              notes: item.notes,
              subtotal: item.unitPrice * item.quantity,
            }))
          );
        }
      }

      // Store order data in sessionStorage for payment page
      sessionStorage.setItem(
        `order-${orderNumber}`,
        JSON.stringify({
          orderNumber,
          customerName: name,
          phone,
          deliveryMethod,
          paymentMethod,
          address: deliveryMethod === 'delivery' ? address : 'Ambil Sendiri',
          total,
          subtotal,
          deliveryFee,
          discount,
          promoCode,
          items: items.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          createdAt: new Date().toISOString(),
        })
      );

      clearCart();

      if (paymentMethod === 'qris') {
        router.push(`/checkout/payment/${orderNumber}`);
      } else {
        router.push(`/orders/${orderNumber}`);
      }
    } catch (err) {
      console.error('Order error:', err);
      // Even if Supabase fails, proceed with local order
      const orderNumber2 = generateOrderNumber();
      sessionStorage.setItem(
        `order-${orderNumber2}`,
        JSON.stringify({
          orderNumber: orderNumber2,
          customerName: name,
          phone,
          deliveryMethod,
          paymentMethod,
          address: deliveryMethod === 'delivery' ? address : 'Ambil Sendiri',
          total,
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice })),
          createdAt: new Date().toISOString(),
        })
      );
      clearCart();
      if (paymentMethod === 'qris') {
        router.push(`/checkout/payment/${orderNumber2}`);
      } else {
        router.push(`/orders/${orderNumber2}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="app-container bg-[#F5F6F5] flex flex-col">
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <Link href="/cart" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="font-bold text-gray-900">Konfirmasi Pesanan</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <ShoppingBag size={48} className="text-gray-200 mb-4" />
          <p className="font-semibold text-gray-600 mb-2">Keranjang kamu kosong</p>
          <Link href="/menu" className="text-primary font-semibold text-sm">Jelajahi Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container bg-[#F5F6F5]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <Link href="/cart" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-gray-900 flex-1">Konfirmasi Pesanan</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="px-4 pt-4 space-y-3">

          {/* Delivery Method Toggle */}
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h2 className="font-bold text-gray-800 text-sm mb-3">Metode Penerimaan</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'delivery' as const, label: 'Antar ke Alamat', icon: Bike },
                { value: 'pickup' as const, label: 'Ambil Sendiri', icon: ShoppingBag },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeliveryMethod(value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150 ${
                    deliveryMethod === value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <Icon size={22} className={deliveryMethod === value ? 'text-primary' : 'text-gray-400'} />
                  <span
                    className={`text-xs font-semibold ${
                      deliveryMethod === value ? 'text-primary' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Data */}
          <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
            <h2 className="font-bold text-gray-800 text-sm">Data Penerima</h2>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Nama Penerima"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="tel"
                placeholder="Nomor WhatsApp (contoh: 0812xxxxxxxx)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-10"
                required
              />
            </div>
            {deliveryMethod === 'delivery' && (
              <>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  <textarea
                    placeholder="Alamat Lengkap di Manado"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="input-field pl-10 resize-none"
                    required
                  />
                </div>
                <div className="relative">
                  <FileText size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  <textarea
                    placeholder="Patokan lokasi (opsional, contoh: Depan Indomaret)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    rows={2}
                    className="input-field pl-10 resize-none"
                  />
                </div>
              </>
            )}
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
              <textarea
                placeholder="Catatan untuk kurir (opsional)"
                value={courierNotes}
                onChange={(e) => setCourierNotes(e.target.value)}
                rows={2}
                className="input-field pl-10 resize-none"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h2 className="font-bold text-gray-800 text-sm mb-3">Ringkasan Pesanan</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1 min-w-0 mr-2">
                    <span className="font-medium text-gray-700">{item.quantity}x {item.name}</span>
                    {item.customizations.length > 0 && (
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {item.customizations.flatMap((c) => c.selectedOptions.map((o) => o.name)).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-800 flex-shrink-0">{formatRupiah(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h2 className="font-bold text-gray-800 text-sm mb-3">Metode Pembayaran</h2>
            <div className="space-y-2">
              {[
                { value: 'qris' as const, label: 'QRIS Instant', desc: 'Scan QR, bayar mudah', icon: Smartphone },
                { value: 'transfer' as const, label: 'Transfer Bank (Virtual Account)', desc: 'BCA, Mandiri, BNI, BRI', icon: CreditCard },
                { value: 'cod' as const, label: 'Tunai (COD)', desc: 'Bayar saat pesanan tiba', icon: Banknote },
              ].map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 ${
                    paymentMethod === value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === value ? 'bg-primary' : 'bg-gray-100'}`}>
                    <Icon size={18} className={paymentMethod === value ? 'text-white' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${paymentMethod === value ? 'text-primary' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-xs text-neutral-500">{desc}</p>
                  </div>
                  {paymentMethod === value && (
                    <Check size={16} className="text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h2 className="font-bold text-gray-800 text-sm mb-3">Rincian Pembayaran</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal ({items.length} menu)</span>
                <span className="font-medium">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Biaya Pengantaran</span>
                <span className={`font-medium ${deliveryFee === 0 ? 'text-secondary font-semibold' : ''}`}>
                  {deliveryFee === 0 ? 'GRATIS 🎉' : formatRupiah(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Biaya Layanan & Kemasan</span>
                <span className="font-medium">{formatRupiah(serviceFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Potongan Kupon</span>
                  <span className="font-semibold text-secondary">-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Pembayaran</span>
                <span className="font-extrabold text-primary text-base">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="h-28" />
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-600">Total</span>
            <span className="font-extrabold text-primary text-lg">{formatRupiah(total)}</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl transition-all duration-150 hover:bg-primary-600 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                Buat Pesanan Sekarang
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
