'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Package,
  MapPin,
  CreditCard,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MenuItemDef {
  icon: React.ReactNode;
  label: string;
  href: string;
  danger?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  // In a real app these would come from an auth store / context.
  // We default to logged-out state as specified.
  const isLoggedIn = false;
  const userName = 'Pengguna Rasa Nyiur';
  const userEmail: string | null = null; // null = not logged in

  const menuItems: MenuItemDef[] = [
    {
      icon: <Package size={16} className="text-primary" />,
      label: 'Riwayat Pesanan',
      href: '/orders',
    },
    {
      icon: <MapPin size={16} className="text-primary" />,
      label: 'Alamat Tersimpan',
      href: '#',
    },
    {
      icon: <CreditCard size={16} className="text-primary" />,
      label: 'Metode Pembayaran',
      href: '#',
    },
    {
      icon: <HelpCircle size={16} className="text-primary" />,
      label: 'Bantuan & FAQ',
      href: '#',
    },
    {
      icon: <Info size={16} className="text-primary" />,
      label: 'Tentang Aplikasi',
      href: '#',
    },
  ];

  return (
    <div className="app-container bg-[#F5F6F5] min-h-screen">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="font-bold text-base text-gray-800">Profil Saya</h1>
      </header>

      {/* ── Content ── */}
      <main className="px-4 pt-4 space-y-4">

        {/* 1. AVATAR CARD */}
        <section className="bg-white rounded-2xl p-4 text-center">
          {/* Avatar circle */}
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            {isLoggedIn ? (
              <span className="text-primary font-bold text-lg select-none">RN</span>
            ) : (
              <User size={28} className="text-primary" />
            )}
          </div>

          {/* Name */}
          <p className="font-bold text-gray-800 text-sm">{userName}</p>

          {/* Email */}
          <p className="text-xs text-gray-400 mt-0.5">
            {userEmail ?? 'masuk untuk melihat akun'}
          </p>

          {/* Edit button */}
          <button className="mt-3 px-4 py-1.5 border border-primary text-primary text-xs font-semibold rounded-xl hover:bg-primary/5 transition-colors">
            Edit Profil
          </button>
        </section>

        {/* 2. NOT LOGGED IN CARD */}
        {!isLoggedIn && (
          <section className="bg-white rounded-2xl p-5">
            <p className="text-sm text-gray-600 text-center leading-snug mb-4">
              Masuk atau daftar untuk menikmati fitur lengkap
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 border border-primary text-primary text-sm font-semibold rounded-xl hover:bg-primary/5 transition-colors"
              >
                Daftar
              </Link>
            </div>
          </section>
        )}

        {/* 3. MENU LIST */}
        <section className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-50">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              {/* Icon bubble */}
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {item.icon}
              </span>

              {/* Label */}
              <span
                className={`flex-1 text-sm font-medium ${
                  item.danger ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                {item.label}
              </span>

              {/* Chevron */}
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </Link>
          ))}

          {/* Logout row — shown only when logged in */}
          {isLoggedIn && (
            <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors">
              <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <LogOut size={16} className="text-red-500" />
              </span>
              <span className="flex-1 text-left text-sm font-medium text-red-500">
                Keluar
              </span>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </button>
          )}
        </section>

        {/* 4. VERSION FOOTER */}
        <p className="text-center text-[11px] text-gray-300 pb-2">
          Rasa Nyiur v1.0.0 · Kuliner Khas Manado 🌴
        </p>

        {/* Spacer for bottom nav */}
        <div className="h-24" />
      </main>

      {/* ── Bottom Navigation ── */}
      <BottomNav />
    </div>
  );
}
