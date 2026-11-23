'use client';

import { useEffect, useState } from 'react';
import { Check, ExternalLink, Loader2, LocateFixed, MapPin, X } from 'lucide-react';
import {
  getGoogleMapsUrl,
  getOsmEmbedUrl,
  reverseGeocode,
  useAddressStore,
  type AddressCoordinates,
} from '@/lib/address-store';

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

function getGeolocationErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser, lalu coba lagi.';
    case err.POSITION_UNAVAILABLE:
      return 'Lokasi tidak tersedia. Pastikan GPS/Layanan Lokasi perangkat menyala.';
    case err.TIMEOUT:
      return 'Gagal mengambil lokasi (timeout). Coba lagi di area dengan sinyal lebih baik.';
    default:
      return 'Gagal mengambil lokasi. Coba lagi.';
  }
}

export default function AddressModal({ open, onClose }: AddressModalProps) {
  const savedAddress = useAddressStore((s) => s.address);
  const savedLatitude = useAddressStore((s) => s.latitude);
  const savedLongitude = useAddressStore((s) => s.longitude);
  const setSavedAddress = useAddressStore((s) => s.setAddress);

  const [value, setValue] = useState(savedAddress);
  const [coords, setCoords] = useState<AddressCoordinates | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [gpsError, setGpsError] = useState('');

  // Selaraskan isian setiap kali modal dibuka.
  useEffect(() => {
    if (!open) return;
    setValue(savedAddress);
    setCoords(
      savedLatitude !== null && savedLongitude !== null
        ? { latitude: savedLatitude, longitude: savedLongitude }
        : null
    );
    setAccuracy(null);
    setError('');
    setGpsError('');
    setLocating(false);
  }, [open, savedAddress, savedLatitude, savedLongitude]);

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

  const handleUseGps = () => {
    if (locating) return;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Browser/perangkat ini tidak mendukung GPS. Silakan tulis alamat manual.');
      return;
    }

    setLocating(true);
    setGpsError('');
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy: accuracyMeters } = position.coords;

        // Simpan koordinat lebih dulu agar tetap presisi walau reverse-geocode gagal.
        setCoords({ latitude, longitude });
        setAccuracy(accuracyMeters);

        const geocoded = await reverseGeocode(latitude, longitude);
        setValue(
          geocoded ?? `Lokasi GPS (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
        );
        setLocating(false);
      },
      (geoError) => {
        setGpsError(getGeolocationErrorMessage(geoError));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleSave = () => {
    if (!value.trim()) {
      setError('Alamat pengantaran tidak boleh kosong.');
      return;
    }
    setSavedAddress(value, coords);
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
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-6 shadow-xl">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Alamat Pengantaran</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Gunakan GPS untuk lokasi presisi, atau tulis alamat lengkapmu di Manado.
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

        {/* Tombol GPS */}
        <button
          type="button"
          onClick={handleUseGps}
          disabled={locating}
          className="w-full mb-3 flex items-center justify-center gap-2 border border-primary/30 bg-primary/5 text-primary text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-60"
        >
          {locating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Mengambil lokasi...
            </>
          ) : (
            <>
              <LocateFixed size={16} />
              Gunakan Lokasi Saya (GPS)
            </>
          )}
        </button>

        {gpsError && (
          <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 leading-relaxed">
            ⚠️ {gpsError}
          </div>
        )}

        <div className="relative">
          <MapPin size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              // Alamat diketik manual tidak lagi terikat ke titik GPS sebelumnya.
              setCoords(null);
              setAccuracy(null);
              if (error) setError('');
            }}
            rows={3}
            placeholder="Contoh: Tikala, Manado - Jl. Sam Ratulangi No. 42, rumah pagar hijau"
            className="input-field pl-10 resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        {/* Pratinjau peta + status GPS */}
        {coords && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
            <iframe
              title="Pratinjau lokasi pengantaran"
              src={getOsmEmbedUrl(coords.latitude, coords.longitude)}
              className="w-full h-36 border-0"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50">
              <p className="text-[11px] text-gray-500">
                📍 Titik GPS aktif
                {accuracy !== null ? ` · akurasi ±${Math.round(accuracy)} m` : ''}
              </p>
              <a
                href={getGoogleMapsUrl(coords.latitude, coords.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline shrink-0"
              >
                Buka peta
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

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
                setCoords(null);
                setAccuracy(null);
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
          disabled={locating}
          className="mt-5 w-full bg-primary text-white font-bold py-3 rounded-xl transition-all duration-150 hover:bg-primary-600 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Check size={16} />
          Simpan Alamat
        </button>
      </div>
    </div>
  );
}
