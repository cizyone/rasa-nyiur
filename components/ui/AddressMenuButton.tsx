'use client';

import { useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import AddressModal from '@/components/ui/AddressModal';
import { useAddressStore } from '@/lib/address-store';

export default function AddressMenuButton() {
  const [open, setOpen] = useState(false);
  const savedAddress = useAddressStore((s) => s.address);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
      >
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MapPin size={16} className="text-primary" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium text-gray-700">Alamat Tersimpan</span>
          <span className="block text-[11px] text-gray-400 truncate">{savedAddress}</span>
        </span>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
      </button>
      <AddressModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
