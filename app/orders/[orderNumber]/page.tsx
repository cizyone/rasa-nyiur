'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, ChevronRight, Star, Clock, Truck, CheckCircle2, Package, ChefHat, ExternalLink } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import { getGoogleMapsUrl, getOsmEmbedUrl } from '@/lib/address-store';

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  total: number;
  items: OrderItem[];
  createdAt: string;
}

type OrderStatus = 'paid' | 'accepted' | 'preparing' | 'delivering' | 'completed';

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType; desc: string }[] = [
  { key: 'paid', label: 'Pembayaran Berhasil', icon: CheckCircle2, desc: 'Pesanan kamu sudah dikonfirmasi' },
  { key: 'accepted', label: 'Pesanan Diterima Resto', icon: Package, desc: 'Dapur Rasa Nyiur sudah menerima pesananmu' },
  { key: 'preparing', label: 'Sedang Disiapkan di Dapur', icon: ChefHat, desc: 'Chef kami sedang memasak dengan penuh cinta 🍳' },
  { key: 'delivering', label: 'Dalam Pengantaran', icon: Truck, desc: 'Kurir sedang menuju lokasimu' },
  { key: 'completed', label: 'Pesanan Selesai', icon: Star, desc: 'Selamat menikmati kuliner khas Manado! 🌴' },
];

const STATUS_ORDER: OrderStatus[] = ['paid', 'accepted', 'preparing', 'delivering', 'completed'];

function getStatusIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status);
}

export default function OrderStatusPage({ params }: { params: { orderNumber: string } }) {
  const { orderNumber } = params;
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('paid');
  const [simulatingProgress, setSimulatingProgress] = useState(false);

  useEffect(() => {
    // Load from sessionStorage first
    const stored = sessionStorage.getItem(`order-${orderNumber}`);
    let storedOrder: OrderData | null = null;
    if (stored) {
      try {
        storedOrder = JSON.parse(stored) as OrderData;
        setOrderData(storedOrder);
      } catch {
        // ignore
      }
    }

    // Try to load from Supabase
    const loadFromSupabase = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const isConfigured =
          supabaseUrl &&
          supabaseUrl !== 'your_supabase_project_url' &&
          supabaseUrl !== 'https://placeholder.supabase.co';

        if (!isConfigured) return;

        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('order_number', orderNumber)
          .single();

        if (data) {
          setCurrentStatus((data.status as OrderStatus) || 'paid');
          setOrderData({
            orderNumber: data.order_number,
            customerName: data.customer_name,
            phone: data.customer_phone,
            deliveryMethod: data.delivery_method,
            paymentMethod: data.payment_method,
            address: data.delivery_address || '',
            latitude: storedOrder?.latitude ?? null,
            longitude: storedOrder?.longitude ?? null,
            total: data.total,
            items: (data.order_items || []).map((i: { menu_item_name: string; quantity: number; unit_price: number }) => ({
              name: i.menu_item_name,
              quantity: i.quantity,
              unitPrice: i.unit_price,
            })),
            createdAt: data.created_at,
          });
        }
      } catch {
        // ignore Supabase errors
      }
    };

    loadFromSupabase();
  }, [orderNumber]);

  // Simulate status progression for demo
  const simulateProgress = async () => {
    if (simulatingProgress) return;
    setSimulatingProgress(true);
    const currentIndex = getStatusIndex(currentStatus);
    if (currentIndex < STATUS_ORDER.length - 1) {
      await new Promise((r) => setTimeout(r, 800));
      const nextStatus = STATUS_ORDER[currentIndex + 1];
      setCurrentStatus(nextStatus);

      // Update Supabase if configured
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const isConfigured =
          supabaseUrl &&
          supabaseUrl !== 'your_supabase_project_url' &&
          supabaseUrl !== 'https://placeholder.supabase.co';

        if (isConfigured) {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          await supabase.from('orders').update({ status: nextStatus }).eq('order_number', orderNumber);
        }
      } catch {
        // ignore
      }
    }
    setSimulatingProgress(false);
  };

  const currentStatusIndex = getStatusIndex(currentStatus);
  const isDelivery = orderData?.deliveryMethod === 'delivery';
  const gpsLatitude = orderData?.latitude;
  const gpsLongitude = orderData?.longitude;
  const hasGpsPoint = typeof gpsLatitude === 'number' && typeof gpsLongitude === 'number';
  const estimatedTime = '25 – 35 Menit';

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <Link href="/orders" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-gray-900 flex-1">Status Pesanan</h1>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          #{orderNumber}
        </span>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Success Banner */}
        <div className={`rounded-2xl p-5 text-center ${
          currentStatus === 'completed'
            ? 'bg-secondary/10 border border-secondary/30'
            : 'bg-primary/5 border border-primary/20'
        }`}>
          {currentStatus === 'completed' ? (
            <>
              <span className="text-4xl block mb-2">🎉</span>
              <h2 className="font-extrabold text-gray-900 text-lg">Pesanan Selesai!</h2>
              <p className="text-sm text-neutral-600 mt-1">Terima kasih sudah memesan di Rasa Nyiur 🌴</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={36} className="text-primary mx-auto mb-2" />
              <h2 className="font-extrabold text-gray-900 text-base">Pembayaran Berhasil! 🎉</h2>
              <p className="text-sm text-neutral-600 mt-1">Pesananmu sedang dalam proses</p>
            </>
          )}
        </div>

        {/* Estimate & Info */}
        {isDelivery && currentStatus !== 'completed' && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-tertiary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Estimasi Tiba</p>
                <p className="font-extrabold text-gray-900">{estimatedTime}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status Stepper */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <h2 className="font-bold text-gray-800 text-sm mb-4">Tracking Pesanan</h2>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, index) => {
              const isDone = index <= currentStatusIndex;
              const isActive = index === currentStatusIndex;
              const Icon = step.icon;
              const isLast = index === STATUS_STEPS.length - 1;

              return (
                <div key={step.key} className="flex gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isDone
                          ? isActive
                            ? 'bg-primary text-white ring-4 ring-primary/20'
                            : 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon size={15} strokeWidth={2} />
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-8 my-0.5 transition-all duration-500 ${
                          index < currentStatusIndex ? 'bg-primary' : 'bg-gray-100'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-4 flex-1 ${isLast ? 'pb-0' : ''}`}>
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        isDone ? 'text-gray-900' : 'text-gray-400'
                      } ${isActive ? 'text-primary font-bold' : ''}`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-xs text-neutral-500 mt-0.5 animate-fade-in">
                        {step.desc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simulate button for demo */}
          {currentStatus !== 'completed' && (
            <button
              onClick={simulateProgress}
              disabled={simulatingProgress}
              className="mt-4 w-full text-xs text-neutral-400 border border-dashed border-gray-200 py-2 rounded-xl hover:border-primary/40 hover:text-primary transition-colors"
            >
              {simulatingProgress ? '⏳ Memperbarui...' : '🔄 Simulasi Update Status (Demo)'}
            </button>
          )}
        </div>

        {/* Kitchen & Courier Info */}
        <div className="bg-white rounded-2xl p-4 shadow-card space-y-3">
          <h2 className="font-bold text-gray-800 text-sm">Informasi Dapur & Kurir</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <ChefHat size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Dapur</p>
              <p className="text-sm font-semibold text-gray-800">Dapur Rasa Nyiur – Tikala</p>
            </div>
          </div>
          {isDelivery && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Truck size={16} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Kurir</p>
                <p className="text-sm font-semibold text-gray-800">Karel Rompas · DB 4521 MN</p>
              </div>
              <a href="tel:+6281234567890" className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Phone size={14} className="text-secondary" />
              </a>
            </div>
          )}
        </div>

        {/* Map Placeholder / Peta GPS */}
        {isDelivery && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-card">
            {hasGpsPoint ? (
              <div className="relative h-40">
                <iframe
                  title="Lokasi pengantaran"
                  src={getOsmEmbedUrl(gpsLatitude, gpsLongitude)}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                <a
                  href={getGoogleMapsUrl(gpsLatitude, gpsLongitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-white/95 text-primary text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-sm hover:bg-white"
                >
                  Buka Google Maps
                  <ExternalLink size={11} />
                </a>
              </div>
            ) : (
              <div className="relative h-40 bg-gradient-to-br from-[#EBF3EE] via-[#D7E8DC] to-[#C3D7B3] flex flex-col items-center justify-center">
                {/* Manado map SVG placeholder */}
                <svg viewBox="0 0 320 160" className="absolute inset-0 w-full h-full opacity-30" fill="none">
                  {/* Road grid */}
                  <line x1="0" y1="80" x2="320" y2="80" stroke="#24583F" strokeWidth="2" strokeDasharray="8,4"/>
                  <line x1="160" y1="0" x2="160" y2="160" stroke="#24583F" strokeWidth="2" strokeDasharray="8,4"/>
                  <line x1="0" y1="40" x2="320" y2="40" stroke="#6F9B55" strokeWidth="1" strokeDasharray="4,6"/>
                  <line x1="0" y1="120" x2="320" y2="120" stroke="#6F9B55" strokeWidth="1" strokeDasharray="4,6"/>
                  <line x1="80" y1="0" x2="80" y2="160" stroke="#6F9B55" strokeWidth="1" strokeDasharray="4,6"/>
                  <line x1="240" y1="0" x2="240" y2="160" stroke="#6F9B55" strokeWidth="1" strokeDasharray="4,6"/>
                  {/* Blocks */}
                  <rect x="20" y="10" width="40" height="20" rx="4" fill="#24583F" opacity="0.3"/>
                  <rect x="90" y="50" width="50" height="15" rx="4" fill="#6F9B55" opacity="0.3"/>
                  <rect x="170" y="90" width="60" height="20" rx="4" fill="#24583F" opacity="0.3"/>
                  <rect x="250" y="30" width="45" height="25" rx="4" fill="#6F9B55" opacity="0.3"/>
                </svg>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg mb-1 animate-bounce">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <p className="text-xs font-bold text-primary bg-white/80 px-3 py-1 rounded-full shadow-sm">
                    {orderData?.address?.split(',')[0] || 'Manado'}
                  </p>
                </div>
              </div>
            )}
            <div className="p-3">
              <p className="text-xs text-neutral-500 font-medium">
                📍 Alamat Pengantaran{hasGpsPoint ? ' · titik GPS presisi' : ''}
              </p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {orderData?.address || 'Tikala, Manado – Jl. Sam Ratulangi No. 42'}
              </p>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {orderData && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h2 className="font-bold text-gray-800 text-sm mb-3">Ringkasan Pesanan</h2>
            <div className="space-y-2 mb-3">
              {orderData.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.quantity}× {item.name}</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-extrabold text-primary">{formatRupiah(orderData.total)}</span>
            </div>
            {orderData.createdAt && (
              <p className="text-xs text-neutral-400 mt-2">
                {formatDate(new Date(orderData.createdAt))}
              </p>
            )}
          </div>
        )}

        {/* CTA: Rate & Order Again */}
        {currentStatus === 'completed' && (
          <div className="space-y-3">
            <button className="w-full bg-tertiary text-primary font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-tertiary-600 transition-all active:scale-95">
              <Star size={16} />
              Beri Rating Pesanan
            </button>
            <Link
              href="/menu"
              className="w-full border-2 border-primary text-primary font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              Pesan Lagi
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
