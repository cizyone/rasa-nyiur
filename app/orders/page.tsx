'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import BottomNav from '@/components/layout/BottomNav';

type OrderStatus = 'pending' | 'paid' | 'preparing' | 'delivering' | 'completed';

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string; Icon: React.ElementType }
> = {
  pending: {
    label: 'Menunggu',
    className: 'bg-gray-100 text-gray-600',
    Icon: Clock,
  },
  paid: {
    label: 'Dibayar',
    className: 'bg-emerald-50 text-emerald-600',
    Icon: CheckCircle2,
  },
  preparing: {
    label: 'Diproses',
    className: 'bg-amber-50 text-amber-600',
    Icon: Clock,
  },
  delivering: {
    label: 'Dikirim',
    className: 'bg-blue-50 text-blue-600',
    Icon: Truck,
  },
  completed: {
    label: 'Selesai',
    className: 'bg-green-50 text-green-600',
    Icon: CheckCircle2,
  },
};

const MOCK_ORDERS: Order[] = [
  {
    orderNumber: 'RN-ABC1234',
    date: '23 November 2026 · 09:30',
    status: 'completed',
    items: [
      { name: 'Tinutuan Glow Up', qty: 1 },
      { name: 'Es Kelapa Aren', qty: 2 },
    ],
    total: 35000,
  },
  {
    orderNumber: 'RN-XYZ5678',
    date: '22 November 2026 · 18:15',
    status: 'preparing',
    items: [{ name: 'Ayam Woku Main Character', qty: 2 }],
    total: 44000,
  },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className, Icon } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      <Icon size={11} />
      {label}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const visibleItems = order.items.slice(0, 2);
  const extraCount = order.items.length - 2;

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 mb-3">
      {/* Top row: order number + date */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-gray-900 text-sm">{order.orderNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-100 my-3" />

      {/* Items */}
      <div className="flex flex-col gap-1 mb-3">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-sm text-gray-700">
            <span className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
              {item.qty}
            </span>
            <span className="truncate">{item.name}</span>
          </div>
        ))}
        {extraCount > 0 && (
          <p className="text-xs text-gray-400 ml-6.5">+ {extraCount} item lainnya</p>
        )}
      </div>

      {/* Bottom: total + detail button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
            Total
          </p>
          <p className="text-sm font-bold text-primary">{formatRupiah(order.total)}</p>
        </div>
        <Link
          href={`/orders/${order.orderNumber}`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
        >
          Lihat Detail
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>(MOCK_ORDERS);

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Riwayat Pesanan</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Package size={28} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700 mb-1">Belum ada pesanan</p>
              <p className="text-xs text-gray-400">Yuk, pesan makanan favoritmu!</p>
            </div>
            <Link
              href="/menu"
              className="mt-1 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Lihat Menu
            </Link>
          </div>
        ) : (
          /* Order list */
          <div>
            {orders.map((order) => (
              <OrderCard key={order.orderNumber} order={order} />
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-24" />

      <BottomNav />
    </div>
  );
}
