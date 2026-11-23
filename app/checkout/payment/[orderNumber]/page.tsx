'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Download,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface OrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: string;
  address: string;
  total: number;
  subtotal: number;
  items: { name: string; quantity: number; unitPrice: number }[];
  createdAt: string;
}

const PAYMENT_DURATION = 15 * 60; // 15 minutes in seconds

export default function PaymentPage({ params }: { params: { orderNumber: string } }) {
  const router = useRouter();
  const { orderNumber } = params;

  const [timeLeft, setTimeLeft] = useState(PAYMENT_DURATION);
  const [checking, setChecking] = useState(false);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Load order from sessionStorage
    const stored = sessionStorage.getItem(`order-${orderNumber}`);
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, [orderNumber]);

  useEffect(() => {
    if (paid || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paid, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCheckPayment = useCallback(async () => {
    setChecking(true);
    // Simulate payment check (in real app, call Supabase to update status)
    await new Promise((r) => setTimeout(r, 1500));

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isConfigured =
        supabaseUrl &&
        supabaseUrl !== 'your_supabase_project_url' &&
        supabaseUrl !== 'https://placeholder.supabase.co';

      if (isConfigured) {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        await supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('order_number', orderNumber);
      }
    } catch {
      // ignore Supabase errors
    }

    setPaid(true);
    setChecking(false);

    // Redirect to order tracking after short delay
    setTimeout(() => {
      router.push(`/orders/${orderNumber}`);
    }, 2000);
  }, [orderNumber, router]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(`#${orderNumber}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalAmount = orderData?.total ?? 0;
  const isExpired = timeLeft === 0 && !paid;

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-gray-900 flex-1">Pembayaran QRIS</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">

        {/* Success State */}
        {paid && (
          <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-5 text-center animate-fade-in">
            <CheckCircle2 size={48} className="text-secondary mx-auto mb-3" />
            <h2 className="font-extrabold text-gray-900 text-lg mb-1">Pembayaran Berhasil! 🎉</h2>
            <p className="text-sm text-neutral-600">Pesananmu sedang diproses oleh dapur</p>
            <p className="text-xs text-neutral-400 mt-2">Mengalihkan ke halaman status pesanan...</p>
          </div>
        )}

        {/* Expired State */}
        {isExpired && !paid && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <Clock size={40} className="text-red-400 mx-auto mb-3" />
            <h2 className="font-bold text-red-700 mb-1">Waktu Pembayaran Habis</h2>
            <p className="text-sm text-red-600 mb-4">Silakan buat pesanan baru</p>
            <Link href="/menu" className="btn-primary text-sm px-6 py-2.5 inline-block">
              Pesan Lagi
            </Link>
          </div>
        )}

        {/* Timer & QR — only show when active */}
        {!paid && !isExpired && (
          <>
            {/* Timer */}
            <div className="bg-white rounded-2xl p-4 shadow-card text-center">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                Selesaikan Pembayaran Dalam
              </p>
              <div
                className={`text-4xl font-extrabold tabular-nums ${
                  timeLeft < 60 ? 'text-red-500' : 'text-primary'
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / PAYMENT_DURATION) * 100}%` }}
                />
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-800 text-sm">Detail Transaksi</h2>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">No. Transaksi</span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="flex items-center gap-1.5 font-bold text-primary text-sm hover:opacity-70 transition-opacity"
                  >
                    #{orderNumber}
                    {copied ? (
                      <Check size={13} className="text-secondary" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Total Tagihan</span>
                  <span className="font-extrabold text-primary text-base">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-600">Metode</span>
                  <span className="font-semibold text-gray-800 text-sm">QRIS</span>
                </div>
              </div>
            </div>

            {/* QRIS Display */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="text-center mb-4">
                <h2 className="font-bold text-gray-900">Scan QR Code</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Gunakan aplikasi m-Banking, GoPay, OVO, Dana, atau ShopeePay
                </p>
              </div>

              {/* QR Code Mockup */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-56 h-56 bg-white border-4 border-primary rounded-2xl p-3 shadow-md">
                    {/* QR Pattern (SVG mockup) */}
                    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Corner squares */}
                      <rect x="10" y="10" width="55" height="55" fill="#24583F" rx="4"/>
                      <rect x="20" y="20" width="35" height="35" fill="white" rx="2"/>
                      <rect x="27" y="27" width="21" height="21" fill="#24583F" rx="2"/>

                      <rect x="135" y="10" width="55" height="55" fill="#24583F" rx="4"/>
                      <rect x="145" y="20" width="35" height="35" fill="white" rx="2"/>
                      <rect x="152" y="27" width="21" height="21" fill="#24583F" rx="2"/>

                      <rect x="10" y="135" width="55" height="55" fill="#24583F" rx="4"/>
                      <rect x="20" y="145" width="35" height="35" fill="white" rx="2"/>
                      <rect x="27" y="152" width="21" height="21" fill="#24583F" rx="2"/>

                      {/* Data modules (pattern) */}
                      {[80,90,100,110,120].map((x) =>
                        [10,20,30,40,50].map((y) => (
                          Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#24583F" rx="1"/> : null
                        ))
                      )}
                      {[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((x) =>
                        [80,90,100,110,120,130,140,150,160,170,180].map((y) => (
                          (x + y) % 20 === 0 ? <rect key={`d-${x}-${y}`} x={x} y={y} width="7" height="7" fill="#24583F" rx="1"/> : null
                        ))
                      )}

                      {/* Center logo */}
                      <rect x="82" y="82" width="36" height="36" fill="white" rx="4"/>
                      <text x="100" y="98" textAnchor="middle" fontSize="10" fill="#24583F" fontWeight="bold">🌴</text>
                      <text x="100" y="111" textAnchor="middle" fontSize="6" fill="#24583F" fontWeight="bold">RN</text>
                    </svg>
                  </div>
                  {/* Shimmer overlay if recently paid */}
                </div>
              </div>

              <div className="text-center">
                <p className="font-bold text-gray-900 text-sm">Rasa Nyiur – Dapur Tikala</p>
                <p className="text-xs text-neutral-500">NMID: ID1026110000{orderNumber.slice(-4)}</p>
              </div>

              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors active:scale-95">
                <Download size={15} />
                Unduh QR Code
              </button>
            </div>

            {/* Payment Guide */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-bold text-gray-800 text-sm mb-3">📱 Cara Bayar QRIS</h3>
              <ol className="space-y-2.5">
                {[
                  'Buka aplikasi m-Banking, GoPay, OVO, Dana, atau ShopeePay',
                  'Pilih menu "Bayar" atau "Scan QR"',
                  'Arahkan kamera ke QR Code di atas',
                  'Periksa nama merchant: Rasa Nyiur – Dapur Tikala',
                  'Konfirmasi nominal dan selesaikan pembayaran',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        {/* Check Payment Button */}
        {!paid && !isExpired && (
          <button
            onClick={handleCheckPayment}
            disabled={checking}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl transition-all duration-150 hover:bg-primary-600 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
          >
            {checking ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Memeriksa Status...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Cek Status Pembayaran
              </>
            )}
          </button>
        )}

        {!paid && !isExpired && (
          <p className="text-center text-xs text-neutral-400 pb-4">
            Sudah transfer? Klik tombol di atas untuk konfirmasi pembayaran
          </p>
        )}
      </div>
    </div>
  );
}
