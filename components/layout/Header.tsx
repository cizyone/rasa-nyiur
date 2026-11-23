'use client';

import { useState } from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import AddressModal from '@/components/ui/AddressModal';
import { useAddressStore } from '@/lib/address-store';

interface HeaderProps {
  location?: string;
  showNotification?: boolean;
  showProfile?: boolean;
}

export default function Header({
  location,
  showNotification = true,
  showProfile = true,
}: HeaderProps) {
  const savedAddress = useAddressStore((s) => s.address);
  const displayLocation = location ?? savedAddress;
  const [isAddressOpen, setAddressOpen] = useState(false);

  return (
    <header className="bg-white px-4 pt-4 pb-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">📍 Antar ke</p>
        <button
          type="button"
          onClick={() => setAddressOpen(true)}
          className="flex items-center gap-1 group mt-0.5"
          aria-label="Ubah alamat pengantaran"
        >
          <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{displayLocation}</span>
          <ChevronDown size={14} className="text-primary flex-shrink-0 group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {showNotification && (
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        )}
        {showProfile && (
          <Link
            href="/profile"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <User size={18} className="text-primary" />
          </Link>
        )}
      </div>

      <AddressModal open={isAddressOpen} onClose={() => setAddressOpen(false)} />
    </header>
  );
}
