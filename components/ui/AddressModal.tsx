'use client';

import { useEffect, useState } from 'react';
import { Check, MapPin, X } from 'lucide-react';
import { useAddressStore } from '@/lib/address-store';

const SUGGESTIONS = [
  'Tikala, Manado - Jl. Sam Ratulangi No. 42',
  'Wenang, Manado - Jl. Dotulolong Lasut',
  'Singkil, Manado - Jl. Walter Monginsidi',
  'Sario, Manado - Jl. Bethesda',
  'Malalayang, Manado - Jl. Raya Malalayang',
  'Mapanget, Manado - Jl. A.A. Maramis',
];

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddressModal({ open, onClose }: AddressModalProps) {
  const savedAddress = useAddressStore((s) => s.address);
  const setSavedAddress = useAddressStore((s) => s.setAddress);

  const [value, setValue] = useState(savedAddress);
  const [error, setError] = useState('');

  // Selaraskan input setiap kali modal dibuka.
  useEffect(() => {
    if (open) {
      setValue(savedAddress);
      setError('');
    }
  }, [open, savedAddress]);

  // Tutup dengan tombol Escape + cegah scroll latar.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!value.trim()) {
      setError('Alamat pengantaran tidak boleh kosong.');
      return;
    }
    setSavedAddress(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-6 shadow-xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Alamat Pengantaran</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tulis alamat lengkapmu di Manado agar kurir mudah menemukan lokasi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="relative">
          <MapPin size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            rows={3}
            autoFocus
            placeholder="Contoh: Tikala, Manado - Jl. Sam Ratulangi No. 42, rumah pagar hijau"
            className="input-field pl-10 resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-2">
          Pilih cepat
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setValue(suggestion);
                setError('');
              }}
              className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-colors ${
                value === suggestion
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary'
              }`}
            >
              {suggestion.split(',')[0]}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-5 w-full bg-primary text-white font-bold py-3 rounded-xl transition-all duration-150 hover:bg-primary-600 active:scale-95 flex items-center justify-center gap-2"
        >
          <Check size={16} />
          Simpan Alamat
        </button>
      </div>
    </div>
  );
}
